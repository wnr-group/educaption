# Educaption Cutoff Calculator - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete mobile-first web app for Tamil Nadu 12th standard students to calculate cutoff marks, discover eligible courses/colleges, and access counselling guidance.

**Architecture:** React + Vite frontend deployed on Vercel, Supabase backend for data + auth, Tailwind CSS for styling, i18next for bilingual (EN/Tamil) support, React Router for navigation, React Query for server state.

**Tech Stack:** React 18, Vite, Tailwind CSS, React Router v6, React Query, React Hook Form, Zod, i18next, Supabase (PostgreSQL + Auth), Lucide React icons, Vercel deployment.

---

## Phase 1: Project Setup & Infrastructure (5 tasks)

### Task 1: Initialize React + Vite project with all dependencies

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `.env.example`
- Create: `index.html`

**Step 1: Create package.json with all dependencies**

```json
{
  "name": "educaption-cutoff",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "i18next": "^23.7.0",
    "react-i18next": "^13.5.0",
    "@supabase/supabase-js": "^2.38.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.0.0"
  }
}
```

**Step 2: Create vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

**Step 3: Create tailwind.config.js**

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#10B981',
        accent: '#F59E0B',
        bg: '#F8FAFC',
        text: '#1E293B'
      }
    }
  },
  plugins: []
}
```

**Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Educaption Cutoff Calculator</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

**Step 5: Create .env.example**

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

**Step 6: Run npm install**

```bash
npm install
```

Expected: All packages installed, node_modules created.

**Step 7: Commit**

```bash
git add package.json vite.config.js tailwind.config.js index.html .env.example
git commit -m "setup: initialize React + Vite project with dependencies"
```

---

### Task 2: Configure Tailwind CSS and create base styles

**Files:**
- Create: `src/index.css`
- Create: `src/main.jsx`
- Create: `postcss.config.js`

**Step 1: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

**Step 2: Create src/index.css with Tailwind directives**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

/* Base typography */
body {
  @apply bg-bg text-text font-sans;
}

h1, h2, h3, h4, h5, h6 {
  @apply font-bold;
}

button {
  @apply transition-colors duration-200;
}

input, textarea, select {
  @apply rounded border border-slate-300 px-3 py-2;
}
```

**Step 3: Create src/main.jsx**

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**Step 4: Test by running dev server**

```bash
npm run dev
```

Expected: Vite dev server starts on localhost:5173 (will error because App doesn't exist yet, which is fine).

**Step 5: Commit**

```bash
git add src/index.css src/main.jsx postcss.config.js
git commit -m "setup: configure Tailwind CSS and base styles"
```

---

### Task 3: Setup Supabase connection and environment

**Files:**
- Create: `src/lib/supabase.js`
- Modify: `.env.local` (create locally, don't commit)

**Step 1: Create src/lib/supabase.js**

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
```

**Step 2: Create .env.local (locally)**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Note: In real setup, get these from Supabase dashboard after creating project.

**Step 3: Add .env.local to .gitignore**

```bash
echo ".env.local" >> .gitignore
```

**Step 4: Test import (verify no errors)**

```bash
node -e "import('./src/lib/supabase.js')" 2>&1 | head -20
```

Expected: No import errors (will show network error if keys are dummy, which is okay).

**Step 5: Commit**

```bash
git add src/lib/supabase.js .gitignore
git commit -m "setup: configure Supabase client connection"
```

---

### Task 4: Setup i18n (internationalization) for English + Tamil

**Files:**
- Create: `public/locales/en.json`
- Create: `public/locales/ta.json`
- Create: `src/lib/i18n.js`

**Step 1: Create English locale (en.json)**

```json
{
  "nav": {
    "home": "Home",
    "calculator": "Calculator",
    "courses": "Courses",
    "colleges": "Colleges",
    "counselling": "Counselling",
    "about": "About"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "next": "Next",
    "back": "Back",
    "submit": "Submit",
    "cancel": "Cancel"
  },
  "home": {
    "title": "Find Your Path",
    "subtitle": "Calculate your cutoff and discover your future",
    "cta": "Calculate My Cutoff"
  },
  "calculator": {
    "title": "Cutoff Calculator",
    "step1": "Select Your Group",
    "step2": "Enter Your Marks",
    "step3": "Select Category",
    "selectGroup": "Choose a subject group...",
    "enterMarks": "Enter marks for each subject (0-100)",
    "selectCategory": "Choose your community category"
  },
  "results": {
    "title": "Your Results",
    "cutoffScores": "Cutoff Scores",
    "eligibleCourses": "Eligible Courses",
    "exploreCourses": "Explore All Courses",
    "viewColleges": "View Colleges"
  }
}
```

**Step 2: Create Tamil locale (ta.json)**

```json
{
  "nav": {
    "home": "முகப்பு",
    "calculator": "கணக்கீடு",
    "courses": "படிப்புகள்",
    "colleges": "கல்லூரிகள்",
    "counselling": "ஆலோசனை",
    "about": "பற்றி"
  },
  "common": {
    "loading": "ஏற்றுகிறது...",
    "error": "ஏதோ தவறு நடந்தது",
    "next": "அடுத்தது",
    "back": "பின்னுக்கு",
    "submit": "சமர்ப்பிக்கவும்",
    "cancel": "ரத்து செய்யவும்"
  },
  "home": {
    "title": "உங்கள் பாதையைக் கண்டறியவும்",
    "subtitle": "உங்கள் கட்ஆஃபை கணக்கிட்டு உங்கள் எதிர்காலத்தைக் கண்டறியவும்",
    "cta": "என் கட்ஆஃப் கணக்கிட்டு பாருங்கள்"
  },
  "calculator": {
    "title": "கட்ஆஃப் கணக்கீடு",
    "step1": "உங்கள் குழுவைத் தேர்ந்தெடுக்கவும்",
    "step2": "உங்கள் மதிப்பெண்களை உள்ளிடவும்",
    "step3": "வகையைத் தேர்ந்தெடுக்கவும்",
    "selectGroup": "ஒரு பாடப் பொருளைத் தேர்ந்தெடுக்கவும்...",
    "enterMarks": "ஒவ்வொரு பாடத்துக்கும் மதிப்பெண்களை உள்ளிடவும் (0-100)",
    "selectCategory": "உங்கள் சமூக வகையைத் தேர்ந்தெடுக்கவும்"
  },
  "results": {
    "title": "உங்கள் முடிவுகள்",
    "cutoffScores": "கட்ஆஃப் மதிப்பெண்கள்",
    "eligibleCourses": "தகுதியுள்ள படிப்புகள்",
    "exploreCourses": "அனைத்து படிப்புகளைப் பார்க்கவும்",
    "viewColleges": "கல்லூரிகளைக் காணவும்"
  }
}
```

**Step 3: Create src/lib/i18n.js**

```javascript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enLocale from '../../public/locales/en.json'
import taLocale from '../../public/locales/ta.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enLocale },
      ta: { translation: taLocale }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
```

**Step 4: Test locales are valid JSON**

```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('public/locales/en.json', 'utf-8')).nav.home)"
```

Expected: "Home" printed.

**Step 5: Commit**

```bash
git add public/locales/en.json public/locales/ta.json src/lib/i18n.js
git commit -m "setup: configure i18n with English and Tamil locales"
```

---

### Task 5: Create App.jsx root component with routing structure

**Files:**
- Create: `src/App.jsx`
- Create: `src/pages/Home.jsx`
- Create: `src/pages/NotFound.jsx`
- Create: `src/context/LanguageContext.jsx`

**Step 1: Create src/context/LanguageContext.jsx for language toggle**

```javascript
import { createContext, useState, useContext } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  )

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ta' : 'en'
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
```

**Step 2: Create src/pages/Home.jsx**

```javascript
export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <h1>Home Page</h1>
    </div>
  )
}
```

**Step 3: Create src/pages/NotFound.jsx**

```javascript
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
      <p className="text-text mb-8">Page not found</p>
      <Link to="/" className="text-primary hover:underline">
        Go Home
      </Link>
    </div>
  )
}
```

**Step 4: Create src/App.jsx with React Router**

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from './lib/i18n'
import { LanguageProvider } from './context/LanguageContext'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </LanguageProvider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}
```

