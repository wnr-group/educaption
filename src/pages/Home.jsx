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
        title="Tamil Nadu Cutoff Calculator & Admission Guide 2026"
        description="Free Tamil Nadu cutoff calculator for TNEA, TNAU, TANUVAS, TNJFU, TNDALU & Paramedical 2026. Check eligible courses after 12th, counselling guide for TN students."
        keywords="Tamil Nadu counselling website, TN students admission guide, Tamil medium students counselling guide, 12th ku apram enna course, cutoff mark la enna course kidaikum, TNEA counselling eppadi apply panrathu, educaption counselling guide, educaption cutoff checker, educaption TN admission website, Tamil Nadu college admission 2026, TN 12th counselling guide, best courses after 12th Tamil Nadu, TN government college admission process, after 12th what are options Tamil Nadu counselling"
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
