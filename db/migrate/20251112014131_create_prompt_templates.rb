class CreatePromptTemplates < ActiveRecord::Migration[8.0]
  def change
    create_table :prompt_templates do |t|
      t.string :name
      t.string :category
      t.text :content
      t.boolean :enabled
      t.integer :version
      t.boolean :is_default
      t.json :metadata

      t.timestamps
    end
    add_index :prompt_templates, :name, unique: true
    add_index :prompt_templates, :enabled
    add_index :prompt_templates, :is_default
  end
end
