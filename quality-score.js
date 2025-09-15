// Quality scoring system for products
class QualityScorer {
    constructor() {
        this.weights = {
            certifications: 0.3,
            organic: 0.25,
            reviews: 0.2,
            safety: 0.15,
            materials: 0.1
        };
    }

    // Calculate quality score for a product
    calculateScore(product) {
        let score = 0;
        
        // Certification score (0-30 points)
        score += this.getCertificationScore(product) * this.weights.certifications * 100;
        
        // Organic score (0-25 points)
        score += this.getOrganicScore(product) * this.weights.organic * 100;
        
        // Reviews score (0-20 points)
        score += this.getReviewsScore(product) * this.weights.reviews * 100;
        
        // Safety score (0-15 points)
        score += this.getSafetyScore(product) * this.weights.safety * 100;
        
        // Materials score (0-10 points)
        score += this.getMaterialsScore(product) * this.weights.materials * 100;
        
        return Math.min(100, Math.round(score));
    }

    // Get certification score (0-1)
    getCertificationScore(product) {
        const certifications = product.certifications || [];
        let score = 0;
        
        // High-value certifications
        if (certifications.includes('ISO')) score += 0.3;
        if (certifications.includes('FDA')) score += 0.3;
        if (certifications.includes('BIS')) score += 0.2;
        if (certifications.includes('CE')) score += 0.2;
        
        return Math.min(1, score);
    }

    // Get organic score (0-1)
    getOrganicScore(product) {
        const badges = product.badges || [];
        let score = 0;
        
        if (badges.some(badge => badge.includes('Organic'))) score += 0.6;
        if (badges.some(badge => badge.includes('Natural'))) score += 0.4;
        if (badges.some(badge => badge.includes('Eco'))) score += 0.3;
        
        return Math.min(1, score);
    }

    // Get reviews score (0-1)
    getReviewsScore(product) {
        const rating = product.rating || 0;
        const reviewCount = product.reviewCount || 0;
        
        // Rating component (0-0.7)
        const ratingScore = rating / 5 * 0.7;
        
        // Review count component (0-0.3)
        let countScore = 0;
        if (reviewCount >= 100) countScore = 0.3;
        else if (reviewCount >= 50) countScore = 0.2;
        else if (reviewCount >= 10) countScore = 0.1;
        
        return ratingScore + countScore;
    }

    // Get safety score (0-1)
    getSafetyScore(product) {
        const badges = product.badges || [];
        let score = 0;
        
        if (badges.some(badge => badge.includes('Doctor Approved'))) score += 0.4;
        if (badges.some(badge => badge.includes('BPA-Free'))) score += 0.3;
        if (badges.some(badge => badge.includes('Safe'))) score += 0.3;
        
        return Math.min(1, score);
    }

    // Get materials score (0-1)
    getMaterialsScore(product) {
        const materials = product.materials || [];
        const badges = product.badges || [];
        let score = 0;
        
        if (materials.includes('wood') || badges.some(b => b.includes('Wood'))) score += 0.4;
        if (materials.includes('cotton') || badges.some(b => b.includes('Cotton'))) score += 0.3;
        if (materials.includes('silicone')) score += 0.3;
        
        return Math.min(1, score);
    }

    // Get score explanation
    getScoreExplanation(product) {
        const score = this.calculateScore(product);
        const reasons = [];
        
        if (product.certifications?.length > 0) {
            reasons.push('✅ Certified');
        }
        if (product.badges?.some(b => b.includes('Organic'))) {
            reasons.push('🌱 Organic');
        }
        if (product.rating >= 4.5) {
            reasons.push('⭐ Highly Rated');
        }
        if (product.badges?.some(b => b.includes('Doctor'))) {
            reasons.push('👩⚕️ Doctor Approved');
        }
        
        return {
            score,
            reasons: reasons.slice(0, 3), // Show top 3 reasons
            level: this.getScoreLevel(score)
        };
    }

    // Get score level
    getScoreLevel(score) {
        if (score >= 90) return 'Excellent';
        if (score >= 80) return 'Very Good';
        if (score >= 70) return 'Good';
        if (score >= 60) return 'Fair';
        return 'Needs Improvement';
    }
}

// Add quality scores to products
function addQualityScores(products) {
    const scorer = new QualityScorer();
    
    return products.map(product => {
        // Add sample certifications and materials for demo
        product.certifications = ['ISO', 'BIS'];
        product.reviewCount = Math.floor(Math.random() * 200) + 50;
        product.materials = ['cotton', 'wood'];
        
        const scoreData = scorer.getScoreExplanation(product);
        
        return {
            ...product,
            qualityScore: scoreData.score,
            scoreReasons: scoreData.reasons,
            scoreLevel: scoreData.level
        };
    });
}

// Display quality score badge
function displayQualityBadge(product) {
    const { qualityScore, scoreReasons } = product;
    
    let badgeColor = '#4CAF50'; // Green
    if (qualityScore < 70) badgeColor = '#FF9800'; // Orange
    if (qualityScore < 60) badgeColor = '#f44336'; // Red
    
    return `
        <div class="quality-badge" style="background: ${badgeColor}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; display: inline-block; margin-bottom: 5px;">
            Quality: ${qualityScore}/100
        </div>
        <div class="quality-reasons" style="font-size: 10px; color: #666;">
            ${scoreReasons.join(' • ')}
        </div>
    `;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QualityScorer, addQualityScores, displayQualityBadge };
}