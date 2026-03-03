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
