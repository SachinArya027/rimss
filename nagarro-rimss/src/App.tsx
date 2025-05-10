import { ChakraProvider, Box, extendTheme, Container } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroCarousel from './components/HeroCarousel'
import FeaturedProducts from './components/FeaturedProducts'
import LatestOffers from './components/LatestOffers'
import AuthProvider from './contexts/AuthProvider'
import FirestoreInitializer from './components/FirestoreInitializer'
import SearchPage from './pages/SearchPage'

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
        <Router>
          <Box minH="100vh" bg="gray.50">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <Box as="main">
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
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
