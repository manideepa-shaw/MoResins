import React from 'react'
import "../css/Home.css"
import "../App.css"
import i1 from "../images/i1.jpg"
import i2 from "../images/i2.jpg"

const Home = () => {
  return (
    <>
    <div className="images">
    <div className="container-fluid">
      <div className="row homeitems">
        <div className="col-sm-1 g1"></div>
        <div className="justify-content-center col-sm-4 g2">
          <img src={i1} alt="" srcset="" />
        </div>
        <div className="col-sm-2" g4></div>
        <div className="col-sm-4 text-center para g5">
          <p> 
            <div className="dark"> Come</div> <div className="white"> And </div> Fall 
            <br/>
             in <div className="red"> Love With our </div>
            <br/><div className="pink"> Finest Collections</div>
          </p>
        </div>
        <div className="col-sm-1"></div>
      </div>
      <br/><br/>
      <div className="row homeitems" style={{margin: "40px 0"}}>
        <div className="col-sm-1 g1"></div>
        <div className="col-sm-4 text-center para g2">
          <p> <div className="white"> Preserve</div> Your <div className="pink"> BEST</div> <br/> Day's Memories <br/><div className="red"> FOREVER</div></p>
        </div>
        <div className="col-sm-3 justify-content-center g5">
          <img src={i2} alt="" srcset="" />
        </div>
        <div className="col-sm-1 g6"></div>
      </div>
    </div>
  </div>
    </>
  )
}

export default Home