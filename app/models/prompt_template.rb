class PromptTemplate < ApplicationRecord
  # Categories
  CATEGORIES = {
    receipt: "receipt",
    invoice: "invoice",
    general: "general"
  }.freeze

  # Validations
  validates :name, presence: true, uniqueness: true
  validates :category, presence: true, inclusion: { in: CATEGORIES.values }
  validates :content, presence: true
  validates :version, presence: true, numericality: { only_integer: true, greater_than: 0 }

  # Associations
  has_many :receipts, dependent: :nullify

  # Scopes
  scope :enabled, -> { where(enabled: true) }
  scope :for_category, ->(category) { where(category: category) }
  scope :default_for, ->(category) { enabled.for_category(category).where(is_default: true).order(version: :desc) }

  # Callbacks
  before_validation :set_defaults, on: :create
  after_save :ensure_single_default_per_category, if: :is_default?

  # Class methods
  def self.default_receipt_prompt
    default_for(CATEGORIES[:receipt]).first || fallback_receipt_prompt
  end

  def self.fallback_receipt_prompt
    # fixturesがない場合のフォールバック
    # 主に開発時の初回マイグレーション後などで使用
    find_by(name: "デフォルトレシート解析プロンプト") || new(
      name: "デフォルトレシート解析プロンプト（自動生成）",
      category: CATEGORIES[:receipt],
      content: default_receipt_content,
      enabled: true,
      version: 1,
      is_default: true,
      metadata: {
        description: "レシート画像を解析してJSON形式で構造化するための標準プロンプト",
        created_by: "system",
        auto_generated: true
      }
    )
  end

  def self.default_receipt_content
    <<~PROMPT.freeze
      添付した画像はレシートです。
      店舗名、取引日時、合計金額、税額、通貨、支払方法、
      明細（品目名・数量・単価・小計）を日本語で正確に読み取り、
      JSON 形式で構造化してください。
      数値は半角の数値で返し、不明な場合は null を使用してください。
      明細の数量が不明な場合は 1 を設定してください。
    PROMPT
  end

  # Instance methods
  def duplicate(new_name: nil)
    new_prompt = dup
    new_prompt.name = new_name || "#{name} (Copy)"
    new_prompt.version = (self.class.where(name: new_prompt.name).maximum(:version) || 0) + 1
    new_prompt.is_default = false
    new_prompt
  end

  def activate!
    update!(enabled: true)
  end

  def deactivate!
    update!(enabled: false, is_default: false)
  end

  private

  def set_defaults
    self.enabled = true if enabled.nil?
    self.version ||= 1
    self.is_default = false if is_default.nil?
    self.metadata ||= {}
  end

  def ensure_single_default_per_category
    return unless is_default?

    self.class
      .where(category: category, is_default: true)
      .where.not(id: id)
      .update_all(is_default: false)
  end
end
