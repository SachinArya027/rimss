import { 
  Box, 
  Container, 
  Stack, 
  Text, 
  Link, 
  Flex, 
  Divider, 
  Icon, 
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const linkHoverColor = useColorModeValue('blue.500', 'blue.300');
  
  return (
    <Box
      bg={bgColor}
      color={textColor}
      borderTopWidth={1}
      borderStyle={'solid'}
      borderColor={borderColor}
      mt="auto"
    >
      <Container as={Stack} maxW={'100%'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Company</Text>
            <Link as={RouterLink} to="/about" _hover={{ color: linkHoverColor }}>About Us</Link>
            <Link as={RouterLink} to="/careers" _hover={{ color: linkHoverColor }}>Careers</Link>
            <Link as={RouterLink} to="/contact" _hover={{ color: linkHoverColor }}>Contact Us</Link>
          </Stack>
          
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Support</Text>
            <Link as={RouterLink} to="/help" _hover={{ color: linkHoverColor }}>Help Center</Link>
            <Link as={RouterLink} to="/terms" _hover={{ color: linkHoverColor }}>Terms of Service</Link>
            <Link as={RouterLink} to="/privacy" _hover={{ color: linkHoverColor }}>Privacy Policy</Link>
          </Stack>
          
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Shop</Text>
            <Link as={RouterLink} to="/search?category=men" _hover={{ color: linkHoverColor }}>Men's Collection</Link>
            <Link as={RouterLink} to="/search?category=women" _hover={{ color: linkHoverColor }}>Women's Collection</Link>
            <Link as={RouterLink} to="/search?category=accessories" _hover={{ color: linkHoverColor }}>Accessories</Link>
            <Link as={RouterLink} to="/search?discounted=true" _hover={{ color: linkHoverColor }}>Sale Items</Link>
          </Stack>
          
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>Stay Connected</Text>
            <Text>Subscribe to our newsletter to get updates on our latest offers!</Text>
            <Flex mt={2} gap={4}>
              <Link href="https://twitter.com" isExternal _hover={{ color: linkHoverColor }}>
                <Icon as={FaTwitter} boxSize={5} />
              </Link>
              <Link href="https://facebook.com" isExternal _hover={{ color: linkHoverColor }}>
                <Icon as={FaFacebook} boxSize={5} />
              </Link>
              <Link href="https://instagram.com" isExternal _hover={{ color: linkHoverColor }}>
                <Icon as={FaInstagram} boxSize={5} />
              </Link>
              <Link href="https://linkedin.com" isExternal _hover={{ color: linkHoverColor }}>
                <Icon as={FaLinkedin} boxSize={5} />
              </Link>
            </Flex>
          </Stack>
        </SimpleGrid>
        
        <Divider my={6} borderColor={borderColor} />
        
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text>© {new Date().getFullYear()} RIMSS. All rights reserved</Text>
          <Text mt={{ base: 2, md: 0 }}>
            Designed and developed for Nagarro Assignment
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
