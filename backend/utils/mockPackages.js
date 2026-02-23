// Complete travel packages for testing

export const mockTravelPackages = [
    {
        id: 'pkg-001',
        name: 'Romantic Paris Getaway',
        destination: {
            city: 'Paris',
            country: 'France',
            coordinates: { lat: 48.8566, lng: 2.3522 }
        },
        duration: 5,
        travelCompanion: 'couple',
        travelMood: 'culture',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        description: 'Experience the romance of Paris with luxury stays and iconic landmarks',
        highlights: [
            'Eiffel Tower visit with champagne',
            'Seine River dinner cruise',
            'Louvre Museum private tour',
            '5-star hotel near Champs-Élysées'
        ],
        included: ['5-star accommodation', 'Daily breakfast', 'Airport transfers', 'City tour', 'Museum tickets'],
        price: {
            starting: 2499,
            perPerson: true,
            currency: 'USD'
        },
        rating: 4.9,
        reviewCount: 342,
        bestSeason: ['April', 'May', 'September', 'October']
    },
    {
        id: 'pkg-002',
        name: 'Tokyo Adventure',
        destination: {
            city: 'Tokyo',
            country: 'Japan',
            coordinates: { lat: 35.6762, lng: 139.6503 }
        },
        duration: 7,
        travelCompanion: 'solo',
        travelMood: 'adventure',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        description: 'Discover modern Tokyo and traditional Japanese culture',
        highlights: [
            'Mount Fuji day trip',
            'Shibuya and Harajuku exploration',
            'Traditional tea ceremony',
            'Robot restaurant experience'
        ],
        included: ['4-star hotel in Shibuya', 'JR Rail pass', 'Guided tours', 'Cultural experiences'],
        price: {
            starting: 2899,
            perPerson: true,
            currency: 'USD'
        },
        rating: 4.8,
        reviewCount: 567,
        bestSeason: ['March', 'April', 'October', 'November']
    },
    {
        id: 'pkg-003',
        name: 'Bali Wellness Retreat',
        destination: {
            city: 'Bali',
            country: 'Indonesia',
            coordinates: { lat: -8.3405, lng: 115.0920 }
        },
        duration: 6,
        travelCompanion: 'couple',
        travelMood: 'relaxed',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        description: 'Rejuvenate in tropical paradise with spa and yoga',
        highlights: [
            'Private villa with pool',
            'Daily spa treatments',
            'Yoga and meditation sessions',
            'Rice terrace sunset dinner'
        ],
        included: ['Luxury villa accommodation', 'Daily spa', 'Yoga classes', 'All meals', 'Airport transfers'],
        price: {
            starting: 1899,
            perPerson: true,
            currency: 'USD'
        },
        rating: 4.9,
        reviewCount: 489,
        bestSeason: ['April', 'May', 'June', 'September']
    },
    {
        id: 'pkg-004',
        name: 'Goa Beach Party Special',
        destination: {
            city: 'Goa',
            country: 'India',
            coordinates: { lat: 15.2993, lng: 74.1240 }
        },
        duration: 4,
        travelCompanion: 'friends',
        travelMood: 'relaxed',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
        description: 'Beach parties, water sports, and Portuguese heritage',
        highlights: [
            'Beachfront resort stay',
            'Water sports activities',
            'Beach club parties',
            'Old Goa heritage tour'
        ],
        included: ['Beach resort', 'Daily breakfast', 'Water sports', 'Club entry passes', 'Scooter rental'],
        price: {
            starting: 599,
            perPerson: true,
            currency: 'USD'
        },
        rating: 4.6,
        reviewCount: 723,
        bestSeason: ['November', 'December', 'January', 'February']
    },
    {
        id: 'pkg-005',
        name: 'Kerala Backwater Experience',
        destination: {
            city: 'Kerala',
            country: 'India',
            coordinates: { lat: 10.8505, lng: 76.2711 }
        },
        duration: 5,
        travelCompanion: 'family',
        travelMood: 'relaxed',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
        description: 'Explore serene backwaters and lush tea plantations',
        highlights: [
            'Houseboat stay',
            'Munnar tea gardens',
            'Ayurvedic spa treatments',
            'Traditional Kathakali dance'
        ],
        included: ['Houseboat + resort stay', 'All meals on houseboat', 'Ayurvedic massage', 'Cultural shows'],
        price: {
            starting: 1299,
            perPerson: false,
            currency: 'USD'
        },
        rating: 4.8,
        reviewCount: 445,
        bestSeason: ['September', 'October', 'January', 'February']
    },
    {
        id: 'pkg-006',
        name: 'Maldives Luxury Escape',
        destination: {
            city: 'Maldives',
            country: 'Maldives',
            coordinates: { lat: 3.2028, lng: 73.2207 }
        },
        duration: 5,
        travelCompanion: 'couple',
        travelMood: 'relaxed',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
        description: 'Overwater villas and pristine beaches',
        highlights: [
            'Overwater villa with private pool',
            'Snorkeling and diving',
            'Spa on the water',
            'Sunset dolphin cruise'
        ],
        included: ['Overwater villa', 'All-inclusive meals', 'Spa credits', 'Water activities', 'Seaplane transfer'],
        price: {
            starting: 4999,
            perPerson: true,
            currency: 'USD'
        },
        rating: 5.0,
        reviewCount: 891,
        bestSeason: ['November', 'December', 'January', 'March', 'April']
    },
    {
        id: 'pkg-007',
        name: 'Dubai Extravaganza',
        destination: {
            city: 'Dubai',
            country: 'UAE',
            coordinates: { lat: 25.2048, lng: 55.2708 }
        },
        duration: 5,
        travelCompanion: 'family',
        travelMood: 'adventure',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        description: 'Luxury shopping, desert safari, and modern marvels',
        highlights: [
            'Burj Khalifa observation deck',
            'Desert safari with BBQ dinner',
            'Dubai Mall shopping tour',
            'Yacht cruise around Palm Jumeirah'
        ],
        included: ['5-star hotel', 'Daily breakfast', 'Desert safari', 'City tours', 'Mall vouchers'],
        price: {
            starting: 2199,
            perPerson: true,
            currency: 'USD'
        },
        rating: 4.7,
        reviewCount: 634,
        bestSeason: ['November', 'December', 'January', 'February', 'March']
    },
    {
        id: 'pkg-008',
        name: 'Ladakh Adventure Trek',
        destination: {
            city: 'Ladakh',
            country: 'India',
            coordinates: { lat: 34.1526, lng: 77.5771 }
        },
        duration: 8,
        travelCompanion: 'friends',
        travelMood: 'adventure',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
        description: 'High-altitude adventure through stunning Himalayan landscapes',
        highlights: [
            'Pangong Lake visit',
            'Monastery tours',
            'Khardung La pass drive',
            'Camping under stars'
        ],
        included: ['Hotel + camping', 'All meals', '4x4 vehicle', 'Permits', 'Oxygen support'],
        price: {
            starting: 1599,
            perPerson: true,
            currency: 'USD'
        },
        rating: 4.9,
        reviewCount: 287,
        bestSeason: ['June', 'July', 'August', 'September']
    },
    {
        id: 'pkg-009',
        name: 'Rajasthan Royal Heritage',
        destination: {
            city: 'Jaipur',
            country: 'India',
            coordinates: { lat: 26.9124, lng: 75.7873 }
        },
        duration: 6,
        travelCompanion: 'family',
        travelMood: 'culture',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
        description: 'Explore magnificent forts, palaces, and royal culture',
        highlights: [
            'Amber Fort elephant ride',
            'Heritage palace hotel stay',
            'Traditional Rajasthani dinner',
            'Udaipur City Palace tour'
        ],
        included: ['Heritage hotels', 'All meals', 'Private guide', 'Cultural performances', 'Transfers'],
        price: {
            starting: 1799,
            perPerson: false,
            currency: 'USD'
        },
        rating: 4.8,
        reviewCount: 512,
        bestSeason: ['October', 'November', 'February', 'March']
    },
    {
        id: 'pkg-010',
        name: 'Singapore City Highlights',
        destination: {
            city: 'Singapore',
            country: 'Singapore',
            coordinates: { lat: 1.3521, lng: 103.8198 }
        },
        duration: 4,
        travelCompanion: 'family',
        travelMood: 'culture',
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
        description: 'Modern city with Gardens by the Bay and Universal Studios',
        highlights: [
            'Universal Studios access',
            'Gardens by the Bay tour',
            'Marina Bay Sands experience',
            'Sentosa Island beach day'
        ],
        included: ['Centrally located hotel', 'Breakfast', 'Theme park tickets', 'City pass', 'Airport shuttle'],
        price: {
            starting: 1899,
            perPerson: true,
            currency: 'USD'
        },
        rating: 4.7,
        reviewCount: 698,
        bestSeason: ['February', 'March', 'July', 'August']
    }
];

// Function to get packages by destination
export const getPackagesByDestination = (city) => {
    return mockTravelPackages.filter(pkg => pkg.destination.city === city);
};

// Function to get packages by mood
export const getPackagesByMood = (mood) => {
    return mockTravelPackages.filter(pkg => pkg.travelMood === mood);
};

// Function to get featured packages
export const getFeaturedPackages = () => {
    return mockTravelPackages.filter(pkg => pkg.rating >= 4.8);
};
