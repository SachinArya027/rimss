import { Box, Container, SimpleGrid as ChakraGrid, Image, Text, Badge, VStack as ChakraVStack, Heading, Button } from '@chakra-ui/react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isFeatured: boolean;
  discount?: number;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Classic Moleskin Jacket",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&h=500",
    isFeatured: true,
    discount: 20
  },
  {
    id: 2,
    name: "Corduroy Trousers",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&h=500",
    isFeatured: true
  },
  {
    id: 3,
    name: "Tattersall Shirt",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&h=500",
    isFeatured: true,
    discount: 15
  },
  {
    id: 4,
    name: "Wool Sweater",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=500&h=500",
    isFeatured: true
  }
];

const FeaturedProducts = () => {
  return (
    <Box py={12} bg="white">
      <Container maxW="container.xl">
        <Heading mb={8} textAlign="center" fontSize="3xl">Featured Products</Heading>
        <ChakraGrid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={8}>
          {mockProducts.map((product) => (
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
