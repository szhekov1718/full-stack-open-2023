const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[2]);
  await blogObject.save();
});

describe("blogs GET tests", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/blogs");

    expect(response.body).toHaveLength(initialBlogs.length);
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

      const response = await api.get("/blogs");
      const authors = response.body.map((blog) => blog.author);

      expect(response.body).toHaveLength(initialBlogs.length + 1);
      expect(authors).toContain("Spas Kanov");
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
