import React from "react";
import "whatwg-fetch";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";
import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  // Click the "View Questions" button
  fireEvent.click(screen.getByText(/View Questions/));

  // Wait for the questions to be displayed
  expect(await screen.findByText(/lorem testum 1/)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // Wait for initial render
  await screen.findByText(/lorem testum 1/);

  // Click the "New Question" button
  fireEvent.click(screen.getByText("New Question"));

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/Prompt/), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/), {
    target: { value: "1" },
  });

  // Submit the form
  fireEvent.click(screen.getByText(/Add Question/));

  // Click the "View Questions" button
  fireEvent.click(screen.getByText(/View Questions/));

  // Check if the new question is displayed
  expect(await screen.findByText(/Test Prompt/)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 1/)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);

  // Click the "View Questions" button
  fireEvent.click(screen.getByText(/View Questions/));

  // Wait for the questions to be displayed
  await screen.findByText(/lorem testum 1/);

  // Click the delete button for the first question
  fireEvent.click(screen.getAllByText("Delete Question")[0]);

  // Wait for the question to be removed
  await waitFor(() => expect(screen.queryByText(/lorem testum 1/)).not.toBeInTheDocument());

  // Check that the remaining question is still displayed
  expect(await screen.findByText(/lorem testum 2/)).toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);

  // Click the "View Questions" button
  fireEvent.click(screen.getByText(/View Questions/));

  // Wait for the questions to be displayed
  await screen.findByText(/lorem testum 2/);

  // Change the correct answer
  fireEvent.change(screen.getAllByLabelText(/Correct Answer/)[0], {
    target: { value: "3" },
  });

  // Verify that the dropdown value has changed
  expect(screen.getAllByLabelText(/Correct Answer/)[0].value).toBe("3");

  // Rerender the component to check persistence
  render(<App />);

  // Verify that the dropdown value is still correct
  expect(screen.getAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});
