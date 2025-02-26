const bcrypt = require("bcryptjs");

const User = require("../../models/user");

module.exports = {

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
};
