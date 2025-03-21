import React from "react";
import "./EventList.css";
import EventItem from "./EventItem/EventItem";

const EventList = (props) => {
  const events = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        _id={event._id}
        title={event.title}
        price={event.price}
        description={event.description}
        date={event.date}
        userId={props.authUserId}
        creatorId= {event.creator._id}
        onDetail= {props.onDetail}
      />
    );
  });
  return <ul className="event__list">{events}</ul>;
};

export default EventList;
