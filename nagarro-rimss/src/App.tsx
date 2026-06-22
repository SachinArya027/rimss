import { ChakraProvider, Box, extendTheme, ColorModeScript, Flex } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthProvider from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartContext'
import HomePage from './pages/HomePage'

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

const pageLoader = (
  <Box pt="64px" display="flex" justifyContent="center" alignItems="center" minH="50vh">
    Loading...
  </Box>
)

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={pageLoader}>{children}</Suspense>
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Flex direction="column" minH="100vh">
              <Navbar />
              <Box flex="1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<LazyRoute><SearchPage /></LazyRoute>} />
                  <Route path="/product/:productId" element={<LazyRoute><ProductDetailsPage /></LazyRoute>} />
                  <Route path="/cart" element={<LazyRoute><CartPage /></LazyRoute>} />
                  <Route path="/orders" element={<LazyRoute><OrderHistoryPage /></LazyRoute>} />
                </Routes>
              </Box>
              <Footer />
            </Flex>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
