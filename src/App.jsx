import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from './lib/i18n'
import { LanguageProvider } from './context/LanguageContext'
import { CalculatorProvider } from './context/CalculatorContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Calculator from './pages/Calculator'
import Results from './pages/Results'
import Courses from './pages/Courses'
import Counselling from './pages/Counselling'
import About from './pages/About'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <CalculatorProvider>
            <Router>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/results" element={<Results />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/counselling" element={<Counselling />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </Router>
          </CalculatorProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}
