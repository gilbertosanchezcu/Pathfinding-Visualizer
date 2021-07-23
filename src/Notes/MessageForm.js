import React, {Component} from 'react';
import './Notes.css'




export default class MessageForm extends Component{
    
    state = {
        username: '',
        note: '',
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    
    handleSubmit = event => {
        event.preventDefault() 
        if (this.state.username){
            const obj = {'username':this.state.username, 'note': this.state.note}
            this.props.updateMessage(obj)
            this.setState({username:'', note:''})

            

        } else {
            alert('Enter a username!')
        }
    }



    
    render(){


        return (
            <div className='message-container'>
                
                <div className = 'form-container'>
                    <form className="form">
                        <input name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" className='input'/> 
                        <textarea name="note" value ={this.state.note} onChange={this.handleChange} placeholder='Write some stuff down...' className='text-input'/>

                        <button type="submit" className='post-button' onClick={this.handleSubmit}>Post</button>
                    </form>
                </div>



            </div>

        )
    }

}