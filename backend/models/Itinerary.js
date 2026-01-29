import mongoose from 'mongoose';

const dailyPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    title: String,
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    },
    activities: [{
        activity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        },
        order: Number,
        timeSlot: String
    }],
    notes: String
});

const itinerarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    travelMonth: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    travelCompanion: {
        type: String,
        enum: ['solo', 'couple', 'family', 'friends'],
        required: true
    },
    travelMood: {
        type: String,
        enum: ['relaxed', 'adventure', 'culture', 'foodie'],
        required: true
    },
    budget: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    departureCity: String,
    dailyPlans: [dailyPlanSchema],
    pricing: {
        flights: {
            type: Number,
            default: 0
        },
        hotels: {
            type: Number,
            default: 0
        },
        activities: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['draft', 'confirmed', 'booked', 'completed'],
        default: 'draft'
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

// Update the updatedAt timestamp before saving
itinerarySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Itinerary', itinerarySchema);
