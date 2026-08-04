import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { Logo } from './Logo'
import { SITE, NAV_LINKS } from '@/config/site'

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-ivory-100">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Logo light />
            <p className="mt-4 max-w-sm text-ivory-300 leading-relaxed">{SITE.description}</p>
            <p className="mt-4 font-display text-lg text-champagne-300 italic">{SITE.tagline}</p>
          </div>

          <div>
            <h4 className="font-display text-lg text-champagne-300 mb-4">Explore</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-ivory-300 hover:text-champagne-300 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-champagne-300 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-ivory-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-champagne-400" />
                <a href={`mailto:${SITE.email}`} className="hover:text-champagne-300 transition-colors">{SITE.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-champagne-400" />
                <span>{SITE.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-champagne-400" />
                <span>{SITE.address}</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="text-ivory-300 hover:text-champagne-300 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="text-ivory-300 hover:text-champagne-300 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ivory-400">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-ivory-400">
            <Link to="/privacy-policy" className="hover:text-champagne-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-champagne-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
