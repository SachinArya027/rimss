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
import SEO from '../components/SEO';

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
  
  // Calculate shipping cost
  const shippingCost = totalPrice >= 100 ? 0 : 9.99;
  
  // Calculate order total
  const orderTotal = totalPrice + shippingCost;
  
  return (
    <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
      <SEO 
        title="Shopping Cart | RIMSS"
        description="Review your shopping cart items, update quantities, and proceed to checkout. Free shipping on orders over $100."
        canonical="/cart"
        keywords="shopping cart, checkout, online shopping, RIMSS, secure checkout"
      />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseLoginModal} 
        onSuccess={() => {
          setIsLoginModalOpen(false);
          setIsCheckoutModalOpen(true);
        }}
      />
      
      {/* Checkout Modal */}
      <Modal isOpen={isCheckoutModalOpen} onClose={handleCloseCheckoutModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Checkout</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <StripeCheckout 
              amount={orderTotal * 100} // Convert to cents for Stripe
              onSuccess={handlePaymentSuccess}
              onCancel={handleCloseCheckoutModal}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      
      <Container maxW="container.xl">
        {cartItems.length === 0 ? (
          <Box 
            textAlign="center" 
            py={10}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6}>
              <Heading size="xl">Your Cart is Empty</Heading>
              <Text>Looks like you haven't added any products to your cart yet.</Text>
              <Button 
                as={RouterLink} 
                to="/search" 
                colorScheme="blue" 
                size="lg"
                aria-label="Start shopping"
              >
                Start Shopping
              </Button>
            </VStack>
          </Box>
        ) : (
          <>
            <Heading mb={6}>Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</Heading>
            
            <Flex 
              direction={{ base: 'column', lg: 'row' }} 
              gap={8}
            >
              {/* Cart Items */}
              <Box 
                flex={2} 
                bg={bgColor} 
                p={6} 
                borderRadius="lg" 
                borderWidth="1px" 
                borderColor={borderColor}
              >
                {isMobile ? (
                  // Mobile view - card layout
                  <VStack spacing={4} align="stretch">
                    {cartItems.map(item => {
                      // Calculate discounted price if applicable
                      const discountedPrice = item.product.discount 
                        ? item.product.price * (1 - item.product.discount / 100) 
                        : item.product.price;
                      
                      return (
                        <Box 
                          key={item.product.id} 
                          borderWidth="1px" 
                          borderRadius="md" 
                          p={4}
                          position="relative"
                        >
                          <IconButton
                            aria-label="Remove item"
                            icon={<CloseIcon />}
                            size="xs"
                            position="absolute"
                            top={2}
                            right={2}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => removeFromCart(item.product.id)}
                          />
                          
                          <Flex gap={4}>
                            <Image 
                              src={item.product.images[0]} 
                              alt={item.product.name}
                              boxSize="80px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                            
                            <Box flex={1}>
                              <Link 
                                as={RouterLink} 
                                to={`/product/${item.product.id}`}
                                fontWeight="bold"
                                _hover={{ color: 'blue.500' }}
                              >
                                {item.product.name}
                              </Link>
                              
                              {item.product.discount && (
                                <Badge colorScheme="red" ml={2}>
                                  {item.product.discount}% OFF
                                </Badge>
                              )}
                              
                              <HStack mt={2} justify="space-between">
                                <HStack>
                                  <IconButton
                                    aria-label="Decrease quantity"
                                    icon={<MinusIcon />}
                                    size="xs"
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    isDisabled={item.quantity <= 1}
                                  />
                                  <Text fontWeight="medium">{item.quantity}</Text>
                                  <IconButton
                                    aria-label="Increase quantity"
                                    icon={<AddIcon />}
                                    size="xs"
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    isDisabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
                                  />
                                </HStack>
                                
                                <Box textAlign="right">
                                  {item.product.discount && (
                                    <Text 
                                      as="span" 
                                      fontSize="sm" 
                                      textDecoration="line-through" 
                                      color="gray.500"
                                      mr={2}
                                    >
                                      ${(item.product.price * item.quantity).toFixed(2)}
                                    </Text>
                                  )}
                                  <Text fontWeight="bold">
                                    ${(discountedPrice * item.quantity).toFixed(2)}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                          </Flex>
                        </Box>
                      );
                    })}
                  </VStack>
                ) : (
                  // Desktop view - table layout
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th width="50%">Product</Th>
                          <Th>Price</Th>
                          <Th>Quantity</Th>
                          <Th isNumeric>Total</Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {cartItems.map(item => {
                          // Calculate discounted price if applicable
                          const discountedPrice = item.product.discount 
                            ? item.product.price * (1 - item.product.discount / 100) 
                            : item.product.price;
                          
                          return (
                            <Tr key={item.product.id}>
                              <Td>
                                <Flex gap={4} align="center">
                                  <Image 
                                    src={item.product.images[0]} 
                                    alt={item.product.name}
                                    boxSize="60px"
                                    objectFit="cover"
                                    borderRadius="md"
                                  />
                                  <Box>
                                    <Link 
                                      as={RouterLink} 
                                      to={`/product/${item.product.id}`}
                                      fontWeight="bold"
                                      _hover={{ color: 'blue.500' }}
                                    >
                                      {item.product.name}
                                    </Link>
                                    {item.product.discount && (
                                      <Badge colorScheme="red" ml={2}>
                                        {item.product.discount}% OFF
                                      </Badge>
                                    )}
                                  </Box>
                                </Flex>
                              </Td>
                              <Td>
                                {item.product.discount ? (
                                  <VStack align="start" spacing={0}>
                                    <Text 
                                      as="span" 
                                      fontSize="sm" 
                                      textDecoration="line-through" 
                                      color="gray.500"
                                    >
                                      ${item.product.price.toFixed(2)}
                                    </Text>
                                    <Text fontWeight="bold" color="blue.600">
                                      ${discountedPrice.toFixed(2)}
                                    </Text>
                                  </VStack>
                                ) : (
                                  <Text>${item.product.price.toFixed(2)}</Text>
                                )}
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
                    aria-label="Clear cart"
                  >
                    Clear Cart
                  </Button>
                  
                  <Button 
                    as={RouterLink} 
                    to="/search" 
                    colorScheme="blue" 
                    variant="outline"
                    aria-label="Continue shopping"
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
                aria-label="Order summary"
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
                    aria-label="Proceed to checkout"
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
                    Taxes calculated at checkout
                  </Text>
                </VStack>
              </Box>
            </Flex>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CartPage;
