class TodosController < ApplicationController
  before_action :set_todo, only: %i[update destroy]

  def index
    render_index
  end

  def create
    todo = Todo.new(todo_params)

    if todo.save
      flash[:notice] = "TODOを追加しました。"
      redirect_to todos_path
    else
      render_index(
        status: :unprocessable_content,
        form: form_payload(todo_params),
        errors: todo.errors.to_hash(true)
      )
    end
  end

  def update
    if @todo.update(todo_params)
      flash[:notice] = "TODOを更新しました。"
      redirect_to todos_path
    else
      render_index(
        status: :unprocessable_content,
        form: form_payload(todo_params),
        errors: @todo.errors.to_hash(true),
        editing_id: @todo.id
      )
    end
  end

  def destroy
    @todo.destroy!
    flash[:notice] = "TODOを削除しました。"
    redirect_to todos_path
  end

  private

  def render_index(status: :ok, **extra_props)
    todos = Todo.order(created_at: :desc)

    props = {
      todos: todos.map { |todo| serialize_todo(todo) }
    }

    props.merge!(extra_props) if extra_props.present?

    render inertia: "Todos/Index", props:, status:
  end

  def serialize_todo(todo)
    {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      created_at: todo.created_at&.iso8601,
      updated_at: todo.updated_at&.iso8601
    }
  end

  def form_payload(params_hash)
    {
      title: params_hash[:title].to_s,
      description: params_hash[:description].to_s
    }
  end

  def set_todo
    @todo = Todo.find(params[:id])
  end

  def todo_params
    scoped = params[:todo].is_a?(ActionController::Parameters) ? params.require(:todo) : params
    permitted = scoped.permit(:title, :description, :completed)
    permitted[:completed] = ActiveModel::Type::Boolean.new.cast(permitted[:completed]) if permitted.key?(:completed)
    permitted.to_h
  end
end
