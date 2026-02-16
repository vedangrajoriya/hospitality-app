import { Utensils, Dumbbell, Wifi, Car, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Utensils,
    title: 'Fine Dining',
    description: 'Award-winning restaurants featuring world-class cuisine prepared by renowned chefs.',
  },
  {
    icon: Dumbbell,
    title: 'Fitness & Spa',
    description: 'State-of-the-art fitness center and rejuvenating spa treatments for complete wellness.',
  },
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Complimentary high-speed internet throughout the property for seamless connectivity.',
  },
  {
    icon: Car,
    title: 'Valet Parking',
    description: 'Convenient valet parking service with secure underground parking facilities.',
  },
  {
    icon: ShieldCheck,
    title: '24/7 Security',
    description: 'Round-the-clock security and concierge service for your peace of mind.',
  },
  {
    icon: Sparkles,
    title: 'Housekeeping',
    description: 'Meticulous daily housekeeping with premium linens and amenities.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-accent font-medium text-sm tracking-widest uppercase">
            Amenities
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Exceptional Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We offer a comprehensive range of amenities designed to make your stay as comfortable and memorable as possible.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 bg-card rounded-xl shadow-soft hover:shadow-card transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
