import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import ScrollReelTestimonials from '../../components/ui/ScrollReelTestimonials';
import SplineHero from '../../components/ui/SplineHero';

const TESTIMONIALS = [
  {
    quote: "Adopting Mochi changed our lives. The team was so supportive and the process was beautifully seamless.",
    author: "Sarah & David, Adopted a Golden Retriever",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80&auto=format&fit=crop",
    alt: "Happy dog",
  },
  {
    quote: "The emergency SOS feature saved a stray kitten outside my office. Unbelievable response time by the rescue team.",
    author: "Michael T., Community Member",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80&auto=format&fit=crop",
    alt: "Cute cat",
  },
  {
    quote: "I love the live cams! It's so heartwarming to watch these animals recover, play, and eventually find their forever homes.",
    author: "Emma R., Monthly Donor",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80&auto=format&fit=crop",
    alt: "Puppy",
  },
];

export default function HomePage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 } 
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div ref={containerRef} className="page-transition" style={{ height: '100%', overflowY: 'auto', backgroundColor: 'var(--bg-page)', color: 'var(--text)', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', WebkitOverflowScrolling: 'touch' }}>
      
      <style>{`
        .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .animate-on-scroll.animate-in { opacity: 1; transform: translateY(0); }
        .parallax-bg { background-attachment: fixed; background-position: center; background-repeat: no-repeat; background-size: cover; }
      `}</style>

      {/* ==============================================
          SECTION 1: SPLINE 3D HERO
          ============================================== */}
      <SplineHero />

      {/* ==============================================
          SECTION 2: TESTIMONIAL REEL
          ============================================== */}
      <div className="animate-on-scroll" style={{ width: '100%', padding: '80px 20px', backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)', margin: '0 0 10px 0', letterSpacing: '-1px' }}>Stories of Hope</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: 0 }}>Hear from the families and communities we've touched.</p>
        </div>
        <ScrollReelTestimonials testimonials={TESTIMONIALS} />
      </div>

      {/* ==============================================
          SECTION 3: THE DATA
          ============================================== */}
      <div style={{ width: '100%', minHeight: '60vh', padding: '80px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-40%', width: '400px', height: '400px', border: '1px solid rgba(136, 152, 101, 0.2)', borderRadius: '50%' }} />
        <div className="animate-on-scroll">
          <span style={{ fontSize: 'clamp(6rem, 15vw, 9rem)', fontWeight: '300', color: 'var(--sage)', lineHeight: '1', letterSpacing: '-4px', display: 'block' }}>82%</span>
          <h3 style={{ margin: '20px 0 0 0', fontSize: '2rem', fontWeight: '400', lineHeight: '1.2', letterSpacing: '-1px', maxWidth: '400px' }}>Of rescued animals find their forever homes within weeks of treatment.</h3>
          <p style={{ margin: '20px 0 0 0', fontSize: '1.1rem', color: 'var(--text-muted)', opacity: 0.9, lineHeight: '1.6', maxWidth: '400px' }}>Rapid response dispatching connects volunteers with injured strays in minutes, significantly increasing their chances of a full recovery.</p>
        </div>
      </div>


      
    </div>
  );
}