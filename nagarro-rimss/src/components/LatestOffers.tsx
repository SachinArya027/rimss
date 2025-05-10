import { useState, useEffect } from 'react';
import { Box, Container, Heading, SimpleGrid as ChakraGrid, Text, VStack as ChakraVStack, Image, Button, Spinner, Center, useToast } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { getActiveOffers } from '../firebase/firestoreService';
import type { Offer } from '../firebase/firestoreService';

const LatestOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        const activeOffers = await getActiveOffers();
        setOffers(activeOffers);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load offers';
        setError(errorMessage);
        toast({
          title: 'Error loading offers',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, [toast]);

  if (loading) {
    return (
      <Box bg="gray.50" py={12}>
        <Container maxW="container.xl">
          <Heading mb={8} textAlign="center" fontSize="3xl">Latest Offers</Heading>
          <Center py={10}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Center>
        </Container>
      </Box>
    );
  }

  if (error || offers.length === 0) {
    return (
      <Box bg="gray.50" py={12}>
        <Container maxW="container.xl">
          <Heading mb={8} textAlign="center" fontSize="3xl">Latest Offers</Heading>
          <Center py={10}>
            <Text color="gray.600">{error || 'No active offers available at the moment.'}</Text>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" py={12}>
      <Container maxW="container.xl">
        <Heading mb={8} textAlign="center" fontSize="3xl">Latest Offers</Heading>
        <ChakraGrid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
          {offers.map((offer) => (
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
