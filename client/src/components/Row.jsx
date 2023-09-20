import React from 'react'

function Row(props) {
  const rowStyle = {
    display: 'flex',
    height: '30px',
  };

  const columnStyle = {
    flex: '1 0 33%',
    border: '1px solid',
    padding: '5px',
  };

  return (
    <>
        <div className= {props.style}>
            <div style={{rowStyle}}>
            {/*Very ugly solution, but too tired to think of better way*/}
                <span style={{columnStyle}}>{props.index}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.score}</span>
            </div>
        </div>
    </>
  )
}


export default Row