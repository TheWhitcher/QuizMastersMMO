import React from 'react';

function ScrollableList(props) {
  return (
    <div className="list-container">
        <div className="list-item">{props.name}</div>
    </div>
  );
}

export default ScrollableList;