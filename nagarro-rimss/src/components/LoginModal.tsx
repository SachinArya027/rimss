import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Divider,
  Text,
  useToast,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../contexts/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const toast = useToast();

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: 'Login successful',
        description: 'You have been logged in with Google',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      toast({
        title: 'Login successful',
        description: 'You have been logged in',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await registerWithEmail(email, password);
      toast({
        title: 'Account created',
        description: 'Your account has been created and you are now logged in',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Sign up failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    // Clear form errors when switching tabs
    setEmailError('');
    setPasswordError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign In to RIMSS</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text fontSize="sm" color="gray.600">
              Sign in to access your account, track orders, and enjoy a personalized shopping experience.
            </Text>
            
            <Tabs isFitted variant="enclosed" index={tabIndex} onChange={handleTabsChange} width="100%">
              <TabList mb="1em">
                <Tab>Sign In</Tab>
                <Tab>Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={4}>
                    <FormControl isInvalid={!!emailError}>
                      <FormLabel>Email</FormLabel>
                      <Input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                      {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                    </FormControl>
                    
                    <FormControl isInvalid={!!passwordError}>
                      <FormLabel>Password</FormLabel>
                      <Input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                      {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                    </FormControl>
                    
                    <Button 
                      colorScheme="blue" 
                      width="100%" 
                      onClick={handleEmailSignIn}
                      isLoading={isLoading && tabIndex === 0}
                      loadingText="Signing in..."
                    >
                      Sign In
                    </Button>
                  </VStack>
                </TabPanel>
                
                <TabPanel>
                  <VStack spacing={4}>
                    <FormControl isInvalid={!!emailError}>
                      <FormLabel>Email</FormLabel>
                      <Input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                      {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                    </FormControl>
                    
                    <FormControl isInvalid={!!passwordError}>
                      <FormLabel>Password</FormLabel>
                      <Input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                      />
                      {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                    </FormControl>
                    
                    <Button 
                      colorScheme="green" 
                      width="100%" 
                      onClick={handleEmailSignUp}
                      isLoading={isLoading && tabIndex === 1}
                      loadingText="Creating account..."
                    >
                      Create Account
                    </Button>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
            
            <Divider />
            
            <Text fontSize="sm" fontWeight="medium" textAlign="center">
              Or continue with
            </Text>
            
            <Button
              leftIcon={<FcGoogle />}
              onClick={handleGoogleSignIn}
              isLoading={isLoading && tabIndex === -1}
              loadingText="Signing in..."
              w="full"
              variant="outline"
            >
              Sign in with Google
            </Button>
            
            <Divider />
            
            <Text fontSize="xs" color="gray.500" textAlign="center">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
