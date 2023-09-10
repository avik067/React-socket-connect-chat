import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { useState,useEffect } from 'react';

import io from 'socket.io-client';

function App() {
   
   
  const  [sms,setSms]= useState({currentList:[], currentValue :"",errMsg:""})
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
                
              }
  
       }
  
  const conncetToSer = () => {
    
            const socketInstance = io('https://my-socket-api.adaptable.app/');
            // https://my-socket-api.adaptable.app/
            // http://localhost:5005/
            setSocket(socketInstance);
            
              // listen for events emitted by the server
            

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
     
    if (socket) {
      socket.on('broadcast', (data) => {
                    // console.log(data);
                    const jsonDataBroad = JSON.parse(data)
                    console.log(jsonDataBroad)
                  
                    setSms({...sms,currentList:[...sms.currentList,jsonDataBroad]})
        });
      }

  } ,[])

  useEffect(()=>{

    if (socket) {
    socket.on('broadcast', (data) => {
                  // console.log(data);
                  const jsonDataBroad = JSON.parse(data)
                  console.log(jsonDataBroad)
                
                  setSms({...sms,currentList:[...sms.currentList,jsonDataBroad]})
      });
    }
  } ,[socket])


  return (
          <div className="App">
            <div className='main-chat-box'>
            <h3 className='heading'>Chat box..</h3>
            <hr/>
              <ul>
                  {currentList.map(each => <li className='sms' key={uuidv4()}>{each.data} <br/> {`name : ${each.name}`}<br />
                  {`place : ${each.place}`}</li>)}
              </ul>
            </div>
            <form onSubmit={sumitToState}>
            <input className='input-box' type="text" value={currentValue} onChange={changeState} placeholder="type here"/>
            <button className='ping'  type="submit" >send</button>
            </form>
          
          </div>
  );
}

export default App;
