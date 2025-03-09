import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/auth-context';
import Spinner from '../components/Navigation/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';

const Bookings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const[bookings, setBookings]= useState([]);
  const {token} = useContext(AuthContext);
  useEffect(()=>{
    fetchBookings()
  })
  const fetchBookings= ()=>{
    setIsLoading(true);
    const requestBody={
      query: `
      query {
          bookings {
          _id
          createdAt
          event {
            _id
            title
            date
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
  const bookings= resData.data.bookings;
  setBookings(bookings);
  setIsLoading(false);
  fetchBookings()
  })
  .catch(err =>{
  console.log(err);
  setIsLoading(false)
  })
  }

  const  deleteBookingHandler= (bookingId)=>{
    setIsLoading(true);
    const requestBody={
      query: `
      mutation {
          cancelBooking(bookingId: "${bookingId}") {
          _id
          title
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
  setBookings(prevState =>{
    console.log(prevState)
    const updatedBookings= prevState.bookings.filter(booking =>{
      return booking._id !== bookingId;
    })
    setIsLoading(false);
    return updatedBookings;
  });
  setIsLoading(false);
  fetchBookings()
  })
  .catch(err =>{
  console.log(err);
  setIsLoading(false)
  })
  }
  return (
    <>
    {/* {isLoading ? <Spinner/> : ( */}
      <BookingList bookings={bookings} onDelete= {deleteBookingHandler}/>
    {/* )} */}
    </>
    
  )
}

export default Bookings