import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, Sparkles, TrendingUp, Users, Zap, BarChart3 } from 'lucide-react';

/* Floating animated card data */
const floatingCards = [
  { icon: TrendingUp, label: 'Payroll Automated', value: '99.9%', color: 'from-blue-400 to-cyan-400', delay: '0s', pos: 'top-6 left-4' },
  { icon: Users, label: 'Manpower Deployed', value: '500+', color: 'from-purple-400 to-pink-400', delay: '0.4s', pos: 'top-4 right-6' },
  { icon: BarChart3, label: 'Compliance Rate', value: '100%', color: 'from-green-400 to-emerald-400', delay: '0.8s', pos: 'bottom-8 left-8' },
  { icon: Zap, label: 'Faster Processing', value: '3×', color: 'from-yellow-400 to-orange-400', delay: '1.2s', pos: 'bottom-6 right-4' },
];

const CTASection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getServiceName = () => {
    if (location.pathname.includes('hr-services')) return 'HR Operations';
    if (location.pathname.includes('recruitment-manpower')) return 'Recruitment & Manpower';
    if (location.pathname.includes('rcu-verification')) return 'RCU & Verification';
    if (location.pathname.includes('payroll')) return 'Payroll Operations';
    if (location.pathname.includes('project-outsourcing')) return 'Technology Operations';
    return 'HR Operations';
  };

  const serviceName = getServiceName();

  const handleContactClick = () => {
    if (location.pathname === '/contact') {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact');
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  /* ── Particle canvas animation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      });
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-700" />

      {/* Animated particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Soft radial glow blobs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — Text & CTAs */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Start Your Transformation
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-white leading-tight mb-5">
              Ready to Transform<br />
              <span className="text-yellow-300">Your {serviceName}?</span>
            </h2>

            <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
              Join 100+ businesses that have already moved from manual, error-prone HR processes to fully automated, compliant, and scalable operations with IQS.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { value: '10,000+', label: 'Employees managed' },
                { value: '98.9%', label: 'Client retention' },
                { value: '5+ yrs', label: 'Industry experience' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/55 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleContactClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
              >
                Get Started Today
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:+917042559158"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 text-sm backdrop-blur-sm"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
              </a>
            </div>
          </div>

          {/* RIGHT — Animated transformation visual */}
          <div className="relative h-72 md:h-96 flex items-center justify-center">

            {/* Central pulsing orb */}
            <div className="relative w-36 h-36">
              {/* Outer rings */}
              <div className="absolute inset-0 rounded-full border-2 border-white/15 animate-ping" style={{ animationDuration: '2.5s' }} />
              <div className="absolute inset-3 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />
              <div className="absolute inset-6 rounded-full border-2 border-white/25 animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.8s' }} />

              {/* Core glowing circle */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl">
                <svg viewBox="0 0 60 60" className="w-16 h-16 drop-shadow-lg" fill="none">
                  {/* Gear / cog transformation icon */}
                  <circle cx="30" cy="30" r="10" fill="white" opacity="0.9" />
                  <circle cx="30" cy="30" r="6" fill="#1D4ED8" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <rect
                      key={i}
                      x="27" y="14"
                      width="6" height="9"
                      rx="2"
                      fill="white"
                      opacity="0.85"
                      transform={`rotate(${deg} 30 30)`}
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from={`${deg} 30 30`}
                        to={`${deg + 360} 30 30`}
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  ))}
                  {/* Arrow up inside */}
                  <path d="M26 32 L30 26 L34 32" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="30" y1="26" x2="30" y2="35" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Floating metric cards */}
            {floatingCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className={`absolute ${card.pos} bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2.5 shadow-xl`}
                  style={{
                    animation: `floatCard 3s ease-in-out infinite`,
                    animationDelay: card.delay,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0 shadow`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-base leading-none">{card.value}</div>
                      <div className="text-white/60 text-[10px] mt-0.5 whitespace-nowrap">{card.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Dashed orbit circle */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 300">
              <ellipse cx="200" cy="150" rx="160" ry="110" stroke="white" strokeWidth="1" strokeDasharray="6 8" fill="none">
                <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="18s" repeatCount="indefinite" />
              </ellipse>
            </svg>
          </div>
        </div>
      </div>

      {/* Inline keyframe for float animation */}
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
};

export default CTASection;