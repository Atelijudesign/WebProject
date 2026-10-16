import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import ScrollToTopOnNavigation from "../components/ScrollToTopOnNavigation";

function TestRoutes() {
  return (
    <>
      <ScrollToTopOnNavigation />
      <Routes>
        <Route path="/blog" element={<Link to="/blog/post">Abrir post</Link>} />
        <Route path="/blog/post" element={<h1>Post</h1>} />
      </Routes>
    </>
  );
}

describe("ScrollToTopOnNavigation", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it("scrolls to the beginning when navigating to a blog post", () => {
    render(
      <MemoryRouter initialEntries={["/blog"]}>
        <TestRoutes />
      </MemoryRouter>
    );

    window.scrollTo.mockClear();
    fireEvent.click(screen.getByRole("link", { name: "Abrir post" }));

    expect(screen.getByRole("heading", { name: "Post" })).toBeDefined();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  });
});
