import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Badge,
  Divider,
  Image,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Skeleton,
  useColorModeValue,
  Alert,
  AlertIcon,
  SimpleGrid
} from '@chakra-ui/react';
import { useAuth } from '../contexts/useAuth';
import { getUserOrders } from '../services/orderService';
import type { Order } from '../services/orderService';
import { formatDate } from '../utils/formatters';

// Helper function to format date
const formatOrderDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return formatDate(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'processing':
      return 'blue';
    case 'pending':
      return 'orange';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Fetch user orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userOrders = await getUserOrders(currentUser.uid);
        setOrders(userOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser, navigate]);
  
  // Render loading state
  if (loading) {
    return (
      <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
        <Container maxW="container.xl">
          <Heading mb={6}>Order History</Heading>
          <VStack spacing={4} align="stretch">
            {[1, 2, 3].map((i) => (
              <Box 
                key={i} 
                p={6} 
                borderWidth="1px" 
                borderRadius="lg" 
                bg={bgColor}
                borderColor={borderColor}
              >
                <Skeleton height="30px" mb={4} />
                <Skeleton height="20px" mb={2} />
                <Skeleton height="20px" mb={4} />
                <Skeleton height="100px" />
              </Box>
            ))}
          </VStack>
        </Container>
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
        <Container maxW="container.xl">
          <Heading mb={6}>Order History</Heading>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
          <Button mt={4} colorScheme="blue" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Container>
      </Box>
    );
  }
  
  // Render empty state
  if (orders.length === 0) {
    return (
      <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
        <Container maxW="container.xl">
          <Heading mb={6}>Order History</Heading>
          <Box 
            p={8} 
            borderWidth="1px" 
            borderRadius="lg" 
            bg={bgColor}
            borderColor={borderColor}
            textAlign="center"
          >
            <Text fontSize="lg" mb={4}>You haven't placed any orders yet.</Text>
            <Button 
              as={RouterLink} 
              to="/search" 
              colorScheme="blue"
            >
              Start Shopping
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }
  
  // Render orders
  return (
    <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
      <Container maxW="container.xl">
        <Heading mb={6}>Order History</Heading>
        
        <VStack spacing={6} align="stretch">
          {orders.map((order) => (
            <Accordion 
              key={order.id} 
              allowToggle 
              borderWidth="1px" 
              borderRadius="lg"
              bg={bgColor}
              borderColor={borderColor}
            >
              <AccordionItem border="none">
                <AccordionButton py={4} _hover={{ bg: hoverBgColor }}>
                  <Box flex="1" textAlign="left">
                    <Flex 
                      direction={{ base: 'column', md: 'row' }} 
                      justify="space-between" 
                      align={{ base: 'start', md: 'center' }}
                      gap={2}
                    >
                      <HStack>
                        <Text fontWeight="bold">Order #{order.id?.substring(0, 8)}</Text>
                        <Badge colorScheme={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </HStack>
                      
                      <HStack spacing={4}>
                        <Text color="gray.500">
                          {formatOrderDate(order.orderDate)}
                        </Text>
                        <Text fontWeight="bold">
                          ${order.total.toFixed(2)}
                        </Text>
                      </HStack>
                    </Flex>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={4}>
                    {/* Order Items */}
                    <Box>
                      <Heading size="sm" mb={3}>Items</Heading>
                      <SimpleGrid 
                        columns={{ base: 1, md: 2 }} 
                        spacing={4}
                      >
                        {order.orderItems.map((item, index) => (
                          <HStack 
                            key={`${order.id}-${index}`} 
                            p={3} 
                            borderWidth="1px" 
                            borderRadius="md"
                            borderColor={borderColor}
                            spacing={4}
                          >
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              boxSize="60px" 
                              objectFit="cover" 
                              borderRadius="md"
                            />
                            <Box flex="1">
                              <Text fontWeight="semibold">{item.name}</Text>
                              <HStack justify="space-between">
                                <Text fontSize="sm">
                                  Qty: {item.quantity} × ${item.discount 
                                    ? (item.price * (1 - item.discount / 100)).toFixed(2)
                                    : item.price.toFixed(2)
                                  }
                                </Text>
                                <Text fontWeight="medium">
                                  ${item.discount 
                                    ? (item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)
                                    : (item.price * item.quantity).toFixed(2)
                                  }
                                </Text>
                              </HStack>
                            </Box>
                          </HStack>
                        ))}
                      </SimpleGrid>
                    </Box>
                    
                    <Divider />
                    
                    {/* Order Summary */}
                    <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
                      {/* Shipping Address */}
                      <Box flex="1">
                        <Heading size="sm" mb={3}>Shipping Address</Heading>
                        <Box p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                          <Text fontWeight="medium">{order.shippingAddress.fullName}</Text>
                          <Text>{order.shippingAddress.addressLine1}</Text>
                          {order.shippingAddress.addressLine2 && (
                            <Text>{order.shippingAddress.addressLine2}</Text>
                          )}
                          <Text>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                          </Text>
                          <Text>{order.shippingAddress.country}</Text>
                        </Box>
                      </Box>
                      
                      {/* Payment Summary */}
                      <Box flex="1">
                        <Heading size="sm" mb={3}>Payment Summary</Heading>
                        <Box p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                          <Flex justify="space-between" mb={2}>
                            <Text>Subtotal:</Text>
                            <Text>${order.subtotal.toFixed(2)}</Text>
                          </Flex>
                          <Flex justify="space-between" mb={2}>
                            <Text>Shipping:</Text>
                            <Text>${order.shippingCost.toFixed(2)}</Text>
                          </Flex>
                          {order.discount > 0 && (
                            <Flex justify="space-between" mb={2}>
                              <Text>Discount:</Text>
                              <Text color="green.500">-${order.discount.toFixed(2)}</Text>
                            </Flex>
                          )}
                          <Divider my={2} />
                          <Flex justify="space-between" fontWeight="bold">
                            <Text>Total:</Text>
                            <Text>${order.total.toFixed(2)}</Text>
                          </Flex>
                          <Text mt={2} fontSize="sm" color="gray.500">
                            Paid with {order.paymentMethod}
                          </Text>
                        </Box>
                      </Box>
                    </Flex>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

export default OrderHistoryPage;
