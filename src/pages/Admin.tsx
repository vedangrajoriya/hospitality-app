import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Bed, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Home,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { rooms } from '@/data/rooms';
import { supabase } from '@/integrations/supabase/client';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Bed, label: 'Rooms', id: 'rooms' },
  { icon: Calendar, label: 'Bookings', id: 'bookings' },
  { icon: Users, label: 'Guests', id: 'guests' },
  { icon: BarChart3, label: 'Reports', id: 'reports' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

// Mock data
const stats = [
  { label: 'Total Rooms', value: '200', icon: Bed, change: '+2.5%' },
  { label: 'Occupancy Rate', value: '78%', icon: TrendingUp, change: '+12.3%' },
  { label: 'Active Bookings', value: '156', icon: Calendar, change: '+8.1%' },
  { label: 'Revenue (MTD)', value: '$124K', icon: DollarSign, change: '+15.2%' },
];

const recentBookings = [
  { id: 1, guest: 'John Smith', room: 'Presidential Suite', checkIn: '2024-02-15', status: 'confirmed' },
  { id: 2, guest: 'Emma Wilson', room: 'Executive Suite', checkIn: '2024-02-14', status: 'checked-in' },
  { id: 3, guest: 'Michael Brown', room: 'Deluxe King', checkIn: '2024-02-14', status: 'pending' },
  { id: 4, guest: 'Sarah Davis', room: 'Deluxe Twin', checkIn: '2024-02-13', status: 'checked-out' },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const navigate = useNavigate();

  // Check admin authentication on mount
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate('/admin-login');
          return;
        }

        // Check if user is admin
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error || !roles) {
          await supabase.auth.signOut();
          navigate('/admin-login');
          return;
        }

        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        setAdminUser({
          id: session.user.id,
          email: session.user.email,
          firstName: profile?.first_name || 'Admin',
          lastName: profile?.last_name || 'User',
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Auth check error:', err);
        navigate('/admin-login');
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Logout failed');
    } else {
      toast.success('Signed out successfully');
      navigate('/admin-login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
              <span className="font-display text-sm text-sidebar-primary-foreground font-bold">H</span>
            </div>
            <span className="font-display text-lg font-semibold">Haven Admin</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                  activeTab === item.id 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground"
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground mt-1"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : ""
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="font-display text-2xl font-semibold text-foreground capitalize">
                {activeTab}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{adminUser?.firstName} {adminUser?.lastName}</p>
                <p className="text-xs text-muted-foreground">{adminUser?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-medium">{adminUser?.firstName?.[0]?.toUpperCase() || 'A'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-card rounded-xl shadow-soft p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-accent" />
                      </div>
                      <span className="text-sm font-medium text-green-500">{stat.change}</span>
                    </div>
                    <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-display text-lg font-semibold text-foreground">Recent Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Guest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Check-in</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{booking.guest}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{booking.room}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{booking.checkIn}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              booking.status === 'confirmed' && "bg-blue-100 text-blue-700",
                              booking.status === 'checked-in' && "bg-green-100 text-green-700",
                              booking.status === 'pending' && "bg-yellow-100 text-yellow-700",
                              booking.status === 'checked-out' && "bg-gray-100 text-gray-700",
                            )}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Room Overview */}
              <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-display text-lg font-semibold text-foreground">Room Inventory</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['deluxe', 'executive', 'presidential'].map((type) => {
                    const typeRooms = rooms.filter(r => r.type === type);
                    const available = typeRooms.filter(r => r.available).length;
                    return (
                      <div key={type} className="p-4 bg-secondary rounded-lg">
                        <h3 className="font-display font-semibold text-foreground capitalize mb-2">{type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {available} of {typeRooms.length} available
                        </p>
                        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full" 
                            style={{ width: `${(available / typeRooms.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                </h2>
                <p className="text-muted-foreground">
                  This section is under construction. Enable Lovable Cloud to add full functionality.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;
