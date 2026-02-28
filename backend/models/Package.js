import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    destination: {
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    maxGroupSize: {
        type: Number,
        default: 10
    },
    travelMood: {
        type: String,
        enum: ['relaxed', 'adventure', 'culture', 'foodie'],
        required: true
    },
    travelCompanion: {
        type: String,
        enum: ['solo', 'couple', 'family', 'friends', 'all'],
        default: 'all'
    },
    highlights: [{
        type: String,
        trim: true
    }],
    inclusions: [{
        type: String,
        trim: true
    }],
    exclusions: [{
        type: String,
        trim: true
    }],
    images: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

packageSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Package', packageSchema);
