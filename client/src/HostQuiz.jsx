import React, { useEffect, useState } from 'react'
import { openTDhost } from './constants';
import Question from './components/Question';
import Spinner from './components/Spinner';
import Result from './components/Result';


function HostQuiz() {

    const JSONstring = localStorage.getItem("categoryInfo");
    const categoryInfo = JSON.parse(JSONstring);
    
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [quizFinished, setQuizFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState();

    const numberOfQuestions = 10;

    useEffect(() => {
        setSelectedCategory({name: categoryInfo[0].name, id: categoryInfo[1].id})
    }, [])

    useEffect(() => {
        if (!selectedCategory) {
            return
        }

        const url = `${openTDhost}?amount=${numberOfQuestions}&category=${selectedCategory.id}&difficulty=easy`

        setIsLoading(true);

        async function fetchTrivia() {

            const triviaResponse = await fetch(url);

            const body = await triviaResponse.json();

            if (body.results) {
                setQuestions(body.results);
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 500)
        }

        fetchTrivia();

    }, [selectedCategory])

    function selectAnswerHandler(answer) {
        setIsLoading(true);

        if (answer.correct) {
            setScore((value) => value + 1); // increment score
            alert("Good Answer!");
        }

        if (activeQuestionIndex === numberOfQuestions - 1) {
            // last question
            setQuizFinished(true);
        } else {
            // next question
            setActiveQuestionIndex((value) => value + 1);
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 200)
    }

    return (
        <div className='container rounded p-4 my-2' style={{ backgroundColor: "rgb(255, 235, 205)" }}>
            <div className="row">
                {
                    isLoading ? <Spinner light={true} size={4}></Spinner>
                        : (questions.length === 0 ? <></> :
                            <>
                                {!quizFinished ?
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-12">
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 text-center h2">{selectedCategory.name}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 text-center h2">Question {activeQuestionIndex + 1}/{numberOfQuestions}</div>
                                        </div>
                                        <div className="row">
                                            <Question question={questions[activeQuestionIndex].question} correct_answer={questions[activeQuestionIndex].correct_answer} incorrect_answers={questions[activeQuestionIndex].incorrect_answers} selectAnswerHandler={selectAnswerHandler}
                                            ></Question>
                                        </div>
                                    </div> : <>
                                        {/* Score/result component */}
                                        <div className="container text-center">
                                            <Result score={score} />
                                        </div>
                                    </>
                                }
                            </>)}
            </div>

        </div>
    )
}

export default HostQuiz