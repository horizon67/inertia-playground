class Post < ApplicationRecord
  scope :recent, -> { order(published_on: :desc, created_at: :desc) }

  def self.by_category(category)
    return recent if category.blank?

    recent.where(category:)
  end

  validates :title, presence: true, length: { maximum: 120 }
  validates :category, presence: true, length: { maximum: 60 }
end
