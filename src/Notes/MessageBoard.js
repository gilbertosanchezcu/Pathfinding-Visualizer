import React, {Component} from 'react'
import SingleComment from './SingleComment'



export default class MessageBoard extends Component{

    render(){
        
        console.log(this.props)
        
        return(
            <div className='messageboard-container'>
                
                <div className='message-board'>
                    <h3>Notepad</h3>
                    {this.props.messages.map((message, index) => 
                        <SingleComment username={message.username} note={message.note} key ={index}/>
                    )}

                </div>

            </div>

        )
    }

}