import { Box, Container, Heading, SimpleGrid as ChakraGrid, Text, VStack as ChakraVStack, Image, Button } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  discount: string;
  validUntil: string;
}

const mockOffers: Offer[] = [
  {
    id: 1,
    title: "Summer Collection Sale",
    description: "Get up to 50% off on our latest summer collection. Limited time offer!",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&h=400",
    discount: "50% OFF",
    validUntil: "2025-05-15"
  },
  {
    id: 2,
    title: "New Season Arrivals",
    description: "Discover our fresh new styles for the upcoming season. Shop now!",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=400",
    discount: "NEW",
    validUntil: "2025-05-20"
  },
  {
    id: 3,
    title: "Premium Collection",
    description: "Exclusive deals on our premium range. Luxury meets affordability.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&h=400",
    discount: "30% OFF",
    validUntil: "2025-05-12"
  }
];

const LatestOffers = () => {
  return (
    <Box bg="gray.50" py={12}>
      <Container maxW="container.xl">
        <Heading mb={8} textAlign="center" fontSize="3xl">Latest Offers</Heading>
        <ChakraGrid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
          {mockOffers.map((offer) => (
            <ChakraVStack
              key={offer.id}
              bg="white"
              p={0}
              borderRadius="xl"
              boxShadow="md"
              gap={0}
              alignItems="stretch"
              overflow="hidden"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
                transition: 'all 0.2s'
              }}
              transition="all 0.2s"
            >
              <Box position="relative">
                <Image 
                  src={offer.image} 
                  alt={offer.title} 
                  width="100%"
                  height="200px"
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  top={4}
                  right={4}
                  bg={offer.discount === 'NEW' ? 'green.500' : 'red.500'}
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontWeight="bold"
                  boxShadow="md"
                >
                  {offer.discount}
                </Box>
              </Box>
              <ChakraVStack p={6} gap={4} flex={1}>
                <ChakraVStack alignItems="start" gap={2} flex={1}>
                  <Heading size="md">{offer.title}</Heading>
                  <Text color="gray.600">{offer.description}</Text>
                  <Text color="gray.500" fontSize="sm" mt="auto">
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                  </Text>
                </ChakraVStack>
                <Button width="100%" rightIcon={<ChevronRightIcon />}>
                  Shop Now
                </Button>
              </ChakraVStack>
            </ChakraVStack>
          ))}
        </ChakraGrid>
      </Container>
    </Box>
  );
};

export default LatestOffers;
