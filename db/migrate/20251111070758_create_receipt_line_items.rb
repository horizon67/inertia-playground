class CreateReceiptLineItems < ActiveRecord::Migration[8.0]
  def change
    create_table :receipt_line_items do |t|
      t.references :receipt, null: false, foreign_key: true
      t.string :name
      t.integer :quantity
      t.decimal :unit_price, precision: 10, scale: 2
      t.decimal :subtotal, precision: 10, scale: 2
      t.text :raw_text

      t.timestamps
    end
  end
end
