import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'Educaption'
const SITE_URL = 'https://educaption.org'
const DEFAULT_IMAGE = '/logo.png'

export default function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  schema = null,
  children
}) {
  const location = useLocation()
  const canonicalUrl = `${SITE_URL}${location.pathname}`
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={imageUrl} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {children}
    </Helmet>
  )
}

// Pre-defined schemas
export const schemas = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Educaption',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Helping Tamil Nadu students navigate admissions with cutoff calculators, course explorers, and counselling guides.',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@educaption.org',
      contactType: 'customer service'
    }
  },

  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Educaption',
    url: SITE_URL,
    description: 'Tamil Nadu Cutoff Calculator and Admissions Guide',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/courses?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  },

  breadcrumb: (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`
    }))
  }),

  educationalTool: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cutoff Calculator',
    url: `${SITE_URL}/calculator`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR'
    },
    description: 'Calculate your Tamil Nadu cutoff marks using official formulas. Free tool for students.'
  }
}
