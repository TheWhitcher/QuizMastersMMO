import React from 'react'
import _ from "lodash";
import {decode} from 'html-entities';

function Question({ question, correct_answer, incorrect_answers, selectAnswerHandler }) {

    function answersButtons() {

        const allAnswers = [...incorrect_answers, correct_answer].map(answer => {return {text: answer, correct: false}})
        allAnswers[allAnswers.length - 1].correct = true; // last answer is the right one

        return _.shuffle(allAnswers.map((answer, index) => {
            return <div className="col-6 text-center" key={index}>
                <button className='btn btn-secondary w-75 m-2 py-4 rounded-pill' onClick={() => selectAnswerHandler(answer)}>{decode(answer.text)}</button>
            </div>
        }))
    }

    return (
        <div className='container'>
            <div className="row">
                <h3 className='p-3 text-center'>{decode(question)}</h3>
                {answersButtons()}
            </div>
        </div>
    )
}

export default Question