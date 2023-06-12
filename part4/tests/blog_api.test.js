const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[2]);
  await blogObject.save();
});

describe("blogs GET tests", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("the first blog is by Michael Chan", async () => {
    const response = await api.get("/blogs");

    expect(response.body[0].author).toBe("Michael Chan");
  });

  test("a specific blog is withing the returned blogs", async () => {
    const response = await api.get("/blogs");

    const titles = response.body.map((blog) => blog.title);

    expect(titles).toContain("Canonical string reduction");
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

    test("blog without author is not added", async () => {
      const newBlog = {
        title: "no author test",
        url: "http://www.cs.utexas.eduranscriptions/EWD08xx/EWD808.html",
        likes: 12,
      };

      await api.post("/blogs").send(newBlog).expect(400);

      const response = await api.get("/blogs");

      expect(response.body).toHaveLength(helper.initialBlogs.length);
    });
  });

  describe("fetching blogs and deleting blogs", () => {
    test("view a specific blog", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(resultBlog.body).toEqual(blogToView);
    });

    test("a blog can be deleted", async () => {
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
});
