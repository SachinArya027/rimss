import { useState, useCallback } from 'react';
import { Box, Container, Text, Button, Flex, useInterval } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1920&h=800',
    title: 'Summer Collection 2025',
    subtitle: 'Discover the latest trends in fashion',
    cta: 'Shop Now'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&h=800',
    title: 'Luxury Essentials',
    subtitle: 'Elevate your style with premium pieces',
    cta: 'Explore Collection'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1920&h=800',
    title: 'New Arrivals',
    subtitle: 'Be the first to wear our latest designs',
    cta: 'View New Arrivals'
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-advance slides every 5 seconds when not hovered
  useInterval(nextSlide, isHovered ? null : 5000);

  return (
    <Box 
      position="relative" 
      height={{ base: '400px', md: '600px' }}
      overflow="hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <Flex
        position="relative"
        height="100%"
        width={`${slides.length * 100}%`}
        transform={`translateX(-${(currentSlide * 100) / slides.length}%)`}
        transition="transform 0.5s ease-in-out"
      >
        {/* Slides */}
        {slides.map((slide) => (
          <Box
            key={slide.id}
            width={`${100 / slides.length}%`}
            height="100%"
            position="relative"
            flexShrink={0}
          >
            {/* Background Image */}
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              backgroundImage={`url(${slide.image})`}
              backgroundSize="cover"
              backgroundPosition="center"
              _after={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bg: 'blackAlpha.400'
              }}
            />

            {/* Content */}
            <Container maxW="container.xl" height="100%">
              <Flex
                height="100%"
                direction="column"
                justifyContent="center"
                alignItems={{ base: 'center', md: 'flex-start' }}
                position="relative"
                color="white"
                textAlign={{ base: 'center', md: 'left' }}
              >
                <Text
                  fontSize={{ base: '3xl', md: '5xl' }}
                  fontWeight="bold"
                  textShadow="2px 2px 4px rgba(0,0,0,0.4)"
                  mb={4}
                >
                  {slide.title}
                </Text>
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  mb={8}
                  textShadow="1px 1px 2px rgba(0,0,0,0.4)"
                >
                  {slide.subtitle}
                </Text>
                <Button
                  size="lg"
                  colorScheme="blue"
                  onClick={() => navigate('/search')}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg'
                  }}
                >
                  {slide.cta}
                </Button>
              </Flex>
            </Container>
          </Box>
        ))}
      </Flex>

      {/* Navigation Arrows */}
      <Flex
        position="absolute"
        width="100%"
        justify="space-between"
        top="50%"
        transform="translateY(-50%)"
        px={4}
        display={{ base: 'none', md: isHovered ? 'flex' : 'none' }}
      >
        <Button
          onClick={prevSlide}
          variant="solid"
          colorScheme="whiteAlpha"
          rounded="full"
          w={12}
          h={12}
          opacity={0.8}
          _hover={{ opacity: 1 }}
        >
          <ChevronLeftIcon w={8} h={8} />
        </Button>
        <Button
          onClick={nextSlide}
          variant="solid"
          colorScheme="whiteAlpha"
          rounded="full"
          w={12}
          h={12}
          opacity={0.8}
          _hover={{ opacity: 1 }}
        >
          <ChevronRightIcon w={8} h={8} />
        </Button>
      </Flex>

      {/* Slide Indicators */}
      <Flex
        position="absolute"
        bottom={4}
        width="100%"
        justify="center"
        gap={2}
        zIndex={1}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            w={2}
            h={2}
            borderRadius="full"
            bg={index === currentSlide ? 'white' : 'whiteAlpha.500'}
            cursor="pointer"
            onClick={() => goToSlide(index)}
            transition="all 0.2s"
            _hover={{ transform: 'scale(1.2)' }}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default HeroCarousel;
