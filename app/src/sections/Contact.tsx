import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Globe, Mail } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const WHATSAPP_NUMBER = '966530092400'

const VERT = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAG_RIPPLE = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform vec4 u_mouse;
uniform float u_time;
uniform float u_mouseActive;
out vec4 outColor;

void main() {
  vec2 uv = v_uv;
  vec2 texel = 1.0 / u_resolution;
  float strength = 0.0;
  vec2 mouseUV = u_mouseActive > 0.5 ? u_mouse.xy / u_resolution : vec2(-10.);
  float dist = distance(uv, mouseUV);
  float falloff = smoothstep(0.5, 0.0, dist);
  strength += falloff * 0.3;
  vec4 prev = texture(u_texture, uv);
  float state = prev.r;
  state *= 0.98;
  float blur = 0.0;
  blur += texture(u_texture, uv + vec2(texel.x, 0.0)).r;
  blur += texture(u_texture, uv - vec2(texel.x, 0.0)).r;
  blur += texture(u_texture, uv + vec2(0.0, texel.y)).r;
  blur += texture(u_texture, uv - vec2(0.0, texel.y)).r;
  blur *= 0.25;
  state = mix(state, blur, 0.4);
  float newHeight = state + strength * 0.5;
  outColor = vec4(newHeight, blur, 0.0, 1.0);
}`

const FRAG_DISPLAY = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_rippleTexture;
uniform sampler2D u_waterNormal;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float rippleNoise(vec2 uv, float t) {
  vec2 p = uv * 5.0;
  return (noise(p + t * 0.3) + noise(p * 1.5 - t * 0.2) * 0.5 + noise(p * 0.7 + t * 0.4) * 0.25) / 1.75;
}
vec3 sampleNormal(vec2 uv, float t) {
  return texture(u_waterNormal, uv * 2.0 + vec2(t * 0.01, 0.0)).rgb * 0.5
       + texture(u_waterNormal, uv * 4.0 + vec2(0.0, t * 0.015)).rgb * 0.3
       + texture(u_waterNormal, uv * 8.0 + t * 0.02).rgb * 0.2;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = u_time;
  float radius = length(p);
  float wave = rippleNoise(p * 2.0, t);
  float rings = sin(radius * 20.0 - t * 1.5 + wave * 2.0) * 0.5 + 0.5;
  float spiral = sin(atan(p.y, p.x) * 3.0 + radius * 15.0 - t * 2.0) * 0.5 + 0.5;
  float pattern = rings * 0.6 + spiral * 0.4;
  vec4 rippleData = texture(u_rippleTexture, uv);
  vec2 rippleUV = uv + rippleData.x * 0.1;
  vec3 waterNormal = normalize(sampleNormal(rippleUV, t).rgb * 2.0 - 1.0);
  float rippleMix = rippleNoise(rippleUV * 3.0, t * 0.7) * 0.6 + sin(length(rippleUV - 0.5) * 25.0 - t * 2.0) * 0.2 + 0.2;
  vec3 col1 = vec3(0.008, 0.216, 0.353); vec3 col2 = vec3(0.769, 0.635, 0.396);
  vec3 col3 = vec3(0.957, 0.957, 0.941); vec3 col4 = vec3(0.5, 0.6, 0.7);
  vec3 col5 = vec3(0.008, 0.114, 0.188);
  vec3 color = mix(col1, col5, smoothstep(0.3, 0.7, pattern));
  color = mix(color, col2, smoothstep(0.5, 0.8, pattern) * 0.3);
  color = mix(color, col5, smoothstep(0.4, 0.1, pattern) * 0.5);
  color = mix(color, mix(col3, col1, smoothstep(0.3, 0.7, rippleMix)), 0.4);
  color = mix(color, col4, smoothstep(0.5, 0.8, rippleMix) * 0.3);
  color += col2 * max(dot(waterNormal, normalize(vec3(0.5, 0.8, 1.0))), 0.0) * 0.2;
  color = mix(color, col1, smoothstep(0.0, 1.0, radius) * 0.3);
  color = pow(color, vec3(0.9));
  outColor = vec4(color, 1.0);
}`

function createFBO(gl: WebGL2RenderingContext, w: number, h: number) {
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const fb = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { tex, fb }
}

function compileShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s))
  return s
}

