import { Box, Flex, Button, IconButton, useDisclosure, Container, Stack as ChakraStack, Link, Text, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { HamburgerIcon, ChevronRightIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <Button variant="ghost" color="gray.700">Sign In</Button>
            <Button leftIcon={<ChevronRightIcon />}>Cart (0)</Button>
          </ChakraStack>

          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            icon={<HamburgerIcon />}
            variant="ghost"
            aria-label="Open Menu"
          />
        </Flex>
      </Container>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
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
              <Button variant="outline" w="full">Sign In</Button>
              <Button w="full" leftIcon={<ChevronRightIcon />}>Cart (0)</Button>
            </ChakraStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
