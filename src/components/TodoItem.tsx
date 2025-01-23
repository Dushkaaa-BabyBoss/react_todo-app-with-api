import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

type TodoItemProps = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  tempoTodo: Todo | null;
  isLoading: boolean;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
  toggleLoader: boolean;
  isEditing: boolean;
  setIsEditingTodoId: (todoId: number | null) => void;
};
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deleteTodo,
  tempoTodo,
  isLoading,
  updateTodo,
  toggleLoader,
  isEditing,
  setIsEditingTodoId,
}) => {
  const [todoChecked, setTodoChecked] = useState(todo.completed);
  const [localTodoLoader, setLocalTodoLoader] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(todo.title);

  const handleCheckedTodo = async () => {
    try {
      setLocalTodoLoader(true);
      const updatedTodo = { ...todo, completed: !todoChecked };

      await updateTodo(updatedTodo);

      setTodoChecked(!todoChecked);
    } finally {
      setTodoChecked(!todoChecked);
      setLocalTodoLoader(false);
    }
  };

  const handleSave = async () => {
    const trimmetTitle = editedTitle.trim();

    if (!trimmetTitle) {
      deleteTodo(todo.id);

      return;
    }

    if (trimmetTitle !== todo.title) {
      try {
        setLocalTodoLoader(true);
        const updatedTodo = { ...todo, title: trimmetTitle };

        await updateTodo(updatedTodo);
      } finally {
        setLocalTodoLoader(false);
      }
    }

    setIsEditingTodoId(null);
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditingTodoId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoChecked}
          onClick={handleCheckedTodo}
        />
      </label>
      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditingTodoId(todo.id)}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      {/* add class is-active */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(tempoTodo && !todo.id) || isLoading || toggleLoader || localTodoLoader ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
