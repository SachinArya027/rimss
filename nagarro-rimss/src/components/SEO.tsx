import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  ogUrl?: string;
  keywords?: string;
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({
  title = 'RIMSS - Retail Inventory Management & Shopping System',
  description = 'Explore our wide range of products at RIMSS. Find the latest fashion, electronics, and home goods at competitive prices.',
  canonical,
  ogType = 'website',
  ogImage = '/logo.png',
  ogUrl,
  keywords = 'retail, shopping, fashion, electronics, inventory, online store',
  children,
}) => {
  // Construct the full title with brand name
  const fullTitle = title.includes('RIMSS') ? title : `${title} | RIMSS`;
  
  // Use the deployment URL from Firebase as the base URL
  const baseUrl = 'https://nagarro-rimss-27.web.app';
  const url = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const image = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical link */}
      {canonical && <link rel="canonical" href={url} />}
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl || url} />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional meta tags for mobile and SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#4299E1" />
      <meta name="robots" content="index, follow" />
      
      {children}
    </Helmet>
  );
};

export default SEO;
