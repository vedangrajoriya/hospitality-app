import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Maximize, Check } from 'lucide-react';
import { rooms } from '@/data/rooms';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const featuredRooms = rooms.slice(0, 3);

export function FeaturedRooms() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBooking = (roomId: string) => {
    if (!user) {
      navigate(`/login?redirect=/booking?room=${roomId}`);
      return;
    }
    navigate(`/booking?room=${roomId}`);
  };
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-accent font-medium text-sm tracking-widest uppercase">
            Accommodations
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Our Featured Rooms
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each room is thoughtfully designed to provide the perfect blend of comfort and sophistication for an unforgettable stay.
          </p>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room, index) => (
            <div
              key={room.id}
              className={cn(
                "group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-up",
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {!room.available && (
                  <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                    <span className="px-4 py-2 bg-destructive text-destructive-foreground rounded-full text-sm font-medium">
                      Fully Booked
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                    room.type === 'presidential' && "bg-accent text-accent-foreground",
                    room.type === 'executive' && "bg-navy text-cream",
                    room.type === 'deluxe' && "bg-secondary text-secondary-foreground",
                  )}>
                    {room.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {room.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Features */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{room.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    <span>{room.size} m²</span>
                  </div>
                </div>

                {/* Amenities Preview */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded text-xs text-secondary-foreground"
                    >
                      <Check className="w-3 h-3 text-accent" />
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="font-display text-2xl font-bold text-foreground">₹{room.price.toLocaleString('en-IN')}</span>
                    <span className="text-muted-foreground text-sm">/night</span>
                  </div>
                  <Button 
                    variant={room.available ? "gold" : "outline"} 
                    size="sm"
                    disabled={!room.available}
                    onClick={() => room.available && handleBooking(room.id)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/rooms">
              View All Rooms
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
