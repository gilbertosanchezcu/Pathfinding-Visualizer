import React, {useState} from 'react'
import './Notification.css';
import {CgArrowLeftO, CgArrowRightO} from 'react-icons/cg';
import {SliderData} from './Items';



export const Slider = ({slides}) => {
    const [current, setCurrent] = useState([0])
    const nextSlide = () => {
        if(current[0] === 0){
            setCurrent([1,2,3,4])
        } else if (current[0]=== 1){
            setCurrent([5,6,7,8])
        } else if (current[0] === 5){
            setCurrent([9,10,11,12])
        } else if (current[0]=== 9){
            setCurrent([0])
        }
    } 

    const prevSlide = () => {
        if (current[0] === 0){
            setCurrent([9,10,11,12])
        } else if (current[0]=== 9){
            setCurrent([5,6,7,8])
        } else if (current[0]=== 5){
            setCurrent([1,2,3,4])
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
        











// function NotificationItem(props){
//     return (
//         <div className = 'notification-item'>
//             <p>
//                 {props.message}
//             </p>
//         </div>
//     )
// }

// function HomeNotifications(props){
//     return (
//         <>
//             <NotificationItem message = 'Click on cells to add walls' />
//             <NotificationItem message = 'Drag Mouse and Cheese to fix start and end points' />
//             <NotificationItem message = 'Pick an algorithm!' />
//         </>
//     )
// }

// function UpdatedNotifications(){
//     return (
//         <>
//             <NotificationItem message = 'Drag start and endpoints to find new paths' />
//             <NotificationItem message = 'Click on different algorithms to compare paths' />
//             <NotificationItem message = 'Reset board to add walls' />
//         </>
//     )
// }

// export function Notification(props){ 
//     console.log('this is props.algoDone', props.algoDone)
//     return (
//         <div className='notification-wrapper'>
//             {props.algoDone
//                 ? <UpdatedNotifications />
//                 : <HomeNotifications />
//             }    
//         </div>
//     )
// }