import { render, screen } from '@testing-library/react';
import PostContent from './PostContent';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('PostContent Security', () => {
  it('should not render images with javascript: protocol', () => {
    const maliciousText = '![pwned](javascript:alert("xss"))';
    render(
      <BrowserRouter>
        <PostContent text={maliciousText} />
      </BrowserRouter>
    );

    const img = screen.queryByRole('img');

    // With the fix, the image should NOT be rendered (so img is null)
    // Or if it is rendered, it shouldn't have javascript: src.
    if (img) {
       expect(img).not.toHaveAttribute('src', expect.stringContaining('javascript:'));
    } else {
       expect(true).toBe(true);
    }
  });

  it('should render valid http images', () => {
    const validText = '![valid](https://example.com/image.jpg)';
    render(
      <BrowserRouter>
        <PostContent text={validText} />
      </BrowserRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'valid');
  });
});
