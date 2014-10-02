/*** @jsx React.DOM */

var socket = io.connect();

var Messages = [];

var pseudo;

var ChatBox = React.createClass({
    getInitialState: function() {
        pseudo = prompt("What's your username?");
        Messages.push({user: 'Connection', text: 'You\'re online'});
        socket.emit('new_client', pseudo);
        
        socket.on('message', this.newMessage);
        
        socket.on('new_client', this.newUser);
        
        return {messages: Messages};
    },
    
    newMessage: function(data) {
        Messages.unshift(data);
        this.setState({messages: Messages});
    },
    
    newUser: function(data) {
        Messages.unshift({user: 'Connection: ', text: data.pseudo + ' is now online'});
        this.setState({messages: Messages});
    },
    
    handleMessageSubmit: function(message) {
        Messages.unshift({user: pseudo, text: message.text});
        this.setState({messages: Messages});
        socket.emit('message', message.text);
    },
    
    render: function() {
        return (
            <div class="messagelist">
                <h1>Chat with socket.io and react.js</h1>
                
                <ChatForm onMessageSubmit={this.handleMessageSubmit} />

                <MessageList messages={this.state.messages} />
            </div>
        )
    }
});

var Message = React.createClass({
    render: function() {
        return (
            <p>
                <em>{this.props.user}</em> - {this.props.text}
            </p>
        );
    }
});

var MessageList = React.createClass({
    render: function() {
        var messageNodes = this.props.messages.map(function(message) {
            return (
                <Message user={message.user} text={message.text} />
            );
        });
        return (
            <div class="messageList">
                <h2>Conversation</h2>
                {messageNodes}
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
            <form class="chatForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your message..." size="50" ref="new_message" />
                <input type="submit" value="Send" />
            </form>
        );
    }
});

React.renderComponent(
    <ChatBox />,
    document.getElementById('content')
);