export default function Contact() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false })
    if (!gl) return
    gl.getExtension('EXT_color_buffer_float')

    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const fsRipple = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_RIPPLE)
    const fsDisplay = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_DISPLAY)

    const progRipple = gl.createProgram()!
    gl.attachShader(progRipple, vs); gl.attachShader(progRipple, fsRipple); gl.linkProgram(progRipple)

    const vs2 = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const progDisplay = gl.createProgram()!
    gl.attachShader(progDisplay, vs2); gl.attachShader(progDisplay, fsDisplay); gl.linkProgram(progDisplay)

    let w = Math.min(canvas.clientWidth, 1920)
    let h = Math.min(canvas.clientHeight, 1080)
    let fbo0 = createFBO(gl, w, h)
    let fbo1 = createFBO(gl, w, h)

    const waterNormalTex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, waterNormalTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 255, 255]))
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, waterNormalTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    }
    img.src = '/water-normal.jpg'

    const mouse = { x: 0, y: 0, active: 0 }
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) * (w / rect.width)
      mouse.y = (rect.height - (e.clientY - rect.top)) * (h / rect.height)
      mouse.active = 1
    }
    const onMouseLeave = () => { mouse.active = 0 }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    const lRR = gl.getUniformLocation(progRipple, 'u_resolution')
    const lRT = gl.getUniformLocation(progRipple, 'u_texture')
    const lRM = gl.getUniformLocation(progRipple, 'u_mouse')
    const lRTi = gl.getUniformLocation(progRipple, 'u_time')
    const lRA = gl.getUniformLocation(progRipple, 'u_mouseActive')
    const lDR = gl.getUniformLocation(progDisplay, 'u_resolution')
    const lDT = gl.getUniformLocation(progDisplay, 'u_time')
    const lDRip = gl.getUniformLocation(progDisplay, 'u_rippleTexture')
    const lDN = gl.getUniformLocation(progDisplay, 'u_waterNormal')

    let time = 0, rafId: number, running = true

    const render = () => {
      if (!running) return
      rafId = requestAnimationFrame(render)
      time += 0.016
      const cw = Math.min(canvas.clientWidth, 1920)
      const ch = Math.min(canvas.clientHeight, 1080)
      if (cw !== w || ch !== h) { w = cw; h = ch; fbo0 = createFBO(gl, w, h); fbo1 = createFBO(gl, w, h) }
      canvas.width = w; canvas.height = h
      gl.viewport(0, 0, w, h)

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1.fb)
      gl.useProgram(progRipple)
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fbo0.tex)
      gl.uniform2f(lRR, w, h); gl.uniform1i(lRT, 0)
      gl.uniform4f(lRM, mouse.x, mouse.y, 0, 0); gl.uniform1f(lRTi, time); gl.uniform1f(lRA, mouse.active)
      const p1 = gl.getAttribLocation(progRipple, 'a_position')
      gl.enableVertexAttribArray(p1); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.vertexAttribPointer(p1, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      const tmp = fbo0; fbo0 = fbo1; fbo1 = tmp

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.useProgram(progDisplay)
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fbo0.tex)
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, waterNormalTex)
      gl.uniform2f(lDR, w, h); gl.uniform1f(lDT, time); gl.uniform1i(lDRip, 0); gl.uniform1i(lDN, 1)
      const p2 = gl.getAttribLocation(progDisplay, 'a_position')
      gl.enableVertexAttribArray(p2); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.vertexAttribPointer(p2, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    render()

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { if (!running) { running = true; render() } }
        else { running = false }
      })
    }, { threshold: 0.1 })
    observer.observe(sectionRef.current!)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = contentRef.current?.querySelectorAll('.animate-in')
      if (els) {
        gsap.from(els, {
          y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')
  }

  return (
    <section id="contact" ref={sectionRef} className="relative min-h-[600px] lg:min-h-screen overflow-hidden">
      {/* WebGL Canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

      {/* Content Overlay */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center min-h-[600px] lg:min-h-screen px-6 py-20">
        <h2
          className="animate-in text-white font-normal text-center"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: '1.3', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        >
          {t('contact.title')}
        </h2>
        <p className="animate-in text-white/80 text-lg lg:text-xl text-center max-w-[500px] mt-5 leading-relaxed">
          {t('contact.subtitle')}
        </p>

        <div className="animate-in flex flex-col sm:flex-row gap-5 mt-12">
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-10 py-4 font-medium text-base tracking-wide transition-all duration-300 hover:brightness-110 hover:shadow-lg rounded-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {t('contact.whatsapp')}
          </button>


        </div>

        <div className="animate-in flex flex-col sm:flex-row gap-8 sm:gap-14 mt-16 items-center">
          <a 
            href="https://maps.app.goo.gl/8uzzGvWFCjGjkADC6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
          >
            <MapPin size={16} />
            <span>{t('contact.location')}</span>
          </a>
          <a 
            href="mailto:info@daralqiyas.com"
            className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
          >
            <Mail size={16} />
            <span>info@daralqiyas.com</span>
          </a>
        </div>
      </div>
    </section>
  )
}
