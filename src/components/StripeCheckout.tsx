import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  Spinner,
  useToast,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { getStripe, handlePaymentSuccess } from '../services/stripeService';

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutForm = ({ amount, onSuccess }: { amount: number; onSuccess: (paymentId: string) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const mockPaymentIntent = {
        id: 'mock_payment_intent_' + Date.now(),
        status: 'succeeded',
        amount: amount,
      };

      const { success } = await handlePaymentSuccess();
      
      if (success) {
        toast({
          title: 'Payment processed!',
          description: 'Your payment has been processed successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        onSuccess(mockPaymentIntent.id);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Text mb={2} fontWeight="medium">Card Details</Text>
          <CardElement options={cardElementOptions} />
        </Box>

        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={processing}
          loadingText="Processing"
          isDisabled={!stripe || processing}
          mt={4}
        >
          {processing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
        </Button>
      </VStack>
    </form>
  );
};

interface StripeCheckoutProps {
  amount: number;
  onCancel: () => void;
  onSuccess: (orderId: string) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, onCancel, onSuccess }) => {
  const [stripePromise] = useState(() => getStripe());
  
  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading size="md">Complete Your Purchase</Heading>
        <Divider />
        
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} />
          </Elements>
        ) : (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
            <Text mt={4}>Loading payment system...</Text>
          </Box>
        )}
        
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </VStack>
    </Box>
  );
};

export default StripeCheckout;
