class ApplicationController < ActionController::Base
  include InertiaRails::Controller
  helper InertiaRails::Helper

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  inertia_share do
    {
      app: {
        name: "Inertia Playground"
      },
      flash: flash.to_hash.compact
    }
  end
end
