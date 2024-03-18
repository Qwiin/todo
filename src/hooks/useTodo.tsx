import { useCallback, useReducer } from "react";

export interface TodoItem {
  id: string | null;
  text: string | null;
  complete: boolean;
}

interface TodoListState {
  todoList: TodoItem[];
  errorMessage: string;
}

interface TodoListAction {
  type: string;
  payload: {
    item?: TodoItem;
    index?: number;
    toIndex?: number;
  }
}

const ACTION_ADD: string = "AddTodo";
const ACTION_COMPLETE: string = "CompleteTodo";
const ACTION_DELETE: string = "DeleteTodo";
const ACTION_MOVE: string = "MoveTodo";

const todoTmpl: TodoItem = {
  id: null,
  text: null,
  complete: false
}

const initialState = {
  id: uid(),
  todoList: [{ ...todoTmpl, text: "My First To-Do!", id: uid() }],
  errorMessage: ""
};

function reducer(prevState: TodoListState, action: TodoListAction) {

  const state = JSON.parse(JSON.stringify(prevState));
  const { todoList } = state;
  const { type, payload } = action;
  const { index, toIndex, item } = payload;

  try {

    switch (type) {

      case ACTION_ADD: {
        if (item === undefined || item.text === undefined || item.text === null || item.text === "") {
          throw "A To-Do must have 1 or more characters";
        }
        if (item.text && item.text.length > 0) {
          state.todoList.push(item);
        }

        console.log("Todo Added");

        // return { ...state };
        break;
      }

      case ACTION_COMPLETE: {
        if (index === undefined) {
          throw "no index specified for 'CompleteTodo'";
        }
        todoList[index].complete = !todoList[index].complete;
        return { ...state };
      }

      case ACTION_DELETE: {
        if (index === undefined) {
          throw "no index specified for 'DeleteTodo'";
        }
        todoList.splice(index, 1);
        // return { ...state };
        break;
      }

      case ACTION_MOVE: {
        if (index === undefined || toIndex === undefined) {
          throw `index (${index}) and toIndex (${toIndex}) required for 'MoveTodo'`;
        }

        // adjust destination if moving item downwards
        const toIndexAdjusted = (index < toIndex) ? toIndex - 1 : toIndex;

        // cut Todo
        const itemToMove = todoList.splice(index, 1)[0];

        // paste Todo
        todoList.splice(toIndexAdjusted, 0, itemToMove);

        // return { ...state };
        break;
      }
    }

    state.errorMessage = "";
  }

  catch (e: any) {
    state.errorMessage = e as string;
  }

  return state;
}


export function useTodo(): {
  todoList: TodoItem[],
  errorMessage: string,
  addTodo: (todoText: string) => void,
  deleteTodo: (index: number) => void,
  completeTodo: (index: number) => void,
  moveTodo: (from: number, to: number) => void,
} {

  const [state, dispatch] = useReducer(reducer, initialState);
  const { todoList, errorMessage } = state;

  const addTodo = useCallback((todoText: string | null) => {
    console.log("Add Todo Called");
    const newTodo: TodoItem = {
      id: uid(),
      text: todoText,
      complete: false,
    }
    dispatch({ type: ACTION_ADD, payload: { item: newTodo } });
  }, []);

  const completeTodo = useCallback((index: number) => {
    console.log("Complete Todo Called");
    dispatch({ type: ACTION_COMPLETE, payload: { index } });
  }, []);

  const deleteTodo = useCallback((index: number) => {
    console.log("Delete Todo Called");
    dispatch({ type: ACTION_DELETE, payload: { index } })
  }, []);

  const moveTodo = useCallback((from: number, to: number) => {
    console.log("Move Todo Called");
    dispatch({
      type: ACTION_MOVE,
      payload: {
        index: from,
        toIndex: to
      }
    });
  }, []);

  return {
    todoList,
    errorMessage,
    moveTodo,
    addTodo,
    completeTodo,
    deleteTodo,
  }

}

/**
 * 
 *  Utility Methods
 * 
 */

function uid(): string {
  return "id_" + stringToInt32Hash(Math.round(Math.random() * 8999999999 + 1000000000).toString());
}
function stringToInt32Hash(str: string): number {
  let hash: number = 0;
  for (let i = 0; i < str.length; i++) {
    const char: number = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to Int32
  }
  return Math.abs(hash);
}