**Step 5: Test dev server runs without errors**

```bash
npm run dev
```

Expected: Dev server starts, loads Home page with "Home Page" text.

**Step 6: Commit**

```bash
git add src/App.jsx src/pages/Home.jsx src/pages/NotFound.jsx src/context/LanguageContext.jsx
git commit -m "setup: create root App component with routing and context"
```

---

## Phase 2: Core UI Components (6 tasks)

### Task 6: Create reusable UI component library (Button, Card, Input)

**Files:**
- Create: `src/components/ui/Button.jsx`
- Create: `src/components/ui/Card.jsx`
- Create: `src/components/ui/Input.jsx`
- Create: `src/components/ui/Select.jsx`

**Step 1: Create src/components/ui/Button.jsx**

```javascript
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-medium rounded transition-colors duration-200 disabled:opacity-50'

  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-700',
    secondary: 'bg-secondary text-white hover:bg-green-700',
    outline: 'border-2 border-primary text-primary hover:bg-blue-50'
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
```

**Step 2: Create src/components/ui/Card.jsx**

```javascript
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  )
}
```

**Step 3: Create src/components/ui/Input.jsx**

```javascript
import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 border-2 border-slate-300 rounded focus:outline-none focus:border-primary ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
```

**Step 4: Create src/components/ui/Select.jsx**

```javascript
import { forwardRef } from 'react'

const Select = forwardRef(({ label, error, options = [], className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-3 py-2 border-2 border-slate-300 rounded focus:outline-none focus:border-primary bg-white ${className}`}
        {...props}
      >
        <option value="">-- Select --</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
```

**Step 5: Test components by updating Home.jsx temporarily**

```bash
# Just verify imports work
node -e "import('./src/components/ui/Button.jsx')" 2>&1 | head -5
```

Expected: No errors.

**Step 6: Commit**

```bash
git add src/components/ui/Button.jsx src/components/ui/Card.jsx src/components/ui/Input.jsx src/components/ui/Select.jsx
git commit -m "ui: create reusable UI component library (Button, Card, Input, Select)"
```

---

### Task 7: Create layout components (Header, Footer, Navigation)

**Files:**
- Create: `src/components/layout/Header.jsx`
- Create: `src/components/layout/Footer.jsx`
- Create: `src/components/layout/Navigation.jsx`
- Create: `src/components/layout/LanguageToggle.jsx`

**Step 1: Create src/components/layout/LanguageToggle.jsx**

```javascript
import { useLanguage } from '../../context/LanguageContext'
import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 bg-slate-200 rounded text-sm font-medium hover:bg-slate-300 transition"
    >
      {language === 'en' ? 'தமிழ்' : 'EN'}
    </button>
  )
}
```

**Step 2: Create src/components/layout/Navigation.jsx**

```javascript
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Navigation() {
  const { t } = useTranslation()

  return (
    <nav className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">
            Educaption
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-100">{t('nav.home')}</Link>
            <Link to="/calculator" className="hover:text-blue-100">{t('nav.calculator')}</Link>
            <Link to="/courses" className="hover:text-blue-100">{t('nav.courses')}</Link>
            <Link to="/colleges" className="hover:text-blue-100">{t('nav.colleges')}</Link>
            <Link to="/counselling" className="hover:text-blue-100">{t('nav.counselling')}</Link>
            <Link to="/about" className="hover:text-blue-100">{t('nav.about')}</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
```

**Step 3: Create src/components/layout/Header.jsx**

```javascript
import Navigation from './Navigation'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  return (
    <header className="shadow-sm">
      <div className="flex justify-end px-4 py-2 bg-slate-100">
        <LanguageToggle />
      </div>
      <Navigation />
    </header>
  )
}
```

**Step 4: Create src/components/layout/Footer.jsx**

```javascript
export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Educaption</h3>
            <p className="text-sm text-slate-300">
              Helping Tamil Nadu students find their path to higher education.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li><a href="#" className="hover:text-white">Calculator</a></li>
              <li><a href="#" className="hover:text-white">Courses</a></li>
              <li><a href="#" className="hover:text-white">Colleges</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <p className="text-sm text-slate-300">
              Email: info@educaption.org<br />
              Phone: +91 9xxx xxxx xx
            </p>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-4 text-center text-sm text-slate-300">
          &copy; 2026 Educaption. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
```

**Step 5: Update src/App.jsx to wrap layout**

Replace the App.jsx Routes section:

```javascript
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// In Routes:
<>
  <Header />
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
  <Footer />
</>
```

**Step 6: Test dev server and verify header/footer appear**

```bash
npm run dev
```

Expected: Header with language toggle and navigation, Footer visible.

**Step 7: Commit**

```bash
git add src/components/layout/Header.jsx src/components/layout/Footer.jsx src/components/layout/Navigation.jsx src/components/layout/LanguageToggle.jsx
git commit -m "ui: create layout components (Header, Footer, Navigation, LanguageToggle)"
```

---

### Task 8: Build Home page hero section with CTA

**Files:**
- Modify: `src/pages/Home.jsx`
- Create: `src/components/home/HeroSection.jsx`
- Create: `src/components/home/FeaturesSection.jsx`

**Step 1: Create src/components/home/HeroSection.jsx**

```javascript
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-blue-100">
          {t('home.subtitle')}
        </p>
        <Link to="/calculator">
          <Button size="lg" variant="secondary">
            {t('home.cta')}
          </Button>
        </Link>
      </div>
    </section>
  )
}
```

**Step 2: Create src/components/home/FeaturesSection.jsx**

```javascript
import { BookOpen, School, Users, FileText } from 'lucide-react'
import Card from '../ui/Card'

