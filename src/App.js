import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { useState,useEffect } from 'react';

import io from 'socket.io-client';

function App() {
   
   
  const  [sms,setSms]= useState({currentList:[], currentValue :""})
  const [socket, setSocket] = useState(null)
  

  const changeState = (event) => {
    
          const newVal = event.target.value
          setSms({...sms,currentValue:newVal})
  }

 

  const sumitToState = (event) => {
              event.preventDefault()
              
              const message = sms.currentValue
              
              if (socket && message) {
                          socket.emit('new-message', message);

                          socket.on('message-back', (data) => {
                                      // console.log(data);
                                      const jsonData = JSON.parse(data)
                                      // console.log(jsonData)
                                      // const messageData = jsonData.data 
                                      setSms( pre => ({...sms,currentList:[...pre.currentList,jsonData],currentValue:""}))                                    
                                      
                          });
                
              }
  
       }

  

 ////////////////////////////
 const getFromDb = async() => {
          
          const url = "https://my-socket-api.adaptable.app/getsort"
                try {
                  const rowData = await fetch(url)
                  const jsonData = await rowData.json()
                  // console.log(jsonData)
                  jsonData.reverse() ;
                  setSms({...sms,currentList:jsonData})
                }
                catch (e) {
                  console.log(e)
                }
}
 

  const conncetToSer =  () => {
       
           
            getFromDb()    
            const socketInstance = io('https://my-socket-api.adaptable.app/');
            // https://my-socket-api.adaptable.app/
            // http://localhost:5005/
            setSocket(socketInstance);
            
              // listen for events emitted by the server
              socketInstance.on("server" ,(msg)=> {
                console.log(`from server : ${msg}`)
              })
              
              socketInstance.on('broadcast', (data) => {
                // console.log(data);
                const jsonDataBroad = JSON.parse(data)
                console.log(jsonDataBroad)
                setSms( pre => ({...sms,currentList:[...pre.currentList,jsonDataBroad]}))
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



 const renderEl = () => {
  const {currentList,currentValue} = sms

   return (
    <div className="App">
    <div className='main-chat-box'>
    <h3 className='heading'>Chat box..</h3>
    <hr/>
      <ul >
          {currentList.map(each => <li className='sms' key={uuidv4()}>
          {each.data}
            <hr/>
            <ul className='info row apart'>
               <li>{`name : ${each.name}`}</li>
               <li>{`place : ${each.place}`}</li>
               <li>{`time UTC: ${each.date }`}</li>
            </ul>

          
          
          </li>)}
      </ul >
    </div>
    <form onSubmit={sumitToState}>
    <input className='input-box' type="text" value={currentValue} onChange={changeState} placeholder="type here"/>
    <button className='ping'  type="submit" >send</button>
    </form>

  </div>
   )

 }


  return renderEl()
}

export default App;
