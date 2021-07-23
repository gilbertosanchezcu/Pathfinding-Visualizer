import React, {Component} from 'react';
import './Notes.css'







export default class SingleComment extends Component{


    render(){

        return (
            <div className='singlecomment-container'>
                <div className='singlecomment'>
                    <p> {`${this.props.username}  ->  ${this.props.note}`}</p>

                </div>
            </div>

        )
    }
}