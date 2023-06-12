require("dotenv").config();
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

const jwt = require("jsonwebtoken");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  // User payload to be included in the JWT
  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  // Sign the JWT
  const token = jwt.sign(userForToken, process.env.SECRET);

  // Include the token in the response
  response.status(201).json({ ...savedUser._doc, token });
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });

  response.json(users);
});

module.exports = usersRouter;
