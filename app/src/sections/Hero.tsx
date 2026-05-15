import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useLanguage } from '../contexts/LanguageContext'
import { getAssetPath } from '../lib/utils'

export default function Hero() {
  const { t, language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = canvasContainerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x02375A)
    scene.fog = new THREE.Fog(0x02375A, 8, 25)

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0.5, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1.2)
    pointLight.position.set(-5, 8, -5)
    scene.add(pointLight)

    const fillLight = new THREE.PointLight(0xC4A265, 0.4)
    fillLight.position.set(5, -3, 5)
    scene.add(fillLight)

    // Text ring logic simplified for character objects
    const group = new THREE.Group()
    const characterCount = 24
    const angleStep = (Math.PI * 2) / characterCount
    const ringRadius = 6

    for (let i = 0; i < characterCount; i++) {
      const geom = new THREE.BoxGeometry(0.3, 0.8, 0.1)
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.6,
      })
      const mesh = new THREE.Mesh(geom, mat)
      const angle = i * angleStep
      mesh.position.set(
        Math.cos(angle) * ringRadius,
        0,
        Math.sin(angle) * ringRadius
      )
      mesh.lookAt(0, 0, 0)
      group.add(mesh)
    }
    scene.add(group)

    let speed = 0.003
    let rafId: number

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      group.rotation.y += speed
      renderer.render(scene, camera)
    }
    animate()

    // Entrance animation for UI elements
    const els = [
      { el: labelRef.current, delay: 0.3 },
      { el: titleRef.current, delay: 0.6 },
      { el: subtitleRef.current, delay: 0.9 },
      { el: ctaRef.current, delay: 1.2 },
    ]
    els.forEach(({ el, delay }) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      setTimeout(() => {
        el.style.transition = 'opacity 1s cubic-bezier(0.33, 1, 0.68, 1), transform 1s cubic-bezier(0.33, 1, 0.68, 1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, delay * 1000)
    })

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  const handleCta = () => {
    const el = document.getElementById('services')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScrollDown = () => {
    const el = document.getElementById('about')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-navy">
      {/* 3D Canvas */}
      <div
        ref={canvasContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(2,55,90,0.3) 0%, rgba(1,29,48,0.7) 100%)',
        }}
      />

      {/* Foreground UI */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
      >
        {/* Top label */}
        <div
          ref={labelRef}
          className="mb-8 opacity-0"
        >
          <img src={getAssetPath('/logo.png')} alt="Logo" className="h-20 w-auto object-contain" />
        </div>

        {/* Main headline */}
        <h1
          ref={titleRef}
          className="text-white text-center font-light leading-tight opacity-0"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '0.02em' }}
        >
          {language === 'ar' ? (
            <>
              <span className="block">حلول هندسية</span>
              <span className="block text-warm-gold">مبتكرة</span>
              <span className="block">ومستدامة</span>
            </>
          ) : (
            <>
              <span className="block">Innovative</span>
              <span className="block text-warm-gold">& Sustainable</span>
              <span className="block">Engineering Solutions</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-white/70 text-center mt-6 max-w-[600px] leading-relaxed opacity-0"
          style={{ fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: '1.8' }}
        >
          {t('hero.subtitle')}
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          onClick={handleCta}
          className="relative z-10 mt-8 bg-warm-gold text-navy px-9 py-3.5 font-medium text-base tracking-wide transition-all duration-300 hover:brightness-110 opacity-0"
        >
          {t('hero.cta')}
        </button>

        {/* Scroll indicator */}
        <button
          onClick={handleScrollDown}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-80 transition-opacity"
          aria-label="Scroll down"
        >
          <div className="w-[1px] h-10 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-white animate-scroll-down" />
          </div>
        </button>
      </div>
    </section>
  )
}
