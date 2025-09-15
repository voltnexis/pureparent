// Database setup script - Run this once to populate initial data
async function setupDatabase() {
    console.log('Setting up database with initial data...');
    
    try {
        // Insert sample products
        const products = [
            {
                title: 'Organic Baby Food Jar - Apple Puree',
                slug: 'organic-baby-food-apple',
                description: 'Pure organic apple puree perfect for first foods. Made from 100% organic apples with no added sugar or preservatives.',
                short_description: 'Organic apple puree for babies 6+ months',
                images: ['img/apple-puree.jpg'],
                price: 299.00,
                mrp: 349.00,
                category: 'feeding',
                age_range: { min: 6, max: 12 },
                certifications: ['Organic', 'BIS'],
                materials: ['organic apples'],
                quality_score: 92
            },
            {
                title: 'BPA-Free Baby Bottle 250ml',
                slug: 'bpa-free-bottle-250ml',
                description: 'Safe BPA-free bottle with anti-colic system. Features soft silicone nipple and easy-grip design.',
                short_description: 'BPA-free bottle with anti-colic nipple',
                images: ['img/baby-bottle.jpg'],
                price: 599.00,
                mrp: 699.00,
                category: 'feeding',
                age_range: { min: 0, max: 12 },
                certifications: ['BPA-Free', 'FDA'],
                materials: ['silicone', 'polypropylene'],
                quality_score: 88
            },
            {
                title: 'Organic Cotton Onesie',
                slug: 'organic-cotton-onesie',
                description: 'Soft organic cotton onesie for sensitive skin. Hypoallergenic and breathable fabric.',
                short_description: '100% organic cotton baby onesie',
                images: ['img/cotton-onesie.jpg'],
                price: 399.00,
                mrp: 499.00,
                category: 'clothes',
                age_range: { min: 0, max: 6 },
                certifications: ['GOTS', 'Organic'],
                materials: ['organic cotton'],
                quality_score: 95
            },
            {
                title: 'Eco-Friendly Diapers Pack',
                slug: 'eco-friendly-diapers',
                description: 'Biodegradable diapers made from bamboo fiber. Super absorbent and gentle on skin.',
                short_description: 'Eco-friendly bamboo diapers - 30 pack',
                images: ['img/eco-diapers.jpg'],
                price: 899.00,
                mrp: 999.00,
                category: 'diapers',
                age_range: { min: 0, max: 24 },
                certifications: ['Eco-Friendly', 'Biodegradable'],
                materials: ['bamboo fiber'],
                quality_score: 87
            },
            {
                title: 'Wooden Teething Ring',
                slug: 'wooden-teething-ring',
                description: 'Natural beech wood teething ring for sore gums. Smooth finish and safe for babies.',
                short_description: 'Safe wooden teething toy',
                images: ['img/teething-ring.jpg'],
                price: 449.00,
                mrp: 549.00,
                category: 'toys',
                age_range: { min: 3, max: 12 },
                certifications: ['CE', 'Natural'],
                materials: ['beech wood'],
                quality_score: 90
            },
            {
                title: 'Smart Baby Monitor',
                slug: 'smart-baby-monitor',
                description: 'WiFi enabled baby monitor with smartphone app. HD video, two-way audio, and night vision.',
                short_description: 'Smart monitor with video and audio',
                images: ['img/baby-monitor.jpg'],
                price: 2999.00,
                mrp: 3499.00,
                category: 'nursery',
                age_range: { min: 0, max: 36 },
                certifications: ['FCC', 'CE'],
                materials: ['plastic', 'electronics'],
                quality_score: 85
            }
        ];
        
        for (const product of products) {
            const { data, error } = await supabase
                .from('products')
                .insert([product]);
                
            if (error) {
                console.error('Error inserting product:', error);
            } else {
                console.log('Inserted product:', product.title);
            }
        }
        
        // Insert sample experts
        const experts = [
            {
                name: 'Dr. Priya Sharma',
                specialty: 'pediatrician',
                qualifications: ['MBBS', 'MD Pediatrics', 'Fellowship in Neonatology'],
                bio: 'Experienced pediatrician specializing in infant care and development with 15+ years of experience.',
                experience_years: 15,
                consultation_fee: 499.00,
                verified: true,
                rating: 4.9,
                total_consultations: 1250
            },
            {
                name: 'Meera Patel',
                specialty: 'lactation',
                qualifications: ['IBCLC Certified', 'BSc Nursing'],
                bio: 'Certified lactation consultant helping new mothers with breastfeeding challenges and support.',
                experience_years: 8,
                consultation_fee: 299.00,
                verified: true,
                rating: 4.8,
                total_consultations: 890
            },
            {
                name: 'Dr. Kavita Jain',
                specialty: 'sleep',
                qualifications: ['Sleep Consultant Certification', 'Child Psychology'],
                bio: 'Sleep specialist helping families establish healthy sleep routines using gentle methods.',
                experience_years: 10,
                consultation_fee: 399.00,
                verified: true,
                rating: 4.7,
                total_consultations: 650
            }
        ];
        
        for (const expert of experts) {
            const { data, error } = await supabase
                .from('experts')
                .insert([expert]);
                
            if (error) {
                console.error('Error inserting expert:', error);
            } else {
                console.log('Inserted expert:', expert.name);
            }
        }
        
        console.log('Database setup completed successfully!');
        
    } catch (error) {
        console.error('Error setting up database:', error);
    }
}

// Run setup when this script is loaded
if (typeof window !== 'undefined' && window.supabase) {
    // Browser environment
    document.addEventListener('DOMContentLoaded', function() {
        // Uncomment the line below to run setup (run only once)
        // setupDatabase();
    });
}