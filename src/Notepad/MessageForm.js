import React, {Component} from 'react';
import './Notes.css'




export default class MessageForm extends Component{
    
    state = {
        username: '',
        message: '',
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    
    handleSubmit = event => {
        event.preventDefault() 
        if (this.state.username && this.state.message){
            const obj = {username:this.state.username, message: this.state.message}

            //optimistic rendering 
            this.props.updateNotes(obj)
            this.setState({username:'', message:''})

            fetch("http://localhost:3001/api/v1/notes", {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify(obj)
            })
            

            

        } else if (!this.state.username){
            alert('Enter a username!')
        }else{
            alert('Enter a message!')
        }

    }



    
    render(){


        return (
            <div className='message-container'>
                
                <div className = 'form-container'>
                    <form className="form">
                        <input name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" className='input'/> 
                        <textarea name="message" value ={this.state.message} onChange={this.handleChange} placeholder='Write some stuff down...' className='text-input'/>

                        <button type="submit" className='post-button' onClick={this.handleSubmit}>Post</button>
                    </form>
                </div>



            </div>

        )
    }

}