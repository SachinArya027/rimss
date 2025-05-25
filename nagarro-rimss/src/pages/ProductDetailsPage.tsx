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
import SEO from '../components/SEO';

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

  // Generate JSON-LD structured data for the product
  const generateProductJsonLd = (product: Product) => {
    // Calculate discounted price if discount exists
    const discountedPrice = product.discount 
      ? product.price * (1 - product.discount / 100) 
      : product.price;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || `${product.name} - Available at RIMSS`,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      sku: product.id,
      mpn: product.id,
      brand: {
        '@type': 'Brand',
        name: 'RIMSS'
      },
      offers: {
        '@type': 'Offer',
        url: `https://nagarro-rimss-27.web.app/product/${product.id}`,
        priceCurrency: 'USD',
        price: discountedPrice.toFixed(2),
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.stock && product.stock > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock'
      }
    };

    return JSON.stringify(jsonLd);
  };
  
  if (loading) {
    return (
      <Box pt="72px" pb={8} minH="calc(100vh - 64px)">
        <SEO 
          title="Loading Product | RIMSS"
          description="Loading product details..."
        />
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
        <SEO 
          title="Product Not Found | RIMSS"
          description="The requested product could not be found."
        />
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
      <SEO 
        title={`${product.name} | RIMSS`}
        description={product.description || `${product.name} - Shop now at RIMSS`}
        canonical={`/product/${product.id}`}
        ogType="product"
        ogImage={product.images && product.images.length > 0 ? product.images[0] : ''}
        keywords={`${product.name}, ${product.category || ''}, online shopping, RIMSS`}
      >
        {/* Add JSON-LD structured data */}
        <script type="application/ld+json">
          {generateProductJsonLd(product)}
        </script>
      </SEO>
      <Container maxW="container.xl">
        {/* Breadcrumb */}
        <Breadcrumb mb={6} fontSize="sm" color="gray.500">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {product.category && (
            <BreadcrumbItem>
              <BreadcrumbLink href={`/search?category=${product.category}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href={`/product/${product.id}`}>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
          {/* Product Images */}
          <GridItem>
            <Box 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden" 
              bg={bgColor} 
              borderColor={borderColor}
              position="relative"
            >
              {product.discount && (
                <Badge 
                  colorScheme="red" 
                  position="absolute" 
                  top="10px" 
                  right="10px" 
                  zIndex="1"
                  fontSize="0.9em"
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  {product.discount}% OFF
                </Badge>
              )}
              
              <Box position="relative" height={{ base: '300px', sm: '400px', md: '500px' }}>
                {product.images && product.images.length > 0 ? (
                  <>
                    <Image 
                      src={product.images[currentImageIndex]} 
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      objectFit="contain"
                      width="100%"
                      height="100%"
                    />
                    
                    {product.images.length > 1 && (
                      <>
                        <IconButton
                          aria-label="Previous image"
                          icon={<ChevronLeftIcon />}
                          position="absolute"
                          left="10px"
                          top="50%"
                          transform="translateY(-50%)"
                          onClick={handlePreviousImage}
                          borderRadius="full"
                          bg="white"
                          opacity="0.8"
                          _hover={{ opacity: 1 }}
                        />
                        <IconButton
                          aria-label="Next image"
                          icon={<ChevronRightIcon />}
                          position="absolute"
                          right="10px"
                          top="50%"
                          transform="translateY(-50%)"
                          onClick={handleNextImage}
                          borderRadius="full"
                          bg="white"
                          opacity="0.8"
                          _hover={{ opacity: 1 }}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <Center height="100%">
                    <Text>No image available</Text>
                  </Center>
                )}
              </Box>
              
              {/* Thumbnail Navigation */}
              {product.images && product.images.length > 1 && (
                <Flex mt={4} justify="center" wrap="wrap">
                  {product.images.map((img, index) => (
                    <Box 
                      key={index}
                      as="button"
                      width="60px"
                      height="60px"
                      m={1}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={index === currentImageIndex ? 'blue.500' : borderColor}
                      overflow="hidden"
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image 
                        src={img} 
                        alt={`${product.name} thumbnail ${index + 1}`}
                        objectFit="cover"
                        width="100%"
                        height="100%"
                      />
                    </Box>
                  ))}
                </Flex>
              )}
            </Box>
          </GridItem>
          
          {/* Product Details */}
          <GridItem>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text color="gray.500" fontWeight="medium">RIMSS</Text>
                <Heading size="xl" mt={2}>{product.name}</Heading>
                
                {/* Rating */}
                <HStack mt={2}>
                  {Array(5).fill('').map((_, i) => (
                    <StarIcon
                      key={i}
                      color={i < 4 ? 'yellow.400' : 'gray.300'}
                    />
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
