export interface WorkerProfile {
  id: string;
  name: string;
  phone: string;
  rating: number;
  reviews: number;
  specialty: string;
  isSeepageExpert: boolean;
}

export const mumbaiPainters: WorkerProfile[] = [
  {
    id: 'painter-1',
    name: 'Raju Painter',
    phone: '9876543210',
    rating: 4.8,
    reviews: 152,
    specialty: 'Interior & Exterior',
    isSeepageExpert: true,
  },
  {
    id: 'painter-2',
    name: 'Sanjay Varma',
    phone: '9876543211',
    rating: 4.9,
    reviews: 210,
    specialty: 'Texture & Stencil Design',
    isSeepageExpert: false,
  },
  {
    id: 'painter-3',
    name: 'Anil Kumar',
    phone: '9876543212',
    rating: 4.7,
    reviews: 98,
    specialty: 'Waterproofing & Damp Proofing',
    isSeepageExpert: true,
  },
  {
    id: 'painter-4',
    name: 'Manoj Singh',
    phone: '9876543213',
    rating: 4.6,
    reviews: 75,
    specialty: 'Commercial Projects',
    isSeepageExpert: false,
  },
  {
    id: 'painter-5',
    name: 'Sunil Gupta',
    phone: '9876543214',
    rating: 5.0,
    reviews: 55,
    specialty: 'Luxury Finishes',
    isSeepageExpert: false,
  },
  {
    id: 'painter-6',
    name: 'Deepak Sharma',
    phone: '9876543215',
    rating: 4.8,
    reviews: 120,
    specialty: 'Residential Repainting',
    isSeepageExpert: true,
  },
  {
    id: 'painter-7',
    name: 'Vijay Patil',
    phone: '9876543216',
    rating: 4.5,
    reviews: 60,
    specialty: 'Exterior Weather-shield',
    isSeepageExpert: false,
  },
  {
    id: 'painter-8',
    name: 'Kishore Yadav',
    phone: '9876543217',
    rating: 4.9,
    reviews: 180,
    specialty: 'New Construction Painting',
    isSeepageExpert: false,
  },
  {
    id: 'painter-9',
    name: 'Ganesh Sawant',
    phone: '9876543218',
    rating: 4.7,
    reviews: 110,
    specialty: 'Damp Proofing Specialist',
    isSeepageExpert: true,
  },
  {
    id: 'painter-10',
    name: 'Ramesh Desai',
    phone: '9876543219',
    rating: 4.6,
    reviews: 85,
    specialty: 'All-Rounder Painter',
    isSeepageExpert: false,
  },
];
