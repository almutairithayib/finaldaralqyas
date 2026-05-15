import { useRef } from 'react'
import { 
  Layout, 
  Zap, 
  HardHat, 
  Map, 
  FileSearch, 
  Box,
  FileCheck,
  ShieldAlert,
  Leaf
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const icons = [Layout, Zap, HardHat, Map, FileSearch, Box, FileCheck, ShieldAlert, Leaf]

export default function Services() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const servicesData = t('services.items') as any[]

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-navy py-[100px] lg:py-[140px]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <p className="text-warm-gold text-lg lg:text-xl font-medium leading-relaxed rtl:text-right ltr:text-left">
            {t('services.desc')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {servicesData.map((s, index) => {
            const Icon = icons[index]
            const num = (index + 1).toString().padStart(2, '0')
            return (
              <div
                key={index}
                className="group relative bg-white/[0.08] border border-white/20 p-10 lg:p-12 rounded-[2rem] transition-all duration-500 hover:bg-white/[0.12] hover:border-warm-gold hover:-translate-y-3 cursor-pointer flex flex-col shadow-2xl rtl:text-right ltr:text-left"
              >
                <div className="flex justify-between items-start mb-12 rtl:flex-row ltr:flex-row-reverse">
                  <div className="w-20 h-20 rounded-[1.25rem] bg-warm-gold/20 flex items-center justify-center text-warm-gold transition-all duration-500 group-hover:bg-warm-gold group-hover:text-navy group-hover:rotate-6">
                    <Icon size={40} />
                  </div>
                  <span className="text-white/20 text-6xl font-light font-dm tracking-tighter">
                    {num}
                  </span>
                </div>
                
                <h3 className="text-white font-bold text-2xl mb-6 group-hover:text-warm-gold transition-colors leading-tight">
                  {s.title}
                </h3>
                
                <p className="text-white/60 text-[17px] leading-relaxed mb-10 flex-grow">
                  {s.desc}
                </p>

                <div className="space-y-4 mt-auto border-t border-white/10 pt-10 flex flex-col items-center">
                  {s.sub.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 text-[15px] text-white/50 justify-center group/item">
                      <div className="w-2 h-2 rounded-full bg-warm-gold/40 group-hover/item:bg-warm-gold transition-colors shadow-sm shrink-0" />
                      <span className="group-hover/item:text-white/90 transition-colors text-center">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
