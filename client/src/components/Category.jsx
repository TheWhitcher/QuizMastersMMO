import React from 'react'
import { useEffect } from 'react';
import SquareButton from './SquareButton'
import PillButton from './PillButton'

const backstring = '<= Back'
function Category() {

  let categoryInfo = [{name: null}, {id: null}]
  
  useEffect(() => {
    localStorage.setItem("categoryInfo", JSON.stringify(categoryInfo));
  })

  function categorySelection(categoryName, categoryId){

    categoryInfo[0].name = categoryName;
    categoryInfo[1].id = categoryId;

    localStorage.setItem("categoryInfo", JSON.stringify(categoryInfo))
  }
  
  return (
    <div>
      <div className='flex container rounded text-center pt-3 mt-5' style={{backgroundColor: 'rgb(255, 235, 205)'}}>
        <div className="row text-start">
          <SquareButton destination="/Home" text={backstring}/>
        </div>
        <div className="row">
            <h1>New Quiz</h1>
        </div>
        <div className="row">
          <h5>Please select a category</h5>
        </div>
        <div className="row my-5">
          <div className="col-6 text-end" onClick={() => categorySelection('Mythology', 20)}>
            <PillButton text='Mythology' destination='/Play'></PillButton>
          </div>
          <div className="col-6 text-start" onClick={() => categorySelection('Geography', 22)}>
            <PillButton text='Geopgraphy' destination='/Play'></PillButton>
          </div>
        </div>
        <div className="row my-5">
          <div className="col-6 text-end" onClick={() => categorySelection('Video Games', 15)}>
            <PillButton text='Video Games' destination='/Play'></PillButton>
          </div>
          <div className="col-6 mb-5 text-start" onClick={() => categorySelection('Film', 11)}>
            <PillButton text='Films' destination='/Play'></PillButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category