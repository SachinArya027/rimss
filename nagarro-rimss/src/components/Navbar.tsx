import { Box, Flex, Button, IconButton, useDisclosure, Container, Stack as ChakraStack, Link, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Image, Circle, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../contexts/useAuth';
import { useCart } from '../contexts/useCart';
import { useTheme } from '../contexts/ThemeContext';
import LoginModal from './LoginModal';
import UserProfile from './UserProfile';
import SearchBar from './SearchBar';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import LogoSvg from '../assets/Logo.svg';

const Navbar = () => {
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { currentUser } = useAuth();
  const { totalItems } = useCart();
  const { toggleTheme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  // Colors that adapt to the current theme
  const navBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const hoverColor = useColorModeValue('blue.500', 'blue.300');
  
  // Handle search submission
  const handleSearch = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Box as="nav" bg={navBgColor} boxShadow="md" position="fixed" width="100%" top={0} zIndex={1000}>
      <Container maxW="100%" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" mr={{ base: 2, md: 0 }}>
            <Link href="/" _hover={{ textDecoration: 'none' }}>
              <Image src={LogoSvg} alt="RIMSS Logo" height={{ base: "30px", md: "40px" }} />
            </Link>
          </Flex>

          <Flex display={{ base: 'none', lg: 'flex' }} alignItems="center" flex={1} mx={8} width="100%">
            <ChakraStack direction="row" gap={10} mr={8} flexShrink={0}>
              <Link href="/search?discounted=true" color={textColor} _hover={{ color: hoverColor }}>Sale</Link>
              <Link href="/search?category=men" color={textColor} _hover={{ color: hoverColor }}>Men</Link>
              <Link href="/search?category=women" color={textColor} _hover={{ color: hoverColor }}>Women</Link>
              <Link href="/search?category=accessories" color={textColor} _hover={{ color: hoverColor }}>Accessories</Link>
            </ChakraStack>
            
            {/* Desktop Search Bar */}
            <Box flex={1} width="100%">
              <SearchBar onSearch={handleSearch} />
            </Box>
          </Flex>

          <ChakraStack direction="row" gap={4} display={{ base: 'none', lg: 'flex' }} alignItems="center">
            {/* Theme Toggle */}
            <Tooltip label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton
                aria-label="Toggle color mode"
                icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
                variant="ghost"
                colorScheme="blue"
                onClick={toggleTheme}
                size="md"
              />
            </Tooltip>
            
            {/* Cart Icon */}
            <Box position="relative">
              <IconButton
                as={RouterLink}
                to="/cart"
                aria-label="Shopping cart"
                icon={<FiShoppingCart size="20px" />}
                variant="ghost"
                colorScheme="blue"
                size="md"
              />
              {totalItems > 0 && (
                <Circle
                  size="20px"
                  bg="red.500"
                  color="white"
                  fontSize="xs"
                  fontWeight="bold"
                  position="absolute"
                  top="-5px"
                  right="-5px"
                >
                  {totalItems}
                </Circle>
              )}
            </Box>
            
            {currentUser ? (
              <UserProfile />
            ) : (
              <Button variant="ghost" color={textColor} onClick={onLoginOpen}>
                Sign In
              </Button>
            )}
          </ChakraStack>

          <Flex display={{ base: 'flex', lg: 'none' }} alignItems="center" gap={2} flex={1}>
            <Box display={{ base: 'block', sm: 'block', lg: 'none' }} width="100%" flex={1}>
              <SearchBar 
                onSearch={handleSearch} 
                size="md" 
                placeholder="Search..."
                variant="filled"
              />
            </Box>
            {/* Mobile Cart Icon */}
            <Box position="relative">
              <IconButton
                as={RouterLink}
                to="/cart"
                aria-label="Shopping cart"
                icon={<FiShoppingCart size="20px" />}
                variant="ghost"
                colorScheme="blue"
                size="md"
              />
              {totalItems > 0 && (
                <Circle
                  size="20px"
                  bg="red.500"
                  color="white"
                  fontSize="xs"
                  fontWeight="bold"
                  position="absolute"
                  top="-5px"
                  right="-5px"
                >
                  {totalItems}
                </Circle>
              )}
            </Box>
            {/* Theme Toggle - Mobile */}
            <IconButton
              aria-label="Toggle color mode"
              icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
              variant="ghost"
              colorScheme="blue"
              onClick={toggleTheme}
              size="md"
            />
            <IconButton
              onClick={onMenuOpen}
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              color={textColor}
              size="md"
            />
          </Flex>
        </Flex>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <ChakraStack spacing={4}>
              {currentUser && <UserProfile />}
              <Link href="/search?category=men" py={2} color={textColor}>Men</Link>
              <Link href="/search?category=women" py={2} color={textColor}>Women</Link>
              <Link href="/search?category=accessories" py={2} color={textColor}>Accessories</Link>
              <Link href="/search?discounted=true" py={2} color={textColor}>Sale</Link>
              <Link href="/search" py={2} color={textColor}>Search Products</Link>
              {!currentUser && (
                <Button colorScheme="blue" w="full" onClick={() => {
                  onMenuClose();
                  onLoginOpen();
                }}>
                  Sign In
                </Button>
              )}
            </ChakraStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
    </Box>
  );
};

export default Navbar;
