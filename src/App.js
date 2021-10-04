import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';

import './App.css';

const MessageTypes = { NONE: 0, SUCCESS: 1, ERROR: 2 }
const msgClasses = 
  { [MessageTypes.NONE]: ''
  , [MessageTypes.SUCCESS]: 'green'
  , [MessageTypes.ERROR]: 'red'
  }

function App() {
  const [socket, setSocket] = useState(null);
  const [userMessage, setUserMessage] = useState(
    { type: MessageTypes.NONE
    , message: ''
    });

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

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
    if (answerDetails.length < "I don't know.".length)
    {
      setUserMessage(
        { type: MessageTypes.ERROR
        , message: 'please give a more detailed response'
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
              <h3>YES <input ref={yesInput} type="radio" value="yes" name="answer"/> </h3> 
              <h3>NO <input ref={noInput} type="radio" value="no" name="answer"/> </h3> 
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
        ? (<h3 className={msgClasses[userMessage.type]}>
            {userMessage.message}
          </h3>) 
        : (<span></span>)
      }
    </div>
  );
}

export default App;