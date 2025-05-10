import { useState } from 'react';
import { Button, Box, Text, useToast, HStack, Spinner } from '@chakra-ui/react';
import { initializeFirestore } from '../firebase/initializeFirestore';

interface FirestoreInitializerProps {
  onInitialized?: () => void;
}

const FirestoreInitializer = ({ onInitialized }: FirestoreInitializerProps) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const toast = useToast();

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
    <Box p={4} borderWidth="1px" borderRadius="md" bg="white" shadow="sm">
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
