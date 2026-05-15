import { useLanguage } from '../contexts/LanguageContext'

// gov1 = blank/transparent → removed
// gov2 = fake target icon → removed
// gov7 = Bank Al Jazira (has large whitespace, boosted with scale)
const allLogos: { src: string; boost?: boolean }[] = [
  // Government sector (gov1 & gov2 removed)
  { src: '/clients/gov3.png' },
  { src: '/clients/gov4.png' },
  { src: '/clients/gov5.png' },
  { src: '/clients/gov6.png' },
  { src: '/clients/gov7.png', boost: true },  // بنك الجزيرة
  { src: '/clients/gov8.png' },
  { src: '/clients/gov9.png' },
  { src: '/clients/gov10.png' },
  { src: '/clients/gov11.png' },
  { src: '/clients/gov12.png' },
  { src: '/clients/gov13.png' },
  { src: '/clients/gov14.png' },
  { src: '/clients/gov15.png' },
  { src: '/clients/gov16.png' },
  // Corporate
  { src: '/clients/corp1.png' },
  { src: '/clients/corp2.png' },
  { src: '/clients/corp3.png' },
  { src: '/clients/corp4.png' },
  { src: '/clients/corp5.png' },
  // Financial
  { src: '/clients/fin1.png' },
  { src: '/clients/fin2.png' },
  { src: '/clients/fin3.png' },
  { src: '/clients/fin4.png' },
  // Misc
  { src: '/clients/misc1.png' },
  { src: '/clients/misc2.png' },
  { src: '/clients/misc3.png' },
]

export default function Clients() {
  const { t } = useLanguage()

  return (
    <section id="clients" className="bg-stone-50 py-[100px] lg:py-[140px]">
      {/* Section Header */}
      <div className="max-w-[1200px] mx-auto px-6 mb-20 rtl:text-right ltr:text-left">
        <h2 className="text-navy font-light leading-tight" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
          {t('clients.title')}
        </h2>
      </div>

      {/* Logos Grid — all logos, static, medium size */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5 lg:gap-6">
          {allLogos.map((logo, i) => (
            <div
              key={i}
              className="bg-white border border-navy/5 rounded-xl p-4 flex items-center justify-center h-[120px] transition-all duration-300 hover:shadow-lg hover:border-warm-gold/30 group"
            >
              <img
                src={logo.src}
                alt="Client Logo"
                className={`object-contain transition-transform duration-300 group-hover:scale-110 ${
                  logo.boost
                    ? 'w-full h-full scale-125'   // Bank Al Jazira: bigger to fill frame
                    : 'max-w-full max-h-full'
                }`}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
