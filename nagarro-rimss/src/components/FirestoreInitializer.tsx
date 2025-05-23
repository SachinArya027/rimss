import { useState } from 'react';
import { Button, Box, Text, useToast, HStack, Spinner } from '@chakra-ui/react';
import { initializeFirestore } from '../firebase/initializeFirestore';

interface FirestoreInitializerProps {
  onInitialized?: () => void;
}

const FirestoreInitializer = ({ onInitialized }: FirestoreInitializerProps) => {
  // React hooks must be called at the top level before any conditional returns
  const [isInitializing, setIsInitializing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const toast = useToast();
  
  // Check if we're in development mode
  const isDevelopment = import.meta.env.MODE === 'development';
  
  // If not in development mode, don't render anything
  if (!isDevelopment) {
    return null;
  }

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializeFirestore(false);
      toast({
        title: 'Database initialized',
        description: 'Sample data has been added to Firestore',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      if (onInitialized) onInitialized();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Initialization failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await initializeFirestore(true);
      toast({
        title: 'Database reset',
        description: 'Firestore data has been reset with fresh sample data',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      if (onInitialized) onInitialized();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Reset failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg="white" shadow="sm" mt={4}>
      <Text fontSize="xs" color="gray.500" mb={2}>Development Mode Only</Text>
      <Text mb={4} fontWeight="medium">Firestore Database Management</Text>
      <HStack spacing={4}>
        <Button 
          colorScheme="blue" 
          onClick={handleInitialize} 
          isDisabled={isInitializing || isResetting}
          leftIcon={isInitializing ? <Spinner size="sm" /> : undefined}
        >
          {isInitializing ? 'Initializing...' : 'Initialize Database'}
        </Button>
        <Button 
          colorScheme="red" 
          onClick={handleReset} 
          isDisabled={isInitializing || isResetting}
          leftIcon={isResetting ? <Spinner size="sm" /> : undefined}
        >
          {isResetting ? 'Resetting...' : 'Reset Database'}
        </Button>
      </HStack>
    </Box>
  );
};

export default FirestoreInitializer;
