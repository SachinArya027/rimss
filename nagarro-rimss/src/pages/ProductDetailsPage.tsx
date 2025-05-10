import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Image,
  Badge,
  Button,
  VStack,
  HStack,
  Flex,
  Spinner,
  Center,
  useColorModeValue,
  IconButton,
  Divider,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import { getProductById } from '../firebase/firestoreService';
import type { Product } from '../firebase/firestoreService';
import { useCart } from '../contexts/useCart';

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useCart();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  const handlePreviousImage = () => {
    if (!product || !product.images.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    if (!product || !product.images.length) return;
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: 'Added to cart',
        description: `${quantity} x ${product.name} added to your cart`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && (!product?.stock || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };
  
  if (loading) {
    return (
      <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
        <Container maxW="container.xl">
          <Center py={10}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Text>Loading product details...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }
  
  if (error || !product) {
    return (
      <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
        <Container maxW="container.xl">
          <Center py={10}>
            <VStack spacing={4}>
              <Heading size="md">Error</Heading>
              <Text>{error || 'Product not found'}</Text>
              <Button onClick={() => navigate('/search')}>Back to Search</Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }
  
  // Calculate discounted price if discount exists
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;
  
  return (
    <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
      <Container maxW="container.xl">
        {/* Breadcrumb */}
        <Breadcrumb mb={6} fontSize="sm" color="gray.500">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/search">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/search?category=${product.category}`}>
              {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'All'}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>{product.name}</Text>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Grid 
          templateColumns={{ base: '1fr', md: '1fr 1fr' }} 
          gap={8}
          bg={bgColor}
          p={6}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
        >
          {/* Product Images */}
          <GridItem>
            <Box position="relative">
              <Image 
                src={product.images[currentImageIndex]} 
                alt={product.name} 
                borderRadius="lg"
                width="100%"
                height="500px"
                objectFit="cover"
              />
              {product.discount && (
                <Badge
                  position="absolute"
                  top={4}
                  right={4}
                  colorScheme="red"
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="md"
                >
                  {product.discount}% OFF
                </Badge>
              )}
              {product.images.length > 1 && (
                <>
                  <IconButton
                    aria-label="Previous image"
                    icon={<ChevronLeftIcon />}
                    position="absolute"
                    left={2}
                    top="50%"
                    transform="translateY(-50%)"
                    colorScheme="blackAlpha"
                    onClick={handlePreviousImage}
                  />
                  <IconButton
                    aria-label="Next image"
                    icon={<ChevronRightIcon />}
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    colorScheme="blackAlpha"
                    onClick={handleNextImage}
                  />
                </>
              )}
            </Box>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <Flex mt={4} gap={2} overflowX="auto" pb={2}>
                {product.images.map((image, index) => (
                  <Box 
                    key={index}
                    cursor="pointer"
                    borderWidth={index === currentImageIndex ? "2px" : "1px"}
                    borderColor={index === currentImageIndex ? "blue.500" : borderColor}
                    borderRadius="md"
                    overflow="hidden"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image 
                      src={image} 
                      alt={`${product.name} - thumbnail ${index + 1}`}
                      width="60px"
                      height="60px"
                      objectFit="cover"
                    />
                  </Box>
                ))}
              </Flex>
            )}
          </GridItem>
          
          {/* Product Details */}
          <GridItem>
            <VStack align="stretch" spacing={4}>
              <Box>
                <HStack>
                  <Badge colorScheme="green" fontSize="sm">
                    {product.category ? product.category.toUpperCase() : 'PRODUCT'}
                  </Badge>
                  {product.stock && product.stock < 10 && (
                    <Badge colorScheme="orange" fontSize="sm">
                      Only {product.stock} left
                    </Badge>
                  )}
                </HStack>
                <Heading size="xl" mt={2}>{product.name}</Heading>
                
                {/* Rating placeholder - would be dynamic in a real app */}
                <HStack mt={2}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} color={star <= 4 ? "yellow.400" : "gray.300"} />
                  ))}
                  <Text fontSize="sm" color="gray.500">(24 reviews)</Text>
                </HStack>
              </Box>
              
              <Box>
                <Flex align="baseline">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    ${discountedPrice.toFixed(2)}
                  </Text>
                  {product.discount && (
                    <Text 
                      as="span" 
                      fontSize="lg" 
                      color="gray.500" 
                      textDecoration="line-through" 
                      ml={2}
                    >
                      ${product.price.toFixed(2)}
                    </Text>
                  )}
                </Flex>
                {product.discount && (
                  <Text fontSize="sm" color="green.500" fontWeight="bold">
                    You save: ${(product.price - discountedPrice).toFixed(2)} ({product.discount}%)
                  </Text>
                )}
              </Box>
              
              <Divider />
              
              {/* Description */}
              <Box>
                <Heading size="md" mb={2}>Description</Heading>
                <Text color="gray.600">
                  {product.description || 'No description available for this product.'}
                </Text>
              </Box>
              
              {/* Color */}
              {product.color && (
                <Box>
                  <Heading size="md" mb={2}>Color</Heading>
                  <HStack>
                    <Box 
                      width="24px" 
                      height="24px" 
                      borderRadius="full" 
                      bg={product.color.toLowerCase()} 
                      borderWidth="1px"
                      borderColor={borderColor}
                    />
                    <Text>{product.color}</Text>
                  </HStack>
                </Box>
              )}
              
              <Divider />
              
              {/* Quantity Selector */}
              <Box>
                <Heading size="md" mb={2}>Quantity</Heading>
                <HStack>
                  <IconButton 
                    aria-label="Decrease quantity" 
                    icon={<MinusIcon />} 
                    onClick={() => handleQuantityChange(-1)}
                    isDisabled={quantity <= 1}
                  />
                  <Text fontWeight="bold" width="40px" textAlign="center">{quantity}</Text>
                  <IconButton 
                    aria-label="Increase quantity" 
                    icon={<AddIcon />} 
                    onClick={() => handleQuantityChange(1)}
                    isDisabled={product.stock !== undefined && quantity >= product.stock}
                  />
                  {product.stock && (
                    <Text fontSize="sm" color="gray.500" ml={2}>
                      {product.stock} available
                    </Text>
                  )}
                </HStack>
              </Box>
              
              {/* Add to Cart Button */}
              <Button 
                colorScheme="blue" 
                size="lg" 
                mt={4}
                onClick={handleAddToCart}
                isDisabled={product.stock !== undefined && product.stock === 0}
              >
                {product.stock !== undefined && product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              {/* Additional Info */}
              <Box mt={4} p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm">
                  <strong>Free shipping</strong> on orders over $100
                </Text>
                <Text fontSize="sm" mt={1}>
                  <strong>30-day return policy</strong> for all products
                </Text>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetailsPage;
