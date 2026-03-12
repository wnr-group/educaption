import { useTranslation } from 'react-i18next'
import { useCalculatorContext } from '../context/CalculatorContext'
import { Check, Circle } from 'lucide-react'
import {
  Step1GroupSelect,
  Step2MarksInput,
  ResultsDisplay
} from '../components/calculator'
import { useHeaderOffset } from '../hooks/useHeaderOffset'
import SEO, { schemas } from '../components/SEO'

function ProgressBar({ currentStep, hasResults }) {
  const { t } = useTranslation()

  const steps = [
    { number: 1, label: t('calculator.steps.group') },
    { number: 2, label: t('calculator.steps.marks') }
  ]

  if (hasResults) {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-center">
          <div className="
            flex items-center justify-center
            w-12 h-12
            bg-gradient-to-br from-emerald-500 to-emerald-600
            text-white
            rounded-2xl
            shadow-soft
          ">
            <Check className="w-6 h-6" strokeWidth={3} />
          </div>
          <span className="
            ml-4
            font-display text-xl font-bold
            text-emerald-600
          ">
            {t('calculator.steps.completed')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center
                  w-12 h-12
                  rounded-2xl
                  font-display font-bold text-lg
                  transition-all duration-300
                  ${currentStep >= step.number
                    ? 'bg-gradient-to-br from-saffron-500 to-saffron-600 text-white shadow-soft'
                    : 'bg-navy-100 text-navy-400'
                  }
                `}
              >
                {currentStep > step.number ? (
                  <Check className="w-6 h-6" strokeWidth={3} />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  mt-3
                  font-body font-medium text-sm
                  transition-colors duration-300
                  ${currentStep >= step.number ? 'text-saffron-600' : 'text-navy-400'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="flex items-center mx-4">
                <div
                  className={`
                    w-24 h-1
                    rounded-full
                    transition-all duration-500
                    ${currentStep > step.number
                      ? 'bg-gradient-to-r from-saffron-500 to-saffron-400'
                      : 'bg-navy-100'
                    }
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Calculator() {
  const { t } = useTranslation()
  const { step, results } = useCalculatorContext()
  const { headerPaddingClass } = useHeaderOffset()

  const renderStep = () => {
    if (results) {
      return <ResultsDisplay />
    }

    switch (step) {
      case 1:
        return <Step1GroupSelect />
      case 2:
        return <Step2MarksInput />
      default:
        return <Step1GroupSelect />
    }
  }

  // Use wider container when showing results
  const containerClass = results
    ? 'max-w-6xl' // 1152px for results with 3-column layout
    : 'max-w-2xl' // 672px for input steps

  const calculatorSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      schemas.educationalTool,
      schemas.breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Calculator', path: '/calculator' }
      ])
    ]
  }

  return (
    <>
      <SEO
        title="Cutoff Calculator 2026"
        description="Calculate your cutoff marks instantly. Enter your 12th marks and get accurate cutoff scores using official formulas."
        schema={calculatorSchema}
      />
      <main className={`min-h-screen bg-gradient-hero ${headerPaddingClass} pb-12 lg:pb-16`}>
      {/* Background decoration */}
      <div className="fixed inset-0 pattern-kolam opacity-30 pointer-events-none" />

      <div className={`relative ${containerClass} mx-auto px-4 sm:px-6 lg:px-8`}>
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="
            font-display text-4xl sm:text-5xl
            font-bold
            text-navy-900
            tracking-tighter
            mb-4
          ">
            {t('calculator.title')}
          </h1>
          <p className="
            font-body text-lg
            text-navy-500
          ">
            {t('calculator.subtitle')}
          </p>
        </div>

        <ProgressBar currentStep={step} hasResults={!!results} />

        {/* Step Content */}
        <div className="animate-fade-in">
          {renderStep()}
        </div>
      </div>
    </main>
    </>
  )
}
