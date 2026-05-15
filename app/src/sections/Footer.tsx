import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  const handleNav = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const links = [
    { label: t('nav.home'), id: 'hero' },
    { label: t('nav.services'), id: 'services' },
    { label: t('nav.projects'), id: 'projects' },
    { label: t('nav.clients'), id: 'clients' },
    { label: t('nav.contact'), id: 'contact' },
  ]

  return (
    <footer
      className="py-16 lg:py-20 pb-10"
      style={{
        background: 'linear-gradient(to bottom, #011D30 0%, #02375A 100%)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 items-start rtl:text-right ltr:text-left">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-4 rtl:flex-row ltr:flex-row-reverse justify-end">
              <span className="text-white font-medium text-lg">
                {t('footer.name')}
              </span>
              <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            </div>
            <span className="text-white/40 font-dm text-[13px] tracking-tight block">
              Dar Al Qiyas for Professional Consulting
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="text-white/60 text-sm font-normal leading-8 hover:text-white transition-colors duration-300 rtl:text-right ltr:text-left"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-[1px] bg-white/10" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 items-center">
          <span className="text-white/30 text-[13px] font-normal text-center sm:text-right">
            © {new Date().getFullYear()} {t('footer.name')}. {t('footer.rights')}
          </span>
          <div className="flex items-center gap-2 text-white/30 text-[13px]">
            <span>{t('footer.builtBy')}</span>
            <div className="w-8 h-[1px] bg-white/20" />
          </div>
        </div>
      </div>
    </footer>
  )
}
