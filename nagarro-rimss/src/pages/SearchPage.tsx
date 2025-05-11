import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Select,
  Button,
  useColorModeValue,
  Spinner,
  Center,
  Flex,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { searchProducts } from '../firebase/firestoreService';
import type { Product, ProductSearchFilters } from '../firebase/firestoreService';
import SearchResults from '../components/SearchResults';

// Available categories and colors for filtering
const categories = ['men', 'women', 'accessories', 'all'];
const colors = ['black', 'blue', 'brown', 'green', 'grey', 'red', 'white', 'all'];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  // Search filters state
  const [filters, setFilters] = useState<ProductSearchFilters>({
    searchTerm: initialQuery,
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
  
  // Price range state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  
  // Mobile drawer for filters
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const pageBgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  // Update filters when URL parameters change
  useEffect(() => {
    const queryParam = searchParams.get('q');
    const categoryParam = searchParams.get('category');
    const colorParam = searchParams.get('color');
    const discountedParam = searchParams.get('discounted');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    
    // Build new filters object based on URL parameters
    const newFilters: ProductSearchFilters = {
      searchTerm: queryParam || '',
      category: categoryParam || 'all',
      color: colorParam || 'all',
      discountedOnly: discountedParam === 'true',
      minPrice: minPriceParam ? parseInt(minPriceParam) : 0,
      maxPrice: maxPriceParam ? parseInt(maxPriceParam) : 500
    };
    
    // Update price range slider
    setPriceRange([newFilters.minPrice || 0, newFilters.maxPrice || 500]);
    
    // Update filters state
    setFilters(newFilters);
    
    // Perform search with the new filters
    if (Object.values(newFilters).some(value => value !== undefined && value !== '' && value !== 'all' && value !== false)) {
      performSearch(newFilters);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Perform search with current filters
  const performSearch = async (searchFilters?: ProductSearchFilters) => {
    setLoading(true);
    setSearched(true);
    
    try {
      // Use provided filters or current state
      const filtersToUse = searchFilters || filters;
      
      // Create a clean filter object without 'all' values and use current priceRange state
      const cleanFilters: ProductSearchFilters = {
        ...filtersToUse,
        category: filtersToUse.category === 'all' ? undefined : filtersToUse.category,
        color: filtersToUse.color === 'all' ? undefined : filtersToUse.color,
        // Use the current priceRange values if no searchFilters are provided
        minPrice: searchFilters ? filtersToUse.minPrice : priceRange[0],
        maxPrice: searchFilters ? filtersToUse.maxPrice : priceRange[1]
      };
      
      // Only update URL if filters were not provided (meaning this was triggered by a user action, not URL change)
      if (!searchFilters) {
        // Update URL search parameters
        const newSearchParams = new URLSearchParams();
        if (filtersToUse.searchTerm) newSearchParams.set('q', filtersToUse.searchTerm);
        if (filtersToUse.category && filtersToUse.category !== 'all') newSearchParams.set('category', filtersToUse.category);
        if (filtersToUse.color && filtersToUse.color !== 'all') newSearchParams.set('color', filtersToUse.color);
        if (filtersToUse.discountedOnly) newSearchParams.set('discounted', 'true');
        // Use priceRange state for the URL parameters
        if (priceRange[0] !== 0) newSearchParams.set('minPrice', priceRange[0].toString());
        if (priceRange[1] !== 500) newSearchParams.set('maxPrice', priceRange[1].toString());
        
        setSearchParams(newSearchParams);
      }
      
      const results = await searchProducts(cleanFilters);
      setProducts(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
      if (isMobile) onClose();
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      searchTerm: initialQuery,
      category: 'all',
      color: 'all',
      minPrice: 0,
      maxPrice: 500,
      discountedOnly: false
    });
    setPriceRange([0, 500]);
    
    // Only keep the search query in URL
    const newSearchParams = new URLSearchParams();
    if (initialQuery) newSearchParams.set('q', initialQuery);
    setSearchParams(newSearchParams);
  };

  // Render filters
  const FiltersContent = () => (
    <VStack align="stretch" spacing={6} width="100%">
      <Heading size="md">Filters</Heading>
      
      {/* Category Filter */}
      <Box>
        <Box mb={2} fontWeight="medium">
          Category
        </Box>
        <Select 
          value={filters.category || 'all'} 
          onChange={handleCategoryChange}
          bg={bgColor}
          size="sm"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </Select>
      </Box>
      
      {/* Color Filter */}
      <Box>
        <Box mb={2} fontWeight="medium">
          Color
        </Box>
        <Select 
          value={filters.color || 'all'} 
          onChange={handleColorChange}
          bg={bgColor}
          size="sm"
        >
          {colors.map(color => (
            <option key={color} value={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </option>
          ))}
        </Select>
      </Box>
      
      {/* Price Range Filter */}
      <Box>
        <Box mb={2} fontWeight="medium">
          Price Range
        </Box>
        <Text fontSize="sm" mb={2}>
          ${priceRange[0]} - ${priceRange[1]}
        </Text>
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
      </Box>
      
      <Box>
        <Checkbox 
          isChecked={filters.discountedOnly} 
          onChange={handleDiscountChange}
          colorScheme="blue"
        >
          Discounted items only
        </Checkbox>
      </Box>
      
      <Flex gap={4} mt={2}>
        <Button 
          colorScheme="blue" 
          size="sm" 
          width="full"
          onClick={() => performSearch()}
          isLoading={loading}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          width="full"
          onClick={handleClearFilters}
        >
          Clear
        </Button>
      </Flex>
    </VStack>
  );

  return (
    <Box pt="72px" pb={8} bg={pageBgColor} minH="calc(100vh - 64px)">
      <Container maxW="container.xl">
        <Box mb={6}>
          <Heading size="lg" color={headingColor}>
            {initialQuery ? `Search results for "${initialQuery}"` : 'All Products'}
          </Heading>
          {products.length > 0 && searched && (
            <Text color={textColor} mt={2}>
              Found {products.length} products
            </Text>
          )}
        </Box>
        
        {/* Mobile Filter Button */}
        {isMobile && (
          <Flex mb={4} justify="flex-end">
            <Button 
              leftIcon={<SearchIcon />} 
              onClick={onOpen} 
              size="sm"
              colorScheme="blue"
              variant="outline"
            >
              Filters
            </Button>
          </Flex>
        )}
        
        <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={8}>
          {/* Filters - Desktop */}
          {!isMobile && (
            <GridItem>
              <Box 
                p={6} 
                bg={bgColor} 
                borderRadius="lg" 
                borderWidth="1px" 
                borderColor={borderColor}
                position="sticky"
                top="80px"
              >
                <FiltersContent />
              </Box>
            </GridItem>
          )}
          
          {/* Search Results */}
          <GridItem>
            {loading ? (
              <Center py={10}>
                <VStack spacing={4}>
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                  <Text color={textColor}>Searching products...</Text>
                </VStack>
              </Center>
            ) : (
              <>
                {!searched ? (
                  <Center py={10}>
                    <VStack spacing={4}>
                      <Text color={textColor}>
                        Use the filters to find products
                      </Text>
                      <Button 
                        colorScheme="blue" 
                        onClick={() => performSearch()}
                      >
                        Show All Products
                      </Button>
                    </VStack>
                  </Center>
                ) : products.length === 0 ? (
                  <Center py={10}>
                    <VStack spacing={4}>
                      <Heading size="md" color={headingColor}>No products found</Heading>
                      <Text color={textColor}>
                        {initialQuery 
                          ? `No products match "${initialQuery}". Try different search terms or filters.` 
                          : 'No products match your filters. Try adjusting your search criteria.'}
                      </Text>
                    </VStack>
                  </Center>
                ) : (
                  <SearchResults 
                    products={products} 
                    loading={false} 
                    searchTerm={filters.searchTerm || ''} 
                  />
                )}
              </>
            )}
          </GridItem>
        </Grid>
      </Container>
      
      {/* Mobile Filters Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filters</DrawerHeader>
          <DrawerBody py={4}>
            <FiltersContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default SearchPage;
