const Booking = require("../../models/booking");

const Event = require("../../models/event"); 
const { transformEvent, transformBooking } = require("./merge");

module.exports = {
  bookings: async (args) => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: "67beb3a80c0cd674ce29a46c",
        event: fetchedEvent,
      });

      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.findByIdAndDelete(args.bookingId);
      return event;
    } catch (err) {
      throw err;
    }
  },
};
