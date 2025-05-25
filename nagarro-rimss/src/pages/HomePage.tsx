import { Box, Container } from '@chakra-ui/react'
import HeroCarousel from '../components/HeroCarousel'
import RunningBanner from '../components/RunningBanner'
import FeaturedProducts from '../components/FeaturedProducts'
import LatestOffers from '../components/LatestOffers'
import FirestoreInitializer from '../components/FirestoreInitializer'
import SEO from '../components/SEO'

const HomePage = () => {
  return (
    <>
      <SEO 
        title="RIMSS - Retail Inventory Management & Shopping System"
        description="Discover the latest trends in fashion, electronics, and home goods at RIMSS. Shop our curated collection of high-quality products at competitive prices."
        canonical="/"
        keywords="online shopping, retail, fashion, electronics, home goods, best deals, RIMSS"
      />
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
    </>
  )
}

export default HomePage
