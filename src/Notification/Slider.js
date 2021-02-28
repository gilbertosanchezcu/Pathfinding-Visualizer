import React, {useState} from 'react'
import './Notification.css';
import {CgArrowLeftO, CgArrowRightO} from 'react-icons/cg';
import {SliderData} from './Items';



export const Slider = ({slides}) => {
    const [current, setCurrent] = useState([0])
    const nextSlide = () => {
        if(current[0] === 0){
            setCurrent([1])
        } else if (current[0]=== 1){
            setCurrent([2,3,4,5])
        } else if (current[0] === 2){
            setCurrent([6,7,8,9])
        } else if (current[0]=== 6){
            setCurrent([10,11,12,13])
        } else if (current[0] === 10){
            setCurrent([0])
        }
    } 

    const prevSlide = () => {
        if (current[0] === 0){
            setCurrent([10,11,12,13])
        } else if (current[0]=== 10){
            setCurrent([6,7,8,9])
        } else if (current[0]=== 6){
            setCurrent([2,3,4,5])
        } else if (current[0] === 2){
            setCurrent([1])
        } else if (current[0] === 1){
            setCurrent([0])
        }
    }
    

    if (!Array.isArray(slides)|| slides.length <= 0 ){
        return null;
    }

    return (
        <section className = 'notification-wrapper'>
            <CgArrowLeftO className = 'left-arrow' onClick = {prevSlide} />
            <CgArrowRightO className = 'right-arrow' onClick = {nextSlide}/>
            {SliderData.map((item,index) => {
                return (
                    <div key = {item.id} className = {current.includes(index)? 'slide active': 'slide'}>
                        {current.includes(index) && (
                        <div className = {item.class}>
                            <p> {item.text}</p>
                        </div>)}
                    </div>
                )
            })}

        </section>
    )
        
} 
        






