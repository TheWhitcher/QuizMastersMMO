import React from 'react'
import _ from "lodash";
import {decode} from 'html-entities';

function Question({ question, correct_answer, incorrect_answers, selectAnswerHandler }) {

    function answersButtons() {

        const allAnswers = [...incorrect_answers, correct_answer].map(answer => {return {text: answer, correct: false}})
        allAnswers[allAnswers.length - 1].correct = true; // last answer is the right one

        return _.shuffle(allAnswers.map((answer, index) => {
            return <div key={index}>
                <button style={{margin: '5px', borderRadius: '20px', padding: '10px 20px'}} onClick={() => selectAnswerHandler(answer)}>{decode(answer.text)}</button>
            </div>
        }))
    }

    return (
        <div className='container'>
            <div className="row">
                <h2>{decode(question)}</h2>
                {answersButtons()}
            </div>
        </div>
    )
}

export default Question