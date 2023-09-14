import React from 'react'

function Spinner({ light, size }) {

    size = size || 1;
    light = light || true;

    return (
        <div className="text-center">
            <div className={"spinner-grow m-5 " + (light ? "text-light" : "text-dark")}  style={{ width: size + "rem", height: size + "rem" }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner