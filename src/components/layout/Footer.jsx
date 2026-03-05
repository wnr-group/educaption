import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()

  const quickLinks = [
    { path: '/calculator', label: t('nav.calculator') },
    { path: '/courses', label: t('nav.courses') },
    { path: '/colleges', label: t('nav.colleges') },
    { path: '/counselling', label: t('nav.counselling') },
    { path: '/about', label: t('nav.about') },
  ]

  const resources = [
    { label: 'TNEA Official', url: 'https://tneaonline.org', external: true },
    { label: 'Anna University', url: 'https://annauniv.edu', external: true },
    { label: 'DoTE Tamil Nadu', url: 'https://tndte.gov.in', external: true },
  ]

  return (
    <footer className="relative bg-gradient-dark text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-saffron-500/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-saffron-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="
                w-12 h-12
                bg-gradient-to-br from-saffron-500 to-saffron-600
                rounded-xl
                flex items-center justify-center
                shadow-glow-saffron
                group-hover:scale-105
                transition-transform duration-200
              ">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-white">
                {t('common.appName')}
              </span>
            </Link>
            <p className="font-body text-navy-300 leading-relaxed mb-6">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg text-white mb-6">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="
                      font-body text-navy-300
                      hover:text-saffron-400
                      transition-colors duration-200
                      inline-flex items-center gap-2
                    "
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-500/50" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-bold text-lg text-white mb-6">
              {t('footer.officialResources')}
            </h4>
            <ul className="space-y-3">
              {resources.map(({ label, url, external }) => (
                <li key={label}>
                  <a
                    href={url}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="
                      font-body text-navy-300
                      hover:text-saffron-400
                      transition-colors duration-200
                      inline-flex items-center gap-2
                    "
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-500/50" />
                    {label}
                    {external && <ExternalLink className="w-3 h-3 opacity-50" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg text-white mb-6">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@educaption.org"
                  className="
                    font-body text-navy-300
                    hover:text-saffron-400
                    transition-colors duration-200
                    flex items-start gap-3
                  "
                >
                  <Mail className="w-5 h-5 text-saffron-500 mt-0.5 flex-shrink-0" />
                  <span>info@educaption.org</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="
                    font-body text-navy-300
                    hover:text-saffron-400
                    transition-colors duration-200
                    flex items-start gap-3
                  "
                >
                  <Phone className="w-5 h-5 text-saffron-500 mt-0.5 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-saffron-500 mt-0.5 flex-shrink-0" />
                <span className="font-body text-navy-300">
                  {t('about.address')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-navy-400">
              {t('footer.copyright')}
            </p>
            <p className="font-body text-sm text-navy-400 flex items-center gap-2">
              {t('footer.madeWith')}
              <Heart className="w-4 h-4 text-saffron-500 fill-saffron-500" />
              {t('footer.forStudents')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
