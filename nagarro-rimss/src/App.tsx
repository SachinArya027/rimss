import { ChakraProvider, Box, extendTheme, ColorModeScript, Flex } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthProvider from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartContext'
import { ThemeProvider } from './contexts/ThemeContext'
import HomePage from './pages/HomePage'

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
                  <Route path="/" element={<HomePage />} />
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
