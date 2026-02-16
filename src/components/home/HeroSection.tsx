import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import heroImage from '@/assets/hero-hotel.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-3xl">
          {/* Rating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 mb-8 animate-fade-up">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-cream text-sm font-medium">Rated 5-Star Excellence</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Where Luxury
            <span className="block text-gradient-gold">Meets Serenity</span>
          </h1>

          {/* Subheadline */}
          <p className="text-cream/80 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Discover an unparalleled hospitality experience at Haven Hotel. From elegantly appointed rooms to world-class amenities, every moment is crafted for perfection.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/booking">
                Reserve Your Stay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/rooms">
                Explore Our Rooms
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-cream/20 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {[
              { value: '200+', label: 'Luxury Rooms' },
              { value: '15+', label: 'Years of Excellence' },
              { value: '50K+', label: 'Happy Guests' },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="font-display text-3xl md:text-4xl font-bold text-accent">{stat.value}</p>
                <p className="text-cream/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-cream/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-cream/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
