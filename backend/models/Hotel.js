import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
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
    description: String,
    amenities: [String],
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
    pricePerNight: {
        type: Number,
        required: true
    },
    images: [String],
    roomType: String,
    category: {
        type: String,
        enum: ['budget', 'mid-range', 'luxury', 'premium'],
        default: 'mid-range'
    }
});

export default mongoose.model('Hotel', hotelSchema);
