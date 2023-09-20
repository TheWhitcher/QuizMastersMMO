import { useContext, useEffect, useState } from 'react'
import Question from './components/Question';
import Spinner from './components/Spinner';
import Result from './components/Result';
import { SocketContext } from './data/socketContent';
import { useNavigate, useParams } from 'react-router-dom';
import Timer from './components/Timer';

function HostQuiz() {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const {code} = useParams();

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState();
    const [numberOfQuestions, setNumberOfQuestion] = useState();
    const [timePerQuestion, setTimePerQuestion] = useState();
    const [playerCount, setPlayerCount] = useState(0);
    const [playersAnswered, setPlayersAnswered] = useState(0);
    const [isNotDone, setIsNotDone] = useState(true)

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
                console.log('data: ', data);
                setQuestions(data.questions)
                setNumberOfQuestion(data.numberOfQuestions)
                setTimePerQuestion(data.timePerQuestion)
                setSelectedCategory(data.questions[0].category)
                setPlayerCount(data.playerCount)  
            })

            socket.on('room-closed', (data) => {
                alert(data.message)
                navigate("../choice")
            })

            socket.on('player-answered', () => {
                setPlayersAnswered(playersAnswered + 1)

                if(playersAnswered === playerCount){
                    setIsNotDone(false)
                }
            })

            socket.on('time-up', () => {
                setIsNotDone(false)
            })

            // return () => {
            //     socket.off('room-closed')
            //     socket.off('quiz-questions')
            //     console.log("Dismounted");
            // }
    }, []);

    function nextQuestion() {
        setIsLoading(true);

        if (activeQuestionIndex === numberOfQuestions - 1) {
            // last question
            navigate(`../leaderboard/${code}`)
        } else {
            // next question
            setActiveQuestionIndex((value) => value + 1);
            setIsNotDone(true)
            socket.emit('start-timer', {code: code})

        }

        setTimeout(() => {
            setIsLoading(false);
        }, 200)
    }

    function closeRoom(){
        socket.emit('close-room', code)
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
                                <div className="row">
                                    <div>Answers {playersAnswered}/{playerCount}</div>
                                </div>
                                <div className="row" style={{marginBlock: '10px'}}>
                                    <button style={{marginInline: '30px'}} onClick={nextQuestion} disabled={isNotDone}>Next</button>
                                    <button style={{marginInline: '30px'}} onClick={closeRoom}>Close</button>
                                </div>
                                    
                                <div className='row' style={{fontSize: '1.5em'}}>Time Left <Timer initialTime={timePerQuestion} /></div>
                                <div style={{pointerEvents: 'none'}}>
                                    <Question question={questions[activeQuestionIndex].question} correct_answer={questions[activeQuestionIndex].correct_answer} incorrect_answers={questions[activeQuestionIndex].incorrect_answers}
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

export default HostQuiz