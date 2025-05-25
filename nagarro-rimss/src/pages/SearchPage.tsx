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
import SEO from '../components/SEO';

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

  // Generate SEO title and description based on search parameters
  const generateSEOTitle = () => {
    let title = 'Shop Products';
    
    if (filters.searchTerm) {
      title = `${filters.searchTerm} - Search Results`;
    } else if (filters.category && filters.category !== 'all') {
      title = `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Products`;
      
      if (filters.color && filters.color !== 'all') {
        title = `${filters.color.charAt(0).toUpperCase() + filters.color.slice(1)} ${title}`;
      }
    } else if (filters.color && filters.color !== 'all') {
      title = `${filters.color.charAt(0).toUpperCase() + filters.color.slice(1)} Products`;
    }
    
    if (filters.discountedOnly) {
      title = `Discounted ${title}`;
    }
    
    return title;
  };
  
  const generateSEODescription = () => {
    let description = 'Browse our collection of high-quality products at RIMSS.';
    
    if (filters.searchTerm) {
      description = `Browse results for "${filters.searchTerm}" at RIMSS. Find the best products matching your search.`;
    } else {
      const parts = [];
      
      if (filters.category && filters.category !== 'all') {
        parts.push(`${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}`);
      }
      
      if (filters.color && filters.color !== 'all') {
        parts.push(`${filters.color.charAt(0).toUpperCase() + filters.color.slice(1)}`);
      }
      
      if (filters.discountedOnly) {
        parts.push('Discounted');
      }
      
      if (parts.length > 0) {
        description = `Shop ${parts.join(' ')} products at RIMSS. Find the perfect items that match your style and budget.`;
      }
    }
    
    return description;
  };

  // Generate canonical URL based on filters
  const generateCanonicalUrl = () => {
    let url = '/search';
    const params = new URLSearchParams();
    
    if (filters.searchTerm) {
      params.append('q', filters.searchTerm);
    }
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    
    if (filters.color && filters.color !== 'all') {
      params.append('color', filters.color);
    }
    
    if (filters.discountedOnly) {
      params.append('discounted', 'true');
    }
    
    const paramString = params.toString();
    if (paramString) {
      url += `?${paramString}`;
    }
    
    return url;
  };

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
    
    try {
      // Use provided filters or current state
      const filtersToUse = searchFilters || filters;
      
      // Update URL parameters
      const params = new URLSearchParams();
      
      if (filtersToUse.searchTerm) {
        params.append('q', filtersToUse.searchTerm);
      }
      
      if (filtersToUse.category && filtersToUse.category !== 'all') {
        params.append('category', filtersToUse.category);
      }
      
      if (filtersToUse.color && filtersToUse.color !== 'all') {
        params.append('color', filtersToUse.color);
      }
      
      if (filtersToUse.discountedOnly) {
        params.append('discounted', 'true');
      }
      
      if (filtersToUse.minPrice !== undefined && filtersToUse.minPrice !== 0) {
        params.append('minPrice', filtersToUse.minPrice.toString());
      }
      
      if (filtersToUse.maxPrice !== undefined && filtersToUse.maxPrice !== 500) {
        params.append('maxPrice', filtersToUse.maxPrice.toString());
      }
      
      setSearchParams(params);
      
      // Perform the search
      const results = await searchProducts(filtersToUse);
      setProducts(results);
      setSearched(true);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
      if (isOpen) onClose(); // Close filter drawer on mobile after search
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    // Reset filters to default
    const defaultFilters: ProductSearchFilters = {
      searchTerm: '',
      category: 'all',
      color: 'all',
      minPrice: 0,
      maxPrice: 500,
      discountedOnly: false
    };
    
    // Reset price range
    setPriceRange([0, 500]);
    
    // Update filters state
    setFilters(defaultFilters);
    
    // Clear URL parameters
    setSearchParams({});
    
    // Reset search
    setSearched(false);
    setProducts([]);
  };

  // Render filters
  const FiltersContent = () => (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md">Filters</Heading>
      </Box>
      
      {/* Category Filter */}
      <Box>
        <Text mb={2} fontWeight="medium">Category</Text>
        <Select 
          value={filters.category || 'all'} 
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          {categories.filter(c => c !== 'all').map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </Select>
      </Box>
      
      {/* Color Filter */}
      <Box>
        <Text mb={2} fontWeight="medium">Color</Text>
        <Select 
          value={filters.color || 'all'} 
          onChange={handleColorChange}
        >
          <option value="all">All Colors</option>
          {colors.filter(c => c !== 'all').map(color => (
            <option key={color} value={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </option>
          ))}
        </Select>
      </Box>
      
      {/* Price Range Filter */}
      <Box>
        <Text mb={2} fontWeight="medium">Price Range</Text>
        <Flex justify="space-between" mb={2}>
          <Text fontSize="sm">${priceRange[0]}</Text>
          <Text fontSize="sm">${priceRange[1]}</Text>
        </Flex>
        <RangeSlider
          aria-label={['min price', 'max price']}
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
      
      {/* Discount Filter */}
      <Box>
        <Checkbox 
          isChecked={filters.discountedOnly} 
          onChange={handleDiscountChange}
        >
          Discounted Items Only
        </Checkbox>
      </Box>
      
      {/* Action Buttons */}
      <Flex gap={2} mt={2}>
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
      <SEO 
        title={generateSEOTitle()}
        description={generateSEODescription()}
        canonical={generateCanonicalUrl()}
        keywords={`${filters.searchTerm || ''}, ${filters.category || ''}, ${filters.color || ''}, online shopping, products, RIMSS`}
      />
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
