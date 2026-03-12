import { useTranslation } from 'react-i18next'
import SEO, { schemas } from '../components/SEO'
import HeroSection from '../components/home/HeroSection'
import HowItWorksSection from '../components/home/HowItWorksSection'
import FeaturesSection from '../components/home/FeaturesSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import CTASection from '../components/home/CTASection'

export default function Home() {
  const { t } = useTranslation()

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      schemas.organization,
      schemas.website
    ]
  }

  return (
    <>
      <SEO
        title="Cutoff Calculator & Course Explorer"
        description="Calculate your Tamil Nadu cutoff, explore 500+ courses, and find your path. Free admission guide for TN students."
        schema={homeSchema}
      />
      <main className="min-h-screen">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </>
  )
}
