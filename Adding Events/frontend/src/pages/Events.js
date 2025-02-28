import React, { useContext, useEffect, useState } from "react";
import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import { AuthContext } from "../context/auth-context";

const Events = () => {
  const {token} = useContext(AuthContext);

  const [creating, setCreating] = useState(false);
  const [formInput, setFormInput] = useState({
    title: "",
    price: 0,
    description: "",
    date: "",
  });
  const [events, setEvents] = useState([])
  const fetchEvents= ()=>{
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
  setEvents(events);
  fetchEvents()
  })
  .catch(err =>{
  console.log(err);
  })
  }  
useEffect(()=>{
  fetchEvents()
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
    console.log(resData);
  })
  .catch(err =>{
      console.log(err);
  })
}
  const modalCancelHandler = () => {
    setCreating(false);
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

  const eventList= events.map((event)=>{
    return  <li key={event._id}className="events__list-item">{event.title}</li>
  })
  return (
    <>
      {creating && <Backdrop />}
      {creating && (
        <Modal
          title="Add title"
          canCancel={true}
          canConfirm={true}
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
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
      {token && <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn" onClick={createEventHandler}>
          Create Event
        </button>
      </div>}
      <ul className="events__list">
      {eventList}
      </ul>
    </>
  );
};

export default Events;
