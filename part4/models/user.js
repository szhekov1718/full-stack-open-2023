const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
    minLength: 5,
  },
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // the password hash should be hidden by default
  },
});

module.exports = mongoose.model("User", userSchema);
