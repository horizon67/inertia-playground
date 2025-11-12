# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_11_12_014218) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "chats", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "model_id"
    t.index ["model_id"], name: "index_chats_on_model_id"
  end

  create_table "messages", force: :cascade do |t|
    t.string "role", null: false
    t.text "content"
    t.json "content_raw"
    t.integer "input_tokens"
    t.integer "output_tokens"
    t.integer "cached_tokens"
    t.integer "cache_creation_tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "chat_id", null: false
    t.integer "model_id"
    t.integer "tool_call_id"
    t.index ["chat_id"], name: "index_messages_on_chat_id"
    t.index ["model_id"], name: "index_messages_on_model_id"
    t.index ["role"], name: "index_messages_on_role"
    t.index ["tool_call_id"], name: "index_messages_on_tool_call_id"
  end

  create_table "models", force: :cascade do |t|
    t.string "model_id", null: false
    t.string "name", null: false
    t.string "provider", null: false
    t.string "family"
    t.datetime "model_created_at"
    t.integer "context_window"
    t.integer "max_output_tokens"
    t.date "knowledge_cutoff"
    t.json "modalities", default: {}
    t.json "capabilities", default: []
    t.json "pricing", default: {}
    t.json "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["family"], name: "index_models_on_family"
    t.index ["provider", "model_id"], name: "index_models_on_provider_and_model_id", unique: true
    t.index ["provider"], name: "index_models_on_provider"
  end

  create_table "posts", force: :cascade do |t|
    t.string "title", null: false
    t.string "category", null: false
    t.text "body"
    t.date "published_on"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_posts_on_category"
    t.index ["published_on"], name: "index_posts_on_published_on"
  end

  create_table "prompt_templates", force: :cascade do |t|
    t.string "name"
    t.string "category"
    t.text "content"
    t.boolean "enabled"
    t.integer "version"
    t.boolean "is_default"
    t.json "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["enabled"], name: "index_prompt_templates_on_enabled"
    t.index ["is_default"], name: "index_prompt_templates_on_is_default"
    t.index ["name"], name: "index_prompt_templates_on_name", unique: true
  end

  create_table "receipt_line_items", force: :cascade do |t|
    t.integer "receipt_id", null: false
    t.string "name"
    t.integer "quantity"
    t.decimal "unit_price", precision: 10, scale: 2
    t.decimal "subtotal", precision: 10, scale: 2
    t.text "raw_text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["receipt_id"], name: "index_receipt_line_items_on_receipt_id"
  end

  create_table "receipts", force: :cascade do |t|
    t.integer "chat_id", null: false
    t.integer "analysis_message_id"
    t.string "store_name"
    t.datetime "transaction_at"
    t.string "transaction_at_raw"
    t.decimal "total_amount", precision: 10, scale: 2
    t.decimal "tax_amount", precision: 10, scale: 2
    t.string "currency", limit: 8
    t.string "payment_method"
    t.text "raw_text"
    t.json "raw_response", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "confidence_score"
    t.json "analysis_metadata"
    t.integer "prompt_template_id"
    t.index ["analysis_message_id"], name: "index_receipts_on_analysis_message_id"
    t.index ["chat_id"], name: "index_receipts_on_chat_id"
    t.index ["prompt_template_id"], name: "index_receipts_on_prompt_template_id"
  end

  create_table "todos", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.boolean "completed", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["completed"], name: "index_todos_on_completed"
  end

  create_table "tool_calls", force: :cascade do |t|
    t.string "tool_call_id", null: false
    t.string "name", null: false
    t.json "arguments", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "message_id", null: false
    t.index ["message_id"], name: "index_tool_calls_on_message_id"
    t.index ["name"], name: "index_tool_calls_on_name"
    t.index ["tool_call_id"], name: "index_tool_calls_on_tool_call_id", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "chats", "models"
  add_foreign_key "messages", "chats"
  add_foreign_key "messages", "models"
  add_foreign_key "messages", "tool_calls"
  add_foreign_key "receipt_line_items", "receipts"
  add_foreign_key "receipts", "chats"
  add_foreign_key "receipts", "messages", column: "analysis_message_id"
  add_foreign_key "receipts", "prompt_templates"
  add_foreign_key "tool_calls", "messages"
end
