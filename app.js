// ============================================================
// SHAREFLOW AI 2.0 – ADVANCED GAMIFIED RESOURCE SHARING ECOSYSTEM
// Architecture: Proximity Radar + SBERT Semantic Matcher +
// Circular Karma Escrow + Real-Time Barter Negotiation Hub
// ============================================================

// Global State
let currentUser = 'Admin';
let currentFilterType = 'all';
let currentCategory = 'all';
let isSemanticSearchActive = true;
let radarRadiusMiles = 2.0;
let radarSelectedCategory = 'all';
let selectedRadarNodeId = 1;
let currentViewPostId = 1;
let audioEnabled = true;

// Web Audio API Context for Sonar Ping
let audioCtx = null;

// Initial Seed Users with Karma Economy & Metrics
const defaultUsers = {
    'Admin': {
        name: 'Admin',
        tier: 'Neighborhood Guardian',
        level: 14,
        karma: 1420,
        multiplier: 3.2,
        escrowLocked: 50,
        streakDays: 12,
        reputation: 4.9,
        ratingsCount: 38,
        co2SavedKg: 142.5,
        dollarsSaved: 1840,
        ewasteSavedKg: 38.2,
        location: 'Seattle Eastside',
        badges: ['instant_responder', '50_items', 'top_lender', 'streak_champion', 'escrow_hero']
    },
    'Alice': {
        name: 'Alice',
        tier: 'Community Pillar',
        level: 8,
        karma: 850,
        multiplier: 2.2,
        escrowLocked: 0,
        streakDays: 7,
        reputation: 4.7,
        ratingsCount: 19,
        co2SavedKg: 82.0,
        dollarsSaved: 940,
        ewasteSavedKg: 18.0,
        location: 'Downtown',
        badges: ['instant_responder', 'streak_champion']
    },
    'Bob': {
        name: 'Bob',
        tier: 'Resource Helper',
        level: 6,
        karma: 540,
        multiplier: 1.5,
        escrowLocked: 50,
        streakDays: 4,
        reputation: 4.8,
        ratingsCount: 16,
        co2SavedKg: 45.0,
        dollarsSaved: 620,
        ewasteSavedKg: 12.5,
        location: 'Capitol Hill',
        badges: ['top_lender']
    },
    'Charlie': {
        name: 'Charlie',
        tier: 'Newcomer',
        level: 2,
        karma: 120,
        multiplier: 1.0,
        escrowLocked: 0,
        streakDays: 1,
        reputation: 4.2,
        ratingsCount: 3,
        co2SavedKg: 12.0,
        dollarsSaved: 150,
        ewasteSavedKg: 2.0,
        location: 'University District',
        badges: []
    }
};

// Seed Posts with Geolocation (distance & polar angle for radar), images & condition
const defaultPosts = [
    {
        id: 1,
        owner: 'Bob',
        type: 'offer',
        category: 'Tools',
        item: 'DeWalt Cordless Drill Kit (18V)',
        location: 'Capitol Hill (0.3 mi)',
        distanceMiles: 0.3,
        polarAngle: 0.85, // radians for radar
        image: 'images/drill_set.jpg',
        condition: 'Like New (Grade A-)',
        co2Diverted: 8.5,
        dollarsSaved: 149,
        desc: 'Professional 18V brushless motor cordless drill with 2 lithium batteries, charger, and 24-piece titanium bit case. Great for carpentry and repairs.',
        semanticTokens: ['drill', 'powertool', 'wood repair', 'carpentry', 'screw', 'furniture fix', 'hardware', 'dewalt', 'workshop'],
        comments: [
            { user: 'Admin', text: 'Does this include masonry bits?' },
            { user: 'Bob', text: 'Yes, 3 carbide masonry bits are included in the lid!' }
        ]
    },
    {
        id: 2,
        owner: 'Admin',
        type: 'offer',
        category: 'Books',
        item: 'General Chemistry & Calculus 10th Ed.',
        location: 'Seattle Eastside (0.8 mi)',
        distanceMiles: 0.8,
        polarAngle: 2.3,
        image: 'images/chemistry_book.jpg',
        condition: 'Like New (Grade A)',
        co2Diverted: 4.2,
        dollarsSaved: 185,
        desc: 'Standard university hardbound edition for Chem 101/102 and introductory calculus. Clean pages, no highlighting, includes online problem set access reference.',
        semanticTokens: ['book', 'chemistry', 'calculus', 'textbook', 'study', 'midterm', 'exam', 'university', 'science', 'math'],
        comments: [
            { user: 'Charlie', text: 'Can I borrow this for 2 weeks before the midterm exam?' },
            { user: 'Admin', text: 'Sure! Just scan the handover QR code to lock escrow.' }
        ]
    },
    {
        id: 3,
        owner: 'Alice',
        type: 'offer',
        category: 'Outdoors',
        item: 'Ultralight 2-Person Dome Camping Tent',
        location: 'Downtown (1.2 mi)',
        distanceMiles: 1.2,
        polarAngle: 4.1,
        image: 'images/camping_tent.jpg',
        condition: 'Brand New',
        co2Diverted: 12.0,
        dollarsSaved: 220,
        desc: 'Weatherproof ripstop nylon dome tent with lightweight aluminum poles and rainfly. Packs down to 3.2 lbs, perfect for weekend backpacking in Mt. Rainier.',
        semanticTokens: ['camping', 'tent', 'backpacking', 'hiking', 'outdoors', 'rainfly', 'sleep outdoors', 'recreation', 'nature'],
        comments: []
    },
    {
        id: 4,
        owner: 'Alice',
        type: 'offer',
        category: 'Clothes',
        item: 'Classic Vintage Denim Jacket',
        location: 'Downtown (0.7 mi)',
        distanceMiles: 0.7,
        polarAngle: 5.4,
        image: 'images/vintage_jacket.jpg',
        condition: 'Like New (Grade A-)',
        co2Diverted: 6.8,
        dollarsSaved: 95,
        desc: '100% heavy cotton vintage wash denim jacket (Size M). Cleaned and maintained with zero fading or tears. Great for chilly autumn evenings.',
        semanticTokens: ['jacket', 'clothes', 'denim', 'vintage', 'winter warmth', 'apparel', 'fashion', 'outerwear', 'coat'],
        comments: []
    },
    {
        id: 5,
        owner: 'Charlie',
        type: 'request',
        category: 'Tools',
        item: 'Table & Wood Repair Tools Needed',
        location: 'University District (1.5 mi)',
        distanceMiles: 1.5,
        polarAngle: 1.6,
        image: 'images/drill_set.jpg',
        condition: 'Request',
        co2Diverted: 6.0,
        dollarsSaved: 80,
        desc: 'Looking to borrow a power drill or sander for 2 days to repair a loose study desk. Willing to lock 40 Karma in escrow!',
        semanticTokens: ['wood repair', 'table fix', 'drill', 'carpentry', 'desk', 'tools', 'furniture'],
        comments: []
    },
    {
        id: 6,
        owner: 'Bob',
        type: 'request',
        category: 'Books',
        item: 'Need Calculus & Linear Algebra Textbook',
        location: 'Capitol Hill (0.9 mi)',
        distanceMiles: 0.9,
        polarAngle: 3.2,
        image: 'images/chemistry_book.jpg',
        condition: 'Request',
        co2Diverted: 3.5,
        dollarsSaved: 120,
        desc: 'Looking for college calculus guide for sophomore exam prep. Will return in pristine condition within 5 days.',
        semanticTokens: ['calculus', 'math', 'linear algebra', 'book', 'exam', 'textbook'],
        comments: []
    }
];

