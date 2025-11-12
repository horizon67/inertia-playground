# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Load Post fixtures
if Post.count.zero?
  require "active_record/fixtures"

  fixtures_path = Rails.root.join("test", "fixtures")
  ActiveRecord::FixtureSet.create_fixtures(fixtures_path, "posts")
  puts "Loaded #{Post.count} posts from fixtures"
end