export default function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Calculate Cutoff',
      description: 'Enter your marks and instantly see your cutoff scores'
    },
    {
      icon: School,
      title: 'Discover Courses',
      description: 'Explore all eligible courses based on your stream'
    },
    {
      icon: Users,
      title: 'Find Colleges',
      description: 'Browse government and private colleges near you'
    },
    {
      icon: FileText,
      title: 'Counselling Guide',
      description: 'Complete step-by-step guidance for TNEA counselling'
    }
  ]

  return (
    <section className="py-16 bg-bg">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card key={i}>
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 3: Update src/pages/Home.jsx**

```javascript
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
```

**Step 4: Test dev server, verify hero and features visible**

```bash
npm run dev
```

Expected: Hero section with "Find Your Path" title, CTA button, features grid below.

**Step 5: Commit**

```bash
git add src/pages/Home.jsx src/components/home/HeroSection.jsx src/components/home/FeaturesSection.jsx
git commit -m "feat: build home page with hero and features sections"
```

---

### Task 9: Create form validation utilities and custom hooks

**Files:**
- Create: `src/lib/validation.js`
- Create: `src/hooks/useFormState.js`

**Step 1: Create src/lib/validation.js with Zod schemas**

```javascript
import { z } from 'zod'

export const calculatorSchema = z.object({
  groupId: z.string().uuid('Please select a valid group'),
  marks: z.record(z.number().min(0).max(100, 'Marks must be 0-100')),
  categoryId: z.string().uuid('Please select a valid category')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const courseFilterSchema = z.object({
  streamId: z.string().optional(),
  searchTerm: z.string().optional()
})

export const validateCalculatorInput = (data) => {
  try {
    return { valid: true, data: calculatorSchema.parse(data) }
  } catch (error) {
    return { valid: false, errors: error.flatten() }
  }
}
```

**Step 2: Create src/hooks/useFormState.js**

```javascript
import { useState } from 'react'

export function useFormState(initialState = {}) {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (onSubmit) => {
    return async (e) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
        await onSubmit(formData)
      } catch (error) {
        setErrors({ submit: error.message })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const reset = () => {
    setFormData(initialState)
    setErrors({})
  }

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset
  }
}
```

**Step 3: Test validation works**

```bash
node -e "
import('./src/lib/validation.js').then(m => {
  const result = m.validateCalculatorInput({
    groupId: '123e4567-e89b-12d3-a456-426614174000',
    marks: { math: 95, physics: 90 },
    categoryId: '123e4567-e89b-12d3-a456-426614174000'
  })
  console.log('Valid:', result.valid)
})
"
```

Expected: "Valid: true" printed.

**Step 4: Commit**

```bash
git add src/lib/validation.js src/hooks/useFormState.js
git commit -m "utils: create form validation utilities and hooks"
```

---

### Task 10: Create stub pages for all routes

**Files:**
- Create: `src/pages/Calculator.jsx`
- Create: `src/pages/Results.jsx`
- Create: `src/pages/Courses.jsx`
- Create: `src/pages/Colleges.jsx`
- Create: `src/pages/Counselling.jsx`
- Create: `src/pages/About.jsx`

**Step 1: Create src/pages/Calculator.jsx**

```javascript
import { useTranslation } from 'react-i18next'

export default function Calculator() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{t('calculator.title')}</h1>
        <p className="text-slate-600">Coming soon...</p>
      </div>
    </div>
  )
}
```

**Step 2: Create src/pages/Results.jsx**

```javascript
export default function Results() {
  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Results</h1>
        <p className="text-slate-600">Coming soon...</p>
      </div>
    </div>
  )
}
```

**Step 3: Create src/pages/Courses.jsx**

```javascript
import { useTranslation } from 'react-i18next'

export default function Courses() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{t('nav.courses')}</h1>
        <p className="text-slate-600">Coming soon...</p>
      </div>
    </div>
  )
}
```

**Step 4: Create src/pages/Colleges.jsx**

```javascript
import { useTranslation } from 'react-i18next'

export default function Colleges() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{t('nav.colleges')}</h1>
        <p className="text-slate-600">Coming soon...</p>
      </div>
    </div>
  )
}
```

**Step 5: Create src/pages/Counselling.jsx**

```javascript
import { useTranslation } from 'react-i18next'

export default function Counselling() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{t('nav.counselling')}</h1>
        <p className="text-slate-600">Coming soon...</p>
      </div>
    </div>
  )
}
```

**Step 6: Create src/pages/About.jsx**

```javascript
import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{t('nav.about')}</h1>
        <p className="text-slate-600">Coming soon...</p>
      </div>
    </div>
  )
}
```

**Step 7: Update src/App.jsx to include all routes**

```javascript
import Calculator from './pages/Calculator'
import Results from './pages/Results'
import Courses from './pages/Courses'
import Colleges from './pages/Colleges'
import Counselling from './pages/Counselling'
import About from './pages/About'

// In Routes:
<Route path="/" element={<Home />} />
<Route path="/calculator" element={<Calculator />} />
<Route path="/results" element={<Results />} />
<Route path="/courses" element={<Courses />} />
<Route path="/colleges" element={<Colleges />} />
<Route path="/counselling" element={<Counselling />} />
<Route path="/about" element={<About />} />
<Route path="*" element={<NotFound />} />
```

**Step 8: Test all routes load without errors**

```bash
npm run dev
```

Navigate to each route. Expected: Page loads with "Coming soon..." message.

**Step 9: Commit**

```bash
git add src/pages/Calculator.jsx src/pages/Results.jsx src/pages/Courses.jsx src/pages/Colleges.jsx src/pages/Counselling.jsx src/pages/About.jsx
git commit -m "pages: create stub pages for all routes"
```

---

## Phase 3: Backend Integration (4 tasks)

### Task 11: Create Supabase database tables and seed scripts

**Files:**
- Create: `docs/database/schema.sql`
- Create: `scripts/seed-data.sql`

**Step 1: Create docs/database/schema.sql (Full schema)**

```sql
-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Streams
CREATE TABLE streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  formula TEXT NOT NULL,
  max_cutoff INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Groups
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  subjects JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Group Stream mapping (which groups eligible for which streams)
CREATE TABLE group_stream_eligibility (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, stream_id)
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Colleges
CREATE TABLE colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  type TEXT NOT NULL,
  district TEXT NOT NULL,
  streams UUID[] NOT NULL,
  website TEXT,
  seats JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Counselling
CREATE TABLE counselling (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  stream_id UUID REFERENCES streams(id),
  description TEXT,
  documents JSONB,
  important_dates JSONB,
  fees JSONB,
  website TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Site Settings
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT now()
);

-- Admin users
CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'editor')),
  created_at TIMESTAMP DEFAULT now()
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Indexes
CREATE INDEX idx_courses_stream_id ON courses(stream_id);
CREATE INDEX idx_group_stream_eligibility ON group_stream_eligibility(group_id, stream_id);
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

**Step 2: Create scripts/seed-data.sql with sample data**

```sql
-- Categories
INSERT INTO categories (code, name, name_ta) VALUES
('OC', 'Other Caste', 'பிற சாதி'),
('BC', 'Backward Caste', 'பிற்பட்ட சாதி'),
('MBC', 'Most Backward Caste', 'மிகவும் பிற்பட்ட சாதி'),
('SC', 'Scheduled Caste', 'திருமணிப் சாதி'),
('ST', 'Scheduled Tribe', 'இனக் குழு');

-- Streams
INSERT INTO streams (name, name_ta, formula, max_cutoff) VALUES
('Engineering', 'பொறியியல்', 'M/2 + P/4 + C/4', 200),
('Medical', 'மருத்துவம்', 'P/4 + C/4 + B/2', 200),
('Agriculture', 'வேளாண்மை', 'M/4 + P/4 + C/4 + B/4', 200);

-- Groups (sample 12th std groups)
INSERT INTO groups (code, name, name_ta, subjects) VALUES
('1', 'Physics, Chemistry, Mathematics', 'இயற்பியல், வேதியியல், கணிதம்', '["Physics", "Chemistry", "Mathematics", "English", "Tamil", "Maths Practical"]'),
('2', 'Physics, Chemistry, Biology', 'இயற்பியல், வேதியியல், உயிரியல்', '["Physics", "Chemistry", "Biology", "English", "Tamil", "Biology Practical"]'),
('3', 'Physics, Chemistry, Computer Science', 'இயற்பியல், வேதியியல், கணினி அறிவியல்', '["Physics", "Chemistry", "Computer Science", "English", "Tamil", "CS Practical"]');

-- Courses (sample)
INSERT INTO courses (stream_id, name, name_ta, duration, description) VALUES
((SELECT id FROM streams WHERE name = 'Engineering'), 'B.Tech Civil Engineering', 'சிவிल் பொறியியல்', '4 years', 'Foundation for infrastructure development'),
((SELECT id FROM streams WHERE name = 'Medical'), 'MBBS', 'மெடिக்যல்', '5.5 years', 'Doctor degree program'),
((SELECT id FROM streams WHERE name = 'Agriculture'), 'B.Sc Agriculture', 'வேளாண்மை அறிவியல்', '4 years', 'Agricultural science program');
```

**Step 3: Document schema as markdown reference**

```bash
mkdir -p docs/database
```

**Step 4: Note on manual Supabase setup (not automated in this plan)**

Create file `docs/DATABASE_SETUP.md`:

```markdown
# Database Setup Instructions

1. Create Supabase project at https://supabase.com
2. Copy Project URL and Anon Key to `.env.local`
3. In Supabase SQL Editor, run contents of `docs/database/schema.sql`
4. Then run `scripts/seed-data.sql` to add sample data
5. Enable Row Level Security (RLS) policies as needed

Note: This plan assumes manual Supabase setup. Automation can be added later.
```

**Step 5: Commit**

```bash
git add docs/database/schema.sql scripts/seed-data.sql docs/DATABASE_SETUP.md
git commit -m "db: create database schema and seed scripts"
```

---

### Task 12: Create React Query hooks for data fetching

**Files:**
- Create: `src/hooks/queries/useGroups.js`
- Create: `src/hooks/queries/useStreams.js`
- Create: `src/hooks/queries/useCourses.js`
- Create: `src/hooks/queries/useCategories.js`

**Step 1: Create src/hooks/queries/useGroups.js**

```javascript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('code', { ascending: true })

      if (error) throw error
      return data
    }
  })
}

