import React, {Component} from 'react';
import MessageBoard from './MessageBoard';
import MessageForm from './MessageForm';
import './Notes.css'




export default class NotesComponent extends Component{

    updateNotes = obj =>{
        this.props.updateNotes(obj)
    }
    
    render(){
        return(
            <div className='message-component'>
                <h1> Make a Note!</h1>
                <MessageForm updateNotes={this.updateNotes} notes={this.props.notes}/>
                <MessageBoard notes={this.props.notes}/>
            </div>
        )
    }
}
