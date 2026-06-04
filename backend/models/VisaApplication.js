import mongoose from 'mongoose';

const visaApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    passportNumber: {
        type: String,
        required: true,
        trim: true
    },
    nationality: {
        type: String,
        required: true,
        trim: true
    },
    destinationCountry: {
        type: String,
        required: true,
        trim: true
    },
    visaType: {
        type: String,
        enum: ['tourist', 'business', 'study', 'work', 'pr'],
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    additionalNotes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['submitted', 'in-review', 'action-required', 'approved', 'rejected'],
        default: 'submitted'
    },
    timeline: [{
        status: {
            type: String,
            required: true
        },
        note: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    documents: [{
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'uploaded', 'verified', 'rejected'],
            default: 'uploaded'
        },
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

visaApplicationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('VisaApplication', visaApplicationSchema);
