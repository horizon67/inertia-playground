class CreatePosts < ActiveRecord::Migration[8.0]
  def change
    create_table :posts do |t|
      t.string :title, null: false
      t.string :category, null: false
      t.text :body
      t.date :published_on

      t.timestamps null: false
    end

    add_index :posts, :category
    add_index :posts, :published_on
  end
end
