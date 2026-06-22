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

const categories = ['men', 'women', 'accessories', 'all'];
const colors = ['black', 'blue', 'brown', 'green', 'grey', 'red', 'white', 'all'];

const capitalize = (value?: string) =>
  value && value !== 'all' ? value.charAt(0).toUpperCase() + value.slice(1) : '';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState<ProductSearchFilters>({
    searchTerm: initialQuery,
    category: 'all',
    color: 'all',
    minPrice: 0,
    maxPrice: 500,
    discountedOnly: false
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const pageBgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  const seoTitle = (() => {
    let title = 'Shop Products';
    if (filters.searchTerm) {
      title = `${filters.searchTerm} - Search Results`;
    } else if (filters.category && filters.category !== 'all') {
      title = `${capitalize(filters.category)} Products`;
      if (filters.color && filters.color !== 'all') {
        title = `${capitalize(filters.color)} ${title}`;
      }
    } else if (filters.color && filters.color !== 'all') {
      title = `${capitalize(filters.color)} Products`;
    }
    return filters.discountedOnly ? `Discounted ${title}` : title;
  })();

  const seoDescription = (() => {
    if (filters.searchTerm) {
      return `Browse results for "${filters.searchTerm}" at RIMSS. Find the best products matching your search.`;
    }
    const parts = [
      capitalize(filters.category),
      capitalize(filters.color),
      filters.discountedOnly ? 'Discounted' : '',
    ].filter(Boolean);
    return parts.length > 0
      ? `Shop ${parts.join(' ')} products at RIMSS. Find the perfect items that match your style and budget.`
      : 'Browse our collection of high-quality products at RIMSS.';
  })();

  const canonicalUrl = (() => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.append('q', filters.searchTerm);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.color && filters.color !== 'all') params.append('color', filters.color);
    if (filters.discountedOnly) params.append('discounted', 'true');
    const paramString = params.toString();
    return paramString ? `/search?${paramString}` : '/search';
  })();

  useEffect(() => {
    const queryParam = searchParams.get('q');
    const categoryParam = searchParams.get('category');
    const colorParam = searchParams.get('color');
    const discountedParam = searchParams.get('discounted');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    
    const newFilters: ProductSearchFilters = {
      searchTerm: queryParam || '',
      category: categoryParam || 'all',
      color: colorParam || 'all',
      discountedOnly: discountedParam === 'true',
      minPrice: minPriceParam ? parseInt(minPriceParam) : 0,
      maxPrice: maxPriceParam ? parseInt(maxPriceParam) : 500
    };
    
    setPriceRange([newFilters.minPrice || 0, newFilters.maxPrice || 500]);
    setFilters(newFilters);
    
    if (Object.values(newFilters).some(value => value !== undefined && value !== '' && value !== 'all' && value !== false)) {
      const runSearch = async () => {
        setLoading(true);
        try {
          const results = await searchProducts(newFilters);
          setProducts(results);
          setSearched(true);
        } catch (error) {
          console.error('Error searching products:', error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

      runSearch();
    }
  }, [searchParams]);

  const performSearch = async (searchFilters?: ProductSearchFilters) => {
    setLoading(true);
    
    try {
      const filtersToUse = searchFilters || filters;
      const params = new URLSearchParams();
      
      if (filtersToUse.searchTerm) params.append('q', filtersToUse.searchTerm);
      if (filtersToUse.category && filtersToUse.category !== 'all') params.append('category', filtersToUse.category);
      if (filtersToUse.color && filtersToUse.color !== 'all') params.append('color', filtersToUse.color);
      if (filtersToUse.discountedOnly) params.append('discounted', 'true');
      if (filtersToUse.minPrice !== undefined && filtersToUse.minPrice !== 0) {
        params.append('minPrice', filtersToUse.minPrice.toString());
      }
      if (filtersToUse.maxPrice !== undefined && filtersToUse.maxPrice !== 500) {
        params.append('maxPrice', filtersToUse.maxPrice.toString());
      }
      
      setSearchParams(params);
      
      const results = await searchProducts(filtersToUse);
      setProducts(results);
      setSearched(true);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
      if (isOpen) onClose();
    }
  };

  const handleClearFilters = () => {
    const defaultFilters: ProductSearchFilters = {
      searchTerm: '',
      category: 'all',
      color: 'all',
      minPrice: 0,
      maxPrice: 500,
      discountedOnly: false
    };
    
    setPriceRange([0, 500]);
    setFilters(defaultFilters);
    setSearchParams({});
    setSearched(false);
    setProducts([]);
  };

  const FiltersContent = () => (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md">Filters</Heading>
      </Box>
      
      <Box>
        <Text mb={2} fontWeight="medium">Category</Text>
        <Select 
          value={filters.category || 'all'} 
          onChange={(e) => setFilters(prev => ({
            ...prev,
            category: e.target.value === 'all' ? undefined : e.target.value
          }))}
        >
          <option value="all">All Categories</option>
          {categories.filter(c => c !== 'all').map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </Select>
      </Box>
      
      <Box>
        <Text mb={2} fontWeight="medium">Color</Text>
        <Select 
          value={filters.color || 'all'} 
          onChange={(e) => setFilters(prev => ({
            ...prev,
            color: e.target.value === 'all' ? undefined : e.target.value
          }))}
        >
          <option value="all">All Colors</option>
          {colors.filter(c => c !== 'all').map(color => (
            <option key={color} value={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </option>
          ))}
        </Select>
      </Box>
      
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
          onChange={(newRange) => setPriceRange([newRange[0], newRange[1]])}
          onChangeEnd={(newRange) => setFilters(prev => ({
            ...prev,
            minPrice: newRange[0],
            maxPrice: newRange[1]
          }))}
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
          onChange={(e) => setFilters(prev => ({ ...prev, discountedOnly: e.target.checked }))}
        >
          Discounted Items Only
        </Checkbox>
      </Box>
      
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
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalUrl}
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
                      <Button colorScheme="blue" onClick={() => performSearch()}>
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
