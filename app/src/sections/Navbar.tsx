import { useEffect, useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { getAssetPath } from '../lib/utils'

export default function Navbar() {
  const { t, language, toggleLanguage } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const navLinks = [
    { label: t('nav.home'), href: '#hero' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.clients'), href: '#clients' },
    { label: t('nav.projects'), href: '#projects' },
    { label: t('nav.contact'), href: '#contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['hero', 'about', 'services', 'clients', 'projects', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.1, rootMargin: '-40% 0px -40% 0px' }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleNav = (href: string) => {
    setMobileOpen(false)
    const id = href.replace('#', '')
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300 ${
          scrolled ? 'bg-navy/95 backdrop-blur-xl shadow-lg' : 'bg-navy/80 backdrop-blur-md'
        }`}
      >
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => handleNav('#hero')} className="flex items-center gap-3 group">
            <img src={getAssetPath('/logo.png')} alt="Logo" className="h-10 w-auto object-contain" />
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`relative text-[15px] font-medium tracking-wide transition-colors duration-300 outline-none ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-warm-gold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-current transition-transform duration-300 origin-left ${
                    activeSection === link.href.replace('#', '')
                      ? 'scale-x-100'
                      : 'scale-x-0'
                  }`}
                  style={{ width: '100%' }}
                />
              </button>
            ))}
          </div>

          {/* Language + CTA + Hamburger */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30"
            >
              <Globe size={18} />
              <span className="text-sm font-medium uppercase">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            <button
              onClick={() => window.open('https://wa.me/966530092400', '_blank')}
              className="hidden md:flex items-center gap-2 bg-[#25D366] text-white px-7 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 hover:brightness-110 rounded-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              {t('nav.requestConsult')}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-navy flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-300">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={`text-2xl font-medium tracking-wide transition-colors outline-none ${
                activeSection === link.href.replace('#', '')
                  ? 'text-warm-gold'
                  : 'text-white hover:text-warm-gold'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-white text-xl font-medium mt-4 border-b border-white/20 pb-2"
          >
            <Globe size={24} />
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
          <button
            onClick={() => handleNav('#contact')}
            className="border border-white text-white px-8 py-3 text-lg font-medium mt-4 hover:bg-white hover:text-navy transition-all duration-300"
          >
            {t('nav.requestConsult')}
          </button>
        </div>
      )}
    </>
  )
}
