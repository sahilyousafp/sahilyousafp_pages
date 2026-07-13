import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CodeMode from "./CodeMode";

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

vi.mock("./CodeGraph", () => ({
  default: () => <div data-testid="code-graph" />,
}));

vi.mock("../../data", () => ({
  codeProjects: [
    {
      title: "Project A",
      link: "https://example.com/a",
      img: "",
      tags: "",
      desc: "",
    },
    {
      title: "Project B",
      link: "https://example.com/b",
      img: "",
      tags: "",
      desc: "",
    },
  ],
  publications: [
    {
      t: "Pub One",
      conf: "Conf",
      d: "2024",
      c: "sub",
      desc: "",
      u: "https://example.com/pub",
    },
  ],
  blogs: [
    {
      t: "Blog One",
      c: "cat",
      d: "2024",
      img: "",
      u: "https://example.com/blog",
    },
  ],
  codeExp: [
    {
      type: "Work",
      date: "2024",
      role: "Engineer",
      desc: "",
      link: "https://example.com/exp",
    },
    { type: "Edu", date: "2023", role: "Student", desc: "", link: "" },
  ],
}));

import { track } from "@vercel/analytics";

describe("CodeMode analytics tracking", () => {
  beforeEach(() => {
    track.mockClear();
  });

  it("tracks header GitHub link click", () => {
    render(<CodeMode onBack={() => {}} />);
    const gh = document.querySelector(".code-nav-github");
    fireEvent.click(gh);
    expect(track).toHaveBeenCalledWith("GitHub Click", { location: "header" });
  });

  it("tracks project card clicks", () => {
    render(<CodeMode onBack={() => {}} />);
    const cards = screen.getAllByRole("link", { name: /Project A|Project B/ });
    fireEvent.click(cards[0]);
    expect(track).toHaveBeenCalledWith("Project Click", {
      project: "Project A",
    });
  });

  it("tracks publication card click", () => {
    render(<CodeMode onBack={() => {}} />);
    const pub = screen.getByRole("link", { name: /Pub One/ });
    fireEvent.click(pub);
    expect(track).toHaveBeenCalledWith("Publication Click", {
      title: "Pub One",
    });
  });

  it("tracks blog card click", () => {
    render(<CodeMode onBack={() => {}} />);
    const blog = screen.getByRole("link", { name: /Blog One/ });
    fireEvent.click(blog);
    expect(track).toHaveBeenCalledWith("Blog Click", { title: "Blog One" });
  });

  it("tracks experience row click only when link present", () => {
    render(<CodeMode onBack={() => {}} />);
    const exp = screen.getByRole("link", { name: /Engineer/ });
    fireEvent.click(exp);
    expect(track).toHaveBeenCalledWith("Experience Click", {
      role: "Engineer",
    });
  });

  it("does not track experience row without link", () => {
    render(<CodeMode onBack={() => {}} />);
    const student = screen.getByText("Student").closest("div");
    fireEvent.click(student);
    expect(track).not.toHaveBeenCalled();
  });

  it("tracks contact email click", () => {
    render(<CodeMode onBack={() => {}} />);
    const email = screen.getByRole("link", {
      name: /sahil.yousaf@students.iaac.net/,
    });
    fireEvent.click(email);
    expect(track).toHaveBeenCalledWith("Contact Click", { type: "email" });
  });

  it("tracks contact linkedin click", () => {
    render(<CodeMode onBack={() => {}} />);
    const li = screen.getByRole("link", { name: /City Layers/ });
    fireEvent.click(li);
    expect(track).toHaveBeenCalledWith("Contact Click", { type: "linkedin" });
  });

  it("tracks contact github click", () => {
    render(<CodeMode onBack={() => {}} />);
    const gh = screen.getByRole("link", { name: /@sahilyousafp/ });
    fireEvent.click(gh);
    expect(track).toHaveBeenCalledWith("Contact Click", { type: "github" });
  });
});
