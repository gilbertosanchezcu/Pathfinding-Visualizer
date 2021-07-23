import React, {Component} from 'react';
import MessageBoard from './MessageBoard';
import MessageForm from './MessageForm';
import './Notes.css'




export default class MessageComponent extends Component{
    
    state = {
        messages:[]
    }


    updateMessage = newMessage => {
        this.setState({messages:this.state.messages.concat(newMessage)})
    }



    render(){


        return(
            <div className='message-component'>
                <h1> Make a Note!</h1>
                <MessageForm updateMessage={this.updateMessage} messages={this.state.messages}/>
                <MessageBoard messages={this.state.messages}/>
            </div>
        )
    }
}