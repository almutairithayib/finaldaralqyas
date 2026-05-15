import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const projectsData = t('projects.items') as any[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.project-card')
      if (cards) {
        gsap.from(cards, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="bg-navy py-[100px] lg:py-[140px]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="text-white/50 text-[13px] font-light tracking-[0.08em] block mb-4 rtl:text-right ltr:text-left">
          {t('projects.tag')}
        </span>
        <h2 className="text-white font-normal mb-14 lg:mb-16 rtl:text-right ltr:text-left" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: '1.35' }}>
          {t('projects.title')}
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projectsData.map((p: any, index: number) => (
            <div key={index} className="project-card group">
              <div className="aspect-video overflow-hidden rounded-xl">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-600"
                  loading="lazy"
                />
              </div>
              <div className="pt-6 rtl:text-right ltr:text-left">
                <span className="text-warm-gold text-[13px] font-light tracking-[0.04em]">
                  {p.client}
                </span>
                <h3 className="text-white font-medium text-xl mt-2 mb-3">
                  {p.title}
                </h3>
                <p className="text-white/60 text-[15px] leading-[26px] line-clamp-2 mb-4">
                  {p.desc}
                </p>
                <div className="flex gap-2 flex-wrap rtl:flex-row ltr:flex-row">
                  {p.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="border border-white/20 text-white/50 text-xs px-3 py-1 font-normal rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
