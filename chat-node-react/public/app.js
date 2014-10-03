/*** @jsx React.DOM */

var socket = io.connect();

var Messages = [];
var Users = [];

var pseudo;

var ChatBox = React.createClass({
    getInitialState: function() {
        pseudo = prompt("What's your username?");
        Messages.push({user: 'CONNECTION', text: 'You\'re online, ' + pseudo, date: new Date()});
        socket.emit('new_client', pseudo);
        socket.on('init', this.initialize);
        Users.push(pseudo);
        
        socket.on('message', this.newMessage);
        
        socket.on('new_client', this.newUser);
        
        socket.on('client_left', this.userDisconnect);
        
        return {messages: Messages, users: Users};
    },
    
    initialize: function(data) {
        Users = data.users;
        this.setState({users: Users});
    },
    
    newMessage: function(data) {
        Messages.unshift({user: data.user, text: data.text, date: new Date()});
        this.setState({messages: Messages});
    },
    
    newUser: function(data) {
        Messages.unshift({user: 'NEW USER: ', text: data.pseudo + ' is now online', date: new Date()});
        Users.push(data.pseudo);
        this.setState({messages: Messages, users: Users});
    },
    
    userDisconnect: function(data) {
        Messages.unshift({user: 'USER LEFT', text: data.pseudo + ' is now offline', date: new Date()});
        var index = Users.indexOf(data.pseudo);
        Users.splice(index, 1);
        this.setState({messages: Messages, users: Users});
    },
    
    handleMessageSubmit: function(message) {
        Messages.unshift({user: pseudo, text: message.text, date: new Date()});
        this.setState({messages: Messages});
        socket.emit('message', message.text);
    },
    
    render: function() {
        return (
            <div className="messagelist">
                <h1>Super Chat</h1>
                <h3>Using socket.io and react.js</h3>
                
                <ChatForm onMessageSubmit={this.handleMessageSubmit} />

                <UsersList users={this.state.users} />
            
                <MessageList messages={this.state.messages} />
            </div>
        )
    }
});

var Message = React.createClass({
    render: function() {
        return (
            <p>
                <span className="date">[{this.props.date.getHours()}:{this.props.date.getMinutes()}:{this.props.date.getSeconds()}] </span><em>{this.props.user}</em> - {this.props.text}
            </p>
        );
    }
});

var MessageList = React.createClass({
    render: function() {
        var messageNodes = this.props.messages.map(function(message) {
            return (
                <Message date={message.date} user={message.user} text={message.text} />
            );
        });
        return (
            <div className="messageList">
                <h2>Conversation</h2>
                {messageNodes}
            </div>
        );
    }
});

var UsersList = React.createClass({
    render: function() {
        var userNodes = this.props.users.map(function(user) {
            return (
                <li>{user}</li>
            );
        });
        return (
            <div className="usersList">
                <h2>Users</h2>
                <ul>
                    {userNodes}
                </ul>
            </div>
        );
    }
});


var ChatForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var new_message = this.refs.new_message.getDOMNode().value.trim();
        if(!new_message) {
            return;
        }
        this.props.onMessageSubmit({text: new_message});
        this.refs.new_message.getDOMNode().value = '';
        return;
    },
    
    render: function() {
        return (
            <form className="chatForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your message..." size="50" ref="new_message" />
                <br/>
                <input type="submit" value="Send" className="button" />
            </form>
        );
    }
});

React.renderComponent(
    <ChatBox />,
    document.getElementById('content')
);