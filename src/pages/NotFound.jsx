import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import SEO from '../components/SEO'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        noindex={true}
      />
      <main className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pattern-kolam opacity-30 pointer-events-none" />

      <div className="relative text-center max-w-lg">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="
            font-display text-[12rem] leading-none
            font-bold
            text-gradient
            tracking-tighter
          ">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="
          font-display text-3xl font-bold
          text-navy-900
          mb-4
        ">
          {t('errors.pageNotFound')}
        </h2>
        <p className="
          font-body text-lg
          text-navy-500
          mb-10
        ">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button
              size="lg"
              variant="primary"
              icon={Home}
              iconPosition="left"
            >
              {t('errors.goHome')}
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="
              inline-flex items-center gap-2
              px-6 py-3
              font-body font-semibold
              text-navy-600
              hover:text-saffron-600
              transition-colors duration-200
            "
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </main>
    </>
  )
}