export function useGroupById(groupId) {
  return useQuery({
    queryKey: ['groups', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!groupId
  })
}
```

**Step 2: Create src/hooks/queries/useStreams.js**

```javascript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function useStreams() {
  return useQuery({
    queryKey: ['streams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data
    }
  })
}

export function useStreamById(streamId) {
  return useQuery({
    queryKey: ['streams', streamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .eq('id', streamId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!streamId
  })
}
```

**Step 3: Create src/hooks/queries/useCourses.js**

```javascript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function useCourses(streamId = null) {
  return useQuery({
    queryKey: ['courses', streamId],
    queryFn: async () => {
      let query = supabase.from('courses').select('*')

      if (streamId) {
        query = query.eq('stream_id', streamId)
      }

      const { data, error } = await query.order('name', { ascending: true })

      if (error) throw error
      return data
    }
  })
}
```

**Step 4: Create src/hooks/queries/useCategories.js**

```javascript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('code', { ascending: true })

      if (error) throw error
      return data
    }
  })
}
```

**Step 5: Test imports work**

```bash
node -e "import('./src/hooks/queries/useGroups.js')" 2>&1 | head -5
```

Expected: No errors.

**Step 6: Commit**

```bash
git add src/hooks/queries/useGroups.js src/hooks/queries/useStreams.js src/hooks/queries/useCourses.js src/hooks/queries/useCategories.js
git commit -m "hooks: create React Query hooks for data fetching"
```

---

### Task 13: Implement cutoff calculation logic

**Files:**
- Create: `src/lib/calculator.js`
- Create: `src/hooks/useCalculator.js`

**Step 1: Create src/lib/calculator.js**

```javascript
/**
 * Parse and evaluate cutoff formula with student marks
 * Example formula: "M/2 + P/4 + C/4"
 * Marks object: { M: 95, P: 90, C: 88 }
 */
export function calculateCutoff(formula, marks) {
  if (!formula || !marks) return null

  try {
    // Replace subject codes with actual mark values
    let expression = formula
    for (const [code, value] of Object.entries(marks)) {
      expression = expression.replace(new RegExp(code, 'g'), value)
    }

    // Safely evaluate the expression using Function
    const result = Function('"use strict"; return (' + expression + ')')()
    return Math.round(result * 100) / 100
  } catch (error) {
    console.error('Calculation error:', error)
    return null
  }
}

/**
 * Calculate cutoff for all streams and check eligibility
 */
export function calculateStreamCutoffs(streams, groupSubjects, marks) {
  const results = {}

  streams.forEach(stream => {
    // Map group subjects to stream formula codes
    const mappedMarks = {}
    groupSubjects.forEach((subject, index) => {
      const code = subject[0].toUpperCase() // Use first letter
      mappedMarks[code] = marks[index]
    })

    const cutoff = calculateCutoff(stream.formula, mappedMarks)
    results[stream.id] = {
      streamId: stream.id,
      streamName: stream.name,
      streamNameTa: stream.name_ta,
      cutoff: cutoff,
      maxCutoff: stream.max_cutoff,
      eligible: cutoff !== null
    }
  })

  return results
}

/**
 * Filter eligible courses by group and cutoff
 */
export function filterEligibleCourses(courses, eligibleStreamIds) {
  return courses.filter(course =>
    eligibleStreamIds.includes(course.stream_id)
  )
}
```

**Step 2: Create src/hooks/useCalculator.js**

```javascript
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { calculateCutoff, calculateStreamCutoffs } from '../lib/calculator'

export function useCalculator() {
  const [results, setResults] = useState(null)

  const calculateMutation = useMutation({
    mutationFn: async ({ group, marks, streams }) => {
      const streamResults = calculateStreamCutoffs(streams, group.subjects, marks)
      return streamResults
    },
    onSuccess: (data) => {
      setResults(data)
    }
  })

  return {
    results,
    isCalculating: calculateMutation.isPending,
    calculate: calculateMutation.mutate,
    error: calculateMutation.error
  }
}
```

**Step 3: Test calculation logic**

```bash
node -e "
import('./src/lib/calculator.js').then(m => {
  const result = m.calculateCutoff('M/2 + P/4 + C/4', { M: 100, P: 100, C: 100 })
  console.log('Cutoff:', result)
})
"
```

Expected: "Cutoff: 100" printed.

**Step 4: Commit**

```bash
git add src/lib/calculator.js src/hooks/useCalculator.js
git commit -m "feat: implement cutoff calculation logic"
```

---

### Task 14: Add cutoff data storage (local or session state)

**Files:**
- Create: `src/context/CalculatorContext.jsx`
- Modify: `src/App.jsx` to provide context

**Step 1: Create src/context/CalculatorContext.jsx**

```javascript
import { createContext, useContext, useState } from 'react'

const CalculatorContext = createContext()

