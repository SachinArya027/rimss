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
  const isDevelopment = import.meta.env.MODE === 'development';
  
  if (!isDevelopment) {
    return null;
  }

  const runAction = async (forceReset: boolean) => {
    const setBusy = forceReset ? setIsResetting : setIsInitializing;
    setBusy(true);
    try {
      await initializeFirestore(forceReset);
      toast({
        title: forceReset ? 'Database reset' : 'Database initialized',
        description: forceReset
          ? 'Firestore data has been reset with fresh sample data'
          : 'Sample data has been added to Firestore',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onInitialized?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: forceReset ? 'Reset failed' : 'Initialization failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg="white" shadow="sm" mt={4}>
      <Text fontSize="xs" color="gray.500" mb={2}>Development Mode Only</Text>
      <Text mb={4} fontWeight="medium">Firestore Database Management</Text>
      <HStack spacing={4}>
        <Button 
          colorScheme="blue" 
          onClick={() => runAction(false)} 
          isDisabled={isInitializing || isResetting}
          leftIcon={isInitializing ? <Spinner size="sm" /> : undefined}
        >
          {isInitializing ? 'Initializing...' : 'Initialize Database'}
        </Button>
        <Button 
          colorScheme="red" 
          onClick={() => runAction(true)} 
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
