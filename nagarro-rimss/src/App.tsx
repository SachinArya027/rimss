import { ChakraProvider, Box, extendTheme, Container, ColorModeScript, Flex } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HeroCarousel from './components/HeroCarousel'
import RunningBanner from './components/RunningBanner'
import FeaturedProducts from './components/FeaturedProducts'
import LatestOffers from './components/LatestOffers'
import AuthProvider from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartContext'
import FirestoreInitializer from './components/FirestoreInitializer'
import { ThemeProvider } from './contexts/ThemeContext'

// Lazy load all pages except home page components
const SearchPage = lazy(() => import('./pages/SearchPage'))
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'))

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
                  <Route path="/search" element={
                    <Suspense fallback={<Box pt="64px" display="flex" justifyContent="center" alignItems="center" minH="50vh">Loading...</Box>}>
                      <SearchPage />
                    </Suspense>
                  } />
                  <Route path="/product/:productId" element={
                    <Suspense fallback={<Box pt="64px" display="flex" justifyContent="center" alignItems="center" minH="50vh">Loading...</Box>}>
                      <ProductDetailsPage />
                    </Suspense>
                  } />
                  <Route path="/cart" element={
                    <Suspense fallback={<Box pt="64px" display="flex" justifyContent="center" alignItems="center" minH="50vh">Loading...</Box>}>
                      <CartPage />
                    </Suspense>
                  } />
                  <Route path="/orders" element={
                    <Suspense fallback={<Box pt="64px" display="flex" justifyContent="center" alignItems="center" minH="50vh">Loading...</Box>}>
                      <OrderHistoryPage />
                    </Suspense>
                  } />
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