// Community Raids
const defaultRaids = [
    {
        id: 'raid-1',
        title: 'Midterm Campus Textbook Exchange',
        category: 'Books',
        targetCount: 50,
        currentCount: 42,
        deadline: 'Ends in 4 Days',
        rewardText: 'Unlocks Campus Coffee Voucher & +2.0x Karma Multiplier',
        badge: 'CAMPUS DRIVE'
    },
    {
        id: 'raid-2',
        title: 'Winter Warmth Community Outerwear Drive',
        category: 'Clothes',
        targetCount: 50,
        currentCount: 31,
        deadline: 'Ends in 11 Days',
        rewardText: 'Unlocks "Zero-Waste Pioneer" Permanent Profile Badge',
        badge: 'SEASONAL QUEST'
    },
    {
        id: 'raid-3',
        title: 'Neighborhood Tool Library Collective',
        category: 'Tools',
        targetCount: 50,
        currentCount: 46,
        deadline: 'Ends in 2 Days',
        rewardText: 'Unlocks Free Access to Municipal Woodworking Makerspace',
        badge: 'HIGH PRIORITY'
    }
];

// Dynamic Badge Definitions
const badgeRegistry = [
    { id: 'instant_responder', title: 'Instant Responder', icon: 'fa-bolt', desc: 'Avg response latency under 3 minutes.' },
    { id: '50_items', title: '50+ Items Saved', icon: 'fa-earth-americas', desc: 'Diverted over 50 items from municipal landfills.' },
    { id: 'top_lender', title: 'Top 1% Lender', icon: 'fa-crown', desc: 'Maintains top tier circular lending volume.' },
    { id: 'streak_champion', title: '12-Day Zero Waste', icon: 'fa-fire', desc: 'Consecutive active days sharing without waste.' },
    { id: 'escrow_hero', title: 'Escrow Guardian', icon: 'fa-shield-halved', desc: '100% verified QR handovers with zero dispute.' }
];

// Active State
let users = {};
let posts = [];
let raids = [];

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadPersistedData();
    updateHud();
    renderMarketplace();
    initRadarCanvas();
    renderCommunityRaids();
    renderBadges();
    renderLeaderboard('karma');
    drawHandoverQrCode('SHAREFLOW_ESCROW_TX_89432');
});

// Storage
function loadPersistedData() {
    const p = localStorage.getItem('sf_posts_v2');
    posts = p ? JSON.parse(p) : defaultPosts;

    const u = localStorage.getItem('sf_users_v2');
    users = u ? JSON.parse(u) : defaultUsers;

    const r = localStorage.getItem('sf_raids_v2');
    raids = r ? JSON.parse(r) : defaultRaids;

    const cur = localStorage.getItem('sf_curUser_v2');
    if (cur && users[cur]) currentUser = cur;

    document.getElementById('profileSwitcher').value = currentUser;
}

function saveState() {
    localStorage.setItem('sf_posts_v2', JSON.stringify(posts));
    localStorage.setItem('sf_users_v2', JSON.stringify(users));
    localStorage.setItem('sf_raids_v2', JSON.stringify(raids));
    localStorage.setItem('sf_curUser_v2', currentUser);
}

// Update Top HUD & Telemetry
function updateHud() {
    const user = users[currentUser] || users['Admin'];
    document.getElementById('hudUserTier').innerHTML = `<i class="fa-solid fa-shield-halved"></i> Tier: ${user.tier}`;
    document.getElementById('hudUserKarma').innerHTML = `<i class="fa-solid fa-coins"></i> ${user.karma.toLocaleString()} Karma Credits (${user.multiplier}x)`;
    document.getElementById('hudUserEscrow').innerHTML = `<i class="fa-solid fa-lock"></i> ${user.escrowLocked} Locked in Escrow`;
    document.getElementById('hudUserStreak').innerHTML = `<i class="fa-solid fa-fire"></i> ${user.streakDays}-Day Zero-Waste Streak`;

    // Hero telemetry
    document.getElementById('heroActivePosts').innerText = posts.length;
    document.getElementById('heroActiveUsers').innerText = Object.keys(users).length * 35;
    
    // Impact section
    document.getElementById('impactCo2').innerText = `${user.co2SavedKg.toFixed(1)} kg`;
    document.getElementById('impactSaved').innerText = `$${user.dollarsSaved.toLocaleString()}`;
    document.getElementById('impactEwaste').innerText = `${user.ewasteSavedKg.toFixed(1)} kg`;
    document.getElementById('impactCirculation').innerText = `${posts.length} Items`;

    // Certificate details
    document.getElementById('certUserName').innerText = `${user.name} (${user.tier})`;
    document.getElementById('certCo2').innerText = `${user.co2SavedKg.toFixed(1)} kg`;
    document.getElementById('certSaved').innerText = `$${user.dollarsSaved.toLocaleString()}`;
    document.getElementById('certEwaste').innerText = `${user.ewasteSavedKg.toFixed(1)} kg`;
    document.getElementById('certHash').innerText = `SHA256: ${generateSimpleHash(user.name + user.karma)}`;
}

function generateSimpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0') + '...9b2a';
}

function switchProfile(newProfile) {
    currentUser = newProfile;
    saveState();
    updateHud();
    renderMarketplace();
    renderBadges();
    showToast(`Switched active profile to ${newProfile}`, 'fa-user-check');
}

