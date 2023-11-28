import React, { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog, defaultNotification, setNotification }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();

    if (title === "" || author === "" || url === "") {
      const newNotification = {
        message: "Blog fields shouldn't be null",
        positive: false,
      };
      setNotification(newNotification);

      setTimeout(() => {
        setNotification({ ...defaultNotification });
      }, 3000);

      return;
    }

    createBlog({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };
  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          Title
          <input
            type="text"
            value={title}
            name="Title"
            placeholder="write title here"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          Author
          <input
            type="text"
            value={author}
            name="Author"
            placeholder="write author here"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
          Url
          <input
            type="text"
            value={url}
            name="Url"
            placeholder="write url here"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  defaultNotification: PropTypes.object.isRequired,
  setNotification: PropTypes.func.isRequired,
};

export default BlogForm;
