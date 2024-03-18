import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { TodoItem, useTodo } from "../hooks/useTodo";
import Todo from "./Todo";

export default function TodoList(props: { id: string }) {
  const { todoList, moveTodo, addTodo, completeTodo, deleteTodo, errorMessage } = useTodo();
  const [err, setErr] = useState(errorMessage);
  const todoTextInput = useRef<HTMLInputElement>(null);
  const addBtn = useRef<HTMLDivElement>(null);
  const errMsgEl: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const [editModeOn, setEditModeOn] = useState(false);

  useEffect(() => {
    setErr(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    if (todoList.length === 0) {
      setEditModeOn(false);
    }
  }, [todoList.length]);

  const addBtnClick = useCallback(() => {
    if (!todoTextInput.current) { return }

    const TodoText: string = todoTextInput.current.value as string || "";
    addTodo(TodoText);

    // erase text after setting todo item
    todoTextInput.current.value = "";

  }, []);

  const renderTodos = () => {

    return todoList.map((item: TodoItem, index: number) => {
      return (
        <Todo key={ item.id } item={ item } index={ index }
          editMode={ editModeOn }
          completeCallback={ () => completeTodo(index) }
          deleteCallback={ () => deleteTodo(index) }
        />
      );
    });
  };

  return (
    <div id={ props.id } className='todo-comp'>
      <div className={ `edit-btn absolute right-9 top-4 ${editModeOn ? 'edit-mode' : ''}` }
        onClick={ () => { setEditModeOn(!editModeOn) } }>✎</div>
      <h1 className='font-sans text-blue-200'>My Todo List</h1>
      { err.length > 0 &&
        <div ref={ errMsgEl } className={ `text-red-500 text-lg font-sans h-0 -top-4 relative transition-opacity` }>{ err }</div>
      }
      <div id="TodoForm" className='flex gap-4 p-4 mb-2'>

        <div className='w-full flex justify-start'>
          <input
            onKeyDown={ (e) => { if (e.key === "Enter") { addBtnClick(); } } }
            onChange={ () => {
              if (errMsgEl.current
                && todoTextInput.current
                && todoTextInput.current.value.length > 0) {
                setErr("");
              }
            }
            }
            className='w-full rounded-xl text-lg px-4'
            ref={ todoTextInput }
            id="TodoTextInput"
            type="text"
            defaultValue=""
            placeholder='New To-Do'>
          </input>
        </div>

        <div className='basis-20 flex justify-center'>
          <div id="AddTodoBtn" ref={ addBtn } onClick={ addBtnClick } className='btn-blue select-none'>
            <h3 className='btn-label-lg'>Add</h3>
          </div>
        </div>

      </div>

      { todoList && todoList.length > 0 &&
        <div id="TodoList" className="todo-list">
          { renderTodos() }
        </div>
      }
    </div>

  );
}
