import { useTranslation } from 'react-i18next'
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg">
      <HeroSection />
      <FeaturesSection />
    </div>
  )
}
