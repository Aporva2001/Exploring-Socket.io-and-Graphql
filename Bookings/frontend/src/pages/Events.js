import React, { useContext, useEffect, useState } from "react";
import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import { AuthContext } from "../context/auth-context";
import EventList from "../components/Events/EventsList/EventList";
import Spinner from "../components/Navigation/Spinner/Spinner";

const Events = () => {
  let isActive= true;
  const {token,userId} = useContext(AuthContext);

  const [creating, setCreating] = useState(false);
  const [formInput, setFormInput] = useState({
    title: "",
    price: 0,
    description: "",
    date: "",
  });
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent]= useState(null);

  const [isLoading, setIsLoading]= useState(false);
  const fetchEvents= ()=>{
    setIsLoading(true);
    const requestBody={
      query: `
      query {
          events {
          _id
          title
          description
          date
          price
          creator {
            _id
            email
          }
          }
      }
      `
  };
  
  fetch('http://localhost:8000/graphql',{
  method: "POST",
  body: JSON.stringify(requestBody),
  headers: {
      'Content-Type': 'application/json'
  }
  })
  .then(res =>{
  if(res.status !== 200 && res.status !== 201){
      throw new Error('failed');
  }
  return res.json()
  })
  .then(resData =>{
  const events= resData.data.events;
  if(isActive){
    setEvents(events);
    setIsLoading(false);
  }

  // fetchEvents()
  })
  .catch(err =>{
  console.log(err);
  if(isActive)
  setIsLoading(false)
  })
  }  
useEffect(()=>{
  fetchEvents()

  return ()=>{
    isActive= false
  }
})

  const createEventHandler = () => {
    setCreating(true);
  };
  const modalConfirmHandler = () => {
    setCreating(false);
    const title = formInput.title;
    const price = +formInput.price;
    const description = formInput.description;
    const date = formInput.date;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      description.trim().length === 0 ||
      date.trim().length === 0
    ) {
      return;
    }
    // console.log(formInput)
    const event= {title, price, description, date};
    // const event = formInput;
    console.log(event);
     const requestBody={
          query: `
          mutation {
              createEvent(eventInput: {title:"${title}",description:"${description}", price: ${price}, date: "${date}" }){
              _id
              title
              description
              date
              price
              
              }
          }
          `
      };

  fetch('http://localhost:8000/graphql',{
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ token
      }
  })
  .then(res =>{
      if(res.status !== 200 && res.status !== 201){
          throw new Error('failed');
      }
      return res.json()
  })
  .then(resData =>{
    setEvents((prevState)=>{
      const updatedEvents= [...prevState];
      updatedEvents.push({
        _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: userId,
          }
          })
          return updatedEvents
      })
    })
  .catch(err =>{
      console.log(err);
  })
}
  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };
  const changeFormInput = (e) => {
    const { id, value } = e.target;
    // console.log(e.target.id);
    // console.log(e.target.value)
    setFormInput((prevInput) => ({
      ...prevInput,
      [id]: value,
    }));
  };

const showDetailHandler = eventId =>{
    // setSelectedEvent(prevState =>{
    //   prevState= events.filter(e => e._id === eventId)
    //   // console.log(prevState);
    //   return prevState;
    // })
    setSelectedEvent(() => {
      return events.find(e => e._id === eventId) || null; 
    });
}

const bookEventHandler= ()=>{
  // setIsLoading(true);
  if(!token){
    setSelectedEvent(null);
    return;
  }
  const requestBody={
    query: `
    mutation {
        bookEvent(eventId: "${selectedEvent._id}") {
        _id
        createdAt
        updatedAt
        }
    }
    `
};

fetch('http://localhost:8000/graphql',{
method: "POST",
body: JSON.stringify(requestBody),
headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer '+token
}
})
.then(res =>{
if(res.status !== 200 && res.status !== 201){
    throw new Error('failed');
}
return res.json()
})
.then(resData =>{
console.log(resData)
setSelectedEvent(null);
})
.catch(err =>{
console.log(err);
})
}
  return (
    <>
      {(creating ||selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title="Add title"
          canCancel={true}
          canConfirm={true}
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form action="">
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={formInput.title}
                onChange={changeFormInput}
              />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                value={formInput.price === 0 ? "" : formInput.price}
                onChange={changeFormInput}
              />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input
                type="datetime-local"
                id="date"
                value={formInput.date}
                onChange={changeFormInput}
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                value={formInput.description}
                onChange={changeFormInput}
              />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel={true}
          canConfirm={true}
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText= {token ? "Book" : 'Confirm'}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>₹{selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}</h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {token && <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn" onClick={createEventHandler}>
          Create Event
        </button>
      </div>}
      {/* {isLoading ? <Spinner /> :  */}
      <EventList events={events} authUserId= {userId} onDetail= {showDetailHandler}/>
       {/* } */} 
    </>
  );
};

export default Events;
