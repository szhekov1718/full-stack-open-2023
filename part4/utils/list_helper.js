const dummy = (blogs) => {
  blogs = null;
  return blogs === null ? 1 : 0;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce(
        (mostLikedBlog, blog) =>
          blog.likes > mostLikedBlog.likes ? blog : mostLikedBlog,
        blogs[0]
      );
};

const authorWithMostBlogs = (blogs) => {
  if (blogs.length === 0) return {};

  let authorsAndBlogCount = blogs.reduce((authorAndBlogCount, blog) => {
    authorAndBlogCount[blog.author] =
      (authorAndBlogCount[blog.author] || 0) + 1;

    return authorAndBlogCount;
  }, {});

  let mostBlogs = Math.max(...Object.values(authorsAndBlogCount));
  let authorWithMostBlogs = Object.keys(authorsAndBlogCount).find(
    (author) => authorsAndBlogCount[author] === mostBlogs
  );

  return {
    author: authorWithMostBlogs,
    blogs: mostBlogs,
  };
};

const authorWithMostLikes = (blogs) => {
  if (blogs.length === 0) return {};

  let authorsAndLikeCount = blogs.reduce((authorAndLikeCount, blog) => {
    authorAndLikeCount[blog.author] =
      (authorAndLikeCount[blog.author] || 0) + blog.likes;

    return authorAndLikeCount;
  }, {});

  let mostLikes = Math.max(...Object.values(authorsAndLikeCount));
  let authorWithMostLikes = Object.keys(authorsAndLikeCount).find(
    (author) => authorsAndLikeCount[author] === mostLikes
  );

  return {
    author: authorWithMostLikes,
    likes: mostLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  authorWithMostBlogs,
  authorWithMostLikes,
};
