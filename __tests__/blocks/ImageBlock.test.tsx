import { render, screen } from '@testing-library/react';
import { ImageBlock } from '@/components/blocks/ImageBlock';

describe('ImageBlock', () => {
  it('renders an image with src and alt', () => {
    render(
      <ImageBlock block={{ id: 'img1', type: 'image', src: '/images/test.jpg', alt: 'Test image' }} />
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/images/test.jpg');
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('wraps image in a card', () => {
    const { container } = render(
      <ImageBlock block={{ id: 'img2', type: 'image', src: '/photo.png', alt: 'Photo' }} />
    );
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
  });
});
