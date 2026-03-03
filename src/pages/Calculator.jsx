import { useTranslation } from 'react-i18next'
import { useCalculatorContext } from '../context/CalculatorContext'
import {
  Step1GroupSelect,
  Step2MarksInput,
  Step3CategorySelect,
  ResultsDisplay
} from '../components/calculator'

/**
 * Progress bar component showing calculator steps
 */
function ProgressBar({ currentStep, hasResults }) {
  const { t } = useTranslation()

  const steps = [
    { number: 1, label: t('calculator.steps.group') },
    { number: 2, label: t('calculator.steps.marks') },
    { number: 3, label: t('calculator.steps.category') }
  ]

  // If we have results, show completed state
  if (hasResults) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary text-white rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="ml-3 text-lg font-medium text-secondary">
            {t('calculator.steps.completed')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.number
                    ? 'bg-primary border-primary text-white'
                    : 'border-slate-300 text-slate-400'
                }`}
              >
                {currentStep > step.number ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-xs text-center hidden sm:block ${
                  currentStep >= step.number ? 'text-primary font-medium' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded transition-colors ${
                  currentStep > step.number ? 'bg-primary' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile step label */}
      <div className="mt-4 text-center sm:hidden">
        <span className="text-primary font-medium">
          {steps.find(s => s.number === currentStep)?.label}
        </span>
        <span className="text-slate-400 ml-2">
          ({currentStep} / {steps.length})
        </span>
      </div>
    </div>
  )
}

/**
 * Main Calculator page component
 */
export default function Calculator() {
  const { t } = useTranslation()
  const { step, results } = useCalculatorContext()

  // Render the current step component
  const renderStep = () => {
    // If we have results, show the results display
    if (results) {
      return <ResultsDisplay />
    }

    switch (step) {
      case 1:
        return <Step1GroupSelect />
      case 2:
        return <Step2MarksInput />
      case 3:
        return <Step3CategorySelect />
      default:
        return <Step1GroupSelect />
    }
  }

  return (
    <main className="min-h-screen bg-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {t('calculator.title')}
        </h1>
        <p className="text-slate-600 text-center mb-8">
          {t('calculator.subtitle')}
        </p>

        <ProgressBar currentStep={step} hasResults={!!results} />

        {renderStep()}
      </div>
    </main>
  )
}
