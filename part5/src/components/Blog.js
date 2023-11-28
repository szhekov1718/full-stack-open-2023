import { useState } from "react";

const Blog = ({ blog, like, remove, user }) => {
  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const buttonLabel = visible ? "hide" : "view";

  return (
    <div className="blog">
      <div>
        <p>
          {blog.title} | {blog.author}{" "}
          <button id="view-hide-button" onClick={toggleVisibility}>
            {buttonLabel}
          </button>
        </p>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p id="like-count">
          likes {blog.likes}{" "}
          <button onClick={like} id="like-button">
            like
          </button>
        </p>
        <p>{blog.user.name}</p>
        {blog.user.username === user.username && (
          <button id="delete-button" onClick={remove}>
            remove
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
