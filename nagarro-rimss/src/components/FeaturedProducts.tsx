import { useState, useEffect } from 'react';
import { Box, Container, SimpleGrid as ChakraGrid, Image, Text, Badge, VStack as ChakraVStack, Heading, Button, Spinner, Center, useToast } from '@chakra-ui/react';
import { getFeaturedProducts } from '../firebase/firestoreService';
import type { Product } from '../firebase/firestoreService';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const featuredProducts = await getFeaturedProducts();
        setProducts(featuredProducts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
        setError(errorMessage);
        toast({
          title: 'Error loading products',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  if (loading) {
    return (
      <Box py={12} bg="white">
        <Container maxW="container.xl">
          <Heading mb={8} textAlign="center" fontSize="3xl">Featured Products</Heading>
          <Center py={10}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Center>
        </Container>
      </Box>
    );
  }

  if (error || products.length === 0) {
    return (
      <Box py={12} bg="white">
        <Container maxW="container.xl">
          <Heading mb={8} textAlign="center" fontSize="3xl">Featured Products</Heading>
          <Center py={10}>
            <Text color="gray.600">{error || 'No featured products available at the moment.'}</Text>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box py={12} bg="white">
      <Container maxW="container.xl">
        <Heading mb={8} textAlign="center" fontSize="3xl">Featured Products</Heading>
        <ChakraGrid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={8}>
          {products.map((product) => (
            <ChakraVStack 
              key={product.id} 
              alignItems="start" 
              gap={3} 
              p={6} 
              borderWidth="1px" 
              borderRadius="xl"
              bg="white"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
                transition: 'all 0.2s'
              }}
              transition="all 0.2s"
            >
              <Box position="relative" width="100%">
                <Image 
                  src={product.image} 
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
              </Box>
              <Text fontWeight="bold" fontSize="lg" mt={2}>{product.name}</Text>
              <Text color="blue.600" fontSize="xl" fontWeight="bold">
                ${product.price.toFixed(2)}
                {product.discount && (
                  <Text as="span" color="gray.500" fontSize="md" textDecoration="line-through" ml={2}>
                    ${(product.price * (1 + product.discount/100)).toFixed(2)}
                  </Text>
                )}
              </Text>
              <Button width="100%" mt={2}>Add to Cart</Button>
            </ChakraVStack>
          ))}
        </ChakraGrid>
      </Container>
    </Box>
  );
};

export default FeaturedProducts;
