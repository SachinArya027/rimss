import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Button,
  Flex,
  IconButton,
  Divider,
  Badge,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useBreakpointValue,
  useToast,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { CloseIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import { useAuth } from '../contexts/useAuth';
import LoginModal from '../components/LoginModal';
import StripeCheckout from '../components/StripeCheckout';
import { createOrder } from '../services/orderService';
import type { ShippingAddress } from '../services/orderService';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Responsive layout
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Handle checkout
  const handleCheckout = () => {
    // Check if user is signed in
    if (!currentUser) {
      // Open login modal if user is not signed in
      setIsLoginModalOpen(true);
      return;
    }
    
    // Open Stripe checkout modal
    setIsCheckoutModalOpen(true);
  };
  
  // Close checkout modal
  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };
  
  // Handle successful payment
  const handlePaymentSuccess = async (paymentId: string) => {
    // Close the checkout modal
    setIsCheckoutModalOpen(false);
    
    if (!currentUser) {
      // This shouldn't happen as we check for login before checkout
      toast({
        title: 'Error',
        description: 'You must be logged in to complete your purchase.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    try {
      // Default shipping address (in a real app, this would be collected from the user)
      const shippingAddress: ShippingAddress = {
        fullName: currentUser.displayName || 'Customer',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States'
      };
      
      // Calculate discount amount
      const discount = cartItems.reduce((total, item) => {
        if (item.product.discount) {
          return total + (item.product.price * (item.product.discount / 100) * item.quantity);
        }
        return total;
      }, 0);
      
      // Create order in Firestore
      const orderId = await createOrder(
        currentUser.uid,
        cartItems,
        shippingAddress,
        'Credit Card', // Payment method
        paymentId,
        totalPrice,
        shippingCost,
        discount,
        orderTotal
      );
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast({
        title: 'Payment successful!',
        description: `Your order #${orderId.substring(0, 8)} has been placed.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Navigate to order history page
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      
      toast({
        title: 'Order processing error',
        description: 'There was an error processing your order. Please contact customer support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Close login modal
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  
  // Calculate shipping cost (free over $100)
  const shippingCost = totalPrice >= 100 ? 0 : 10;
  
  // Calculate total with shipping
  const orderTotal = totalPrice + shippingCost;
  
  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
        <Container maxW="container.xl">
          <VStack spacing={8} py={10} align="center">
            <Heading size="xl">Your Cart is Empty</Heading>
            <Text color="gray.600">
              Looks like you haven't added any products to your cart yet.
            </Text>
            <Button 
              colorScheme="blue" 
              size="lg"
              onClick={() => navigate('/search')}
            >
              Continue Shopping
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }
  
  return (
    <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
      
      {/* Stripe Checkout Modal */}
      <Modal isOpen={isCheckoutModalOpen} onClose={handleCloseCheckoutModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Checkout</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <StripeCheckout 
              amount={Math.round(orderTotal * 100)} // Convert to cents for Stripe
              onClose={handleCloseCheckoutModal}
              onSuccess={handlePaymentSuccess}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      
      <Container maxW="container.xl">
        <Heading mb={6}>Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</Heading>
        
        <Flex 
          direction={{ base: 'column', lg: 'row' }} 
          gap={8}
        >
          {/* Cart Items */}
          <Box 
            flex={3} 
            bg={bgColor} 
            p={6} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderColor={borderColor}
          >
            {isMobile ? (
              // Mobile cart view
              <VStack spacing={6} align="stretch">
                {cartItems.map((item) => {
                  const discountedPrice = item.product.discount 
                    ? item.product.price * (1 - item.product.discount / 100) 
                    : item.product.price;
                  
                  return (
                    <Box 
                      key={item.product.id} 
                      p={4} 
                      borderWidth="1px" 
                      borderRadius="md" 
                      borderColor={borderColor}
                    >
                      <Flex gap={4}>
                        <Link as={RouterLink} to={`/product/${item.product.id}`}>
                          <Image 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            boxSize="80px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                        </Link>
                        
                        <VStack flex={1} align="start" spacing={2}>
                          <Flex w="100%" justify="space-between">
                            <Link 
                              as={RouterLink} 
                              to={`/product/${item.product.id}`}
                              fontWeight="bold"
                              _hover={{ color: 'blue.500' }}
                            >
                              {item.product.name}
                            </Link>
                            <IconButton
                              aria-label="Remove item"
                              icon={<CloseIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => removeFromCart(item.product.id)}
                            />
                          </Flex>
                          
                          {item.product.category && (
                            <Badge colorScheme="green" fontSize="xs">
                              {item.product.category}
                            </Badge>
                          )}
                          
                          <Text fontWeight="bold" color="blue.600">
                            ${discountedPrice.toFixed(2)}
                            {item.product.discount && (
                              <Text as="span" color="gray.500" fontSize="sm" textDecoration="line-through" ml={2}>
                                ${item.product.price.toFixed(2)}
                              </Text>
                            )}
                          </Text>
                          
                          <HStack>
                            <IconButton
                              aria-label="Decrease quantity"
                              icon={<MinusIcon />}
                              size="xs"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              isDisabled={item.quantity <= 1}
                            />
                            <Text fontWeight="medium" width="30px" textAlign="center">
                              {item.quantity}
                            </Text>
                            <IconButton
                              aria-label="Increase quantity"
                              icon={<AddIcon />}
                              size="xs"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              isDisabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
                            />
                          </HStack>
                          
                          <Text fontWeight="bold">
                            Subtotal: ${(discountedPrice * item.quantity).toFixed(2)}
                          </Text>
                        </VStack>
                      </Flex>
                    </Box>
                  );
                })}
              </VStack>
            ) : (
              // Desktop cart view
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th width="100px">Product</Th>
                      <Th>Name</Th>
                      <Th>Price</Th>
                      <Th>Quantity</Th>
                      <Th isNumeric>Subtotal</Th>
                      <Th width="50px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {cartItems.map((item) => {
                      const discountedPrice = item.product.discount 
                        ? item.product.price * (1 - item.product.discount / 100) 
                        : item.product.price;
                      
                      return (
                        <Tr key={item.product.id}>
                          <Td>
                            <Link as={RouterLink} to={`/product/${item.product.id}`}>
                              <Image 
                                src={item.product.images[0]} 
                                alt={item.product.name}
                                boxSize="80px"
                                objectFit="cover"
                                borderRadius="md"
                              />
                            </Link>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Link 
                                as={RouterLink} 
                                to={`/product/${item.product.id}`}
                                fontWeight="bold"
                                _hover={{ color: 'blue.500' }}
                              >
                                {item.product.name}
                              </Link>
                              {item.product.category && (
                                <Badge colorScheme="green" fontSize="xs">
                                  {item.product.category}
                                </Badge>
                              )}
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontWeight="bold" color="blue.600">
                              ${discountedPrice.toFixed(2)}
                              {item.product.discount && (
                                <Text as="span" color="gray.500" fontSize="sm" textDecoration="line-through" ml={2}>
                                  ${item.product.price.toFixed(2)}
                                </Text>
                              )}
                            </Text>
                          </Td>
                          <Td>
                            <HStack>
                              <IconButton
                                aria-label="Decrease quantity"
                                icon={<MinusIcon />}
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                isDisabled={item.quantity <= 1}
                              />
                              <Text fontWeight="medium" width="30px" textAlign="center">
                                {item.quantity}
                              </Text>
                              <IconButton
                                aria-label="Increase quantity"
                                icon={<AddIcon />}
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                isDisabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
                              />
                            </HStack>
                          </Td>
                          <Td isNumeric fontWeight="bold">
                            ${(discountedPrice * item.quantity).toFixed(2)}
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="Remove item"
                              icon={<CloseIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => removeFromCart(item.product.id)}
                            />
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
            
            <Flex justify="space-between" mt={6}>
              <Button 
                variant="outline" 
                leftIcon={<CloseIcon />}
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              
              <Button 
                as={RouterLink} 
                to="/search" 
                colorScheme="blue" 
                variant="outline"
              >
                Continue Shopping
              </Button>
            </Flex>
          </Box>
          
          {/* Order Summary */}
          <Box 
            flex={1} 
            bg={bgColor} 
            p={6} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderColor={borderColor}
            height="fit-content"
            position="sticky"
            top="80px"
          >
            <Heading size="md" mb={4}>Order Summary</Heading>
            
            <VStack spacing={3} align="stretch">
              <Flex justify="space-between">
                <Text>Subtotal</Text>
                <Text fontWeight="bold">${totalPrice.toFixed(2)}</Text>
              </Flex>
              
              <Flex justify="space-between">
                <Text>Shipping</Text>
                <Text fontWeight="bold">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </Text>
              </Flex>
              
              {shippingCost > 0 && (
                <Text fontSize="sm" color="gray.500">
                  Free shipping on orders over $100
                </Text>
              )}
              
              <Divider my={2} />
              
              <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                <Text>Total</Text>
                <Text color="blue.600">${orderTotal.toFixed(2)}</Text>
              </Flex>
              
              <Button 
                colorScheme="blue" 
                size="lg" 
                mt={4}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              
              <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
                Taxes calculated at checkout
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default CartPage;
