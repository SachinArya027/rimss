import { ChakraProvider, Box, extendTheme, Container, ColorModeScript, Flex } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HeroCarousel from './components/HeroCarousel'
import RunningBanner from './components/RunningBanner'
import FeaturedProducts from './components/FeaturedProducts'
import LatestOffers from './components/LatestOffers'
import AuthProvider from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartContext'
import FirestoreInitializer from './components/FirestoreInitializer'
import SearchPage from './pages/SearchPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CartPage from './pages/CartPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import { ThemeProvider } from './contexts/ThemeContext'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800'
      }
    })
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
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Flex direction="column" minH="100vh">
              <Navbar />
              <Box flex="1">
                <Routes>
                  <Route path="/" element={
                    <Box as="main" pt="64px">
                      <HeroCarousel />
                      <RunningBanner />
                      <Box py={8}>
                        <FeaturedProducts />
                        <LatestOffers />
                      </Box>
                      <Container maxW="container.xl" py={8}>
                        <FirestoreInitializer />
                      </Container>
                    </Box>
                  } />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/product/:productId" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                </Routes>
              </Box>
              <Footer />
            </Flex>
          </Router>
        </CartProvider>
      </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  )
}

export default App
