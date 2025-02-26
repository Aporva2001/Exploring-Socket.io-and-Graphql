const Event = require("../../models/event");
const { transformEvent } = require("./merge");
const { User } = require("../../models/user");

module.exports = {
  // This contains all the resolvers
  events: async () => {
    // This function will be called if an incoming request looks for events property in RootQuery
    //    return events;
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      console.log(err);
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
      createdEvent = transformEvent(result);
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
};
