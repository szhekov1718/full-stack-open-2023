const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post("/", async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = request.user;

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
  const user = request.user;
  const blogToUpdate = await Blog.findById(request.params.id);

  if (body.comments !== undefined && Object.keys(body).length === 1) {
    blogToUpdate.comments = body.comments;
    let updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blogToUpdate,
      { new: true, runValidators: true, context: "query" }
    );
    return response.json(updatedBlog);
  }

  if (body.likes !== undefined && Object.keys(body).length === 1) {
    blogToUpdate.likes = body.likes;
    let updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blogToUpdate,
      { new: true, runValidators: true, context: "query" }
    );
    return response.json(updatedBlog);
  }

  if (!(blogToUpdate.user._id.toString() === user._id.toString())) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const user = request.user;
  const blogToDelete = await Blog.findById(request.params.id);

  if (!(blogToDelete.user._id.toString() === user._id.toString())) {
    return response.status(401).json({ error: "Unauthorized delete action" });
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
