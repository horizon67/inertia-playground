class Receipt < ApplicationRecord
  belongs_to :chat
  belongs_to :analysis_message, class_name: "Message", optional: true

  has_many :line_items, class_name: "ReceiptLineItem", dependent: :destroy, inverse_of: :receipt

  has_one_attached :image

  accepts_nested_attributes_for :line_items, allow_destroy: true

  validates :chat, presence: true
  validates :total_amount, numericality: { allow_nil: true }
  validates :tax_amount, numericality: { allow_nil: true }

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
end