export function CalculatorProvider({ children }) {
  const [calculatorState, setCalculatorState] = useState({
    group: null,
    marks: {},
    category: null,
    results: null,
    step: 1
  })

  const updateGroup = (group) => {
    setCalculatorState(prev => ({ ...prev, group }))
  }

  const updateMarks = (marks) => {
    setCalculatorState(prev => ({ ...prev, marks }))
  }

  const updateCategory = (category) => {
    setCalculatorState(prev => ({ ...prev, category }))
  }

  const setResults = (results) => {
    setCalculatorState(prev => ({ ...prev, results }))
  }

  const moveToStep = (step) => {
    setCalculatorState(prev => ({ ...prev, step }))
  }

  const reset = () => {
    setCalculatorState({
      group: null,
      marks: {},
      category: null,
      results: null,
      step: 1
    })
  }

  return (
    <CalculatorContext.Provider
      value={{
        ...calculatorState,
        updateGroup,
        updateMarks,
        updateCategory,
        setResults,
        moveToStep,
        reset
      }}
    >
      {children}
    </CalculatorContext.Provider>
  )
}

export function useCalculatorContext() {
  return useContext(CalculatorContext)
}
```

**Step 2: Update src/App.jsx to wrap CalculatorProvider**

```javascript
import { CalculatorProvider } from './context/CalculatorContext'

// Wrap entire app:
<I18nextProvider i18n={i18n}>
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CalculatorProvider>
        <Router>
          {/* Routes */}
        </Router>
      </CalculatorProvider>
    </LanguageProvider>
  </QueryClientProvider>
</I18nextProvider>
```

**Step 3: Test context provides without errors**

```bash
npm run dev
```

Expected: App loads normally.

**Step 4: Commit**

```bash
git add src/context/CalculatorContext.jsx
git commit -m "context: add calculator state management context"
```

---

## Phase 4: Calculator Feature (5 tasks)

### Task 15: Build Step 1 - Group Selection form

**Files:**
- Create: `src/components/calculator/Step1GroupSelect.jsx`
- Modify: `src/pages/Calculator.jsx`

**Step 1: Create src/components/calculator/Step1GroupSelect.jsx**

```javascript
import { useTranslation } from 'react-i18next'
import { useGroups } from '../../hooks/queries/useGroups'
import { useCalculatorContext } from '../../context/CalculatorContext'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Card from '../ui/Card'

export default function Step1GroupSelect({ onNext }) {
  const { t } = useTranslation()
  const { data: groups, isLoading, error } = useGroups()
  const { group, updateGroup } = useCalculatorContext()

  const handleNext = () => {
    if (group) onNext()
  }

  if (isLoading) return <div className="text-center py-8">{t('common.loading')}</div>
  if (error) return <div className="text-red-500 py-8">Error loading groups</div>

  const groupOptions = (groups || []).map(g => ({
    value: g.id,
    label: `${g.name} (${g.name_ta})`
  }))

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">{t('calculator.step1')}</h2>
      <Select
        label={t('calculator.selectGroup')}
        options={groupOptions}
        value={group?.id || ''}
        onChange={(e) => {
          const selectedGroup = groups.find(g => g.id === e.target.value)
          updateGroup(selectedGroup)
        }}
      />
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!group}
          size="lg"
        >
          {t('common.next')}
        </Button>
      </div>
    </Card>
  )
}
```

**Step 2: Update src/pages/Calculator.jsx with multi-step form**

```javascript
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useCalculatorContext } from '../context/CalculatorContext'
import Step1GroupSelect from '../components/calculator/Step1GroupSelect'
import Card from '../components/ui/Card'

