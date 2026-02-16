import roomDeluxe from '@/assets/room-deluxe.jpg';
import roomExecutive from '@/assets/room-executive.jpg';
import roomPresidential from '@/assets/room-presidential.jpg';

export interface Room {
  id: string;
  name: string;
  type: 'deluxe' | 'executive' | 'presidential';
  price: number;
  image: string;
  description: string;
  features: string[];
  capacity: number;
  size: number; // in sqm
  available: boolean;
}

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Deluxe King Room',
    type: 'deluxe',
    price: 24817,
    image: roomDeluxe,
    description: 'Experience refined comfort in our elegantly appointed Deluxe King Room, featuring stunning city views and premium amenities.',
    features: ['King-size bed', 'City view', 'Rain shower', 'Smart TV', 'Mini bar', 'Coffee machine'],
    capacity: 2,
    size: 35,
    available: true,
  },
  {
    id: '2',
    name: 'Deluxe Twin Room',
    type: 'deluxe',
    price: 23987,
    image: roomDeluxe,
    description: 'Perfect for friends or colleagues, our Deluxe Twin Room offers two comfortable beds with all the luxury amenities you expect.',
    features: ['Two queen beds', 'City view', 'Rain shower', 'Smart TV', 'Mini bar', 'Work desk'],
    capacity: 2,
    size: 38,
    available: true,
  },
  {
    id: '3',
    name: 'Executive Suite',
    type: 'executive',
    price: 41417,
    image: roomExecutive,
    description: 'Indulge in spacious luxury with our Executive Suite, featuring a separate living area and panoramic views.',
    features: ['King-size bed', 'Living room', 'Panoramic view', 'Jacuzzi tub', 'Butler service', 'Premium bar'],
    capacity: 3,
    size: 65,
    available: true,
  },
  {
    id: '4',
    name: 'Executive Corner Suite',
    type: 'executive',
    price: 45567,
    image: roomExecutive,
    description: 'Our corner suites offer dual-aspect views and additional space for the discerning traveler.',
    features: ['King-size bed', 'Dual views', 'Dining area', 'Spa bathroom', 'Lounge access', 'Smart home'],
    capacity: 3,
    size: 75,
    available: false,
  },
  {
    id: '5',
    name: 'Presidential Suite',
    type: 'presidential',
    price: 107817,
    image: roomPresidential,
    description: 'The pinnacle of luxury living. Our Presidential Suite offers unparalleled elegance with private terrace and dedicated butler.',
    features: ['Master bedroom', 'Private terrace', 'Grand piano', 'Personal chef', 'Limousine service', 'Helipad access'],
    capacity: 4,
    size: 150,
    available: true,
  },
  {
    id: '6',
    name: 'Royal Penthouse',
    type: 'presidential',
    price: 207417,
    image: roomPresidential,
    description: 'Experience royalty in our exclusive penthouse spanning the entire top floor with 360-degree city views.',
    features: ['3 bedrooms', 'Private pool', 'Home cinema', 'Wine cellar', 'Personal staff', 'Private elevator'],
    capacity: 6,
    size: 350,
    available: true,
  },
];

export const getRoomsByType = (type: Room['type']) => rooms.filter(room => room.type === type);

export const getAvailableRooms = () => rooms.filter(room => room.available);
