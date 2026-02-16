import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold-light rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
            Ready to Experience
            <span className="block text-gradient-gold">Luxury Living?</span>
          </h2>
          <p className="text-cream/70 text-lg mb-10 max-w-xl mx-auto">
            Book your stay today and discover why Haven Hotel has been the destination of choice for discerning travelers worldwide.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/booking">
                Book Your Stay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="tel:+15551234567">
                <Phone className="w-5 h-5 mr-2" />
                Call Us
              </a>
            </Button>
          </div>

          <p className="text-cream/50 text-sm mt-8">
            Need help? Our reservations team is available 24/7 to assist you.
          </p>
        </div>
      </div>
    </section>
  );
}
