import { Box, Flex, Button, IconButton, useDisclosure, Container, Stack as ChakraStack, Link, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Image } from '@chakra-ui/react';
import { HamburgerIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/useAuth';
import LoginModal from './LoginModal';
import UserProfile from './UserProfile';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import LogoSvg from '../assets/Logo.svg';

const Navbar = () => {
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Handle search submission
  const handleSearch = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Box as="nav" bg="white" boxShadow="md" position="fixed" width="100%" top={0} zIndex={1000}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" mr={{ base: 2, md: 0 }}>
            <Link href="/" _hover={{ textDecoration: 'none' }}>
              <Image src={LogoSvg} alt="RIMSS Logo" height={{ base: "30px", md: "40px" }} />
            </Link>
          </Flex>

          <Flex display={{ base: 'none', lg: 'flex' }} alignItems="center" flex={1} mx={6}>
            <ChakraStack direction="row" gap={8} mr={6}>
              <Link href="/" color="gray.700" _hover={{ color: 'blue.500' }}>Home</Link>
              <Link href="/search?category=men" color="gray.700" _hover={{ color: 'blue.500' }}>Men</Link>
              <Link href="/search?category=women" color="gray.700" _hover={{ color: 'blue.500' }}>Women</Link>
              <Link href="/search?category=accessories" color="gray.700" _hover={{ color: 'blue.500' }}>Accessories</Link>
              <Link href="/search?discounted=true" color="gray.700" _hover={{ color: 'blue.500' }}>Sale</Link>
            </ChakraStack>
            
            {/* Desktop Search Bar */}
            <Box flex={1} maxW="400px">
              <SearchBar onSearch={handleSearch} />
            </Box>
          </Flex>

          <ChakraStack direction="row" gap={4} display={{ base: 'none', lg: 'flex' }}>
            {currentUser ? (
              <UserProfile />
            ) : (
              <Button variant="ghost" color="gray.700" onClick={onLoginOpen}>
                Sign In
              </Button>
            )}
            <Button leftIcon={<ChevronRightIcon />}>Cart (0)</Button>
          </ChakraStack>

          <Flex display={{ base: 'flex', lg: 'none' }} alignItems="center" gap={2}>
            <Box display={{ base: 'block', sm: 'block', lg: 'none' }} width={{ base: "240px", sm: "320px" }}>
              <SearchBar 
                onSearch={handleSearch} 
                size="md" 
                placeholder="Search..."
                variant="filled"
              />
            </Box>
            <IconButton
              onClick={onMenuOpen}
              icon={<HamburgerIcon />}
              variant="ghost"
              aria-label="Open Menu"
              ml="auto"
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
              <Link href="/" py={2} color="gray.700">Home</Link>
              <Link href="/search?category=men" py={2} color="gray.700">Men</Link>
              <Link href="/search?category=women" py={2} color="gray.700">Women</Link>
              <Link href="/search?category=accessories" py={2} color="gray.700">Accessories</Link>
              <Link href="/search?discounted=true" py={2} color="gray.700">Sale</Link>
              <Link href="/search" py={2} color="gray.700">Search Products</Link>
              {currentUser ? (
                <Button variant="outline" w="full" onClick={onMenuClose}>
                  My Profile
                </Button>
              ) : (
                <Button variant="outline" w="full" onClick={() => {
                  onMenuClose();
                  onLoginOpen();
                }}>
                  Sign In
                </Button>
              )}
              <Button w="full" leftIcon={<ChevronRightIcon />}>Cart (0)</Button>
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
