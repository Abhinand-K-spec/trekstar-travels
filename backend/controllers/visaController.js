import VisaApplication from '../models/VisaApplication.js';

// Apply for a Visa
export const applyForVisa = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            passportNumber,
            nationality,
            destinationCountry,
            visaType,
            departureDate,
            additionalNotes,
            documents
        } = req.body;

        if (!fullName || !email || !phone || !passportNumber || !nationality || !destinationCountry || !visaType || !departureDate) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Prepare documents array with uploaded status
        const docArray = (documents || []).map(docName => ({
            name: docName,
            status: 'uploaded',
            uploadDate: new Date()
        }));

        // Set initial timeline event
        const timeline = [{
            status: 'submitted',
            note: 'Your visa application was successfully submitted online.',
            date: new Date()
        }];

        const applicationData = {
            user: req.user ? req.user._id : undefined,
            fullName,
            email,
            phone,
            passportNumber,
            nationality,
            destinationCountry,
            visaType,
            departureDate,
            additionalNotes,
            documents: docArray,
            timeline,
            status: 'submitted'
        };

        const visaApplication = new VisaApplication(applicationData);
        await visaApplication.save();

        res.status(201).json({
            success: true,
            message: 'Visa application submitted successfully',
            data: visaApplication
        });
    } catch (error) {
        console.error('Apply Visa Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting visa application',
            error: error.message
        });
    }
};

// Get current user's visa applications
export const getMyVisaApplications = async (req, res) => {
    try {
        const applications = await VisaApplication.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Get My Visas Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching visa applications',
            error: error.message
        });
    }
};

// Get single visa application by ID
export const getVisaApplicationById = async (req, res) => {
    try {
        const application = await VisaApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Visa application not found'
            });
        }

        // User can only view their own unless admin
        if (req.user.role !== 'admin' && String(application.user) !== String(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this application'
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Get Visa Details Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching visa application details',
            error: error.message
        });
    }
};

