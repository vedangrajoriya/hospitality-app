import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAvailableRooms } from '@/hooks/useRooms';
import { useCreateBooking } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Users, CreditCard, Check, ArrowRight, Loader2, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import roomDeluxe from '@/assets/room-deluxe.jpg';
import roomExecutive from '@/assets/room-executive.jpg';
import roomPresidential from '@/assets/room-presidential.jpg';

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

const Booking = () => {
  const [searchParams] = useSearchParams();
  const preselectedRoomId = searchParams.get('room');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [selectedRoom, setSelectedRoom] = useState(preselectedRoomId || '');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [step, setStep] = useState(1);

  const { data: rooms = [], isLoading: roomsLoading } = useAvailableRooms();
  const createBooking = useCreateBooking();

  const selectedRoomData = rooms.find(r => r.id === selectedRoom);

  // Check authentication - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/booking${preselectedRoomId ? `?room=${preselectedRoomId}` : ''}`);
    }
  }, [authLoading, user, navigate, preselectedRoomId]);

  // Auto-select room if preselected and available
  useEffect(() => {
    if (preselectedRoomId && rooms.length > 0) {
      const room = rooms.find(r => r.id === preselectedRoomId);
      if (room) {
        setSelectedRoom(preselectedRoomId);
      }
    }
  }, [preselectedRoomId, rooms]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const subtotal = selectedRoomData ? Number(selectedRoomData.price) * nights : 0;
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to complete your booking');
      navigate('/login');
      return;
    }

    if (!selectedRoomData) {
      toast.error('Please select a room');
      return;
    }

    try {
      await createBooking.mutateAsync({
        room_id: selectedRoom,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: total,
        special_requests: specialRequests || undefined,
      });
      
      toast.success('Booking confirmed!', {
        description: 'You will receive a confirmation email shortly.',
      });
      navigate('/');
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  if (authLoading || roomsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-12 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <span className="text-accent font-medium text-sm tracking-widest uppercase">
              Reservations
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Book Your Stay
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete your reservation in just a few simple steps.
            </p>
          </div>
        </div>
      </section>

      {/* Auth Notice */}
      {!user && (
        <section className="py-4 bg-accent/10 border-b border-accent/20">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-foreground">
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign in to save your booking and access your reservation history.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="gold" size="sm" asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Progress */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Select Room' },
              { num: 2, label: 'Special Requests' },
              { num: 3, label: 'Confirmation' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step >= s.num ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={cn(
                    "text-sm font-medium hidden sm:block",
                    step >= s.num ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div className="w-12 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                      Select Your Dates & Room
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <Label htmlFor="checkin" className="text-foreground">Check-in Date</Label>
                        <div className="relative mt-2">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="checkin"
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="pl-10"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="checkout" className="text-foreground">Check-out Date</Label>
                        <div className="relative mt-2">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="checkout"
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="pl-10"
                            min={checkIn || new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <Label htmlFor="guests" className="text-foreground">Number of Guests</Label>
                      <div className="relative mt-2">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="guests"
                          type="number"
                          min={1}
                          max={6}
                          value={guests}
                          onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                          className="pl-10 w-32"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                      Choose Your Room
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {rooms.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => setSelectedRoom(room.id)}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                            selectedRoom === room.id 
                              ? "border-accent bg-accent/5 shadow-gold" 
                              : "border-border hover:border-accent/50"
                          )}
                        >
                          <img
                            src={room.image_url || getRoomImage(room.type)}
                            alt={room.name}
                            className="w-24 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-display font-semibold text-foreground">{room.name}</h4>
                            <p className="text-sm text-muted-foreground">{room.capacity} guests • {room.size} m²</p>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-xl font-bold text-foreground">₹{room.price.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-muted-foreground">per night</p>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            selectedRoom === room.id ? "border-accent bg-accent" : "border-muted"
                          )}>
                            {selectedRoom === room.id && <Check className="w-3 h-3 text-accent-foreground" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full md:w-auto"
                    disabled={!selectedRoom || !checkIn || !checkOut || nights < 1}
                    onClick={() => setStep(2)}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                      Special Requests
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="requests" className="text-foreground">Any special requests or preferences?</Label>
                        <Textarea
                          id="requests"
                          placeholder="E.g., Late check-in, room preferences, dietary requirements..."
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          className="mt-2 h-32"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Special requests are subject to availability and cannot be guaranteed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      onClick={() => setStep(3)}
                    >
                      Review Booking
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                      Review & Confirm
                    </h2>
                    
                    <div className="bg-secondary rounded-xl p-6 space-y-4">
                      {user && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Guest</span>
                          <span className="text-foreground font-medium">{user.email}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Room</span>
                        <span className="text-foreground font-medium">{selectedRoomData?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-in</span>
                        <span className="text-foreground">{new Date(checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-out</span>
                        <span className="text-foreground">{new Date(checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guests</span>
                        <span className="text-foreground">{guests}</span>
                      </div>
                      {specialRequests && (
                        <div className="pt-2 border-t border-border">
                          <span className="text-muted-foreground block mb-1">Special Requests</span>
                          <span className="text-foreground text-sm">{specialRequests}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!user && (
                    <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
                      <p className="text-foreground mb-4">
                        You need to sign in to complete your booking.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" asChild>
                          <Link to="/login">Sign In</Link>
                        </Button>
                        <Button variant="gold" asChild>
                          <Link to="/signup">Create Account</Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button 
                      variant="gold" 
                      size="lg" 
                      onClick={handleSubmit}
                      disabled={!user || createBooking.isPending}
                    >
                      {createBooking.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-card p-6 sticky top-32">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Booking Summary
                </h3>
                
                {selectedRoomData ? (
                  <>
                    <img
                      src={selectedRoomData.image_url || getRoomImage(selectedRoomData.type)}
                      alt={selectedRoomData.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-display font-semibold text-foreground">{selectedRoomData.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4 capitalize">{selectedRoomData.type}</p>

                    <div className="space-y-2 py-4 border-t border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">${selectedRoomData.price} × {nights} night{nights !== 1 ? 's' : ''}</span>
                        <span className="text-foreground">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxes & fees (12%)</span>
                        <span className="text-foreground">${tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-display text-2xl font-bold text-foreground">${total.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">Select a room to see pricing details.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
