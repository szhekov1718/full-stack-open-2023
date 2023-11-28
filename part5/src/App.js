import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const defaultNotification = { message: "", positive: false };
  const [notification, setNotification] = useState(defaultNotification);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedBlogAppUserJSON =
      window.localStorage.getItem("loggedBlogAppUser");
    if (loggedBlogAppUserJSON) {
      const user = JSON.parse(loggedBlogAppUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject);

      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    } catch (exception) {
      const newNotification = {
        ...notification,
        message: `${exception.response.data.error}`,
        positive: false,
      };
      setNotification(newNotification);

      setTimeout(() => {
        setNotification({ ...defaultNotification });
      }, 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    blogService.setToken(null);
    setUser(null);
  };

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      blogFormRef.current.toggleVisibility();
      console.log(returnedBlog);
      setBlogs(blogs.concat(returnedBlog));

      const newNotification = {
        ...notification,
        message: `a new blog '${returnedBlog.title}' by ${returnedBlog.author} has been added`,
        positive: true,
      };
      setNotification(newNotification);

      setTimeout(() => {
        setNotification({ ...defaultNotification });
      }, 3000);
    } catch (exception) {
      const newNotification = {
        ...notification,
        message: `${exception.response.data.error}`,
        positive: false,
      };
      setNotification(newNotification);

      setTimeout(() => {
        setNotification({ ...defaultNotification });
      }, 3000);
    }
  };

  const likeBlog = async (id) => {
    const blogToUpdate = blogs.find((blog) => blog.id === id);

    if (!blogToUpdate) {
      setBlogs(blogs.filter((blog) => blog.id !== id));

      const newNotification = {
        ...notification,
        message: "Something went wrong",
        positive: false,
      };
      setNotification(newNotification);

      setTimeout(() => {
        setNotification({ ...defaultNotification });
      }, 3000);

      return;
    }

    const updatedBlog = {
      likes: blogToUpdate.likes + 1,
    };

    try {
      await blogService.update(id, updatedBlog);
      setBlogs(
        blogs.map((blog) =>
          blog.id !== blogToUpdate.id
            ? blog
            : { ...blogToUpdate, likes: updatedBlog.likes }
        )
      );
    } catch (exception) {
      const newNotification = {
        ...notification,
        message: `${exception.response.data.error}`,
        positive: false,
      };
      setNotification(newNotification);

      setTimeout(() => {
        setNotification({ ...defaultNotification });
      }, 3000);
    }
  };

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id);

    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author} ?`
      )
    ) {
      try {
        await blogService.remove(blogToDelete.id);
        setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
      } catch (exception) {
        const newNotification = {
          ...notification,
          message:
            exception.response.data.error !== undefined
              ? `${exception.response.data.error}`
              : `${exception.message}`,
          positive: false,
        };
        setNotification(newNotification);

        setTimeout(() => {
          setNotification({ ...defaultNotification });
        }, 3000);
      }
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={notification.message}
        positive={notification.positive}
      />

      {!user && <LoginForm handleLogin={handleLogin} />}

      {user && (
        <div>
          <p>
            {user.name} logged in{" "}
            <button id="logout-button" onClick={handleLogout}>
              logout
            </button>
          </p>

          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
              createBlog={createBlog}
              defaultNotification={defaultNotification}
              setNotification={setNotification}
            />
          </Togglable>

          {blogs
            .sort((b1, b2) => b2.likes - b1.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                like={() => likeBlog(blog.id)}
                remove={() => deleteBlog(blog.id)}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
