import { ChakraProvider, Box, extendTheme } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import HeroCarousel from './components/HeroCarousel'
import FeaturedProducts from './components/FeaturedProducts'
import LatestOffers from './components/LatestOffers'
import AuthProvider from './contexts/AuthProvider'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50'
      }
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'blue'
      }
    }
  }
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Box minH="100vh">
          <Navbar />
          <Box as="main">
            <HeroCarousel />
            <Box py={8}>
              <FeaturedProducts />
              <LatestOffers />
            </Box>
          </Box>
        </Box>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
