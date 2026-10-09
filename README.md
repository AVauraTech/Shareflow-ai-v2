# 🚀 ShareFlow AI 2.0: Advanced Gamified Resource Sharing Ecosystem

**ShareFlow AI 2.0** is a modernized, full-stack, gamified peer-to-peer resource exchange platform. It transforms standard community lending into a **circular, collaborative micro-economy** powered by geospatial proximity radar, AI semantic intent matching, automated barter matchmaking, and smart escrow contracts.

---

## 🌟 Key Architecture & Features

### 1. 🌍 Live Geospatial Proximity Radar
* **Interactive Polar-Coordinate Canvas**: Visualizes local inventory as pulsing nodes mapped by distance (e.g., 0.3 mi, 0.8 mi, 1.2 mi) and polar angles.
* **Proximity Range Slider & Category Filters**: Dynamic radius filtering (0.5 to 5.0 miles) with instant node count re-clustering.
* **Web Audio Sonar Sweep**: Synthesizes real-time acoustic sonar pings upon discovery.

### 2. 🤖 AI Vision Lab & Autonomous Agentic Matchmaker
* **Multimodal Defect Inspection**: Simulates deep vision defect diagnostics, cosmetic wear scoring, and automated category tagging.
* **SBERT Semantic Intent Matching**: Concept clustering and cosine similarity matching queries like *"need wood repair"* to *"DeWalt Cordless Drill Kit"* without requiring exact keyword overlap.
* **Autonomous Matchmaker Queue**: Background agent scans open community requests and active offers, auto-drafting trade proposals with 1-click barter execution.

### 3. 🛡️ Circular Karma Economy & Escrow
* **Tokenized Karma & Tier Ladder**:
  * `Newcomer` (Lvl 1–3, 1.0x multiplier)
  * `Resource Helper` (Lvl 4–7, 1.5x multiplier)
  * `Community Pillar` (Lvl 8–12, 2.2x multiplier)
  * `Neighborhood Guardian` (Lvl 13+, 3.2x multiplier)
* **Anti-Hoarding Escrow Contract**: Borrowing locks Karma tokens in escrow. Timely returns release the deposit, mint a +1.5x multiplier bonus, and extend zero-waste streaks.
* **Dynamic Badges**: Real-time badges for `Instant Responder`, `Zero-Waste Hero`, `Master Lender`, and `Escrow Hero`.

### 4. 🏆 Community Raids & Seasonal Quests
* **Collaborative Neighborhood Quests**: Shared milestone bars (e.g., *"Midterm Campus Textbook Exchange"*, *"Neighborhood Tool Library Collective"*).
* Contributing items advances the community gauge and unlocks rewards and profile multipliers.

### 5. 🤝 Live Barter Negotiation & QR Handover
* **P2P Slide-Over Negotiation Drawer**: Real-time barter messaging and counter-offer proposals.
* **Dynamic QR Code Verification**: Generates unique QR patterns for physical exchange verification, preventing ghosting and securing handover before escrow release.

### 6. 🌿 Sustainability & Impact Dashboard
* **Metrics Engine**: Quantifies avoided CO₂ emissions (kg), peer capital saved ($), and landfill e-waste prevented (kg).
* **Official Zero-Waste Certificate**: Renders and downloads a high-resolution verified PNG certificate generated live in HTML5 Canvas.

---

## 💻 Tech Stack

* **Frontend**: HTML5, Modern CSS3 (Glassmorphism, Ambient Floating Blobs, Flexbox & CSS Grid), Vanilla ES6+ JavaScript, HTML5 Canvas (Radar, QR, Certificate), Web Audio API.
* **Backend Interfaces**:
  1. **Python Local Server (`server.py`)**: Zero-dependency development server with UTF-8 support and CORS headers.
  2. **Java OOP Engine (`ResourceSharingPlatform.java`)**: Full-featured interactive CLI with object serialization (`users.dat`, `posts.dat`, `raids.dat`), shutdown hooks, and SBERT concept matching (`SemanticMatchmaker.java`).

---

## 🏃 How to Run

### Option 1: Web Dashboard (Recommended)

1. Start the local server:
   ```bash
   python server.py --open
   ```
2. Or specify a custom port:
   ```bash
   python server.py 8080
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

### Option 2: Java Terminal CLI

1. Compile all Java source files:
   ```bash
   javac -encoding UTF-8 *.java
   ```
2. Run the platform CLI:
   ```bash
   java ResourceSharingPlatform
   ```
3. Test autonomous matching, escrow locking, community raids, and persistence across sessions.