// Points-based Eligibility Evaluator (like Y-Axis)
export const evaluateVisaEligibility = async (req, res) => {
    try {
        const {
            visaType,
            age,
            education,
            experience,
            ielts,
            monthlyIncome,
            destinationCountry
        } = req.body;

        if (!visaType || !destinationCountry) {
            return res.status(400).json({
                success: false,
                message: 'Visa type and destination country are required'
            });
        }

        let score = 0;
        let breakdown = [];
        let status = 'ineligible';
        let recommendation = '';

        if (['work', 'study', 'pr'].includes(visaType)) {
            // Age points
            const ageVal = Number(age);
            let agePoints = 0;
            if (ageVal >= 18 && ageVal <= 35) {
                agePoints = 25;
            } else if (ageVal >= 36 && ageVal <= 45) {
                agePoints = 15;
            } else if (ageVal >= 46) {
                agePoints = 5;
            }
            score += agePoints;
            breakdown.push({ criteria: 'Age Profile', score: agePoints, max: 25, detail: `Age: ${ageVal} years` });

            // Education points
            let eduPoints = 0;
            if (education === 'doctoral') eduPoints = 25;
            else if (education === 'masters') eduPoints = 23;
            else if (education === 'bachelors') eduPoints = 20;
            else if (education === 'diploma') eduPoints = 10;
            score += eduPoints;
            breakdown.push({ criteria: 'Education Qualifications', score: eduPoints, max: 25, detail: `Level: ${education}` });

            // Work Experience points
            const expVal = Number(experience);
            let expPoints = 0;
            if (expVal >= 6) expPoints = 20;
            else if (expVal >= 3) expPoints = 15;
            else if (expVal >= 1) expPoints = 10;
            score += expPoints;
            breakdown.push({ criteria: 'Professional Experience', score: expPoints, max: 20, detail: `${expVal} years of experience` });

            // IELTS / English Proficiency points
            const ieltsVal = parseFloat(ielts);
            let ieltsPoints = 0;
            if (ieltsVal >= 8.0) ieltsPoints = 20;
            else if (ieltsVal >= 7.0) ieltsPoints = 15;
            else if (ieltsVal >= 6.0) ieltsPoints = 10;
            score += ieltsPoints;
            breakdown.push({ criteria: 'Language Competence (IELTS)', score: ieltsPoints, max: 20, detail: `Band Score: ${ieltsVal}` });

            // Financial Capability points
            const incomeVal = Number(monthlyIncome);
            let finPoints = 0;
            if (incomeVal >= 5000) finPoints = 10;
            else if (incomeVal >= 2000) finPoints = 5;
            score += finPoints;
            breakdown.push({ criteria: 'Financial Backup', score: finPoints, max: 10, detail: `$${incomeVal}/month` });

            // Determine status
            if (score >= 75) {
                status = 'highly-eligible';
                recommendation = `Outstanding! Your score of ${score}/100 exceeds the standard requirement. You have a high probability of success for a ${visaType} visa to ${destinationCountry}. We recommend starting your application immediately.`;
            } else if (score >= 65) {
                status = 'eligible';
                recommendation = `Great news! Your score of ${score}/100 meets the eligibility criteria. You are qualified for a ${visaType} visa to ${destinationCountry}. Get in touch with our experts to prepare your document file.`;
            } else if (score >= 50) {
                status = 'borderline';
                recommendation = `Your score is ${score}/100. You are close to the eligibility threshold. Retaking the IELTS to score a higher band or gaining an extra year of work experience will strongly solidify your application profile.`;
            } else {
                status = 'ineligible';
                recommendation = `Your score is ${score}/100. It does not meet the typical 65-point requirement for the ${visaType} visa program in ${destinationCountry}. Consider applying for study programs or selecting a destination with different requirements.`;
            }

        } else {
            // Tourist or Business Visa Checklist-based Evaluation (stateless score)
            const incomeVal = Number(monthlyIncome);
            const expVal = Number(experience);
            
            let touristScore = 40; // Base score
            
            // Financial strength is primary for tourist/business
            if (incomeVal >= 4000) touristScore += 40;
            else if (incomeVal >= 2000) touristScore += 25;
            else if (incomeVal >= 1000) touristScore += 10;

            // Stable employment/experience counts as ties to home country
            if (expVal >= 5) touristScore += 20;
            else if (expVal >= 2) touristScore += 15;
            else if (expVal >= 1) touristScore += 5;

            score = touristScore;
            
            breakdown.push({ criteria: 'Financial Capability & Funds', score: incomeVal >= 4000 ? 40 : (incomeVal >= 2000 ? 25 : 10), max: 40, detail: `$${incomeVal}/month` });
            breakdown.push({ criteria: 'Employment Stability (Home ties)', score: expVal >= 5 ? 20 : (expVal >= 2 ? 15 : 5), max: 20, detail: `${expVal} years career` });
            breakdown.push({ criteria: 'Base Visa Profile', score: 40, max: 40, detail: `Standard requirements` });

            if (score >= 80) {
                status = 'highly-eligible';
                recommendation = `Excellent profile! Your strong financial status and employment history show excellent ties to your home country, minimizing rejection risk. You are highly eligible for a ${visaType} visa to ${destinationCountry}.`;
            } else if (score >= 65) {
                status = 'eligible';
                recommendation = `Good profile! You have sufficient funds to cover your travel to ${destinationCountry}. Preparing a clean daily itinerary and solid hotel booking receipts will make your approval chances high.`;
            } else {
                status = 'borderline';
                recommendation = `Your visa score is ${score}/100. Recommending additional financial support proofs (like property deeds or sponsor letters) or applying with a smaller travel duration to increase approval rate.`;
            }
        }

        res.status(200).json({
            success: true,
            data: {
                visaType,
                destinationCountry,
                score,
                maxScore: 100,
                status,
                breakdown,
                recommendation
            }
        });
    } catch (error) {
        console.error('Evaluate Visa Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error evaluating visa eligibility',
            error: error.message
        });
    }
};

// Admin: Get all visa applications
export const adminGetAllVisaApplications = async (req, res) => {
    try {
        const { status, search } = req.query;
        const query = {};

        if (status) query.status = status;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { passportNumber: { $regex: search, $options: 'i' } },
                { destinationCountry: { $regex: search, $options: 'i' } }
            ];
        }

        const applications = await VisaApplication.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Admin Get Visas Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching visa applications for admin',
            error: error.message
        });
    }
};

// Admin: Update visa application status and timeline
export const adminUpdateVisaApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, timelineNote } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const application = await VisaApplication.findById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Visa application not found'
            });
        }

        application.status = status;

        // Push new event to timeline
        const note = timelineNote || `Visa application status updated to: ${status.replace('-', ' ')}`;
        application.timeline.push({
            status,
            note,
            date: new Date()
        });

        // Auto-update document status if application approved/rejected
        if (status === 'approved') {
            application.documents.forEach(doc => {
                doc.status = 'verified';
            });
        }

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Visa application updated successfully',
            data: application
        });
    } catch (error) {
        console.error('Admin Update Visa Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating visa application status',
            error: error.message
        });
    }
};
