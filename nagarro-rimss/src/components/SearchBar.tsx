import { useState, useRef, useEffect } from 'react';
import { 
  InputGroup, 
  InputLeftElement, 
  Input, 
  IconButton, 
  useDisclosure,
  useColorModeValue
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search products...", 
  size = "md",
  variant = "filled"
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { onClose } = useDisclosure();
  
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');

  // Check if we're already on the search page
  const isSearchPage = location.pathname === '/search';
  
  // Extract current search params to preserve other filters when searching from search page
  const getSearchParams = () => {
    const currentParams = new URLSearchParams(location.search);
    // Replace the query parameter
    currentParams.set('q', searchTerm);
    return currentParams.toString();
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm);
      } else if (isSearchPage) {
        // If already on search page, update the URL with new search term
        // while preserving other filters
        navigate(`/search?${getSearchParams()}`);
        // Force a page refresh if needed
        window.location.href = `/search?${getSearchParams()}`;
      } else {
        // Navigate to search page with query parameter
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      }
      onClose();
    }
  };
  
  // Extract search term from URL when on search page
  useEffect(() => {
    if (isSearchPage) {
      const params = new URLSearchParams(location.search);
      const queryParam = params.get('q');
      if (queryParam) {
        setSearchTerm(queryParam);
      }
    }
  }, [isSearchPage, location.search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <InputGroup size={size} width="100%">
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.500" />
      </InputLeftElement>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        variant={variant}
        bg={bgColor}
        _hover={{ bg: hoverBgColor }}
        borderRadius="full"
        pr="2.5rem" // Make room for the search button
        fontSize={{ base: "sm", md: "md" }}
      />
      <IconButton
        aria-label="Search"
        icon={<SearchIcon />}
        onClick={handleSearch}
        size={size}
        variant="ghost"
        position="absolute"
        right={0}
        zIndex={2}
      />
    </InputGroup>
  );
};

export default SearchBar;
