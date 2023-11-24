require("dotenv").config();
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

const jwt = require("jsonwebtoken");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 2) {
    return response
      .status(400)
      .json({ error: "Password must be at least 3 characters long" });
  }

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

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

module.exports = usersRouter;
