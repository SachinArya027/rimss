import React from 'react';
import { Box, keyframes, useColorModeValue } from '@chakra-ui/react';

interface RunningBannerProps {
  text?: string;
  speed?: number;
  backgroundColor?: string;
  textColor?: string;
}

const RunningBanner: React.FC<RunningBannerProps> = ({
  text = "🔥 Special Offers! Free Shipping on Orders Over $50! Shop Now! 🛒 Limited Time Deals! 🔥",
  speed = 30,
  backgroundColor,
  textColor,
}) => {
  // Get theme-aware colors
  const bgColor = useColorModeValue('blue.500', 'blue.700');
  const txtColor = useColorModeValue('white', 'white');

  // Create a keyframe animation for the running text
  const marqueeAnimation = keyframes`
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
  `;

  // Create a duplicate of the text to ensure continuous flow
  const repeatedText = `${text} ${text} ${text} ${text} ${text} ${text} ${text} ${text}`;

  return (
    <Box
      width="100%"
      bg={backgroundColor || bgColor}
      py={3}
      overflow="hidden"
      position="relative"
    >
      <Box
        css={{
          '&::before': {
            content: `"${repeatedText}"`,
            display: 'inline-block',
            whiteSpace: 'nowrap',
            animation: `${marqueeAnimation} ${speed}s linear infinite`,
            color: txtColor,
            fontWeight: 'bold',
          }
        }}
        color={textColor || txtColor}
        fontWeight="bold"
        fontSize="md"
        letterSpacing="0.5px"
        whiteSpace="nowrap"
      >
        {repeatedText}
      </Box>
    </Box>
  );
};

export default RunningBanner;
