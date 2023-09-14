import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authorizationToken, scoreRoute } from './constants.js';
import SquareButton from './SquareButton';

function Result(props) 
{
  const JSONstring = localStorage.getItem("categoryInfo");
  const categoryData = JSON.parse(JSONstring);

  const navigate = useNavigate()
  const score = props.score;
  const categoryName = categoryData[0].name;
  const categoryID = categoryData[1].id;
  let playerName = "";

  function navigateToApp(){
    navigate('/Leaderboard');
  }
  
  async function PostName()
  {
    playerName = document.getElementById("name").value

    if(playerName.length > 0){
      
      const url = scoreRoute;
      
      const options ={      
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorizationToken
        },
        body: JSON.stringify(
        {
          "name": playerName,
          "score": score,
          "categoryId": categoryID,
          "categoryName": categoryName
        })
      }
      
      await fetch(url, options)
      
      await navigateToApp();

      alert('Added to leaderboards');
    }
    else
    {
      alert('Enter your name');
    }
  }
    
    return (
      <>
      <div>
        <div className="flex container rounded text-center m-0">
          <div className="row">
            <h1 className="mt-3">Completed!</h1>
          </div>

          <div className="row">
            <h3 className="fs-3 mb-5">Your score is {props.score}/10</h3>
          </div>

          <div className="row p-0">
            <div className="col text-end">
              <label className="pe-2">Name: </label>
              <input type="text" id="name" name="name"/>
            </div>

            <div className="col text-start">
                <SquareButton text="Save score to leaderboard" clickEvent={PostName}/>
            </div>
          </div>

          <div className="row mt-4">
            <SquareButton destination="/Category" text="Replay" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Result