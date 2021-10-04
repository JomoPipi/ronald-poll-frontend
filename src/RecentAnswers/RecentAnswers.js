import React, { useState } from 'react';
import './RecentAnswers.css';


const RecentAnswers = ({ closeCallback, socket, showAnswers }) => {

    const [ answers, setAnswers ] = useState([])

    socket.on('responses', answers => {
        setAnswers(answers)
    })

    function toListElement({ answerIsYes, answerDetails }, i) {
        return <li className="response-item" key={Math.random()}>
            <span className={answerIsYes ? 'green' : 'red'}>
                <div className="response-number">{i+1}. </div>
                {answerIsYes ? 'YES' : 'NO'}
            </span> &nbsp;
            "{answerDetails}"
        </li>
    }

    return (
        <div className="main" style={{ display: showAnswers ? 'block' : 'none' }}>
            <button onClick={closeCallback}> go back </button>
            <h1>MOST RECENT ANSWERS</h1>

            <ol className="answer-list">
                {answers.map(toListElement)}
            </ol>
        </div>
    );
};

export default RecentAnswers;