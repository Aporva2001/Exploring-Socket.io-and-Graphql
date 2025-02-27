const Event = require("../../models/event");
const { transformEvent } = require("./merge");
const  User  = require("../../models/user");

module.exports = {
  events: async () => {
    // For this resolver we don't need authentication
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
  createEvent: async (args,req) => { // The second argument is the request argument which is received automatically.
    // For this we need authentication so we will add some logic in this
    if(!req.isAuth){
      throw new Error('Unauthenticated');
    }
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: req.userId,
      });
      let createdEvent;
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);
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
