const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
    //   return events; // ERROR HERE
  } catch (err) {
    throw err;
  }
};

const singleEvent= async (eventId)=>{
    try {
        const event= await Event.findById(eventId);
        return {...event._doc, _id: event.id, creator: user.bind(this, event.creator),}
    } catch (err) {
    throw err;  
    }
}
const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  // This contains all the resolvers
  events: async () => {
    // This function will be called if an incoming request looks for events property in RootQuery
    //    return events;
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event._id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  bookings: async (args) => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "67beb3a80c0cd674ce29a46c",
      });
      let createdEvent;
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
      const creator = await User.findById("67beb3a80c0cd674ce29a46c");
      if (!creator) {
        throw new Error("User not Found");
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }

    // events.push(event);
  },
  createUser: async (args) => {
    try {
      const exisitingUser = await User.findOne({ email: args.userInput.email });
      if (exisitingUser) {
        throw new Error("User exists already");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        // password: args.userInput.password // Insecure as password will be stored as plaintext
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, password: null, _id: result._id };
      // The password which we return will be set to null due to security issues though it will be stored in the database.
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  bookEvent: async (args) => {
    try{
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "67beb3a80c0cd674ce29a46c",
      event: fetchedEvent,
    });

    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(booking._doc.createdAt).toISOString(),
      updatedAt: new Date(booking._doc.updatedAt).toISOString(),
    };
}
catch(err){
    throw err;
}
  },
  cancelBooking: async (args) =>{
    try {
    const booking= await Booking.findById(args.bookingId).populate('event');
    const event= {...booking.event._doc, _id: booking.event.id, creator: user.bind(this, booking.event._doc.creator)}
    await Booking.findByIdAndDelete(args.bookingId)
    return event;
    } catch (err) {
        throw err
    } 
  }
};
