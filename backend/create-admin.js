#!/usr/bin/env node
// Script to create an admin user for testing
// Run: node create-admin.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load env
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') });

// Simple inline user generation
const args = process.argv.slice(2);
const email = args[0] || 'admin@trekstar.com';
const name = args[1] || 'Admin User';
const password = args[2] || 'admin123';

const connectAndCreate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Dynamically import User model
        const { default: User } = await import('./models/User.js');

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            // Update role to admin
            user.role = 'admin';
            await user.save();
            console.log(`✅ Updated existing user "${email}" to admin role`);
        } else {
            user = await User.create({ name, email, password, role: 'admin' });
            console.log(`✅ Created admin user:`);
            console.log(`   Email: ${email}`);
            console.log(`   Password: ${password}`);
            console.log(`   Name: ${name}`);
        }

        console.log('\n🔐 You can now log in at http://localhost:3000/admin/login');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

connectAndCreate();
