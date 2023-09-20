import { useContext, useEffect, useState } from 'react'
import Question from './components/Question';
import Spinner from './components/Spinner';
import { SocketContext } from './data/socketContent';
import { useNavigate, useParams } from 'react-router-dom';
import Timer from './components/Timer';

function PlayerQuiz() {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const {code} = useParams();

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState();
    const [numberOfQuestions, setNumberOfQuestion] = useState();
    const [timePerQuestion, setTimePerQuestion] = useState();
    const [isAnswered, setIsAnswered] = useState(false)

    useEffect(() => {
        if(!socket){
                navigate('./multiplayer')
                console.log("No socket found")
                return;
            }
    
            socket.emit('connected');
            socket.emit('request-questions', { code: code, isHost: true });
            socket.emit('start-timer', {code: code});
    
            socket.on('quiz-questions', (data) => {
                setQuestions(data.questions)
                setNumberOfQuestion(data.numberOfQuestions)
                setTimePerQuestion(data.timePerQuestion)
                setSelectedCategory(data.questions[0].category)
                console.log('activeQuestionIndex: ', activeQuestionIndex);
                
                console.log(data)
            })

            socket.on('next-question', () => {
                // next question
                setIsLoading(false)
                setActiveQuestionIndex((value) => value + 1);
                socket.emit('start-timer', {code: code})
            })

            socket.on('room-closed', (data) => {
                //(data.message)
                navigate("../choice")
            })

            socket.on('time-up', () => {
                setIsLoading(true)
            })

            socket.on('nav-leaderboard', () => {
                navigate(`../leaderboard/${code}`)
            })
            
            // return () => {
            //     socket.off('room-closed')
            //     socket.off('quiz-questions')
            //     console.log("Dismounted");
            // }
    }, []);

    function leaveRoom(){
        socket.emit('leave-room', code)
    }

    function selectAnswerHandler(answer) {
        setIsLoading(true);
        socket.emit('player-answered', {code: code})

        if (answer.correct) {
            // TODO: increment score
            //setScore((value) => value + 1); // increment score
            //alert("Good Answer!");
        }

        
    }

    return (
        <div className='container' style={{ margin: '10px', padding: '40px' }}>
            <div className="row">
                { 
                    isLoading ? <Spinner light={true} size={4}></Spinner> : 
                    (questions.length === 0 ? <></> :
                        <>
                            <div className="container">
                                <div className="row">
                                    <div>{selectedCategory}</div>
                                </div>
                                <div className="row">
                                    <div>Question {activeQuestionIndex + 1}/{numberOfQuestions}</div>
                                </div>
                                <div className="row" style={{marginBlock: '10px'}}>
                                    <button style={{marginInline: '30px'}} onClick={leaveRoom}>Leave</button>
                                </div>
                                    
                                <div className='row' style={{fontSize: '1.5em'}}>Time Left <Timer initialTime={timePerQuestion} /></div>
                                <div className="row">
                                    <Question question={questions[activeQuestionIndex].question} correct_answer={questions[activeQuestionIndex].correct_answer} incorrect_answers={questions[activeQuestionIndex].incorrect_answers} selectAnswerHandler={selectAnswerHandler}
                                    ></Question>
                                </div>
                            </div>

                        </>
                    )
                }
            </div>

        </div>
    )
}

export default PlayerQuiz