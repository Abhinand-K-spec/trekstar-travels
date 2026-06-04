import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { mockTravelPackages } from './utils/mockPackages.js';
import Package from './models/Package.js';

// Load environment variables
dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding');

        // Delete existing packages first
        await Package.deleteMany({});
        console.log('Cleared existing packages');

        // Map mockTravelPackages to Package schema
        const packagesToSeed = mockTravelPackages.map(pkg => ({
            title: pkg.name,
            destination: {
                city: pkg.destination.city,
                country: pkg.destination.country
            },
            duration: pkg.duration,
            description: pkg.description,
            price: pkg.price.starting || pkg.price,
            maxGroupSize: pkg.maxGroupSize || 10,
            travelMood: pkg.travelMood,
            travelCompanion: pkg.travelCompanion,
            highlights: pkg.highlights || [],
            inclusions: pkg.included || [],
            exclusions: pkg.excluded || [],
            images: pkg.image ? [pkg.image] : [],
            isActive: true
        }));

        await Package.insertMany(packagesToSeed);
        console.log(`Successfully seeded ${packagesToSeed.length} packages!`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
