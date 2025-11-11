require "json"

module Receipts
  class Analyzer
    class Error < StandardError; end
    class ParsingError < Error; end

    DEFAULT_PROMPT = <<~PROMPT.freeze
      添付した画像はレシートです。
      店舗名、取引日時、合計金額、税額、通貨、支払方法、
      明細（品目名・数量・単価・小計）を日本語で正確に読み取り、
      JSON 形式で構造化してください。
      数値は半角の数値で返し、不明な場合は null を使用してください。
      明細の数量が不明な場合は 1 を設定してください。
    PROMPT

    Result = Struct.new(:chat, :assistant_message, :data, :raw_text, keyword_init: true)

    def initialize(image:, prompt: DEFAULT_PROMPT, chat: nil, model: nil)
      @image = image
      @prompt = prompt
      @chat = chat || ::Chat.create!
      @model = model
    end

    def call
      ensure_image!

      chat.with_model(@model, assume_exists: true) if @model.present?

      response = chat.ask(@prompt, with: image)
      assistant_message = chat.messages.order(:created_at).last

      raw_text = assistant_message&.content
      raw_payload = assistant_message&.content_raw.presence || response&.content

      data = normalize_payload(raw_payload || raw_text)

      Result.new(chat:, assistant_message:, data:, raw_text:)
    rescue JSON::ParserError => e
      raise ParsingError, "JSONの解析に失敗しました: #{e.message}"
    end

    private

    attr_reader :chat, :image

    def ensure_image!
      return if image.present?

      raise Error, "画像ファイルが選択されていません。"
    end

    def normalize_payload(payload)
      return payload if payload.is_a?(Hash)

      text = payload.to_s
      cleaned = extract_json_string(text)

      raise ParsingError, "JSON形式のレスポンスが取得できませんでした。" unless cleaned

      JSON.parse(cleaned)
    end

    def extract_json_string(text)
      return if text.blank?

      cleaned = text.strip
      cleaned = cleaned.gsub(/\A```json\s*/i, "")
      cleaned = cleaned.gsub(/\A```/, "")
      cleaned = cleaned.gsub(/```\s*\z/, "").strip

      return cleaned if valid_json?(cleaned)

      candidate = cleaned[/\{.*\}/m]
      return unless candidate

      candidate = candidate.strip
      return candidate if valid_json?(candidate)

      nil
    end

    def valid_json?(string)
      JSON.parse(string)
      true
    rescue JSON::ParserError
      false
    end
  end
end
