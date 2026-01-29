import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: String,
        enum: ['adventure', 'culture', 'food', 'relaxation', 'sightseeing', 'entertainment'],
        required: true
    },
    location: {
        city: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    duration: {
        hours: Number,
        minutes: Number
    },
    price: {
        type: Number,
        required: true
    },
    images: [String],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    availability: {
        type: String,
        enum: ['daily', 'weekdays', 'weekends', 'seasonal'],
        default: 'daily'
    },
    includeInPackage: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Activity', activitySchema);
