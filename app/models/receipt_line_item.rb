class ReceiptLineItem < ApplicationRecord
  belongs_to :receipt

  validates :name, presence: true
  validates :quantity, numericality: { allow_nil: true, greater_than: 0 }
  validates :unit_price, numericality: { allow_nil: true }
  validates :subtotal, numericality: { allow_nil: true }
end
