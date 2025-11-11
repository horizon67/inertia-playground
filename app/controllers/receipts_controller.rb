class ReceiptsController < ApplicationController
  def index
    receipts = Receipt.includes(:line_items, chat: :model, image_attachment: :blob).order(created_at: :desc)

    render inertia: "Receipts/Index", props: {
      receipts: receipts.map { |receipt| serialize_receipt(receipt) }
    }
  end

  def create
    image_param = receipt_image_param
    analyzer = Receipts::Analyzer.new(image: image_param)
    result = analyzer.call

    receipt = build_receipt(result)

    ActiveRecord::Base.transaction do
      receipt.save!
      attach_image(receipt, image_param)
    end

    flash[:notice] = "レシートを登録しました。"
    redirect_to receipts_path
  rescue Receipts::Analyzer::Error, Receipts::Analyzer::ParsingError => e
    flash[:alert] = e.message
    render_error_state(status: :unprocessable_content)
  rescue RubyLLM::Error => e
    flash[:alert] = "レシート解析に失敗しました: #{e.message}"
    render_error_state(status: :unprocessable_content)
  rescue ActiveRecord::RecordInvalid => e
    flash[:alert] = "レシートの保存に失敗しました: #{e.record.errors.full_messages.join(', ')}"
    render_error_state(status: :unprocessable_content)
  end

  private

  def render_error_state(status:)
    receipts = Receipt.includes(:line_items, chat: :model, image_attachment: :blob).order(created_at: :desc)
    render inertia: "Receipts/Index",
           props: {
             receipts: receipts.map { |receipt| serialize_receipt(receipt) }
           },
           status: status
  end

  def receipt_image_param
    image =
      if params[:receipt].present?
        params.require(:receipt).permit(:image)[:image]
      else
        params.permit(:image)[:image]
      end

    return image if image.present?

    raise ActionController::ParameterMissing, :image
  end

  def attach_image(receipt, image_param)
    return unless image_param.present?

    image_param.rewind if image_param.respond_to?(:rewind)
    receipt.image.attach(image_param)
  end

  def build_receipt(result)
    assistant_message = result.assistant_message || result.chat.messages.order(:created_at).where(role: :assistant).last
    raw_text = result.raw_text || assistant_message&.content
    data = result.data || {}

    Receipt.new(
      chat: result.chat,
      analysis_message: assistant_message,
      store_name: data["店舗名"] || data["store_name"],
      transaction_at: parse_datetime(data["取引日時"] || data["transaction_datetime"]),
      transaction_at_raw: data["取引日時"] || data["transaction_datetime"],
      total_amount: parse_decimal(data["合計金額"] || data["total_amount"]),
      tax_amount: parse_decimal(data["税額"] || data["tax_amount"]),
      currency: data["通貨"] || data["currency"],
      payment_method: data["支払方法"] || data["payment_method"],
      raw_text: raw_text,
      raw_response: data.as_json
    ).tap do |receipt|
      Array.wrap(data["明細"] || data["line_items"]).each do |item|
        name = item["品目名"] || item["name"]
        quantity = parse_integer(item["数量"] || item["quantity"])
        unit_price = parse_decimal(item["単価"] || item["unit_price"])
        subtotal = parse_decimal(item["小計"] || item["subtotal"])

        next if name.blank? && quantity.blank? && unit_price.blank? && subtotal.blank?

        receipt.line_items.build(
          name:,
          quantity:,
          unit_price:,
          subtotal:,
          raw_text: item.to_json
        )
      end
    end
  end

  def parse_decimal(value)
    return if value.blank?

    cleaned = value.to_s.tr("０-９", "0-9").gsub(/[^\d.\-]/, "")
    return if cleaned.blank?

    BigDecimal(cleaned)
  rescue ArgumentError
    nil
  end

  def parse_integer(value)
    return if value.blank?

    cleaned = value.to_s.tr("０-９", "0-9").gsub(/[^\d\-]/, "")
    return if cleaned.blank?

    Integer(cleaned, 10)
  rescue ArgumentError
    nil
  end

  def parse_datetime(value)
    return if value.blank?

    normalized = value.to_s
    normalized = normalized.tr("０-９", "0-9")
    normalized = normalized.gsub(/年|月/, "-").gsub(/日/, " ")
    normalized = normalized.gsub(/時|:/, ":").gsub(/分/, ":00")
    normalized = normalized.strip

    Time.zone.parse(normalized)
  rescue ArgumentError
    nil
  end

  def serialize_receipt(receipt)
    {
      id: receipt.id,
      store_name: receipt.store_name,
      transaction_at: receipt.transaction_at&.iso8601,
      transaction_at_label: receipt.transaction_at_label,
      transaction_at_raw: receipt.transaction_at_raw,
      total_amount: receipt.total_amount&.to_f,
      tax_amount: receipt.tax_amount&.to_f,
      currency: receipt.currency_or_default,
      currency_label: receipt.currency_label,
      payment_method: receipt.payment_method,
      raw_text: receipt.raw_text,
      raw_response: receipt.raw_response,
      chat_id: receipt.chat_id,
      analysis_message_id: receipt.analysis_message_id,
      model: receipt.chat&.model&.name,
      model_id: receipt.chat&.model&.model_id,
      created_at: receipt.created_at.iso8601,
      image_url: receipt.image.attached? ? url_for(receipt.image) : nil,
      line_items: receipt.line_items.map do |item|
        {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price&.to_f,
          subtotal: item.subtotal&.to_f,
          raw_text: item.raw_text
        }
      end
    }
  end
end
