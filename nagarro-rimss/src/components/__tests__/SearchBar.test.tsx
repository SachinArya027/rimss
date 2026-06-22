import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { vi } from 'vitest';
import SearchBar from '../SearchBar';

const navigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  useLocation: () => ({ pathname: '/', search: '' }),
}));

function renderWithChakra(props = {}) {
  return render(
    <ChakraProvider>
      <SearchBar {...props} />
    </ChakraProvider>
  );
}

describe('SearchBar', () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it('shows the default placeholder', () => {
    renderWithChakra();
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('uses a custom placeholder when passed in', () => {
    renderWithChakra({ placeholder: 'Find items...' });
    expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
  });

  it('lets you type a search term', async () => {
    renderWithChakra();
    const input = screen.getByPlaceholderText('Search products...');

    await userEvent.type(input, 'shoes');
    expect(input).toHaveValue('shoes');
  });

  it('calls onSearch when you hit the search button', async () => {
    const onSearch = vi.fn();
    renderWithChakra({ onSearch });

    await userEvent.type(screen.getByPlaceholderText('Search products...'), 'jacket');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith('jacket');
  });

  it('calls onSearch on Enter', async () => {
    const onSearch = vi.fn();
    renderWithChakra({ onSearch });

    await userEvent.type(screen.getByPlaceholderText('Search products...'), 'watch{Enter}');
    expect(onSearch).toHaveBeenCalledWith('watch');
  });

  it('ignores blank searches', async () => {
    const onSearch = vi.fn();
    renderWithChakra({ onSearch });

    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    await userEvent.type(screen.getByPlaceholderText('Search products...'), '   ');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('navigates to /search when there is no onSearch handler', async () => {
    renderWithChakra();

    await userEvent.type(screen.getByPlaceholderText('Search products...'), 'laptop');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(navigate).toHaveBeenCalledWith('/search?q=laptop');
  });
});
