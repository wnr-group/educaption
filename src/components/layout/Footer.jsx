import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()

  const quickLinks = [
    { path: '/calculator', label: t('nav.calculator') },
    { path: '/courses', label: t('nav.courses') },
    { path: '/counselling', label: t('nav.counselling') },
    { path: '/about', label: t('nav.about') },
  ]

  const resources = [
    { label: 'TNEA Official', url: 'https://tneaonline.org', external: true },
    { label: 'Anna University', url: 'https://annauniv.edu', external: true },
    { label: 'DoTE Tamil Nadu', url: 'https://tndte.gov.in', external: true },
  ]

  return (
    <footer className="relative bg-[#0A0A0F] text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF6B35]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <img
                src="/logo.png"
                alt="Educaption Logo"
                className="w-12 h-12 object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="font-black text-2xl text-white">
                {t('common.appName')}
              </span>
            </Link>
            <p className="text-white/50 leading-relaxed mb-6">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg text-white mb-6">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="
                      text-white/50
                      hover:text-[#FF6B35]
                      transition-colors duration-200
                      inline-flex items-center gap-2
                    "
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]/50" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg text-white mb-6">
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
                      text-white/50
                      hover:text-[#FF6B35]
                      transition-colors duration-200
                      inline-flex items-center gap-2
                    "
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]/50" />
                    {label}
                    {external && <ExternalLink className="w-3 h-3 opacity-50" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg text-white mb-6">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@educaption.org"
                  className="
                    text-white/50
                    hover:text-[#FF6B35]
                    transition-colors duration-200
                    flex items-start gap-3
                  "
                >
                  <Mail className="w-5 h-5 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                  <span>info@educaption.org</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="
                    text-white/50
                    hover:text-[#FF6B35]
                    transition-colors duration-200
                    flex items-start gap-3
                  "
                >
                  <Phone className="w-5 h-5 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                <span className="text-white/50">
                  Tamil Nadu, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              {t('footer.copyright')}
            </p>
            <p className="text-sm text-white/40 flex items-center gap-2">
              {t('footer.madeWith')}
              <Heart className="w-4 h-4 text-[#FF6B35] fill-[#FF6B35]" />
              {t('footer.forStudents')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
