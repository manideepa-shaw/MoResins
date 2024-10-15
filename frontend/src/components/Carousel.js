import {React,useState} from 'react'
import "../css/Carousel.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faRightLeft } from '@fortawesome/free-solid-svg-icons'

const Carousel = (props) => {
    const [slideNum, setslideNum] = useState(0)
    const prevSlide =()=>{
        setslideNum(slideNum===0 ? props.images.length-1 : slideNum-1)
    }
    const nextSlide =()=>{
        if(slideNum===props.images.length-1)
        {
            setslideNum(0)
        }
        else{
            setslideNum(slideNum+1)
        }
    }
    const indicatorSlide =(ind)=>{
        setslideNum(ind)
    }
  return (
    
    <div className="final">
    <div className='carousel'>
        <FontAwesomeIcon icon={faArrowLeft} size='xl' className='arrow arrow-left' onClick={prevSlide}/>
        {props.images.map((image,idx)=>{
            return ( <>
            <img src={`${process.env.REACT_APP_BACKEND_URL_IMG}${image}`} alt={`${process.env.REACT_APP_BACKEND_URL_IMG}${image}`} 
            key={idx} className={slideNum===idx ? 'slide':'hide'}
            />
        </>
        )
        })}
        <FontAwesomeIcon icon={faArrowRight} size='xl' className='arrow arrow-right' onClick={nextSlide} />
        <span className='indicators'>
            {props.images.map((_,idx)=>{
                return <button key={idx} onClick={()=>indicatorSlide(idx)} className={slideNum===idx?'indicator':'indicator-blur'}></button>
            })}
        </span>
    </div>
    </div>
  )
}

export default Carousel