
import './App.css';
import { useState,useEffect } from 'react';

import io from 'socket.io-client';

function App() {
   
   
  const  [sms,setSms]= useState({currentList:["hello","hey"], currentValue :""})
  const [socket, setSocket] = useState(null)
  const {currentList,currentValue} = sms

  const changeState = (event) => {
    const newVal = event.target.value
    setSms({...sms,currentValue:newVal})
  }

  const sumitToState = (event) => {
    event.preventDefault()
    const message = currentValue

  if (socket && message) {
    socket.emit('new-message', message);
  }
   
    setSms ({...sms,currentList:[...sms.currentList,currentValue],currentValue:"" })
  }
  
  const conncetToSer = () => {
    const socketInstance = io('http://localhost:4000');
    setSocket(socketInstance);
  
    // listen for events emitted by the server
  
    socketInstance.on('connection', () => {
      console.log('Connected to server');
    });
  
    socketInstance.on('message', (data) => {
      console.log(`Received message: ${data}`);
    });

    socketInstance.on("server" ,(msg)=> {
      console.log(`from server : ${msg}`)
    })

  
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }

  useEffect(()=>{
    conncetToSer()

  } ,[])



  return (
    <div className="App">
      <div className='main-chat-box'>
         <ul>
            {currentList.map(each => <li className='sms'>{each}</li>)}
         </ul>
      </div>
      <form onSubmit={sumitToState}>
       <input className='input-box' type="text" value={currentValue} onChange={changeState}/>
       <button className='ping'  type="submit" >send</button>
       </form>
       
       
    </div>
  );
}

export default App;
