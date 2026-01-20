import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ComposerBox from "./ComposerBox";
import { MemoryRouter } from "react-router-dom";

// Mock dependencies
const mockCreatePost = vi.fn();

vi.mock("../../lib/api", () => ({
  socialApi: {
    createPost: (...args: any[]) => mockCreatePost(...args),
  },
}));

const mockUser = {
  id: "user-123",
  email: "test@example.com",
};

const mockProfile = {
  full_name: "Test User",
  avatar_url: "https://example.com/avatar.jpg",
};

const mockUseAuth = vi.fn();
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("ComposerBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default logged in state
    mockUseAuth.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
    });
  });

  it("renders the composer input when logged in", () => {
    render(
      <MemoryRouter>
        <ComposerBox />
      </MemoryRouter>,
    );
    expect(
      screen.getByPlaceholderText("What's happening in your creative world?"),
    ).toBeInTheDocument();
  });

  it("renders sign in prompt when logged out", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
    });

    render(
      <MemoryRouter>
        <ComposerBox />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("Sign in to share your creative thoughts"),
    ).toBeInTheDocument();
  });

  it("updates input value when typing", () => {
    render(
      <MemoryRouter>
        <ComposerBox />
      </MemoryRouter>,
    );
    const textarea = screen.getByPlaceholderText(
      "What's happening in your creative world?",
    );
    fireEvent.change(textarea, { target: { value: "Hello world" } });
    expect(textarea).toHaveValue("Hello world");
  });

  it("calls createPost when submitting valid post", async () => {
    mockCreatePost.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <ComposerBox />
      </MemoryRouter>,
    );

    const textarea = screen.getByPlaceholderText(
      "What's happening in your creative world?",
    );
    fireEvent.change(textarea, { target: { value: "New post content" } });

    const submitButton = screen.getByText("Post");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith("New post content");
    });
  });
});
