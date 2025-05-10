import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Text,
  Flex,
  Divider,
  useToast
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/useAuth';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error logging out',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!currentUser) return null;

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
        <Flex align="center">
          <Avatar 
            size="sm" 
            src={currentUser.photoURL || undefined} 
            name={currentUser.displayName || 'User'} 
            mr={2} 
          />
          <Text display={{ base: 'none', md: 'block' }}>
            {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
          </Text>
        </Flex>
      </MenuButton>
      <MenuList>
        <Flex direction="column" px={3} py={2}>
          <Text fontWeight="bold">{currentUser.displayName || 'User'}</Text>
          <Text fontSize="sm" color="gray.600">{currentUser.email}</Text>
        </Flex>
        <Divider my={2} />
        <MenuItem>My Profile</MenuItem>
        <MenuItem>Order History</MenuItem>
        <MenuItem>Wishlist</MenuItem>
        <Divider my={2} />
        <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserProfile;
