import { ChakraProvider, Box, extendTheme, Container } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroCarousel from './components/HeroCarousel'
import FeaturedProducts from './components/FeaturedProducts'
import LatestOffers from './components/LatestOffers'
import AuthProvider from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartContext'
import FirestoreInitializer from './components/FirestoreInitializer'
import SearchPage from './pages/SearchPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CartPage from './pages/CartPage'

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
        <CartProvider>
          <Router>
            <Box minH="100vh" bg="gray.50">
              <Navbar />
              <Routes>
                <Route path="/" element={
                  <Box as="main" pt="64px">
                    <HeroCarousel />
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
              </Routes>
            </Box>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
