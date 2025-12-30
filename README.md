# 🎓 大學四年 College Life Game

A real-time multiplayer Monopoly-style board game designed for 泰北華校 students to learn about college life, financial management, and career preparation.

## ✨ Features

- 🌐 **Real-time Multiplayer**: Play with friends online from different devices
- 🎮 **2-4 Players**: Flexible player count
- 📚 **Educational Content**: Questions about academic, financial, career, and cultural topics
- ⚡ **Random Events**: Choice-based outcomes with risk/reward mechanics (e.g., 50% chance of good/bad boss)
- 🎲 **Fast-paced**: 35-45 minute gameplay
- 💾 **Save/Load**: Game state persistence
- 🌐 **Bilingual**: Chinese/English support
- 🔥 **Firebase Integration**: No server needed, runs entirely on GitHub Pages

## 🚀 Quick Start

### Play Online
Visit: `https://yourusername.github.io/college-life-game/`

### Host Your Own
1. Fork this repository
2. Set up Firebase (see below)
3. Update `firebase-config.js` with your config
4. Enable GitHub Pages in Settings
5. Share your URL with friends!

## 🎮 How to Play

### Creating a Game
1. Click **"Create New Game"**
2. Enter your name
3. Select max players (2-4)
4. Share the **6-digit game code** with friends
5. Wait for players to join
6. Click **"Start Game"** when ready

### Joining a Game
1. Click **"Join Existing Game"**
2. Enter your name
3. Enter the **6-digit game code** from your friend
4. Wait for host to start

### Gameplay
- **Roll Dice**: Move around the board
- **Answer Questions**: Earn academic points
- **Random Events**: Make choices (e.g., take risky part-time job)
- **Collect Points**: Academic 🎓 + Social 👥 + Career 💼
- **Win**: Player with most points after 4 rounds wins!

## 🎯 Random Events

### Example: Part-Time Job
When you land on the job center:
- **Option A**: Accept Job (50% chance)
  - ✅ Good Boss: +1500 credits, +100 career points
  - ❌ Bad Boss: No pay, -200 career points
- **Option B**: Decline (100% safe)
  - Focus on studies: +50 academic points

### Other Events
- Scholarship opportunities
- Study group invitations
- Club leadership roles
- Internship fairs
- Investment opportunities
- Health issues
- Surprise quizzes
- And more...

## 🔧 Firebase Setup

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add Project"
3. Name: `college-life-game`
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Realtime Database
1. Click "Realtime Database" in sidebar
2. Click "Create Database"
3. Choose location: **Asia Southeast**
4. Start in **Test Mode**
5. Click "Enable"

### Step 3: Get Configuration
1. Click gear icon ⚙️ > Project Settings
2. Scroll to "Your apps" section
3. Click `</>` (Web) icon
4. Register app: `college-game`
5. Copy the `firebaseConfig` object
6. Paste into `firebase-config.js`

### Step 4: Set Database Rules
```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": true,
        ".write": true,
        ".indexOn": ["status", "createdAt"]
      }
    }
  }
}
```

## 📁 File Structure
```
college-game/
├── index.html              # Main HTML file
├── game.js                 # Game logic with Firebase
├── style.css               # Styling
├── data.js                 # Game data (questions, events, spaces)
├── firebase-config.js      # Firebase configuration
└── README.md               # This file
```

## 🎨 Game Mechanics

### Point System
- 🎓 **Academic Points**: From answering questions correctly
- 👥 **Social Points**: From campus life events
- 💼 **Career Points**: From career development activities
- 💰 **Credits**: In-game currency

### Four Rounds
- **Year 1 (Freshman)**: Foundation building
- **Year 2 (Sophomore)**: Exploration
- **Year 3 (Junior)**: Specialization
- **Year 4 (Senior)**: Preparation for graduation

### Board Spaces (36 total)
- **Academic** (9 spaces): Classrooms, library, exams
- **Campus Life** (9 spaces): Dorms, cafeteria, clubs
- **Financial** (9 spaces): Bank, jobs, scholarships
- **Career** (9 spaces): Internships, networking, job offers

## 🌐 Technologies Used

- **HTML5 Canvas**: Game board rendering
- **Vanilla JavaScript**: Game logic
- **CSS3**: Styling and animations
- **Firebase Realtime Database**: Multiplayer sync
- **LocalStorage**: Save/load functionality

## 🎓 Educational Value

### Learning Objectives
- **Financial Literacy**: Budget management, loans vs scholarships
- **Academic Skills**: Study techniques, time management
- **Career Readiness**: Networking, interviews, resume building
- **Cultural Awareness**: 泰北華校 values and heritage

### Question Categories
- Academic (25%)
- Financial (25%)
- Career (25%)
- Cultural (25%)

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🐛 Troubleshooting

### "Firebase is not defined"
- Check that Firebase scripts load before `game.js`
- Verify `firebase-config.js` is included

### "Permission denied"
- Update Firebase database rules (see setup)
- Make sure rules allow read/write

### Game not syncing
- Check internet connection
- Open browser console (F12) for errors
- Verify Firebase configuration is correct

### Players can't join
- Make sure game code is exactly 6 characters
- Check that game hasn't started yet
- Verify room isn't full

## 📝 License

MIT License - Free to use and modify

## 🙏 Credits

Designed for 泰北華校 educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Enjoy the game! 祝你玩得開心！** 🎉