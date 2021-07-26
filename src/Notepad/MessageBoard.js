import React from 'react'
import SingleComment from './SingleComment'



const MessageBoard = props => {
    
    return(
        <div className='messageboard-container'>
            
            <div className='message-board'>
                <h3>Notepad</h3>
                {props.notes.map((note, index) => 
                    <SingleComment username={note.username} note={note.message} key ={index}/>
                )}

            </div>

        </div>

    )
}

export default MessageBoard
