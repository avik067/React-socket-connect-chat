import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { useState,useEffect } from 'react';

import io from 'socket.io-client';

function App() {
   
   
  const  [sms,setSms]= useState({currentList:[{data: "erhget", name:"Israel Hagenes",place: "Port Maxiebury"}], currentValue :"",errMsg:"",place:'',name:''})
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

                          socket.on('message-back', (data) => {
                                      // console.log(data);
                                      const jsonData = JSON.parse(data)
                                      console.log(jsonData)
                                      // const messageData = jsonData.data
                                    
                                      setSms({...sms,currentList:[...sms.currentList,jsonData],currentValue:"" })
                          });

                          // setSms ({...sms,currentList:[...sms.currentList,{data: message, name:"",place: ""}],currentValue:"" })
              }
  
       }
  
  const conncetToSer = () => {
    
            const socketInstance = io('http://localhost:5005/');
            setSocket(socketInstance);
            
              // listen for events emitted by the server
            
              // socketInstance.on('connection', () => {
              //   console.log('Connected to server');
              // });
            
              // socketInstance.on('message-back', (data) => {
              //   // console.log(data);
              //   const jsonData = JSON.parse(data)
              //   console.log(jsonData)
              //   const messageData = jsonData.data
              
              //   // setSms({...sms,currentList:[...sms.currentList,jsonData],currentValue:"" })
              // });

              socketInstance.on("server" ,(msg)=> {
                console.log(`from server : ${msg}`)
              })

              
          return () => {
            if (socketInstance) {
              socketInstance.disconnect();
            }
          };
  }
/////////////////////////////////////////////////

  useEffect(()=>{
    conncetToSer()

  } ,[])


  return (
          <div className="App">
            <div className='main-chat-box'>
              <ul>
                  {currentList.map(each => <li className='sms' key={uuidv4()}>{each.data} <br/> {`name : ${each.name}`}<br />
                  {`place : ${each.place}`}</li>)}
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
