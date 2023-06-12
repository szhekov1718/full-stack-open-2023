const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogs = helper.initialBlogs.map((blog) => new Blog(blog)); // create blogs objects
  const promiseArray = blogs.map((blog) => blog.save()); // create array of promises - each promise is for blog.save
  await Promise.all(promiseArray); // transform to single Promise object and wait for it to complete
});

describe("blogs GET tests", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific blog is withing the returned blogs", async () => {
    const response = await api.get("/blogs");
    const titles = response.body.map((blog) => blog.title);

    expect(titles).toContain("Canonical string reduction");
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("blogs POST tests", () => {
  test("a new valid blog is added", async () => {
    const newBlog = {
      title: "TESTING",
      author: "Spas Kanov",
      url: "http://www.cs.utexas.eduranscriptions/EWD08xx/EWD808.html",
      likes: 18,
    };

    await api
      .post("/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsInDb = await helper.blogsInDb();
    expect(blogsInDb).toHaveLength(helper.initialBlogs.length + 1);

    const authors = blogsInDb.map((blog) => blog.author);
    expect(authors).toContain("Spas Kanov");
  });

  test("fails POST request with status code 400 if data invalid", async () => {
    const newBlog = {
      url: "http://www.cs.utexas.eduranscriptions/EWD08xx/EWD808.html",
      likes: 12,
    };

    await api.post("/blogs").send(newBlog).expect(400);

    const response = await api.get("/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe("finding a specific blog", () => {
  test("view a specific blog", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.get(`/blogs/${validNonexistingId}`).expect(404);
  });

  test("fails with statuscode 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/blogs/${invalidId}`).expect(400);
  });
});

describe("deleting a blog", () => {
  test("a blog can be deleted with success status code 204", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const authors = blogsAtEnd.map((blog) => blog.author);

    expect(authors).not.toContain(blogToDelete.content);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});