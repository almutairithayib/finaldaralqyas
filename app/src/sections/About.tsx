import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const { t, dir } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column animation - direction aware
      const leftEls = leftColRef.current?.querySelectorAll('.animate-in')
      if (leftEls) {
        gsap.from(leftEls, {
          x: dir === 'rtl' ? -40 : 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Right column animation
      if (rightColRef.current) {
        gsap.from(rightColRef.current, {
          x: dir === 'rtl' ? 40 : -40,
          opacity: 0,
          scale: 1.03,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [dir])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-stone-light py-[100px] lg:py-[140px]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Content column */}
          <div ref={leftColRef} className="lg:col-span-3 text-right rtl:text-right ltr:text-left">


            <h2 className="animate-in text-navy font-normal leading-tight mb-6" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: '1.35' }}>
              {t('about.vision')}
            </h2>
            <p className="animate-in text-navy/75 leading-relaxed max-w-[520px] mb-12 rtl:mr-0 rtl:ml-auto ltr:ml-0 ltr:mr-auto" style={{ fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: '1.9' }}>
              {t('about.visionText')}
            </p>

            <h2 className="animate-in text-navy font-normal leading-tight mb-6" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: '1.35' }}>
              {t('about.mission')}
            </h2>
            <p className="animate-in text-navy/75 leading-relaxed max-w-[520px] rtl:mr-0 rtl:ml-auto ltr:ml-0 ltr:mr-auto" style={{ fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: '1.9' }}>
              {t('about.missionText')}
            </p>
          </div>

          {/* Image column */}
          <div ref={rightColRef} className="lg:col-span-2 flex flex-col">
            <div className="relative overflow-hidden aspect-[3/4] rounded-2xl shadow-2xl">
              <img
                src="/about.jpg"
                alt="Architecture"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-8 pt-8 border-t border-stone-dark flex flex-col items-start rtl:items-end ltr:items-start">
              <span className="text-warm-gold font-light text-[clamp(36px,4vw,52px)] leading-none block">
                +500
              </span>
              <span className="text-navy text-base font-normal mt-2 block opacity-70">
                {t('about.stats')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
