const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes(listHelper.empty_blog);
    expect(result).toBe(0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(listHelper.blogs);
    expect(result).toBe(36);
  });
});

describe("favorite blog", () => {
  test("of empty list is empty", () => {
    const result = listHelper.favoriteBlog(listHelper.empty_blog);
    expect(result).toEqual([]);
  });

  test("when list has only one blog, return that blog", () => {
    const result = listHelper.favoriteBlog(listHelper.listWithOneBlog);
    expect(result).toEqual(listHelper.listWithOneBlog[0]);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.favoriteBlog(listHelper.blogs);
    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    });
  });
});

describe("most blogs", () => {
  test("of empty list is empty", () => {
    const result = listHelper.mostBlogs(listHelper.empty_blog);
    expect(result).toEqual([]);
  });

  test("when list has only one blog, return the author and 1", () => {
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", blogs: 1 });
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.mostBlogs(listHelper.blogs);
    expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 });
  });
});

describe("most likes", () => {
  test("of empty list is empty", () => {
    const result = listHelper.mostLikes(listHelper.empty_blog);
    expect(result).toEqual([]);
  });

  test("when list has only one blog, return the author and likes", () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 5 });
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.mostLikes(listHelper.blogs);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 17 });
  });
});
