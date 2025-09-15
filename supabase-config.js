// Supabase Configuration
const SUPABASE_URL = 'https://tzktemeomigmidcijpzf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6a3RlbWVvbWlnbWlkY2lqcHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MzQwODIsImV4cCI6MjA3MzQxMDA4Mn0.WJT0HW6CGbni1Am8GaD6WFNu5C0SAVU8VRX5h0a10k0';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database helper functions
class DatabaseService {
    // Auth functions
    async signUp(email, password, userData) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        });
        return { data, error };
    }

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    }

    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        });
        return { data, error };
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    }

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }

    // Profile functions
    async createProfile(userId, profileData) {
        const { data, error } = await supabase
            .from('profiles')
            .insert([{ user_id: userId, ...profileData }]);
        return { data, error };
    }

    async getProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        return { data, error };
    }

    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', userId);
        return { data, error };
    }

    // Baby profile functions
    async createBaby(babyData) {
        // First check if baby already exists for this user
        const { data: existing } = await supabase
            .from('babies')
            .select('*')
            .eq('user_id', babyData.user_id)
            .single();
        
        if (existing) {
            // Update existing baby
            const { data, error } = await supabase
                .from('babies')
                .update(babyData)
                .eq('user_id', babyData.user_id)
                .select();
            return { data, error };
        } else {
            // Create new baby
            const { data, error } = await supabase
                .from('babies')
                .insert([babyData])
                .select();
            return { data, error };
        }
    }

    async getBabies(userId) {
        const { data, error } = await supabase
            .from('babies')
            .select('*')
            .eq('user_id', userId);
        return { data, error };
    }

    async updateBaby(babyId, updates) {
        const { data, error } = await supabase
            .from('babies')
            .update(updates)
            .eq('id', babyId);
        return { data, error };
    }

    // Products functions
    async getProducts(filters = {}) {
        let query = supabase.from('products').select('*');
        
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.ageRange) {
            query = query.contains('age_range', filters.ageRange);
        }
        
        const { data, error } = await query;
        return { data, error };
    }

    async getProduct(productId) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
        return { data, error };
    }

    // Reviews functions
    async getReviews(productId) {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                profiles:user_id (username, avatar_url)
            `)
            .eq('product_id', productId)
            .order('created_at', { ascending: false });
        return { data, error };
    }

    async createReview(reviewData) {
        const { data, error } = await supabase
            .from('reviews')
            .insert([reviewData]);
        return { data, error };
    }

    // Orders functions
    async createOrder(orderData) {
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData]);
        return { data, error };
    }

    async getOrders(userId) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        return { data, error };
    }

    // Consultations functions
    async createConsultation(consultationData) {
        const { data, error } = await supabase
            .from('consultations')
            .insert([consultationData]);
        return { data, error };
    }

    async getConsultations(userId) {
        const { data, error } = await supabase
            .from('consultations')
            .select(`
                *,
                experts:expert_id (name, specialty, avatar_url)
            `)
            .eq('user_id', userId)
            .order('slot_time', { ascending: false });
        return { data, error };
    }

    // Experts functions
    async getExperts(specialty = null) {
        let query = supabase.from('experts').select('*');
        
        if (specialty) {
            query = query.eq('specialty', specialty);
        }
        
        const { data, error } = await query;
        return { data, error };
    }

    // Upload image
    async uploadImage(file, bucket = 'products') {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);
            
        if (error) return { data: null, error };
        
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);
            
        return { data: { path: fileName, url: publicUrl }, error: null };
    }
}

// Initialize database service
const db = new DatabaseService();

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user);
        localStorage.setItem('user', JSON.stringify(session.user));
    } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        localStorage.removeItem('user');
        localStorage.removeItem('profile');
    }
});