class Receipt < ApplicationRecord
  belongs_to :chat
  belongs_to :analysis_message, class_name: "Message", optional: true
  belongs_to :prompt_template, optional: true

  has_many :line_items, class_name: "ReceiptLineItem", dependent: :destroy, inverse_of: :receipt

  has_one_attached :image

  accepts_nested_attributes_for :line_items, allow_destroy: true

  validates :chat, presence: true
  validates :total_amount, numericality: { allow_nil: true }
  validates :tax_amount, numericality: { allow_nil: true }
  validates :confidence_score, numericality: { allow_nil: true, in: 0..100 }

  # Callbacks
  before_save :calculate_confidence_score, if: :should_calculate_score?

  def currency_or_default
    raw = currency.to_s.strip
    return "JPY" if raw.blank?

    normalized = raw.gsub(/[￥¥]/, "").strip.upcase
    return "JPY" if normalized.blank? || raw.include?("円") || normalized == "YEN"

    normalized
  end

  def currency_label
    currency.presence || currency_or_default
  end

  def transaction_at_label
    return transaction_at_raw if transaction_at.blank? && transaction_at_raw.present?
    return unless transaction_at

    I18n.l(transaction_at, format: :long)
  end

  # Confidence Score Calculation
  def calculate_confidence_score
    self.confidence_score = compute_confidence_score
    self.analysis_metadata ||= {}
    self.analysis_metadata["score_details"] = confidence_score_breakdown
    self.confidence_score
  end

  def compute_confidence_score
    breakdown = confidence_score_breakdown
    breakdown.values.sum.to_f / breakdown.keys.size
  end

  def confidence_score_breakdown
    scores = {}

    # 必須フィールドの存在チェック（各20点）
    scores[:store_name] = store_name.present? ? 100 : 0
    scores[:total_amount] = total_amount.present? ? 100 : 0
    scores[:transaction_at] = transaction_at.present? ? 100 : 0

    # 金額の整合性チェック（30点）
    scores[:amount_consistency] = calculate_amount_consistency_score

    # 明細の完全性チェック（20点）
    scores[:line_items_completeness] = calculate_line_items_score

    # 税額の妥当性チェック（10点）
    scores[:tax_validity] = calculate_tax_validity_score

    scores
  end

  def calculate_amount_consistency_score
    return 50 unless line_items.any? && total_amount.present?

    calculated_total = line_items.sum { |item| item.subtotal || 0 }
    return 100 if calculated_total == 0

    diff_percentage = ((total_amount - calculated_total).abs / calculated_total * 100).to_f

    case diff_percentage
    when 0..1 then 100
    when 1..5 then 80
    when 5..10 then 60
    when 10..20 then 40
    else 20
    end
  end

  def calculate_line_items_score
    return 30 unless line_items.any?

    complete_items = line_items.count do |item|
      item.name.present? && item.quantity.present? && item.unit_price.present?
    end

    (complete_items.to_f / line_items.size * 100).to_i
  end

  def calculate_tax_validity_score
    return 50 unless total_amount.present? && tax_amount.present?

    # 日本の消費税率を想定（8%または10%）
    tax_rate = (tax_amount.to_f / (total_amount - tax_amount) * 100).round(1)

    case tax_rate
    when 7.5..8.5, 9.5..10.5 then 100  # 8%または10%の許容範囲
    when 0 then 80  # 非課税取引
    when 6.5..12 then 60  # やや外れた値
    else 30  # 明らかに不自然な値
    end
  end

  def confidence_level
    return nil unless confidence_score

    case confidence_score
    when 90..100 then :high
    when 70..89 then :medium
    when 50..69 then :low
    else :very_low
    end
  end

  def confidence_level_label
    return "N/A" unless confidence_score

    labels = {
      high: "高",
      medium: "中",
      low: "低",
      very_low: "要確認"
    }

    labels[confidence_level] || "N/A"
  end

  private

  def should_calculate_score?
    # 新規作成時、または関連データが変更された時にスコアを計算
    new_record? ||
    will_save_change_to_store_name? ||
    will_save_change_to_total_amount? ||
    will_save_change_to_tax_amount? ||
    will_save_change_to_transaction_at? ||
    line_items.any?(&:changed?)
  end
end
