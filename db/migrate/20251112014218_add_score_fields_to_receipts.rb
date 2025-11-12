class AddScoreFieldsToReceipts < ActiveRecord::Migration[8.0]
  def change
    add_column :receipts, :confidence_score, :float
    add_column :receipts, :analysis_metadata, :json
    add_reference :receipts, :prompt_template, null: true, foreign_key: true
  end
end
