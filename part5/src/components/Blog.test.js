import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    title: "a test blog",
    author: "Test Testov",
    url: "www.test.com",
    likes: 0,
    user: "test123",
  };

  const userWhoPostedBlog = {
    username: "test123",
  };

  let mockRemoveBlog = jest.fn();
  let mockLikeBlog = jest.fn();

  test("renders title and author", () => {
    const component = render(<Blog blog={blog} user={userWhoPostedBlog} />);

    expect(component.container).toHaveTextContent("a test blog | Test Testov");
  });

  test("clicking the view button displays url and number of likes", async () => {
    const component = render(
      <Blog
        blog={blog}
        user={userWhoPostedBlog}
        remove={mockRemoveBlog}
        like={mockLikeBlog}
      />
    );

    const user = userEvent.setup();
    const button = component.getByText("view");
    await user.click(button);

    expect(component.container).toHaveTextContent("www.test.com");

    expect(component.container).toHaveTextContent("0");
  });

  test("like button is clicked 2 times", async () => {
    const component = render(
      <Blog
        blog={blog}
        user={userWhoPostedBlog}
        remove={mockRemoveBlog}
        like={mockLikeBlog}
      />
    );

    const user = userEvent.setup();
    const button = component.getByText("view");
    await user.click(button);

    const likeButton = component.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockLikeBlog.mock.calls).toHaveLength(2);
  });
});
