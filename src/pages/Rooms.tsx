import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useRooms, Room } from '@/hooks/useRooms';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Maximize, Check, Filter, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import roomDeluxe from '@/assets/room-deluxe.jpg';
import roomExecutive from '@/assets/room-executive.jpg';
import roomPresidential from '@/assets/room-presidential.jpg';

type RoomFilter = 'all' | Room['type'];

// Map room types to local images
const getRoomImage = (type: string) => {
  switch (type) {
    case 'presidential':
      return roomPresidential;
    case 'executive':
      return roomExecutive;
    default:
      return roomDeluxe;
  }
};

const Rooms = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<RoomFilter>('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  
  const { data: rooms = [], isLoading, error } = useRooms();

  const handleBooking = (roomId: string) => {
    if (!user) {
      navigate(`/login?redirect=/booking?room=${roomId}`);
      return;
    }
    navigate(`/booking?room=${roomId}`);
  };

  const filteredRooms = rooms.filter((room) => {
    if (filter !== 'all' && room.type !== filter) return false;
    if (showAvailableOnly && !room.available) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <span className="text-accent font-medium text-sm tracking-widest uppercase">
              Accommodations
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Our Rooms & Suites
            </h1>
            <p className="text-muted-foreground text-lg">
              From elegant deluxe rooms to opulent presidential suites, find your perfect sanctuary.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-md z-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filter:</span>
            </div>
            
            {(['all', 'deluxe', 'executive', 'presidential'] as RoomFilter[]).map((type) => (
              <Button
                key={type}
                variant={filter === type ? 'gold' : 'outline'}
                size="sm"
                onClick={() => setFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}

            <div className="h-6 w-px bg-border mx-2" />

            <Button
              variant={showAvailableOnly ? 'gold' : 'outline'}
              size="sm"
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            >
              {showAvailableOnly && <X className="w-3 h-3 mr-1" />}
              Available Only
            </Button>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive text-lg">Failed to load rooms. Please try again.</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No rooms match your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setFilter('all'); setShowAvailableOnly(false); }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room, index) => (
                <div
                  key={room.id}
                  className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={room.image_url || getRoomImage(room.type)}
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

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(room.features || []).slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded text-xs text-secondary-foreground"
                        >
                          <Check className="w-3 h-3 text-accent" />
                          {feature}
                        </span>
                      ))}
                    </div>

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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rooms;