// ============================================================
// NAVIGATION & TABS
// ============================================================
function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(sec => {
        sec.classList.remove('active-section');
        sec.classList.add('section-hidden');
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('section-hidden');
        target.classList.add('active-section');
    }

    document.querySelectorAll('.nav-links .nav-item').forEach(link => link.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${sectionId}`);
    if (activeNav) activeNav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// GEOSPATIAL PROXIMITY RADAR MAP ENGINE (Canvas 60fps)
// ============================================================
let radarAnimId = null;
let radarSweepAngle = 0;

function initRadarCanvas() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI displays
    const size = 600;
    canvas.width = size;
    canvas.height = size;

    renderRadarNodesList();
    inspectRadarNode(posts[0]);

    // Canvas click detection for blips
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scale = size / rect.width;
        const clickX = (e.clientX - rect.left) * scale;
        const clickY = (e.clientY - rect.top) * scale;
        const center = size / 2;

        // Check each visible post blip
        const maxDistRadius = (size / 2) - 40;
        const visibleNodes = posts.filter(p => {
            const matchesRadius = p.distanceMiles <= radarRadiusMiles;
            const matchesCat = radarSelectedCategory === 'all' || p.category === radarSelectedCategory;
            return matchesRadius && matchesCat;
        });

        for (const p of visibleNodes) {
            const nodeRadius = (p.distanceMiles / radarRadiusMiles) * maxDistRadius;
            const x = center + Math.cos(p.polarAngle) * nodeRadius;
            const y = center + Math.sin(p.polarAngle) * nodeRadius;

            const distFromClick = Math.hypot(clickX - x, clickY - y);
            if (distFromClick < 22) { // 22px click tolerance
                inspectRadarNode(p);
                playSonarPing(880);
                showToast(`Focused Radar Target: ${p.item}`, 'fa-crosshairs');
                break;
            }
        }
    });

    function drawRadarFrame() {
        ctx.clearRect(0, 0, size, size);
        const center = size / 2;
        const maxRadius = center - 40;

        // Background subtle concentric rings
        const rings = [0.25, 0.5, 0.75, 1.0];
        ctx.lineWidth = 1;
        rings.forEach(rFrac => {
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
            ctx.beginPath();
            ctx.arc(center, center, maxRadius * rFrac, 0, Math.PI * 2);
            ctx.stroke();

            // Distance labels
            ctx.fillStyle = 'rgba(0, 229, 255, 0.45)';
            ctx.font = '10px "Space Grotesk", monospace';
            const distLabel = (radarRadiusMiles * rFrac).toFixed(1) + ' mi';
            ctx.fillText(distLabel, center + 4, center - (maxRadius * rFrac) + 12);
        });

        // Crosshairs
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
        ctx.beginPath();
        ctx.moveTo(center, center - maxRadius);
        ctx.lineTo(center, center + maxRadius);
        ctx.moveTo(center - maxRadius, center);
        ctx.lineTo(center + maxRadius, center);
        ctx.stroke();

        // Sweeping Sonar Beam
        radarSweepAngle += 0.022;
        if (radarSweepAngle > Math.PI * 2) radarSweepAngle -= Math.PI * 2;

        const gradient = ctx.createRadialGradient(center, center, 0, center, center, maxRadius);
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0.0)');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, maxRadius, radarSweepAngle - 0.45, radarSweepAngle);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Main Sweep Line
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(center + Math.cos(radarSweepAngle) * maxRadius, center + Math.sin(radarSweepAngle) * maxRadius);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        // Draw Resource Blips
        const visibleNodes = posts.filter(p => {
            const matchesRadius = p.distanceMiles <= radarRadiusMiles;
            const matchesCat = radarSelectedCategory === 'all' || p.category === radarSelectedCategory;
            return matchesRadius && matchesCat;
        });

        document.getElementById('radarActiveNodesCount').innerText = `PULSING: ${visibleNodes.length} NODES`;

        visibleNodes.forEach(p => {
            const nodeRadius = (p.distanceMiles / radarRadiusMiles) * maxRadius;
            const x = center + Math.cos(p.polarAngle) * nodeRadius;
            const y = center + Math.sin(p.polarAngle) * nodeRadius;

            // Difference between sweep angle and node angle to trigger pulse
            let angleDiff = Math.abs(radarSweepAngle - (p.polarAngle % (Math.PI * 2)));
            if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

            const isHit = angleDiff < 0.25;

            // Outer pulse ring
            if (isHit) {
                ctx.beginPath();
                ctx.arc(x, y, 16, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Blip Core
            ctx.beginPath();
            ctx.arc(x, y, p.id === selectedRadarNodeId ? 8 : 5, 0, Math.PI * 2);
            ctx.fillStyle = p.type === 'offer' ? '#00ff9d' : '#ffaa00';
            ctx.shadowColor = p.type === 'offer' ? '#00ff9d' : '#ffaa00';
            ctx.shadowBlur = p.id === selectedRadarNodeId ? 16 : 8;
            ctx.fill();

            // Label
            ctx.font = '11px Outfit, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 0;
            ctx.fillText(p.item.substring(0, 14) + '..', x + 10, y + 4);
        });

        // Center Node (User)
        ctx.beginPath();
        ctx.arc(center, center, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 14;
        ctx.fill();

        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillStyle = '#00e5ff';
        ctx.fillText("YOU (Home Base)", center - 45, center + 22);

        radarAnimId = requestAnimationFrame(drawRadarFrame);
    }

    if (radarAnimId) cancelAnimationFrame(radarAnimId);
    radarAnimId = requestAnimationFrame(drawRadarFrame);
}

function updateRadarRadius(val) {
    radarRadiusMiles = parseFloat(val);
    document.getElementById('radarRadiusDisplay').innerText = `${radarRadiusMiles.toFixed(1)} Miles`;
    renderRadarNodesList();
}

function setRadarCategory(cat) {
    radarSelectedCategory = cat;
    document.querySelectorAll('#radarCategoryPills button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderRadarNodesList();
}

function renderRadarNodesList() {
    const list = document.getElementById('radarNodesList');
    if (!list) return;
    list.innerHTML = '';

    const visibleNodes = posts.filter(p => {
        const matchesRadius = p.distanceMiles <= radarRadiusMiles;
        const matchesCat = radarSelectedCategory === 'all' || p.category === radarSelectedCategory;
        return matchesRadius && matchesCat;
    });

    if (visibleNodes.length === 0) {
        list.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:1rem; font-size:0.85rem;">No nodes in range. Increase radius or change category.</div>`;
        return;
    }

    visibleNodes.forEach(p => {
        const item = document.createElement('div');
        item.className = `radar-node-item ${p.id === selectedRadarNodeId ? 'selected' : ''}`;
        item.onclick = () => {
            inspectRadarNode(p);
            playSonarPing(740);
        };

        item.innerHTML = `
            <img src="${p.image}" class="radar-node-thumb" alt="${p.item}">
            <div class="radar-node-info">
                <div class="radar-node-title">${p.item}</div>
                <div class="radar-node-meta">
                    <span style="color:var(--accent-cyan);"><i class="fa-solid fa-location-arrow"></i> ${p.distanceMiles} mi</span>
                    <span>•</span>
                    <span style="color:${p.type === 'offer' ? 'var(--accent-emerald)' : 'var(--accent-amber)'};">${p.type.toUpperCase()}</span>
                    <span>•</span>
                    <span>${p.category}</span>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

function inspectRadarNode(post) {
    if (!post) return;
    selectedRadarNodeId = post.id;
    currentViewPostId = post.id;

    document.getElementById('inspectTitle').innerText = post.item;
    document.getElementById('inspectDesc').innerText = post.desc;
    document.getElementById('inspectImg').src = post.image;
    document.getElementById('inspectOwner').innerText = post.owner;
    document.getElementById('inspectDistance').innerHTML = `<i class="fa-solid fa-location-arrow"></i> ${post.distanceMiles} mi away`;
    
    const badge = document.getElementById('inspectBadge');
    badge.className = `badge badge-${post.type}`;
    badge.innerText = post.type.toUpperCase();

    renderRadarNodesList();
}

function triggerSonarPing() {
    playSonarPing(980);
    showToast('Sonar pulse broadcasted! 6 active nodes echoing response.', 'fa-satellite-dish');
}

function initiateInspectBarter() {
    const post = posts.find(p => p.id === selectedRadarNodeId);
    if (post) openBarterDrawerForPost(post);
}

// Web Audio Sonar Ping
function playSonarPing(freq = 660) {
    if (!audioEnabled) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
        // Audio policy ignore
    }
}

function toggleRadarAudio() {
    audioEnabled = !audioEnabled;
    const btn = document.getElementById('radarSoundToggle');
    if (audioEnabled) {
        btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> Sonar SFX`;
        playSonarPing(880);
        showToast('Sonar audio enabled', 'fa-volume-high');
    } else {
        btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> Muted`;
        showToast('Sonar audio muted', 'fa-volume-xmark');
    }
}

// ============================================================
// MARKETPLACE & AI SBERT SEMANTIC VECTOR SEARCH
// ============================================================
function filterPosts() {
    renderMarketplace();
}

function setPostTypeFilter(type) {
    currentFilterType = type;
    document.querySelectorAll('.toggle-group button').forEach(b => b.classList.remove('active'));
    document.getElementById(`filter-${type}`).classList.add('active');
    renderMarketplace();
}

function toggleSemanticSearch() {
    isSemanticSearchActive = !isSemanticSearchActive;
    const btn = document.getElementById('semanticSearchToggle');
    if (isSemanticSearchActive) {
        btn.classList.add('active');
        showToast('SBERT AI Semantic Search Activated (concept & intent matching)', 'fa-wand-magic-sparkles');
    } else {
        btn.classList.remove('active');
        showToast('Switched to Standard Exact Keyword Filter', 'fa-font');
    }
    renderMarketplace();
}

function calculateSemanticMatchScore(query, post) {
    if (!query || query.trim() === '') return 1.0;
    const qWords = query.toLowerCase().split(/\s+/).filter(Boolean);

    // Exact matches
    let score = 0;
    const itemLower = post.item.toLowerCase();
    const descLower = post.desc.toLowerCase();

    qWords.forEach(w => {
        if (itemLower.includes(w)) score += 0.5;
        if (descLower.includes(w)) score += 0.3;
        if (post.semanticTokens.some(t => t.includes(w) || w.includes(t))) score += 0.6;
    });

    // Special concept matching (SBERT emulation)
    if (qWords.some(w => ['wood', 'fix', 'repair', 'screw', 'furniture', 'shelf'].includes(w)) && post.category === 'Tools') {
        score += 0.75;
    }
    if (qWords.some(w => ['exam', 'study', 'midterm', 'calculus', 'math', 'chemistry', 'homework'].includes(w)) && post.category === 'Books') {
        score += 0.75;
    }
    if (qWords.some(w => ['camp', 'hiking', 'mountain', 'sleep', 'tent', 'backpack'].includes(w)) && post.category === 'Outdoors') {
        score += 0.75;
    }
    if (qWords.some(w => ['cold', 'warmth', 'jacket', 'denim', 'wear', 'winter'].includes(w)) && post.category === 'Clothes') {
        score += 0.75;
    }

    return Math.min(score, 1.0);
}

function renderMarketplace() {
    const grid = document.getElementById('postsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const searchVal = document.getElementById('searchInput').value.trim();
    const catVal = document.getElementById('categoryFilter').value;

    let filtered = posts.map(p => {
        const score = calculateSemanticMatchScore(searchVal, p);
        return { post: p, matchScore: score };
    });

    // Filter by match score
    if (searchVal.length > 0) {
        if (isSemanticSearchActive) {
            filtered = filtered.filter(item => item.matchScore > 0.2);
            filtered.sort((a, b) => b.matchScore - a.matchScore);
        } else {
            filtered = filtered.filter(item => {
                const s = searchVal.toLowerCase();
                return item.post.item.toLowerCase().includes(s) || item.post.desc.toLowerCase().includes(s);
            });
        }
    }

    // Filter category & type
    filtered = filtered.filter(item => {
        const p = item.post;
        const matchesCat = catVal === 'all' || p.category === catVal;
        const matchesType = currentFilterType === 'all' || p.type === currentFilterType;
        return matchesCat && matchesType;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:4rem 1rem; color:var(--text-muted);">
                <i class="fa-solid fa-radar" style="font-size:3rem; margin-bottom:1rem; opacity:0.4;"></i>
                <h3>No Matching Community Resources Detected</h3>
                <p style="font-size:0.9rem; margin-top:0.4rem;">Try broadening your search or post a new request to notify neighbors.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(({ post: p, matchScore }) => {
        const card = document.createElement('div');
        card.className = 'post-card glass-panel';

        const matchBadge = (isSemanticSearchActive && searchVal.length > 0) ? `
            <span class="badge" style="background:rgba(168,85,247,0.2); color:#c084fc; border:1px solid rgba(168,85,247,0.4);">
                <i class="fa-solid fa-sparkles"></i> ${(matchScore * 100).toFixed(0)}% SBERT Match
            </span>
        ` : '';

        card.innerHTML = `
            <img src="${p.image}" class="post-card-img" alt="${p.item}">
            <div class="post-card-header">
                <div style="display:flex; gap:0.4rem; align-items:center;">
                    <span class="badge badge-${p.type}">${p.type.toUpperCase()}</span>
                    <span class="post-condition-badge">${p.condition}</span>
                </div>
                ${matchBadge}
            </div>
            <h3 class="post-title">${p.item}</h3>
            <p class="post-desc">${p.desc}</p>
            <div class="post-impact-pill">
                <i class="fa-solid fa-leaf"></i> 🌱 Diverts ${p.co2Diverted} kg CO₂ | Est. $${p.dollarsSaved} Saved
            </div>
            <div class="post-footer">
                <span><i class="fa-solid fa-user"></i> ${p.owner}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${p.location}</span>
            </div>
            <div class="post-card-actions">
                <button class="btn-card-primary" onclick="openBarterDrawerForPostById(${p.id})">
                    <i class="fa-solid fa-handshake"></i> ${p.type === 'offer' ? 'Request Barter' : 'Fulfill Request'}
                </button>
                <button class="btn-card-secondary" onclick="openDetailsModal(${p.id})">
                    <i class="fa-solid fa-eye"></i> Details (${p.comments.length})
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ============================================================
// AI VISION CONDITION LAB & SCANNER
// ============================================================
const scanPresets = {
    'drill': {
        name: 'Cordless Power Drill Kit (18V)',
        cat: 'Tools & Workshop',
        img: 'images/drill_set.jpg',
        grade: 'Grade A- (Like New)',
        gradeBadge: 'A-',
        confidence: '98.4% Confidence via Vision Model',
        defect: '< 2.5% (Minimal cosmetic scuffing on base)',
        integrity: '100% (Motor & Battery Intact)',
        duration: '3 – 5 Days',
        value: '$149.00 USD',
        karma: '+75 Karma / Lending Cycle',
        tags: ['#powertool', '#cordless', '#woodworking', '#18v-brushless']
    },
    'book': {
        name: 'General Chemistry & Calculus 10th Ed.',
        cat: 'Books & Education',
        img: 'images/chemistry_book.jpg',
        grade: 'Grade A (Pristine)',
        gradeBadge: 'A',
        confidence: '99.1% Confidence via Vision Model',
        defect: '< 1.0% (Zero highlighting, crisp binding)',
        integrity: '100% (All 1,280 pages present)',
        duration: '14 Days (Full Study Module)',
        value: '$185.00 USD',
        karma: '+60 Karma / Lending Cycle',
        tags: ['#chemistry', '#textbook', '#stem', '#college-exam']
    },
    'tent': {
        name: 'Ultralight 2-Person Dome Camping Tent',
        cat: 'Outdoors & Recreation',
        img: 'images/camping_tent.jpg',
        grade: 'Grade A+ (Brand New)',
        gradeBadge: 'A+',
        confidence: '97.8% Confidence via Vision Model',
        defect: '0.0% (Factory sealed stakes & rainfly)',
        integrity: '100% (Full seam tape seal)',
        duration: '4 Days (Weekend Trek)',
        value: '$220.00 USD',
        karma: '+90 Karma / Lending Cycle',
        tags: ['#camping', '#tent', '#backpacking', '#ultralight']
    },
    'jacket': {
        name: 'Classic Vintage Denim Jacket',
        cat: 'Apparel & Outerwear',
        img: 'images/vintage_jacket.jpg',
        grade: 'Grade A- (Vintage Quality)',
        gradeBadge: 'A-',
        confidence: '96.5% Confidence via Vision Model',
        defect: '< 3.0% (Natural vintage wear patina)',
        integrity: '100% (Heavy gauge brass rivets)',
        duration: '7 Days',
        value: '$95.00 USD',
        karma: '+50 Karma / Lending Cycle',
        tags: ['#denim', '#vintage', '#sustainable-fashion', '#outerwear']
    }
};

let currentSelectedPresetKey = 'drill';

function loadScannerPreset(key) {
    currentSelectedPresetKey = key;
    document.querySelectorAll('.preset-chip').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    const data = scanPresets[key];
    if (!data) return;

    document.getElementById('scannerPreviewImg').src = data.img;
    document.getElementById('aiGradeLabel').innerText = data.grade;
    document.getElementById('aiGradeBadge').innerText = data.gradeBadge;
    document.getElementById('aiConfidenceLabel').innerText = data.confidence;
    document.getElementById('aiDetectedName').innerText = data.name;
    document.getElementById('aiDetectedCat').innerText = data.cat;
    document.getElementById('aiDefectLevel').innerText = data.defect;
    document.getElementById('aiIntegrity').innerText = data.integrity;
    document.getElementById('aiLoanDuration').innerText = data.duration;
    document.getElementById('aiReplacementVal').innerText = data.value;
    document.getElementById('aiKarmaMint').innerText = data.karma;

    const tagsBox = document.getElementById('aiTagsContainer');
    tagsBox.innerHTML = '';
    data.tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.style = 'background:rgba(0,229,255,0.1); color:var(--accent-cyan);';
        span.innerText = t;
        tagsBox.appendChild(span);
    });

    triggerScanAnimation();
}

function triggerScanAnimation() {
    const box = document.getElementById('scannerDropzone');
    box.classList.add('scanning');
    playSonarPing(1100);

    setTimeout(() => {
        box.classList.remove('scanning');
        playSonarPing(880);
        showToast('Gemini Multimodal Vision Scan Complete! Defect grading updated.', 'fa-check');
    }, 1500);
}

function publishScannedItem() {
    const preset = scanPresets[currentSelectedPresetKey];
    const newPost = {
        id: Date.now(),
        owner: currentUser,
        type: 'offer',
        category: preset.cat.split(' ')[0],
        item: preset.name,
        location: `${users[currentUser]?.location || 'Seattle Eastside'} (0.2 mi)`,
        distanceMiles: 0.2,
        polarAngle: Math.random() * Math.PI * 2,
        image: preset.img,
        condition: preset.grade.split(' ')[0] + ' ' + preset.grade.split(' ')[1],
        co2Diverted: 8.0,
        dollarsSaved: parseInt(preset.value.replace(/[^0-9]/g, '')) || 100,
        desc: `AI-Verified listing with condition rating ${preset.gradeBadge}. Defect report: ${preset.defect}.`,
        semanticTokens: preset.tags.map(t => t.replace('#', '')),
        comments: []
    };

    posts.unshift(newPost);
    saveState();
    renderMarketplace();
    renderRadarNodesList();
    showToast(`Published "${newPost.item}" with verified AI Metadata!`, 'fa-rocket');
    showSection('marketplace');
}

function initiateAutoMatch(requester, lender, itemName) {
    openBarterDrawer();
    document.getElementById('drawerItemTitle').innerText = itemName;
    document.getElementById('drawerEscrowTerms').innerText = `Escrow Stake: 45 Karma Locked | Requester: ${requester} ↔ Lender: ${lender}`;
    
    const chat = document.getElementById('drawerChatMessages');
    chat.innerHTML = `
        <div class="chat-bubble peer">
            <strong>🤖 Autonomous Agent:</strong> Matchmaker successfully paired ${requester}'s open request with ${lender}'s ${itemName} (95.4% SBERT similarity). Review and finalize terms below.
        </div>
    `;
    showToast(`Proposed trade contract for ${itemName}`, 'fa-handshake');
}

function openAgenticMatchReview() {
    showSection('ai-lab');
    window.scrollTo({ top: 800, behavior: 'smooth' });
}

// ============================================================
// CIRCULAR KARMA ECONOMY & COMMUNITY RAIDS
// ============================================================
function renderCommunityRaids() {
    const container = document.getElementById('raidsContainer');
    if (!container) return;
    container.innerHTML = '';

    raids.forEach(r => {
        const pct = Math.round((r.currentCount / r.targetCount) * 100);
        const card = document.createElement('div');
        card.className = 'raid-card glass-panel';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="raid-banner-tag" style="background:rgba(0,229,255,0.15); color:var(--accent-cyan); border:1px solid rgba(0,229,255,0.3);">
                    <i class="fa-solid fa-flag"></i> ${r.badge}
                </span>
                <small style="color:var(--text-muted);"><i class="fa-regular fa-clock"></i> ${r.deadline}</small>
            </div>
            <h3 style="font-size:1.25rem; margin:0.6rem 0 0.3rem 0;">${r.title}</h3>
            <p style="color:var(--text-muted); font-size:0.85rem; line-height:1.5;">${r.rewardText}</p>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${pct}%;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-top:0.4rem; color:var(--text-muted);">
                <span>Progress: <strong style="color:#fff;">${r.currentCount} / ${r.targetCount} Items</strong></span>
                <span style="color:var(--accent-emerald); font-weight:700;">${pct}% Completed</span>
            </div>
            <button class="btn-card-primary" style="width:100%; margin-top:1.2rem; padding:0.65rem;" onclick="openContributeRaidModal('${r.id}')">
                <i class="fa-solid fa-hand-holding-heart"></i> Contribute Item (+100 Karma)
            </button>
        `;
        container.appendChild(card);
    });
}

function renderBadges() {
    const box = document.getElementById('badgesContainer');
    if (!box) return;
    box.innerHTML = '';

    const user = users[currentUser] || users['Admin'];
    const userBadges = user.badges || [];

    badgeRegistry.forEach(b => {
        const isUnlocked = userBadges.includes(b.id);
        const card = document.createElement('div');
        card.className = `badge-showcase-card glass-panel ${isUnlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
            <div class="badge-icon-wrap">
                <i class="fa-solid ${b.icon}"></i>
            </div>
            <h4 style="font-size:0.95rem; margin:0.2rem 0; color:${isUnlocked ? '#fff' : 'var(--text-muted)'};">${b.title}</h4>
            <p style="font-size:0.75rem; color:var(--text-muted); line-height:1.4;">${b.desc}</p>
            <span class="badge" style="background:${isUnlocked ? 'rgba(0,255,157,0.15)' : 'rgba(255,255,255,0.05)'}; color:${isUnlocked ? 'var(--accent-emerald)' : 'var(--text-dim)'}; margin-top:auto;">
                ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </span>
        `;
        box.appendChild(card);
    });
}

function openContributeRaidModal(raidId) {
    const select = document.getElementById('raidSelect');
    select.innerHTML = '';
    raids.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.innerText = `${r.title} (${r.currentCount}/${r.targetCount})`;
        if (raidId && r.id === raidId) opt.selected = true;
        select.appendChild(opt);
    });

    const itemSelect = document.getElementById('raidItemSelect');
    itemSelect.innerHTML = '';
    const myOffers = posts.filter(p => p.owner === currentUser && p.type === 'offer');
    if (myOffers.length === 0) {
        itemSelect.innerHTML = `<option value="">Demo Item: DeWalt Drill or General Chemistry Textbook</option>`;
    } else {
        myOffers.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.id;
            opt.innerText = o.item;
            itemSelect.appendChild(opt);
        });
    }

    openModal('contributeRaidModal');
}

function handleContributeToRaid(e) {
    e.preventDefault();
    const raidId = document.getElementById('raidSelect').value;
    const targetRaid = raids.find(r => r.id === raidId) || raids[0];

    targetRaid.currentCount = Math.min(targetRaid.targetCount, targetRaid.currentCount + 1);

    // Reward user
    const user = users[currentUser];
    if (user) {
        user.karma += 100;
        user.co2SavedKg += 6.5;
        user.streakDays += 1;
    }

    saveState();
    updateHud();
    renderCommunityRaids();
    closeModal('contributeRaidModal');
    playSonarPing(900);
    showToast(`Contributed to "${targetRaid.title}"! Earned +100 Karma Credits & extended streak.`, 'fa-circle-check');
}

// ============================================================
// REAL-TIME BARTER & CHAT DRAWER
// ============================================================
function openBarterDrawer() {
    document.getElementById('barterDrawerOverlay').classList.add('open');
    document.getElementById('barterDrawer').classList.add('open');
}

function closeBarterDrawer() {
    document.getElementById('barterDrawerOverlay').classList.remove('open');
    document.getElementById('barterDrawer').classList.remove('open');
}

function openBarterDrawerForPostById(id) {
    const post = posts.find(p => p.id === id);
    if (post) openBarterDrawerForPost(post);
}

function openBarterDrawerForPost(post) {
    currentViewPostId = post.id;
    document.getElementById('drawerItemTitle').innerText = post.item;
    document.getElementById('drawerEscrowTerms').innerText = `Escrow Stake: 50 Karma Locked | Lender: ${post.owner}`;
    document.getElementById('drawerContractStatus').innerText = 'IN NEGOTIATION';

    drawHandoverQrCode(`SF_ESCROW_TX_${post.id}_${currentUser}`);

    const chat = document.getElementById('drawerChatMessages');
    chat.innerHTML = `
        <div class="chat-bubble peer">
            <strong>${post.owner}:</strong> Hey ${currentUser}! Glad you're interested in ${post.item}. It's ready for handover today.
        </div>
    `;

    openBarterDrawer();
}

function drawHandoverQrCode(content) {
    const canvas = document.getElementById('handoverQrCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 140;
    ctx.clearRect(0, 0, size, size);

    // Draw stylized QR Matrix
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#080714';
    const grid = 14;
    const cell = size / grid;

    // Corner Finder Patterns
    function drawFinder(r, c) {
        ctx.fillRect(c * cell, r * cell, cell * 3, cell * 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect((c + 0.6) * cell, (r + 0.6) * cell, cell * 1.8, cell * 1.8);
        ctx.fillStyle = '#080714';
        ctx.fillRect((c + 1) * cell, (r + 1) * cell, cell * 1, cell * 1);
    }

    drawFinder(1, 1);
    drawFinder(1, grid - 4);
    drawFinder(grid - 4, 1);

    // Deterministic pseudo-random payload pattern based on string
    let seed = 0;
    for (let i = 0; i < content.length; i++) seed += content.charCodeAt(i);

    for (let r = 0; r < grid; r++) {
        for (let c = 0; c < grid; c++) {
            if ((r < 5 && c < 5) || (r < 5 && c > grid - 6) || (r > grid - 6 && c < 5)) continue;
            seed = (seed * 9301 + 49297) % 233280;
            if (seed / 233280 > 0.5) {
                ctx.fillRect(c * cell, r * cell, cell * 0.9, cell * 0.9);
            }
        }
    }
}

function simulateQrHandoverReturn() {
    const user = users[currentUser];
    if (user) {
        user.escrowLocked = Math.max(0, user.escrowLocked - 50);
        user.karma += Math.round(50 * user.multiplier);
        user.streakDays += 1;
        user.co2SavedKg += 5.2;
        user.dollarsSaved += 45;
    }

    saveState();
    updateHud();
    playSonarPing(880);
    showToast('Verified Return via QR Scan! 50 Escrow released + 1.5x Karma minted.', 'fa-circle-check');

    document.getElementById('drawerContractStatus').innerText = 'COMPLETED / RETURNED';
    document.getElementById('drawerContractStatus').className = 'badge badge-offer';

    const chat = document.getElementById('drawerChatMessages');
    const div = document.createElement('div');
    div.className = 'chat-bubble peer';
    div.innerHTML = `<strong>System:</strong> 🎉 Verified item scan! Escrow contract settled with zero dispute.`;
    chat.appendChild(div);
}

function sendBarterMessage(e) {
    e.preventDefault();
    const input = document.getElementById('barterChatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const chat = document.getElementById('drawerChatMessages');
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble me';
    userMsg.innerHTML = `<strong>You:</strong> ${msg}`;
    chat.appendChild(userMsg);
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    // Simulated peer auto-reply after 1.2s
    setTimeout(() => {
        const peerMsg = document.createElement('div');
        peerMsg.className = 'chat-bubble peer';
        const replies = [
            "Sounds like a great deal! I can meet you at the neighborhood coffee shop.",
            "Terms accepted. I've locked the calendar slot for your pickup.",
            "Perfect. Let's scan the QR code upon handover to activate the escrow."
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        peerMsg.innerHTML = `<strong>Peer:</strong> ${randomReply}`;
        chat.appendChild(peerMsg);
        chat.scrollTop = chat.scrollHeight;
        playSonarPing(600);
    }, 1200);
}

function acceptBarterContract() {
    document.getElementById('drawerContractStatus').innerText = 'ESCROW ACTIVE';
    document.getElementById('drawerContractStatus').className = 'badge badge-offer';
    showToast('Contract terms accepted! Escrow locked until verified return.', 'fa-check');
}

function proposeCounterOffer() {
    const chat = document.getElementById('drawerChatMessages');
    const div = document.createElement('div');
    div.className = 'chat-bubble me';
    div.innerHTML = `<strong>You:</strong> Counter-proposal: Can we adjust borrow window to 5 days with 60 Karma escrow stake?`;
    chat.appendChild(div);
    showToast('Counter-offer sent to lender', 'fa-paper-plane');
}

// ============================================================
// DETAILS MODAL, RATINGS & COMMENTS
// ============================================================
function openDetailsModal(id) {
    currentViewPostId = id;
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('detailTitle').innerText = post.item;
    document.getElementById('detailDesc').innerText = post.desc;
    document.getElementById('detailImg').src = post.image;
    document.getElementById('detailOwner').innerText = post.owner;
    document.getElementById('detailLocation').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${post.location}`;
    document.getElementById('detailBadge').className = `badge badge-${post.type}`;
    document.getElementById('detailBadge').innerText = post.type.toUpperCase();

    renderDetailComments(post);
    openModal('detailsModal');
}

function renderDetailComments(post) {
    const list = document.getElementById('detailCommentsList');
    list.innerHTML = '';
    if (!post.comments || post.comments.length === 0) {
        list.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem;">No questions yet. Be the first to ask!</div>`;
        return;
    }

    post.comments.forEach(c => {
        const div = document.createElement('div');
        div.style = 'background:rgba(255,255,255,0.04); padding:0.5rem 0.8rem; border-radius:8px; font-size:0.85rem;';
        div.innerHTML = `<strong style="color:var(--accent-cyan);">${c.user}:</strong> <span style="color:#eee;">${c.text}</span>`;
        list.appendChild(div);
    });
}

function handleSendComment(e) {
    e.preventDefault();
    const input = document.getElementById('commentTextInput');
    const text = input.value.trim();
    if (!text) return;

    const post = posts.find(p => p.id === currentViewPostId);
    if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push({ user: currentUser, text });
        saveState();
        renderDetailComments(post);
        renderMarketplace();
        input.value = '';
        showToast('Comment posted to resource thread', 'fa-comment');
    }
}

function rateOwner(stars) {
    const post = posts.find(p => p.id === currentViewPostId);
    if (!post) return;

    if (post.owner === currentUser) {
        alert("You cannot rate yourself!");
        return;
    }

    const owner = users[post.owner];
    if (owner) {
        const currentSum = owner.reputation * owner.ratingsCount;
        owner.ratingsCount++;
        owner.reputation = (currentSum + stars) / owner.ratingsCount;
        saveState();
        updateHud();
        renderLeaderboard('karma');
        showToast(`Rated ${post.owner} ${stars} stars!`, 'fa-star');
    }
}

function initiateModalBarter() {
    closeModal('detailsModal');
    const post = posts.find(p => p.id === currentViewPostId);
    if (post) openBarterDrawerForPost(post);
}

// ============================================================
// CREATE LISTING FORM
// ============================================================
function openCreateListingModal() {
    openModal('postModal');
}

function handleCreatePost(e) {
    e.preventDefault();
    const type = document.querySelector('input[name="pType"]:checked').value;
    const item = document.getElementById('pItemName').value.trim();
    const category = document.getElementById('pCategory').value;
    const condition = document.getElementById('pCondition').value;
    const location = document.getElementById('pLocation').value.trim() || 'Seattle Eastside (0.5 mi)';
    const image = document.getElementById('pImgSelect').value;
    const desc = document.getElementById('pDesc').value.trim() || 'Community item available for neighbor sharing.';

    const newPost = {
        id: Date.now(),
        owner: currentUser,
        type,
        category,
        item,
        location,
        distanceMiles: 0.5,
        polarAngle: Math.random() * Math.PI * 2,
        image,
        condition,
        co2Diverted: category === 'Tools' ? 7.5 : 4.0,
        dollarsSaved: 110,
        desc,
        semanticTokens: item.toLowerCase().split(' ').concat(desc.toLowerCase().split(' ')),
        comments: []
    };

    posts.unshift(newPost);

    // Reward Karma for offering
    if (type === 'offer') {
        const u = users[currentUser];
        if (u) u.karma += 50;
    }

    saveState();
    updateHud();
    renderMarketplace();
    renderRadarNodesList();
    closeModal('postModal');
    e.target.reset();
    showToast(`Published listing "${item}" to Community Radar!`, 'fa-circle-check');
}

// ============================================================
// LEADERBOARD
// ============================================================
let currentLeaderboardTab = 'karma';

function switchLeaderboardTab(tab) {
    currentLeaderboardTab = tab;
    document.querySelectorAll('#leaderboardTabs button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderLeaderboard(tab);
}

function renderLeaderboard(metric = 'karma') {
    const list = document.getElementById('leaderboardList');
    if (!list) return;
    list.innerHTML = '';

    const sorted = Object.values(users).sort((a, b) => {
        if (metric === 'karma') return b.karma - a.karma;
        if (metric === 'streak') return b.streakDays - a.streakDays;
        if (metric === 'carbon') return b.co2SavedKg - a.co2SavedKg;
        return 0;
    });

    sorted.forEach((u, idx) => {
        const row = document.createElement('div');
        row.className = 'leaderboard-item';

        let metricDisplay = '';
        if (metric === 'karma') metricDisplay = `<span style="color:#ffd700; font-weight:700;">${u.karma.toLocaleString()} Karma</span>`;
        if (metric === 'streak') metricDisplay = `<span style="color:var(--accent-amber); font-weight:700;">🔥 ${u.streakDays} Days</span>`;
        if (metric === 'carbon') metricDisplay = `<span style="color:var(--accent-emerald); font-weight:700;">🌱 ${u.co2SavedKg.toFixed(1)} kg</span>`;

        row.innerHTML = `
            <div style="display:flex; align-items:center; gap:1.2rem;">
                <span class="rank" style="font-size:1.3rem;">#${idx + 1}</span>
                <div>
                    <h4 style="color:#fff; font-size:1.05rem; display:flex; align-items:center; gap:0.5rem;">
                        ${u.name} <span class="badge" style="background:rgba(255,255,255,0.05); font-size:0.7rem;">${u.tier}</span>
                    </h4>
                    <small style="color:var(--text-muted);"><i class="fa-solid fa-star" style="color:#ffd700;"></i> ${u.reputation.toFixed(1)} (${u.ratingsCount} reviews)</small>
                </div>
            </div>
            <div style="text-align:right;">
                ${metricDisplay}
            </div>
        `;
        list.appendChild(row);
    });
}

// ============================================================
// SUSTAINABILITY CERTIFICATE GENERATOR & DOWNLOAD
// ============================================================
function openCertificateModal() {
    updateHud();
    openModal('certificateModal');
}

function downloadCertificate() {
    const user = users[currentUser] || users['Admin'];
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#0a0d1e');
    bgGrad.addColorStop(1, '#061715');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Double Gold Border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1140, 740);
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, 1116, 716);

    // Header Text
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL VERIFIED CERTIFICATE OF ZERO-WASTE IMPACT', 600, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Outfit", sans-serif';
    ctx.fillText('SHAREFLOW ENVIRONMENTAL PILLAR', 600, 180);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px "Outfit", sans-serif';
    ctx.fillText('This certifies that the following community steward has actively diverted resources from municipal landfills:', 600, 240);

    // Recipient Name
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 52px "Space Grotesk", sans-serif';
    ctx.fillText(`${user.name} – ${user.tier}`, 600, 330);

    // Metrics Box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(150, 400, 900, 160);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(150, 400, 900, 160);

    ctx.fillStyle = '#00ff9d';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillText(`${user.co2SavedKg.toFixed(1)} kg CO₂`, 300, 470);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px "Outfit", sans-serif';
    ctx.fillText('Emissions Diverted', 300, 510);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillText(`$${user.dollarsSaved.toLocaleString()}`, 600, 470);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Peer Capital Retained', 600, 510);

    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillText(`${user.ewasteSavedKg.toFixed(1)} kg`, 900, 470);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Landfill Diverted', 900, 510);

    // Verification Hash & Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '16px "Space Grotesk", monospace';
    ctx.fillText(`VERIFICATION HASH: SHA256:${generateSimpleHash(user.name + user.karma)} | ISSUED: OCTOBER 2026`, 600, 680);

    // Trigger download
    const link = document.createElement('a');
    link.download = `ShareFlow_Certificate_${user.name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast('Downloaded High-Res Verified Certificate (PNG)', 'fa-file-image');
}

function shareCertificate() {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Impact verification link copied to clipboard!', 'fa-link');
}

// ============================================================
// MODAL & TOAST HELPERS
// ============================================================
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('show');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
}

function showToast(message, icon = 'fa-info-circle') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color:var(--accent-cyan);"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(15px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
