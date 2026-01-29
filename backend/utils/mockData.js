// Mock data generators for destinations, hotels, activities, and flights

export const mockDestinations = [
    {
        city: 'Paris',
        country: 'France',
        coordinates: { lat: 48.8566, lng: 2.3522 },
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
    },
    {
        city: 'Tokyo',
        country: 'Japan',
        coordinates: { lat: 35.6762, lng: 139.6503 },
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
    },
    {
        city: 'Bali',
        country: 'Indonesia',
        coordinates: { lat: -8.3405, lng: 115.0920 },
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
    },
    {
        city: 'Dubai',
        country: 'UAE',
        coordinates: { lat: 25.2048, lng: 55.2708 },
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'
    },
    {
        city: 'Santorini',
        country: 'Greece',
        coordinates: { lat: 36.3932, lng: 25.4615 },
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800'
    },
    {
        city: 'New York',
        country: 'USA',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'
    }
];

export const generateMockHotels = (city, category = 'mid-range') => {
    const hotelsByCity = {
        'Paris': [
            {
                name: 'Le Marais Boutique Hotel',
                description: 'Charming boutique hotel in the heart of Paris',
                amenities: ['WiFi', 'Breakfast', 'City View', 'Concierge'],
                rating: 4.5,
                reviewCount: 342,
                pricePerNight: 180,
                images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
                roomType: 'Deluxe Room',
                category: 'mid-range'
            },
            {
                name: 'The Parisian Grand',
                description: 'Luxury hotel near the Eiffel Tower',
                amenities: ['WiFi', 'Spa', 'Pool', 'Restaurant', 'Room Service'],
                rating: 4.8,
                reviewCount: 567,
                pricePerNight: 350,
                images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
                roomType: 'Suite',
                category: 'luxury'
            }
        ],
        'Tokyo': [
            {
                name: 'Shibuya Modern Hotel',
                description: 'Contemporary hotel in bustling Shibuya',
                amenities: ['WiFi', 'Breakfast', 'Gym', '24/7 Desk'],
                rating: 4.6,
                reviewCount: 289,
                pricePerNight: 150,
                images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
                roomType: 'Standard Room',
                category: 'mid-range'
            },
            {
                name: 'Imperial Gardens Resort',
                description: 'Traditional luxury with modern amenities',
                amenities: ['WiFi', 'Spa', 'Onsen', 'Restaurant', 'Garden View'],
                rating: 4.9,
                reviewCount: 412,
                pricePerNight: 420,
                images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
                roomType: 'Premium Suite',
                category: 'premium'
            }
        ],
        'Bali': [
            {
                name: 'Ubud Rice Terrace Villa',
                description: 'Peaceful villa with stunning rice field views',
                amenities: ['WiFi', 'Pool', 'Breakfast', 'Yoga Studio'],
                rating: 4.7,
                reviewCount: 198,
                pricePerNight: 120,
                images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800'],
                roomType: 'Private Villa',
                category: 'mid-range'
            },
            {
                name: 'Seminyak Beach Resort',
                description: 'Beachfront luxury resort',
                amenities: ['WiFi', 'Beach Access', 'Spa', 'Pool', 'Restaurant'],
                rating: 4.8,
                reviewCount: 524,
                pricePerNight: 280,
                images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
                roomType: 'Ocean View Suite',
                category: 'luxury'
            }
        ]
    };

    return hotelsByCity[city] || [
        {
            name: `${city} Central Hotel`,
            description: `Comfortable hotel in downtown ${city}`,
            amenities: ['WiFi', 'Breakfast', 'Gym'],
            rating: 4.3,
            reviewCount: 156,
            pricePerNight: 140,
            images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
            roomType: 'Standard Room',
            category: category
        }
    ];
};

