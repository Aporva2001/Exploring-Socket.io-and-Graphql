import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/auth-context';
import Spinner from '../components/Navigation/Spinner/Spinner';

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
  return (
    <>
    {/* {isLoading ? <Spinner/> : ( */}
      <ul>
        {bookings.map(booking =>{
          return <li key={booking._id}>{booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}</li>
        })}
      </ul>
    {/* )} */}
    </>
    
  )
}

export default Bookings