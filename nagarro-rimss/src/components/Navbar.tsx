import { Box, Flex, Button, IconButton, useDisclosure, Container, Stack as ChakraStack, Link, Text, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { HamburgerIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/useAuth';
import LoginModal from './LoginModal';
import UserProfile from './UserProfile';

const Navbar = () => {
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { currentUser } = useAuth();

  return (
    <Box as="nav" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={1000}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">RIMSS</Text>
          </Flex>

          <Flex display={{ base: 'none', md: 'flex' }} alignItems="center">
            <ChakraStack direction="row" gap={8}>
              <Link href="#" color="gray.700" _hover={{ color: 'blue.500' }}>Home</Link>
              <Link href="#" color="gray.700" _hover={{ color: 'blue.500' }}>Men</Link>
              <Link href="#" color="gray.700" _hover={{ color: 'blue.500' }}>Women</Link>
              <Link href="#" color="gray.700" _hover={{ color: 'blue.500' }}>Children</Link>
              <Link href="#" color="gray.700" _hover={{ color: 'blue.500' }}>Sale</Link>
            </ChakraStack>
          </Flex>

          <ChakraStack direction="row" gap={4} display={{ base: 'none', md: 'flex' }}>
            {currentUser ? (
              <UserProfile />
            ) : (
              <Button variant="ghost" color="gray.700" onClick={onLoginOpen}>
                Sign In
              </Button>
            )}
            <Button leftIcon={<ChevronRightIcon />}>Cart (0)</Button>
          </ChakraStack>

          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onMenuOpen}
            icon={<HamburgerIcon />}
            variant="ghost"
            aria-label="Open Menu"
          />
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
              <Link href="#" py={2} color="gray.700">Home</Link>
              <Link href="#" py={2} color="gray.700">Men</Link>
              <Link href="#" py={2} color="gray.700">Women</Link>
              <Link href="#" py={2} color="gray.700">Children</Link>
              <Link href="#" py={2} color="gray.700">Sale</Link>
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
