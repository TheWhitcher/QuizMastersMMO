import React from 'react'

function Row(props) {
  return (
    <>
        <div className= {props.style}>
            <div className="row m-0" style={{height: "30px"}}>
                <div className="col border">{props.name}</div>
                <div className="col border">{props.category}</div>
                <div className="col border">{props.score}</div>
            </div>
        </div>
    </>
  )
}

export default Row