import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

describe("<BlogForm />", () => {
  test("updates parent state and calls onSubmit", async () => {
    const createBlog = jest.fn();
    const defaultNotification = {};
    const setNotification = jest.fn();
    const user = userEvent.setup();

    const component = render(
      <BlogForm
        createBlog={createBlog}
        defaultNotification={defaultNotification}
        setNotification={setNotification}
      />
    );

    const titleInput = component.getByPlaceholderText("write title here");
    const authorInput = component.getByPlaceholderText("write author here");
    const urlInput = component.getByPlaceholderText("write url here");
    const sendButton = component.getByText("create");

    await user.type(titleInput, "test blog title");
    await user.type(authorInput, "test blog author");
    await user.type(urlInput, "test blog url");
    await user.click(sendButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("test blog title");
  });
});
