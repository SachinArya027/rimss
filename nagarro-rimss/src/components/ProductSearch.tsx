import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  Flex,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,

  Checkbox,
  InputGroup,
  InputLeftElement,
  Collapse,
  useDisclosure,
  IconButton,
  Divider,
  useColorModeValue,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { searchProducts } from '../firebase/firestoreService';
import type { ProductSearchFilters } from '../firebase/firestoreService';
import type { Product } from '../firebase/firestoreService';
import SearchResults from './SearchResults';

// Available categories and colors for filtering
const categories = ['men', 'women', 'accessories', 'all'];
const colors = ['black', 'blue', 'brown', 'green', 'grey', 'red', 'white', 'all'];

const ProductSearch = () => {
  // Search filters state
  const [filters, setFilters] = useState<ProductSearchFilters>({
    searchTerm: '',
    category: 'all',
    color: 'all',
    minPrice: 0,
    maxPrice: 500,
    discountedOnly: false
  });

  // Results state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  // Filter panel state
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  
  // Price range state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  
  // Background colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Handle search term change
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value === 'all' ? undefined : e.target.value;
    setFilters(prev => ({ ...prev, category }));
  };

  // Handle color change
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const color = e.target.value === 'all' ? undefined : e.target.value;
    setFilters(prev => ({ ...prev, color }));
  };

  // Handle price range change
  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange([newRange[0], newRange[1]]);
  };

  // Handle price range change end
  const handlePriceRangeChangeEnd = (newRange: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: newRange[0],
      maxPrice: newRange[1]
    }));
  };

  // Handle discount filter change
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, discountedOnly: e.target.checked }));
  };

  // Handle search button click
  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    
    try {
      // Create a clean filter object without 'all' values
      const searchFilters: ProductSearchFilters = {
        ...filters,
        category: filters.category === 'all' ? undefined : filters.category,
        color: filters.color === 'all' ? undefined : filters.color
      };
      
      const results = await searchProducts(searchFilters);
      setProducts(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      color: 'all',
      minPrice: 0,
      maxPrice: 500,
      discountedOnly: false
    });
    setPriceRange([0, 500]);
    setSearched(false);
    setProducts([]);
  };

  return (
    <Box py={8} bg="gray.50">
      <Container maxW="container.xl">
        <Heading mb={6} fontSize="2xl">Product Search</Heading>
        
        <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor={borderColor} mb={6}>
          {/* Search Bar */}
          <Flex direction={{ base: 'column', md: 'row' }} mb={4} gap={4}>
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search products..."
                value={filters.searchTerm}
                onChange={handleSearchTermChange}
                bg="white"
                borderRadius="md"
              />
            </InputGroup>
            
            <Button 
              colorScheme="blue" 
              leftIcon={<SearchIcon />} 
              onClick={handleSearch}
              isLoading={loading}
              loadingText="Searching..."
              minW={{ base: 'full', md: '150px' }}
            >
              Search
            </Button>
          </Flex>
          
          {/* Filter Toggle */}
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="medium">Filters</Text>
            <IconButton
              icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              variant="ghost"
              aria-label={isOpen ? "Collapse filters" : "Expand filters"}
              onClick={onToggle}
              size="sm"
            />
          </Flex>
          
          <Divider mb={4} />
          
          {/* Filters */}
          <Collapse in={isOpen} animateOpacity>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
              {/* Category Filter */}
              <GridItem>
                <Text fontSize="sm" mb={2}>Category</Text>
                <Select 
                  value={filters.category || 'all'} 
                  onChange={handleCategoryChange}
                  bg="white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </Select>
              </GridItem>
              
              {/* Color Filter */}
              <GridItem>
                <Text fontSize="sm" mb={2}>Color</Text>
                <Select 
                  value={filters.color || 'all'} 
                  onChange={handleColorChange}
                  bg="white"
                >
                  {colors.map(color => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </Select>
              </GridItem>
              
              {/* Price Range Filter */}
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Text fontSize="sm" mb={2}>Price Range: ${priceRange[0]} - ${priceRange[1]}</Text>
                <RangeSlider
                  aria-label={['min', 'max']}
                  defaultValue={[0, 500]}
                  min={0}
                  max={500}
                  step={10}
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  onChangeEnd={handlePriceRangeChangeEnd}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
              </GridItem>
            </Grid>
            
            <Flex mt={6} justify="space-between" align="center">
              <Checkbox 
                isChecked={filters.discountedOnly} 
                onChange={handleDiscountChange}
                colorScheme="blue"
              >
                Show discounted products only
              </Checkbox>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Flex>
          </Collapse>
        </Box>
        
        {/* Search Results */}
        {searched && (
          <SearchResults 
            products={products} 
            loading={loading} 
            searchTerm={filters.searchTerm || ''} 
          />
        )}
      </Container>
    </Box>
  );
};

export default ProductSearch;
