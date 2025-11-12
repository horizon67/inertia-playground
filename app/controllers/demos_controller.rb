class DemosController < ApplicationController
  DEFERRED_DELAY_SECONDS = 1.5

  def partial_reloads
    render inertia: "Demos/PartialReloads", props: partial_reload_props
  end

  def deferred_props
    render inertia: "Demos/DeferredProps", props: deferred_props_props
  end

  private

  def partial_reload_props
    {
      filters: {
        category: category_param
      },
      posts: -> { serialize_posts(partial_posts_scope) },
      posts_loaded_at: -> { Time.zone.now.iso8601 },
      categories: -> { Post.order(:category).distinct.pluck(:category) },
      categories_loaded_at: -> { Time.zone.now.iso8601 },
      total_posts: -> { Post.count }
    }
  end

  def deferred_props_props
    {
      posts: -> { serialize_posts(Post.recent.limit(5)) },
      posts_loaded_at: -> { Time.zone.now.iso8601 },
      stats: InertiaRails.defer { build_stats_payload },
      stats_generated_at: InertiaRails.defer { Time.zone.now.iso8601 },
      category_breakdown: InertiaRails.defer(group: "insights") { build_category_breakdown }
    }
  end

  def partial_posts_scope
    Post.by_category(category_param)
  end

  def category_param
    params[:category].presence
  end

  def serialize_posts(relation)
    relation.map do |post|
      {
        id: post.id,
        title: post.title,
        category: post.category,
        body: post.body,
        published_on: post.published_on&.iso8601,
        created_at: post.created_at.iso8601,
        updated_at: post.updated_at.iso8601
      }
    end
  end

  def build_stats_payload
    simulate_deferred_delay

    {
      total_posts: Post.count,
      categories: Post.distinct.count(:category),
      latest_published_on: Post.maximum(:published_on)&.iso8601,
      most_recent_created_at: Post.maximum(:created_at)&.iso8601
    }
  end

  def build_category_breakdown
    simulate_deferred_delay

    totals = Post.group(:category).count
    total_posts = totals.values.sum

    totals.sort_by { |category, count| [ -count, category ] }.map do |category, count|
      {
        category:,
        count:,
        percentage: total_posts.zero? ? 0.0 : ((count.to_f / total_posts) * 100).round(1)
      }
    end
  end

  def simulate_deferred_delay
    return unless Rails.env.development?

    sleep(DEFERRED_DELAY_SECONDS)
  end
end
