import React, { useState } from 'react'
import './Events.css'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'

const Events = () => {
  const [creating, setCreating] = useState(false)

  const createEventHandler= ()=>{
    setCreating(true);
  }
  const modalConfirmHandler= ()=>{
    setCreating(false);
  }
  const modalCancelHandler= ()=>{
    setCreating(false);
  }
  return (
    <>
    {creating && <Backdrop />}
    { creating && <Modal title="Add title" canCancel={true} canConfirm={true} onCancel={modalCancelHandler} onConfirm={modalConfirmHandler}>
    
    </Modal>}
    <div className='events-control'>
      <p>Share your own Events!</p>
      <button className='btn' onClick={createEventHandler}>Create Event</button>
    </div>
    </>

  )
}

export default Events