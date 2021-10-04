import React, { useState, useRef } from 'react';
import io from 'socket.io-client';

import './App.css';
import RecentAnswers from './RecentAnswers/RecentAnswers';

const MessageTypes = { NONE: 0, SUCCESS: 1, ERROR: 2 }
const msgClasses = 
  { [MessageTypes.NONE]: ''
  , [MessageTypes.SUCCESS]: 'green'
  , [MessageTypes.ERROR]: 'red'
  }

function App() {
  const socket = io(`http://${window.location.hostname}:3000`);
  
  const [userMessage, setUserMessage] = useState(
    { type: MessageTypes.NONE
    , message: ''
    });

  const textInput = useRef(null);
  const yesInput = useRef(null);
  const noInput = useRef(null);

  function sendData() {
    setUserMessage({ type: MessageTypes.NONE })
    
    const answerIsYes = yesInput.current.checked
    const answerIsNo = noInput.current.checked
    const answerDetails = textInput.current.value
    if (!answerIsYes && !answerIsNo)
    {
      setUserMessage(
        { type: MessageTypes.ERROR
        , message: 'please select either YES or NO'
        })
      return;
    }
    const minCharacters = "I don't know.".length
    if (answerDetails.length < minCharacters)
    {
      setUserMessage(
        { type: MessageTypes.ERROR
        , message: `Please make your response longer than ${minCharacters} characters.`
        })
      return;
    }
    setUserMessage(
      { type: MessageTypes.SUCCESS
      , message: 'Thanks for letting us know!'
      })
    yesInput.current.checked = false
    noInput.current.checked = false
    textInput.current.value = ''

    socket.emit('user-answer', { answerIsYes, answerDetails })
  }

  const [showAnswers, setShowAnswers] = useState(false);
  function viewAnswersPage() {
    setShowAnswers(true)
    setUserMessage({ type: MessageTypes.NONE })
  }
  function hideAnswersPage() {
    setShowAnswers(false)
  }

  return (
    <div className="App">
      <header className="app-header">
        Ronald Poll
      </header>
      { socket ? (
        <div className="question-card">
          <div className="form"> 
              <h1> Is a 
                <span className="red"> hot dog </span>
                a 
                <span className="green"> sandwich</span>? 
              </h1>
            <div className="options">
              <label className="yes-no-label">
              <h3>YES <input ref={yesInput} type="radio" value="yes" name="answer"/> </h3> 
              </label>
              <label className="yes-no-label">
              <h3>NO <input ref={noInput} type="radio" value="no" name="answer"/> </h3> 
              </label>
            </div>
            <h1 className="italic"> Why? </h1>

            <textarea placeholder="Enter your response here" ref={textInput}></textarea>

            <button onClick={sendData}> <h1> OK </h1> </button>
          </div>
        </div>
      ) : (
        <div>Not Connected</div>
      )}
      { userMessage.type !== MessageTypes.NONE
        ? (<span>
            <h2 className={msgClasses[userMessage.type]}>
              {userMessage.message}
            </h2>
            {userMessage.type === MessageTypes.SUCCESS
              ? <button className="view-answers-link" target="_blank" onClick={viewAnswersPage}>
              SEE WHAT OTHERS HAVE TO SAY</button>
              : <span></span>
            }
          </span>) 
        : <span></span>
      }
      { <RecentAnswers 
          closeCallback={hideAnswersPage}
          socket={socket}
          showAnswers={showAnswers}
          />
      }
    </div>
  );
}

export default App;