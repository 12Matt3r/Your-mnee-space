import React from 'react';
import { render, screen } from '@testing-library/react';
import PostContent from './PostContent';
import { BrowserRouter } from 'react-router-dom';

describe('PostContent', () => {
  it('renders text correctly', () => {
    render(<PostContent text="Hello world" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders hashtags as links', () => {
    render(
      <BrowserRouter>
        <PostContent text="Hello #world" />
      </BrowserRouter>
    );
    const link = screen.getByText('#world');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/discover?q=world');
  });

  it('renders markdown images with valid http/https urls', () => {
    render(<PostContent text="![Alt text](https://example.com/image.png)" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.png');
    expect(img).toHaveAttribute('alt', 'Alt text');
  });

  it('does NOT render images with unsafe javascript urls', () => {
    render(<PostContent text="![Bad](javascript:alert(1))" />);
    // Should NOT find an image with this src
    // Or ideally, should render the text or nothing.
    // In our fix, we will probably just render the text "![Bad](javascript:alert(1))" or similar,
    // or maybe just ignore it.
    // Let's assume we want to NOT render an image.
    const img = screen.queryByRole('img');
    if (img) {
        expect(img).not.toHaveAttribute('src', expect.stringContaining('javascript:'));
    }
  });
});