export default function Calculator() {
  const { t } = useTranslation()
  const { step, moveToStep } = useCalculatorContext()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t('calculator.title')}</h1>

        {/* Progress bar */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`flex-1 h-2 mx-2 rounded ${
                s <= step ? 'bg-primary' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Steps */}
        {step === 1 && (
          <Step1GroupSelect onNext={() => moveToStep(2)} />
        )}
        {step === 2 && (
          <Card><p>Step 2 (coming next)</p></Card>
        )}
        {step === 3 && (
          <Card><p>Step 3 (coming next)</p></Card>
        )}
      </div>
    </div>
  )
}
```

**Step 3: Test dev server, navigate to /calculator**

```bash
npm run dev
```

Expected: Calculator page loads with Step 1, dropdown populated with groups.

**Step 4: Commit**

```bash
git add src/components/calculator/Step1GroupSelect.jsx src/pages/Calculator.jsx
git commit -m "feat: build calculator step 1 - group selection"
```

---

### Task 16: Build Step 2 - Marks entry form

**Files:**
- Create: `src/components/calculator/Step2MarksInput.jsx`

**Step 1: Create src/components/calculator/Step2MarksInput.jsx**

```javascript
import { useTranslation } from 'react-i18next'
import { useCalculatorContext } from '../../context/CalculatorContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'

export default function Step2MarksInput({ onNext, onBack }) {
  const { t } = useTranslation()
  const { group, marks, updateMarks } = useCalculatorContext()

  if (!group) return null

  const handleMarkChange = (subject, value) => {
    updateMarks({
      ...marks,
      [subject]: Math.min(100, Math.max(0, Number(value) || 0))
    })
  }

  const allMarksEntered = group.subjects.every(s => marks[s] !== undefined)

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">{t('calculator.step2')}</h2>
      <p className="text-sm text-slate-600 mb-6">{t('calculator.enterMarks')}</p>

      <div className="space-y-4">
        {group.subjects.map(subject => (
          <Input
            key={subject}
            label={subject}
            type="number"
            min="0"
            max="100"
            value={marks[subject] || ''}
            onChange={(e) => handleMarkChange(subject, e.target.value)}
            placeholder="0-100"
          />
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          {t('common.back')}
        </Button>
        <Button onClick={onNext} disabled={!allMarksEntered} size="lg">
          {t('common.next')}
        </Button>
      </div>
    </Card>
  )
}
```

**Step 2: Update src/pages/Calculator.jsx to include Step 2**

```javascript
import Step2MarksInput from '../components/calculator/Step2MarksInput'

// In step === 2:
{step === 2 && (
  <Step2MarksInput
    onNext={() => moveToStep(3)}
    onBack={() => moveToStep(1)}
  />
)}
```

**Step 3: Test step 2 - enter marks and progress**

```bash
npm run dev
```

Expected: Can enter marks for all subjects, Next button enabled when all filled.

**Step 4: Commit**

```bash
git add src/components/calculator/Step2MarksInput.jsx
git commit -m "feat: build calculator step 2 - marks entry"
```

---

### Task 17: Build Step 3 - Category selection and calculation

**Files:**
- Create: `src/components/calculator/Step3CategorySelect.jsx`
- Create: `src/components/calculator/CalculationEngine.jsx`

**Step 1: Create src/components/calculator/Step3CategorySelect.jsx**

```javascript
import { useTranslation } from 'react-i18next'
import { useCategories } from '../../hooks/queries/useCategories'
import { useCalculatorContext } from '../../context/CalculatorContext'
import { useCalculator } from '../../hooks/useCalculator'
import { useStreams } from '../../hooks/queries/useStreams'
import { calculateStreamCutoffs } from '../../lib/calculator'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Card from '../ui/Card'

export default function Step3CategorySelect({ onNext, onBack }) {
  const { t } = useTranslation()
  const { data: categories, isLoading: catLoading } = useCategories()
  const { data: streams, isLoading: streamLoading } = useStreams()
  const { group, marks, category, updateCategory, setResults, moveToStep } = useCalculatorContext()

  if (!group || !marks) return null

  const handleCalculate = () => {
    if (!category) return

    // Calculate cutoffs for all streams
    const streamResults = calculateStreamCutoffs(streams, group.subjects, Object.values(marks))
    setResults(streamResults)
    moveToStep(4) // Move to results page (will create this next)
  }

  const categoryOptions = (categories || []).map(c => ({
    value: c.id,
    label: `${c.name} (${c.name_ta})`
  }))

  if (catLoading || streamLoading) return <div>{t('common.loading')}</div>

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">{t('calculator.step3')}</h2>
      <Select
        label={t('calculator.selectCategory')}
        options={categoryOptions}
        value={category?.id || ''}
        onChange={(e) => {
          const selected = categories.find(c => c.id === e.target.value)
          updateCategory(selected)
        }}
      />

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          {t('common.back')}
        </Button>
        <Button onClick={handleCalculate} disabled={!category} size="lg">
          {t('results.title')}
        </Button>
      </div>
    </Card>
  )
}
```

**Step 2: Update src/pages/Calculator.jsx**

```javascript
import Step3CategorySelect from '../components/calculator/Step3CategorySelect'
import ResultsDisplay from '../components/calculator/ResultsDisplay'

// In JSX:
{step === 3 && (
  <Step3CategorySelect
    onBack={() => moveToStep(2)}
    onNext={() => moveToStep(4)}
  />
)}

{step === 4 && (
  <ResultsDisplay onReset={reset} />
)}

// Add reset function:
import { useCalculatorContext } from '../context/CalculatorContext'
const { reset } = useCalculatorContext()
```

**Step 3: Create stub ResultsDisplay component**

```javascript
// src/components/calculator/ResultsDisplay.jsx
import { useCalculatorContext } from '../../context/CalculatorContext'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function ResultsDisplay({ onReset }) {
  const { results } = useCalculatorContext()

  if (!results) return null

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Your Results</h2>
      <div className="space-y-4">
        {Object.values(results).map(result => (
          <div key={result.streamId} className="border-l-4 border-primary pl-4">
            <h3 className="font-bold">{result.streamName}</h3>
            <p className="text-sm text-slate-600">Cutoff: {result.cutoff}/{result.maxCutoff}</p>
          </div>
        ))}
      </div>
      <Button onClick={onReset} className="mt-6">
        Calculate Again
      </Button>
    </Card>
  )
}
```

**Step 4: Test calculator flow end-to-end**

```bash
npm run dev
```

Expected: Can flow through all 3 steps, see calculated results.

**Step 5: Commit**

```bash
git add src/components/calculator/Step3CategorySelect.jsx src/components/calculator/ResultsDisplay.jsx src/pages/Calculator.jsx
git commit -m "feat: build calculator step 3 and results display"
```

---

### Task 18: Build Results page with detailed output

**Files:**
- Modify: `src/pages/Results.jsx`
- Create: `src/components/results/EligibleCoursesCard.jsx`
- Create: `src/components/results/CollegeRecommendations.jsx`

**Step 1: Create src/components/results/EligibleCoursesCard.jsx**

```javascript
import { useCourses } from '../../hooks/queries/useCourses'
import Card from '../ui/Card'

export default function EligibleCoursesCard({ streamIds }) {
  const { data: allCourses } = useCourses()

  if (!allCourses) return null

  const eligibleCourses = allCourses.filter(course =>
    streamIds.includes(course.stream_id)
  )

  return (
    <Card className="mb-6">
      <h3 className="text-xl font-bold mb-4">Eligible Courses</h3>
      {eligibleCourses.length === 0 ? (
        <p className="text-slate-600">No eligible courses found</p>
      ) : (
        <div className="space-y-3">
          {eligibleCourses.map(course => (
            <div key={course.id} className="border-l-4 border-secondary pl-4">
              <h4 className="font-bold">{course.name}</h4>
              <p className="text-sm text-slate-600">{course.duration}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
```

**Step 2: Create src/components/results/CollegeRecommendations.jsx**

```javascript
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function CollegeRecommendations() {
  return (
    <Card className="mb-6">
      <h3 className="text-xl font-bold mb-4">Next Steps</h3>
      <div className="space-y-3">
        <Link to="/colleges">
          <Button className="w-full">View Colleges</Button>
        </Link>
        <Link to="/counselling">
          <Button variant="secondary" className="w-full">
            Counselling Guide
          </Button>
        </Link>
      </div>
    </Card>
  )
}
```

**Step 3: Update src/pages/Results.jsx**

```javascript
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Card from '../components/ui/Card'
import EligibleCoursesCard from '../components/results/EligibleCoursesCard'
import CollegeRecommendations from '../components/results/CollegeRecommendations'

export default function Results() {
  const { t } = useTranslation()
  const location = useLocation()
  const { results } = location.state || {}

  if (!results) {
    return (
      <div className="min-h-screen bg-bg py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <p className="text-slate-600">
              Please calculate your cutoff first.
            </p>
          </Card>
        </div>
      </div>
    )
  }

  const eligibleStreamIds = Object.values(results)
    .filter(r => r.eligible)
    .map(r => r.streamId)

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t('results.title')}</h1>

        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">{t('results.cutoffScores')}</h2>
          <div className="space-y-3">
            {Object.values(results).map(result => (
              <div key={result.streamId} className="flex justify-between">
                <span className="font-medium">{result.streamName}</span>
                <span className={result.eligible ? 'text-green-600 font-bold' : 'text-red-600'}>
                  {result.cutoff}/{result.maxCutoff}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {eligibleStreamIds.length > 0 && (
          <>
            <EligibleCoursesCard streamIds={eligibleStreamIds} />
            <CollegeRecommendations />
          </>
        )}
      </div>
    </div>
  )
}
```

**Step 4: Update Calculator to link to Results**

In `src/pages/Calculator.jsx`, update ResultsDisplay:

```javascript
import { useNavigate } from 'react-router-dom'

export default function ResultsDisplay({ onReset }) {
  const { results } = useCalculatorContext()
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate('/results', { state: { results } })
  }

  // Add button to navigate to /results
}
```

**Step 5: Test results page**

```bash
npm run dev
```

Expected: Results page shows cutoff scores and eligible courses.

**Step 6: Commit**

```bash
git add src/pages/Results.jsx src/components/results/EligibleCoursesCard.jsx src/components/results/CollegeRecommendations.jsx
git commit -m "feat: build results page with course recommendations"
```

---

## Phase 5: Data Browsing Pages (4 tasks)

### Task 19: Build Courses listing page with filters

**Files:**
- Create: `src/components/courses/CourseFilters.jsx`
- Create: `src/components/courses/CourseList.jsx`
- Modify: `src/pages/Courses.jsx`

**Step 1: Create src/components/courses/CourseFilters.jsx**

```javascript
import { useState } from 'react'
import { useStreams } from '../../hooks/queries/useStreams'
import Select from '../ui/Select'

export default function CourseFilters({ onFilterChange }) {
  const { data: streams } = useStreams()
  const [selectedStream, setSelectedStream] = useState('')

  const handleStreamChange = (e) => {
    setSelectedStream(e.target.value)
    onFilterChange({ streamId: e.target.value })
  }

  const streamOptions = (streams || []).map(s => ({
    value: s.id,
    label: s.name
  }))

  return (
    <div className="mb-6">
      <Select
        label="Filter by Stream"
        options={streamOptions}
        value={selectedStream}
        onChange={handleStreamChange}
      />
    </div>
  )
}
```

**Step 2: Create src/components/courses/CourseList.jsx**

```javascript
import Card from '../ui/Card'

export default function CourseList({ courses, isLoading }) {
  if (isLoading) return <div>Loading...</div>

  if (!courses || courses.length === 0) {
    return <Card><p className="text-slate-600">No courses found</p></Card>
  }

  return (
    <div className="space-y-4">
      {courses.map(course => (
        <Card key={course.id}>
          <h3 className="text-lg font-bold">{course.name}</h3>
          <p className="text-sm text-slate-600 mb-2">{course.name_ta}</p>
          <p className="text-sm mb-2">{course.description}</p>
          <p className="text-xs text-slate-500">Duration: {course.duration}</p>
        </Card>
      ))}
    </div>
  )
}
```

**Step 3: Update src/pages/Courses.jsx**

```javascript
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCourses } from '../hooks/queries/useCourses'
import CourseFilters from '../components/courses/CourseFilters'
import CourseList from '../components/courses/CourseList'

export default function Courses() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState({})
  const { data: courses, isLoading } = useCourses(filters.streamId)

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t('nav.courses')}</h1>
        <CourseFilters onFilterChange={setFilters} />
        <CourseList courses={courses} isLoading={isLoading} />
      </div>
    </div>
  )
}
```

**Step 4: Test courses page**

```bash
npm run dev
```

Expected: Courses page loads, can filter by stream.

**Step 5: Commit**

```bash
git add src/components/courses/CourseFilters.jsx src/components/courses/CourseList.jsx src/pages/Courses.jsx
git commit -m "feat: build courses listing page with filters"
```

---

### Task 20: Build Colleges directory page with search

**Files:**
- Create: `src/hooks/queries/useColleges.js`
- Create: `src/components/colleges/CollegeSearchBar.jsx`
- Create: `src/components/colleges/CollegeGrid.jsx`
- Modify: `src/pages/Colleges.jsx`

**Step 1: Create src/hooks/queries/useColleges.js**

```javascript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function useColleges() {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data
    }
  })
}
```

**Step 2: Create src/components/colleges/CollegeSearchBar.jsx**

```javascript
import Input from '../ui/Input'

export default function CollegeSearchBar({ onSearch }) {
  return (
    <div className="mb-6">
      <Input
        label="Search Colleges"
        placeholder="College name or district..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
```

**Step 3: Create src/components/colleges/CollegeGrid.jsx**

```javascript
import Card from '../ui/Card'

export default function CollegeGrid({ colleges, isLoading }) {
  if (isLoading) return <div>Loading...</div>

  if (!colleges || colleges.length === 0) {
    return <Card><p className="text-slate-600">No colleges found</p></Card>
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {colleges.map(college => (
        <Card key={college.id}>
          <h3 className="text-lg font-bold">{college.name}</h3>
          <p className="text-sm text-slate-600 mb-2">{college.name_ta}</p>
          <div className="space-y-1 text-sm">
            <p><span className="font-semibold">Type:</span> {college.type}</p>
            <p><span className="font-semibold">District:</span> {college.district}</p>
          </div>
          {college.website && (
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm mt-3 inline-block"
            >
              Visit Website →
            </a>
          )}
        </Card>
      ))}
    </div>
  )
}
```

**Step 4: Update src/pages/Colleges.jsx**

```javascript
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useColleges } from '../hooks/queries/useColleges'
import CollegeSearchBar from '../components/colleges/CollegeSearchBar'
import CollegeGrid from '../components/colleges/CollegeGrid'

export default function Colleges() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const { data: allColleges, isLoading } = useColleges()

  const filteredColleges = useMemo(() => {
    if (!allColleges) return []
    return allColleges.filter(college =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.district.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [allColleges, searchTerm])

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t('nav.colleges')}</h1>
        <CollegeSearchBar onSearch={setSearchTerm} />
        <CollegeGrid colleges={filteredColleges} isLoading={isLoading} />
      </div>
    </div>
  )
}
```

**Step 5: Test colleges page**

```bash
npm run dev
```

Expected: Colleges page loads with search functionality.

**Step 6: Commit**

```bash
git add src/hooks/queries/useColleges.js src/components/colleges/CollegeSearchBar.jsx src/components/colleges/CollegeGrid.jsx src/pages/Colleges.jsx
git commit -m "feat: build colleges directory with search"
```

---

### Task 21: Build Counselling information page

**Files:**
- Create: `src/hooks/queries/useCounselling.js`
- Create: `src/components/counselling/CounsellingSteps.jsx`
- Modify: `src/pages/Counselling.jsx`

**Step 1: Create src/hooks/queries/useCounselling.js**

```javascript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function useCounselling() {
  return useQuery({
    queryKey: ['counselling'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('counselling')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data
    }
  })
}
```

**Step 2: Create src/components/counselling/CounsellingSteps.jsx**

```javascript
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Card from '../ui/Card'

export default function CounsellingSteps({ counsellingInfo }) {
  const [expandedId, setExpandedId] = useState(null)

  if (!counsellingInfo || counsellingInfo.length === 0) {
    return <Card><p className="text-slate-600">No counselling info available</p></Card>
  }

  return (
    <div className="space-y-4">
      {counsellingInfo.map(item => (
        <Card key={item.id} className="cursor-pointer">
          <button
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            className="w-full flex justify-between items-center"
          >
            <h3 className="text-lg font-bold">{item.name}</h3>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                expandedId === item.id ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedId === item.id && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-slate-600 mb-4">{item.description}</p>

              {item.important_dates && (
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Important Dates</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    {Object.entries(item.important_dates).map(([key, date]) => (
                      <li key={key}>{key}: {date}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.documents && (
                <div>
                  <h4 className="font-bold mb-2">Required Documents</h4>
                  <ul className="text-sm space-y-1 text-slate-600 list-disc list-inside">
                    {item.documents.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.website && (
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm mt-4 inline-block"
                >
                  Official Website →
                </a>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
```

**Step 3: Update src/pages/Counselling.jsx**

```javascript
import { useTranslation } from 'react-i18next'
import { useCounselling } from '../hooks/queries/useCounselling'
import CounsellingSteps from '../components/counselling/CounsellingSteps'

export default function Counselling() {
  const { t } = useTranslation()
  const { data: counsellingInfo, isLoading } = useCounselling()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t('nav.counselling')}</h1>

        {isLoading && <div>{t('common.loading')}</div>}
        {!isLoading && (
          <CounsellingSteps counsellingInfo={counsellingInfo} />
        )}
      </div>
    </div>
  )
}
```

**Step 4: Test counselling page**

```bash
npm run dev
```

Expected: Counselling page loads with expandable sections.

**Step 5: Commit**

```bash
git add src/hooks/queries/useCounselling.js src/components/counselling/CounsellingSteps.jsx src/pages/Counselling.jsx
git commit -m "feat: build counselling information page with expandable sections"
```

---

### Task 22: Build About page with Educaption info

**Files:**
- Modify: `src/pages/About.jsx`

**Step 1: Update src/pages/About.jsx**

```javascript
import { useTranslation } from 'react-i18next'
import Card from '../components/ui/Card'

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t('nav.about')}</h1>

        <Card className="mb-6">
          <h2 className="text-2xl font-bold mb-4">About Educaption</h2>
          <p className="text-slate-700 mb-4">
            Educaption is a non-profit organization dedicated to empowering underprivileged
            students in Tamil Nadu with access to quality educational guidance and opportunities.
          </p>
          <p className="text-slate-700">
            Our mission is to help 12th standard students calculate their cutoff marks, discover
            eligible courses and colleges, and navigate the counselling process with confidence.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <span>Provide free, accurate cutoff calculation tools</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <span>Help students explore all available higher education paths</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <span>Demystify the TNEA counselling process</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">✓</span>
              <span>Support underprivileged students in Tamil Nadu</span>
            </li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <div className="space-y-2 text-slate-700">
            <p><span className="font-semibold">Email:</span> info@educaption.org</p>
            <p><span className="font-semibold">Phone:</span> +91 9xxx xxxx xx</p>
            <p><span className="font-semibold">Address:</span> Tamil Nadu, India</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
```

**Step 2: Test about page**

```bash
npm run dev
```

Expected: About page displays Educaption information.

**Step 3: Commit**

```bash
git add src/pages/About.jsx
git commit -m "feat: build about page with Educaption information"
```

---

## Phase 6: Testing & Deployment (3 tasks)

### Task 23: Write unit tests for calculator logic

**Files:**
- Create: `src/lib/__tests__/calculator.test.js`
- Create: `vitest.config.js`

**Step 1: Create vitest.config.js**

```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: []
  }
})
```

**Step 2: Create src/lib/__tests__/calculator.test.js**

```javascript
import { describe, it, expect } from 'vitest'
import { calculateCutoff, calculateStreamCutoffs } from '../calculator'

describe('Calculator Functions', () => {
  describe('calculateCutoff', () => {
    it('should calculate simple formula correctly', () => {
      const formula = 'M/2 + P/4 + C/4'
      const marks = { M: 100, P: 100, C: 100 }
      const result = calculateCutoff(formula, marks)
      expect(result).toBe(100)
    })

    it('should handle decimal results', () => {
      const formula = 'M/2 + P/4 + C/4'
      const marks = { M: 95, P: 90, C: 88 }
      const result = calculateCutoff(formula, marks)
      expect(result).toBeCloseTo(90.75, 2)
    })

    it('should return null for invalid formula', () => {
      const formula = 'INVALID'
      const marks = { M: 100 }
      const result = calculateCutoff(formula, marks)
      expect(result).toBeNull()
    })

    it('should handle zero marks', () => {
      const formula = 'M/2 + P/4 + C/4'
      const marks = { M: 0, P: 0, C: 0 }
      const result = calculateCutoff(formula, marks)
      expect(result).toBe(0)
    })
  })

  describe('calculateStreamCutoffs', () => {
    it('should calculate cutoffs for multiple streams', () => {
      const streams = [
        { id: '1', name: 'Engineering', formula: 'M/2 + P/4 + C/4', max_cutoff: 200 }
      ]
      const groupSubjects = ['Math', 'Physics', 'Chemistry']
      const marks = [95, 90, 88]

      const result = calculateStreamCutoffs(streams, groupSubjects, marks)
      expect(result['1']).toBeDefined()
      expect(result['1'].eligible).toBe(true)
    })
  })
})
```

**Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass.

**Step 4: Commit**

```bash
git add vitest.config.js src/lib/__tests__/calculator.test.js
git commit -m "test: add unit tests for calculator logic"
```

---

### Task 24: Build production setup and environment config

**Files:**
- Create: `.env.example` (update)
- Create: `vercel.json`
- Modify: `package.json` (add vercel build)

**Step 1: Update .env.example**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=development
```

**Step 2: Create vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

**Step 3: Test build command**

```bash
npm run build
```

Expected: dist folder created with optimized build files.

**Step 4: Test preview**

```bash
npm run preview
```

Expected: Preview server starts and loads the app.

**Step 5: Commit**

```bash
git add .env.example vercel.json
git commit -m "setup: add production environment and Vercel config"
```

---

### Task 25: Create deployment guide and final checklist

**Files:**
- Create: `docs/DEPLOYMENT.md`
- Create: `DEPLOYMENT_CHECKLIST.md`

**Step 1: Create docs/DEPLOYMENT.md**

```markdown
# Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for hosting)

## Setup Steps

### 1. Supabase Setup

1. Create project at https://supabase.com
2. Run schema from `docs/database/schema.sql`
3. Run seed from `scripts/seed-data.sql`
4. Copy Project URL and Anon Key

### 2. Local Development

```bash
npm install
echo "VITE_SUPABASE_URL=..." > .env.local
echo "VITE_SUPABASE_ANON_KEY=..." >> .env.local
npm run dev
```

### 3. Build for Production

```bash
npm run build
npm run preview # Test locally
```

### 4. Deploy to Vercel

```bash
# Option A: Via CLI
npm install -g vercel
vercel

# Option B: Via GitHub
1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Set environment variables in Vercel settings
4. Deploy
```

### 5. Post-Deployment

- Verify all routes load
- Test calculator functionality
- Check database connectivity
- Monitor error logs

## Environment Variables

Required in Vercel:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Troubleshooting

**Blank page:** Check browser console for errors
**Database connection error:** Verify Supabase URL/key
**Build fails:** Run `npm install` and `npm run build` locally first
```

**Step 2: Create DEPLOYMENT_CHECKLIST.md**

```markdown
# Final Deployment Checklist

- [ ] All routes render without console errors
- [ ] Calculator flows through 3 steps correctly
- [ ] Results page shows cutoff calculations
- [ ] Courses page filters by stream
- [ ] Colleges page search functionality works
- [ ] Counselling page displays with dates/docs
- [ ] Language toggle (EN/Tamil) works
- [ ] Mobile responsive on all pages
- [ ] No console warnings
- [ ] Build completes without errors
- [ ] Preview build loads correctly
- [ ] Environment variables set in Vercel
- [ ] Database seed data loaded
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Performance tested (Lighthouse)
- [ ] Accessibility checked (WCAG AA)

## Pre-Launch Testing

1. Run on 3G connection simulation (DevTools)
2. Test on iOS Safari + Android Chrome
3. Verify all i18n strings load
4. Check all CTA buttons link correctly
```

**Step 3: Add build to package.json if not present**

Verify in `package.json`:
```json
"scripts": {
  "build": "vite build"
}
```

**Step 4: Commit**

```bash
git add docs/DEPLOYMENT.md DEPLOYMENT_CHECKLIST.md
git commit -m "docs: add deployment guide and checklist"
```

---

## Summary

**Plan saved to:** `docs/plans/2026-03-04-implementation-plan.md`

**Total Tasks:** 25

**Phases:**
1. **Project Setup & Infrastructure** (5 tasks) - React, Vite, Tailwind, Supabase, i18n
2. **Core UI Components** (6 tasks) - Button, Card, Input, Layout, Home page
3. **Backend Integration** (4 tasks) - Database schema, React Query hooks, Calculator logic
4. **Calculator Feature** (5 tasks) - 3-step form, calculations, results display
5. **Data Browsing Pages** (4 tasks) - Courses, Colleges, Counselling, About
6. **Testing & Deployment** (3 tasks) - Unit tests, build setup, deployment guide

**Tech Stack:** React 18 + Vite, Tailwind CSS, React Router, React Query, React Hook Form, i18next, Supabase, Vercel

---

## Execution Options

**Plan complete and saved to `docs/plans/2026-03-04-implementation-plan.md`**

Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration with code review checkpoints.

**2. Parallel Session (separate)** - Open new session in worktree with executing-plans skill, batch execution with structured checkpoints.

**Which approach would you prefer?**