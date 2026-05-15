import { useLanguage } from '../contexts/LanguageContext'
import { useLenis } from '../hooks/useLenis'
import Navbar from '../sections/Navbar'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Services from '../sections/Services'
import Clients from '../sections/Clients'
import Projects from '../sections/Projects'
import Contact from '../sections/Contact'


export default function Home() {
  useLenis()
  const { dir } = useLanguage()

  return (
    <div className="relative" dir={dir}>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Clients />
      <Projects />
      <Contact />

    </div>
  )
}
