class CreateReceipts < ActiveRecord::Migration[8.0]
  def change
    create_table :receipts do |t|
      t.references :chat, null: false, foreign_key: true
      t.references :analysis_message, foreign_key: { to_table: :messages }

      t.string :store_name
      t.datetime :transaction_at
      t.string :transaction_at_raw
      t.decimal :total_amount, precision: 10, scale: 2
      t.decimal :tax_amount, precision: 10, scale: 2
      t.string :currency, limit: 8
      t.string :payment_method
      t.text :raw_text
      t.json :raw_response, default: {}

      t.timestamps
    end
  end
end
