import React from "react";
import "./EventItem.css";

const EventItem = ({
  _id,
  title,
  price,
  description,
  date,
  userId,
  creatorId,
  onDetail
}) => {
  return (
    <li key={_id} className="events__list-item">
      <div>
        <h1>{title}</h1>
        <h2>₹{price} - {new Date(date).toLocaleDateString()}</h2>
      </div>
      <div>
        {userId === creatorId ? (
          <p>You are the owner of the event</p>
        ) : (
          <button className="btn" onClick={()=>{onDetail(_id)}}>View Details</button>
        )}
      </div>
    </li>
  );
};
//  onClick={onDetail(_id)}
export default EventItem;