export const generateMockActivities = (city, travelMood = 'culture') => {
    const activitiesByCity = {
        'Paris': [
            {
                name: 'Eiffel Tower Visit',
                description: 'Skip-the-line access to the iconic Eiffel Tower',
                category: 'sightseeing',
                duration: { hours: 2, minutes: 30 },
                price: 45,
                images: ['https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800'],
                rating: 4.9,
                reviewCount: 1234
            },
            {
                name: 'Louvre Museum Tour',
                description: 'Guided tour of the world-famous Louvre',
                category: 'culture',
                duration: { hours: 3, minutes: 0 },
                price: 65,
                images: ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800'],
                rating: 4.8,
                reviewCount: 987
            },
            {
                name: 'Seine River Cruise',
                description: 'Romantic evening cruise with dinner',
                category: 'relaxation',
                duration: { hours: 2, minutes: 0 },
                price: 85,
                images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'],
                rating: 4.7,
                reviewCount: 678
            },
            {
                name: 'French Cooking Class',
                description: 'Learn to cook authentic French cuisine',
                category: 'food',
                duration: { hours: 4, minutes: 0 },
                price: 120,
                images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'],
                rating: 4.9,
                reviewCount: 456
            }
        ],
        'Tokyo': [
            {
                name: 'Tokyo Skytree Experience',
                description: 'Visit Japan\'s tallest structure',
                category: 'sightseeing',
                duration: { hours: 2, minutes: 0 },
                price: 35,
                images: ['https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800'],
                rating: 4.7,
                reviewCount: 892
            },
            {
                name: 'Sushi Making Workshop',
                description: 'Learn to make authentic sushi from a master chef',
                category: 'food',
                duration: { hours: 3, minutes: 0 },
                price: 95,
                images: ['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800'],
                rating: 4.9,
                reviewCount: 567
            },
            {
                name: 'Mount Fuji Day Trip',
                description: 'Guided day trip to iconic Mount Fuji',
                category: 'adventure',
                duration: { hours: 10, minutes: 0 },
                price: 180,
                images: ['https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=800'],
                rating: 4.8,
                reviewCount: 734
            },
            {
                name: 'Traditional Tea Ceremony',
                description: 'Experience authentic Japanese tea ceremony',
                category: 'culture',
                duration: { hours: 1, minutes: 30 },
                price: 55,
                images: ['https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800'],
                rating: 4.6,
                reviewCount: 321
            }
        ],
        'Bali': [
            {
                name: 'Ubud Monkey Forest',
                description: 'Explore the sacred monkey forest sanctuary',
                category: 'sightseeing',
                duration: { hours: 2, minutes: 0 },
                price: 20,
                images: ['https://images.unsplash.com/photo-1562133567-b6a0a9d1a5b3?w=800'],
                rating: 4.5,
                reviewCount: 445
            },
            {
                name: 'Rice Terrace Trekking',
                description: 'Guided trek through stunning Tegalalang rice terraces',
                category: 'adventure',
                duration: { hours: 3, minutes: 30 },
                price: 45,
                images: ['https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800'],
                rating: 4.8,
                reviewCount: 612
            },
            {
                name: 'Balinese Massage & Spa',
                description: 'Traditional Balinese massage treatment',
                category: 'relaxation',
                duration: { hours: 2, minutes: 0 },
                price: 55,
                images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800'],
                rating: 4.9,
                reviewCount: 789
            },
            {
                name: 'Cooking Class at Local Market',
                description: 'Shop and cook authentic Balinese dishes',
                category: 'food',
                duration: { hours: 4, minutes: 0 },
                price: 75,
                images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
                rating: 4.7,
                reviewCount: 234
            }
        ]
    };

    const activities = activitiesByCity[city] || [
        {
            name: `${city} City Tour`,
            description: `Comprehensive tour of ${city}'s highlights`,
            category: 'sightseeing',
            duration: { hours: 4, minutes: 0 },
            price: 60,
            images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'],
            rating: 4.5,
            reviewCount: 200
        }
    ];

    // Filter by mood if needed
    const moodToCategory = {
        'adventure': 'adventure',
        'culture': 'culture',
        'foodie': 'food',
        'relaxed': 'relaxation'
    };

    return activities;
};

export const calculateFlightPrice = (departureCity, destination, travelClass = 'economy') => {
    // Mock flight pricing based on distance and class
    const basePrice = 300;
    const classMultiplier = {
        'economy': 1,
        'premium-economy': 1.5,
        'business': 2.5,
        'first': 4
    };

    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2

    return Math.round(basePrice * (classMultiplier[travelClass] || 1) * randomFactor);
};

export const mockFlightData = {
    airlines: ['Emirates', 'Singapore Airlines', 'Qatar Airways', 'Lufthansa', 'Air France'],
    departureAirports: {
        'New York': 'JFK',
        'London': 'LHR',
        'Mumbai': 'BOM',
        'Singapore': 'SIN',
        'Los Angeles': 'LAX'
    }
};
