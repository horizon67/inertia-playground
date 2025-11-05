# frozen_string_literal: true

InertiaRails.configure do |config|
  # Include empty errors hash in all responses to comply with Inertia protocol
  # This will be the default behavior in InertiaRails 4.0
  config.always_include_errors_hash = true
end
