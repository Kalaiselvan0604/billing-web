// Authentication Management

// GitHub OAuth Configuration
const GITHUB_CLIENT_ID = 'your_github_client_id'; // To be configured
const GITHUB_REDIRECT_URI = window.location.origin + '/login.html';
const GITHUB_EMAIL = 'mechkalai2004@gmail.com';
const GITHUB_PASSWORD = 'Kalai@024';

async function authenticateWithGitHub(email, password) {
    // For offline functionality, we'll use local authentication
    // In production, this would integrate with GitHub OAuth
    
    if (email === GITHUB_EMAIL) {
        const database = await initDB();
        const isValid = await database.verifyPassword(password);
        
        if (isValid) {
            // Store authentication
            sessionStorage.setItem('authenticated', 'true');
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('authTime', new Date().toISOString());
            return true;
        }
    }
    
    return false;
}

async function checkAuth() {
    const authenticated = sessionStorage.getItem('authenticated');
    const authTime = sessionStorage.getItem('authTime');
    
    if (!authenticated || authenticated !== 'true') {
        return false;
    }
    
    // Check if session is still valid (24 hours)
    if (authTime) {
        const authDate = new Date(authTime);
        const now = new Date();
        const hoursDiff = (now - authDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            clearAuth();
            return false;
        }
    }
    
    return true;
}

function clearAuth() {
    sessionStorage.removeItem('authenticated');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('authTime');
}

async function verifySecurityQuestions(answer1, answer2, answer3) {
    const database = await initDB();
    const verified = await database.verifySecurityQuestions(answer1, answer2, answer3);
    return { verified };
}

async function setNewPassword(password) {
    const database = await initDB();
    await database.setPassword(password);
    return true;
}

// GitHub OAuth Flow (for future implementation)
function initiateGitHubOAuth() {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=user:email`;
    window.location.href = githubAuthUrl;
}

function handleGitHubCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        // Exchange code for token (would need backend in production)
        // For now, we'll use local authentication
        console.log('GitHub OAuth code received:', code);
    }
}

