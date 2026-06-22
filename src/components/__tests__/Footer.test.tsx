import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../Footer';

describe('Footer', () => {
  beforeEach(() => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </ChakraProvider>
    );
  });

  it('shows company info and main sections', () => {
    expect(screen.getByText('YCompany - RIMSS')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Stay Connected')).toBeInTheDocument();
  });

  it('has the expected footer links', () => {
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Careers' })).toHaveAttribute('href', '/careers');
    expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: 'Help Center' })).toHaveAttribute('href', '/help');
    expect(screen.getByRole('link', { name: "Men's Collection" })).toHaveAttribute(
      'href',
      '/search?category=men'
    );
    expect(screen.getByRole('link', { name: 'Sale Items' })).toHaveAttribute(
      'href',
      '/search?discounted=true'
    );
  });

  it('shows copyright with current year', () => {
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}.*YCompany - RIMSS`))).toBeInTheDocument();
  });

  it('links to social profiles', () => {
    const socialHrefs = screen
      .getAllByRole('link')
      .map((el) => el.getAttribute('href'))
      .filter((href) => href?.startsWith('https://'));

    expect(socialHrefs).toEqual([
      'https://twitter.com',
      'https://facebook.com',
      'https://instagram.com',
      'https://linkedin.com',
    ]);
  });
});
