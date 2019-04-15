import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";

export default class TodosList extends Component {
  _isMounted = false;

  state = {
    todos: []
  };

  componentDidMount() {
    this._isMounted = true;
    //request and retrieve data from our backend
    axios
      .get("http://localhost:4000/todos/")
      .then(response => {
        if (this._isMounted) {
          this.setState({
            todos: response.data
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // componentDidUpdate(prevProps, prevState) {

  //   if (prevState.todos !== this.props.todos) {
  //     console.log("123");
  //   }
  // }

  componentWillUnmount() {
    this._isMounted = false;
  }

  todoList() {
    const Todo = props => (
      <tr>
        <td className={props.todo.todo_completed ? "completed" : ""}>
          {props.todo.todo_description}
        </td>
        <td className={props.todo.todo_completed ? "completed" : ""}>
          {props.todo.todo_responsible}
        </td>
        <td className={props.todo.todo_completed ? "completed" : ""}>
          {props.todo.todo_priority}
        </td>
        <td>
          <Button variant="primary" onClick={() => this.edit(props.todo._id)}>
            Edit
          </Button>
          <span> </span>
          <Button variant="danger" onClick={() => this.delete(props.todo._id)}>
            Delete
          </Button>
        </td>
      </tr>
    );

    return this.state.todos.map(function(currentTodo, i) {
      return <Todo todo={currentTodo} key={i} />;
    });
  }

  edit = id => {
    this.props.history.push("/edit/" + id);
  };

  delete(id) {
    axios
      .delete("http://localhost:4000/todo/" + id)
      .then(response => {
        let todos = this.state.todos;
        let index = -1;
        let counter = 0;
        for (let todo of todos) {
          if (todo._id === id) {
            index = counter;
            break;
          }
          counter++;
        }

        if (index !== -1) {
          todos.splice(index, 1);
          this.setState({
            todos: todos
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <h3>Todos List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Responsible</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.todoList()}</tbody>
        </table>
      </div>
    );
  }
}
