import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Badge,
  VStack,
  Button,
  Heading,
  Spinner,
  Center,
  Flex,
  Select,
  useColorModeValue,
  Link,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { Product } from '../firebase/firestoreService';
import { useCart } from '../contexts/useCart';

interface SearchResultsProps {
  products: Product[];
  loading: boolean;
  searchTerm: string;
}

type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';

const SearchResults = ({ products, loading, searchTerm }: SearchResultsProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { addToCart } = useCart();
  const toast = useToast();
  
  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast({
      title: 'Added to cart',
      description: `${product.name} added to your cart`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <Center py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Searching products...</Text>
        </VStack>
      </Center>
    );
  }

  if (products.length === 0) {
    return (
      <Center py={10}>
        <VStack spacing={4}>
          <Heading size="md">No products found</Heading>
          <Text>
            {searchTerm 
              ? `No products match "${searchTerm}". Try different search terms or filters.` 
              : 'No products match your filters. Try adjusting your search criteria.'}
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md">{products.length} Products Found</Heading>
        <Flex align="center">
          <Text mr={2} fontSize="sm">Sort by:</Text>
          <Select 
            value={sortBy} 
            onChange={handleSortChange} 
            size="sm" 
            width="auto"
            bg={bgColor}
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
          </Select>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing={6}>
        {sortedProducts.map((product) => (
          <VStack 
            key={product.id} 
            alignItems="start" 
            gap={3} 
            p={6} 
            borderWidth="1px" 
            borderRadius="xl"
            bg={bgColor}
            borderColor={borderColor}
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: 'lg',
              transition: 'all 0.2s'
            }}
            transition="all 0.2s"
          >
            <Box position="relative" width="100%">
              <Link as={RouterLink} to={`/product/${product.id}`} width="100%" display="block">
                <Image 
                  src={product.images && product.images.length > 0 ? product.images[0] : ''} 
                  alt={product.name} 
                  borderRadius="lg"
                  width="100%"
                  height="250px"
                  objectFit="cover"
                />
              {product.discount && (
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  colorScheme="red"
                  fontSize="sm"
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  {product.discount}% OFF
                </Badge>
              )}
              </Link>
            </Box>
            <Link as={RouterLink} to={`/product/${product.id}`} _hover={{ textDecoration: 'none' }}>
              <Text fontWeight="bold" fontSize="lg" mt={2}>{product.name}</Text>
            </Link>
            <Text color="gray.600" fontSize="sm" noOfLines={2}>
              {product.description || 'No description available'}
            </Text>
            <Flex justify="space-between" width="100%" align="center">
              <Text color="blue.600" fontSize="xl" fontWeight="bold">
                ${product.price.toFixed(2)}
                {product.discount && (
                  <Text as="span" color="gray.500" fontSize="md" textDecoration="line-through" ml={2}>
                    ${(product.price * (1 + product.discount/100)).toFixed(2)}
                  </Text>
                )}
              </Text>
              <Badge colorScheme="green" fontSize="xs">
                {product.category}
              </Badge>
            </Flex>
            <Button 
              width="100%" 
              mt={2} 
              colorScheme="blue"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </Button>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default SearchResults;
