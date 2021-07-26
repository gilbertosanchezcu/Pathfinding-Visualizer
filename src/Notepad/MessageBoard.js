import React from 'react'
import SingleComment from './SingleComment'



const MessageBoard = props => {
    
    return(
        <div className='messageboard-container'>
            
            <div className='message-board'>
                <div className = 'message-board-heading'>
                    <h3>Notepad</h3>
                </div>
                <div className = 'message-board-post'>
                    {props.notes.map((note, index) => 
                        <SingleComment username={note.username} note={note.message} key ={index}/>
                    )}
                </div>
            </div>

        </div>

    )
}

export default MessageBoard
