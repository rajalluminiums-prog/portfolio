import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import api from '../api';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  structuredData?: Record<string, any> | Record<string, any>[];
}

export default function SEO({
  title = "Premium Aluminium Fabricators & Sliding Windows in Indore | Raj Alluminiums",
  description = "Top-rated aluminium fabricators in Indore. Specializing in sliding & openable windows, office doors, custom partitions, cabin setups, and kitchen profile work.",
  keywords = "aluminium fabricators in Indore, sliding windows, openable windows, 2 track windows, 3 track windows, office doors, sliding doors, partition work, office cabins, custom partitions, kitchen profile work",
  url = "https://rajalluminiums.in/",
  image = "https://rajalluminiums.in/logo.png",
  structuredData,
}: SEOProps) {
  const [stats, setStats] = useState({ average: 0, total: 0 });

  useEffect(() => {
    api.get('/api/reviews/stats')
      .then(r => { if(r.data.success && r.data.data.total > 0) setStats(r.data.data) })
      .catch(() => {});
  }, []);
  
  // Default LocalBusiness Schema
  const defaultSchema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Raj Alluminiums & Door House",
    "image": image,
    "@id": url,
    "url": url,
    "telephone": "+91-9876543210",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "187, GNT Market",
      "addressLocality": "Indore",
      "addressRegion": "MP",
      "postalCode": "452002",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.7161, 
      "longitude": 75.8458
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "20:00"
    },
    "priceRange": "$$"
  };

  // Add dynamic AggregateRating if we have reviews
  if (stats.total > 0) {
    defaultSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": stats.average,
      "reviewCount": stats.total
    };
  }

  const schemas = [defaultSchema];
  if (structuredData) {
    if (Array.isArray(structuredData)) {
      schemas.push(...structuredData);
    } else {
      schemas.push(structuredData as any);
    }
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {schemas.map((schema, index) => (
        <script type="application/ld+json" key={index}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
