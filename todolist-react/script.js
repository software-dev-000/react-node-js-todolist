/*** @jsx React.DOM */

var TodoBox = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    
    handleTodoSubmit: function(todo) {
        var todos = this.state.data;
        todos.push(todo);
        this.setState({data: todos})
    },
    
    handleTodoDelete: function(todo, e) {
        var todos = this.state.data;
        var index = todos.map(function(e) { return e.todoitem; }).indexOf(todo.todoitem);
        todos.splice(index, 1);
        this.setState({data: todos})
    },
    
    render: function() {
        return (
            <div class="todolist">
                <h1>Todolist</h1>
                
                <TodoList onTodoDelete={this.handleTodoDelete} data={this.state.data} />
                
                <TodoForm onTodoSubmit={this.handleTodoSubmit} />
            </div>
        )
    }
});

var TodoList = React.createClass({
    handleClick: function(e) {
        e.preventDefault();
        var todo = this.props.todo;
        alert(todo);
        this.props.onTodoDelete({todoitem: todo});
    },
    
    createItem: function(todo) {
        return (
            <li><a href="#" onClick={this.props.onTodoDelete.bind(this, todo)}>✘  </a>{todo}</li>
        );
    },
    
    render: function() {
        return (
            <ul>
                {this.props.data.map(this.createItem)}
            </ul>
        );
    }
});


var TodoForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var newitem = this.refs.newtodo.getDOMNode().value.trim();
        if(!newitem) {
            return;
        }
        this.props.onTodoSubmit({todoitem: newitem});
        this.refs.newtodo.getDOMNode().value = '';
        return;
    },
    
    render: function() {
        return (
            <form class="todoForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="To do..." ref="newtodo" />
                <input type="submit" value="Submit" />
            </form>
        );
    }
});

React.renderComponent(
    <TodoBox />,
    document.getElementById('content')
);