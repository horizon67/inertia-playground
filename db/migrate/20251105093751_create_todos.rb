class CreateTodos < ActiveRecord::Migration[8.0]
  def change
    create_table :todos do |t|
      t.string :title, null: false
      t.text :description
      t.boolean :completed, null: false, default: false

      t.timestamps null: false
    end

    add_index :todos, :completed
  end
end
