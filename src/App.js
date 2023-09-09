
import './App.css';
import { useState,useEffect } from 'react';

import io from 'socket.io-client';

function App() {
   
   
  const  [sms,setSms]= useState({currentList:[{data: "erhget", name:"Israel Hagenes",place: "Port Maxiebury"}], currentValue :"",errMsg:"",place:'',name:''})
  const [socket, setSocket] = useState(null)
  const {currentList,currentValue,place,name} = sms

  const changeState = (event) => {
    const newVal = event.target.value
    setSms({...sms,currentValue:newVal})
  }

  const sumitToState = (event) => {
    event.preventDefault()
    const socketInstance = io('http://localhost:5005');
    setSocket(socketInstance);
    const message = currentValue
    
  if (socket && message) {
    socket.emit('new-message', message);
    
  }
   
  

    
  

    // setSms ({...sms,currentList:[...sms.currentList,currentValue],currentValue:"" })
    // currentList:[...sms.currentList,currentValue],
  }
  
  const conncetToSer = () => {
    const socketInstance = io('http://localhost:5005');
    setSocket(socketInstance);
   
    // listen for events emitted by the server
  
    socketInstance.on('connection', () => {
      console.log('Connected to server');
    });
  
    socketInstance.on('message-back', (data) => {
      // console.log(data);
      const jsonData = JSON.parse(data)
      console.log(jsonData)
      const messageData = jsonData.data
      setSms({...sms,currentList:[...sms.currentList,messageData],currentValue:"" ,place:jsonData.place,name:jsonData.name})
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

  } ,[sms])




  return (
    <div className="App">
      <div className='main-chat-box'>
         <ul>
            {currentList.map(each => <><li className='sms'>{each.data} <br/> {`name : ${each.name}`}<br />{`place : ${each.place}`}</li></>)}
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
