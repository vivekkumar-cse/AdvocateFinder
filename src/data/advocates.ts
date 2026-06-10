export type Specialization = 
  | 'criminal' 
  | 'civil' 
  | 'family' 
  | 'corporate' 
  | 'cyber' 
  | 'property';

export interface Advocate {
  id: string;
  name: string;
  imageUrl: string;
  specializations: Specialization[];
  experience: number;
  city: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  consultationFee: number;
  verified: boolean;
  about: string;
  languages: string[];
  education: string;
  casesHandled: number;
}

export const specializations: { value: Specialization; label: string; icon: string }[] = [
  { value: 'criminal', label: 'Criminal Law', icon: '⚖️' },
  { value: 'civil', label: 'Civil Law', icon: '📜' },
  { value: 'family', label: 'Family Law', icon: '👨‍👩‍👧' },
  { value: 'corporate', label: 'Corporate Law', icon: '🏢' },
  { value: 'cyber', label: 'Cyber Law', icon: '💻' },
  { value: 'property', label: 'Property Law', icon: '🏠' },
];

export const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
];

export const advocates: Advocate[] = [
  {
    id: '1',
    name: 'Adv. Priya Sharma',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    specializations: ['criminal', 'civil'],
    experience: 15,
    city: 'Mumbai',
    area: 'Andheri West',
    address: '301, Legal Chambers, Link Road, Andheri West',
    latitude: 19.1364,
    longitude: 72.8296,
    rating: 4.8,
    consultationFee: 2000,
    verified: true,
    about: 'Senior criminal lawyer with extensive experience in high-profile cases. Specialized in white-collar crimes and civil disputes.',
    languages: ['English', 'Hindi', 'Marathi'],
    education: 'LLB, Mumbai University | LLM, Harvard Law School',
    casesHandled: 450,
  },
  {
    id: '2',
    name: 'Adv. Rajesh Kumar',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    specializations: ['corporate', 'property'],
    experience: 20,
    city: 'Delhi',
    area: 'Connaught Place',
    address: '45, Barakhamba Road, Connaught Place',
    latitude: 28.6315,
    longitude: 77.2167,
    rating: 4.9,
    consultationFee: 5000,
    verified: true,
    about: 'Expert in corporate mergers, acquisitions, and property transactions. Former legal head at Fortune 500 company.',
    languages: ['English', 'Hindi', 'Punjabi'],
    education: 'BA LLB, Delhi University | MBA, IIM Ahmedabad',
    casesHandled: 780,
  },
  {
    id: '3',
    name: 'Adv. Meera Reddy',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    specializations: ['family', 'civil'],
    experience: 12,
    city: 'Bangalore',
    area: 'Koramangala',
    address: '78, 5th Block, Koramangala',
    latitude: 12.9352,
    longitude: 77.6245,
    rating: 4.7,
    consultationFee: 1500,
    verified: true,
    about: 'Compassionate family law practitioner specializing in divorce, custody, and matrimonial disputes.',
    languages: ['English', 'Kannada', 'Telugu', 'Hindi'],
    education: 'LLB, National Law School, Bangalore',
    casesHandled: 320,
  },
  {
    id: '4',
    name: 'Adv. Arjun Nair',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    specializations: ['cyber', 'corporate'],
    experience: 8,
    city: 'Bangalore',
    area: 'Whitefield',
    address: '22, Tech Park, ITPL Main Road, Whitefield',
    latitude: 12.9698,
    longitude: 77.7500,
    rating: 4.6,
    consultationFee: 3000,
    verified: true,
    about: 'Tech-savvy lawyer specializing in cybercrime, data privacy, and IT contracts. Regular speaker at tech conferences.',
    languages: ['English', 'Malayalam', 'Hindi'],
    education: 'LLB, NLU Delhi | Certified in Cyber Law',
    casesHandled: 180,
  },
  {
    id: '5',
    name: 'Adv. Sunita Patel',
    imageUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face',
    specializations: ['property', 'civil'],
    experience: 18,
    city: 'Ahmedabad',
    area: 'Navrangpura',
    address: '12, Law House, CG Road, Navrangpura',
    latitude: 23.0375,
    longitude: 72.5611,
    rating: 4.8,
    consultationFee: 1800,
    verified: true,
    about: 'Property law expert with deep knowledge of land acquisition and real estate transactions in Gujarat.',
    languages: ['English', 'Gujarati', 'Hindi'],
    education: 'LLB, Gujarat University',
    casesHandled: 520,
  },
  {
    id: '6',
    name: 'Adv. Vikram Singh',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    specializations: ['criminal'],
    experience: 25,
    city: 'Delhi',
    area: 'Saket',
    address: '89, District Court Complex, Saket',
    latitude: 28.5244,
    longitude: 77.2090,
    rating: 4.9,
    consultationFee: 8000,
    verified: true,
    about: 'Senior criminal defense attorney with experience in Supreme Court. Known for handling complex criminal trials.',
    languages: ['English', 'Hindi'],
    education: 'LLB, Faculty of Law, DU | Senior Advocate, Supreme Court',
    casesHandled: 950,
  },
  {
    id: '7',
    name: 'Adv. Kavitha Menon',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    specializations: ['family', 'property'],
    experience: 10,
    city: 'Chennai',
    area: 'T. Nagar',
    address: '56, Pondy Bazaar, T. Nagar',
    latitude: 13.0418,
    longitude: 80.2341,
    rating: 4.5,
    consultationFee: 1200,
    verified: false,
    about: 'Dedicated family lawyer handling divorce, maintenance, and property succession cases across Tamil Nadu.',
    languages: ['English', 'Tamil', 'Hindi'],
    education: 'LLB, Madras Law College',
    casesHandled: 200,
  },
  {
    id: '8',
    name: 'Adv. Rohit Mehta',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
    specializations: ['corporate', 'cyber'],
    experience: 14,
    city: 'Pune',
    area: 'Hinjewadi',
    address: '33, Phase 1, Hinjewadi IT Park',
    latitude: 18.5912,
    longitude: 73.7380,
    rating: 4.7,
    consultationFee: 2500,
    verified: true,
    about: 'Corporate counsel with expertise in startup legal matters, venture capital, and technology contracts.',
    languages: ['English', 'Hindi', 'Marathi'],
    education: 'LLB, ILS Law College | CS Qualified',
    casesHandled: 380,
  },
];
