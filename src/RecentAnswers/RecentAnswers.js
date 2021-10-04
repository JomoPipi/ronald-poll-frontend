import React from 'react';
import './RecentAnswers.css';


const RecentAnswers = (props) => {

    return (
        <div className="main">
            <button onClick={props.closeCallback}> go back </button>
            <h1>RECENT ANSWERS</h1>

            <ul className="answer-list">
                <li>eryeo</li>
                <li>hello</li>
                <li>heldadf</li>
                <li>yegslo</li>
            </ul>
        </div>
    );
};

export default RecentAnswers;