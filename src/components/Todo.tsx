import { memo } from "react";
import { TodoItem } from "../hooks/useTodo";

interface TodoProps {
  item: TodoItem,
  index: number,
  editMode: boolean,
  completeCallback: () => void,
  deleteCallback: () => void,
}

const Todo = memo(

  function Todo(props: TodoProps) {

    const { index, item, editMode, completeCallback, deleteCallback } = props;


    return (
      <div id={ item.id as string } data-index={ index } className='todo-item-wrapper'>

        <div className=''>
          <div className={ `btn-green ${item.complete ? 'checked' : ''}` }
            onClick={ () => { completeCallback() } }>
          </div>
        </div>

        <div className='todo-item-middle'>
          <div className={ `todo-item-text ${item.complete ? 'complete' : ''}` }
            style={ {
              textDecoration: item.complete ? 'line-through' : undefined
            } }>{ item.text }</div>
        </div>

        {/* Delete Button */ }
        { (editMode || item.complete) &&
          <div className='todo-item-right'>
            <div
              className='btn-red font-sans'
              onClick={ () => { deleteCallback() } }
            ></div>
          </div>
        }

      </div>
    );
  }
  , (prev: TodoProps, next: TodoProps) => {
    return (
      prev.item.complete === next.item.complete &&
      prev.item.id === next.item.id &&
      prev.editMode === next.editMode
    )
  });

export default Todo;
