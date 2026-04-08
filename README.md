# FF Management System

A complete esports tournament management platform for organizing scrims and tournaments with automated OCR-based leaderboard processing and prize distribution.

## Features

- **User Authentication**: JWT-based signup/login with role-based access (user/admin)
- **Team Management**: Create and manage esports teams with players
- **Match Management**: Create scrims or tournaments with flexible multi-round structure
- **Registration System**: Team registration with slot management (max 12 teams per match)
- **Payment Processing**: Screenshot upload for payment proof with admin approval workflow
- **OCR Leaderboard**: Upload leaderboard screenshots → Tesseract.js extracts data (Team | Kills | Placement format)
- **Prize Calculation**: Auto-calculated prize pool (50%-35%-15% default distribution) with admin customization
- **Slot Assignment**: First-come-first-served auto-assignment or manual slot reassignment by admin
- **Dark Theme UI**: Premium, minimalist design with Tailwind CSS and Lucide icons

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- Tesseract.js (OCR)

**Frontend:**
- React + Vite
- Tailwind CSS
- Zustand (state management)
- React Query (server state)
- Axios (API calls)
- React Router (navigation)
- Lucide React (icons)

## Project Structure

```
ff-management-system/
├── backend/
│   ├── server.js                 # Main Express app
│   ├── .env                      # Environment variables (create from .env.example)
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Team.js
│   │   ├── Match.js
│   │   ├── Registration.js
│   │   ├── Payment.js
│   │   └── Leaderboard.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── teams.js
│   │   ├── matches.js
│   │   ├── registrations.js
│   │   ├── payments.js
│   │   ├── leaderboards.js
│   │   └── admin.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── teamController.js
│   │   ├── matchController.js
│   │   ├── registrationController.js
│   │   ├── paymentController.js
│   │   ├── leaderboardController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── upload.js             # Multer config
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── ocr.js                # Tesseract.js wrapper
│   │   ├── prizeCalculator.js    # Prize distribution logic
│   │   └── slotAssignment.js     # Auto/manual slot assignment
│   ├── uploads/                  # Local file storage
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx               # Main app with routing
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── Dashboard.jsx
│       │   ├── MyTeams.jsx
│       │   ├── MatchDetails.jsx
│       │   ├── AdminDashboard.jsx
│       │   └── Leaderboard.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── MatchCard.jsx
│       │   ├── TeamForm.jsx
│       │   ├── OCRUpload.jsx
│       │   ├── LeaderboardTable.jsx
│       │   ├── SlotAssignment.jsx
│       │   └── PrizePool.jsx
│       ├── store/
│       │   └── useStore.js       # Zustand state management
│       ├── hooks/
│       │   └── useAuth.js
│       ├── services/
│       │   └── api.js            # Axios wrapper with all endpoints
│       └── styles/
│           └── globals.css       # Tailwind global styles
│
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure:
   ```
   MONGODB_URI=mongodb://localhost:27017/ff-management
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Ensure MongoDB is running:**
   ```bash
   mongod
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   Server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify .env file:**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Teams
- `POST /api/teams` - Create team
- `GET /api/teams/my-teams` - Get user's teams
- `GET /api/teams/:teamId` - Get team details
- `PUT /api/teams/:teamId` - Update team
- `DELETE /api/teams/:teamId` - Delete team

### Matches
- `POST /api/matches` - Create match (admin only)
- `GET /api/matches` - List all matches
- `GET /api/matches/:matchId` - Get match details
- `PATCH /api/matches/:matchId/status` - Update status (admin only)

### Registrations
- `POST /api/registrations` - Register team for match
- `GET /api/registrations/my-registrations` - Get user's registrations
- `GET /api/registrations/match/:matchId` - Get match registrations (admin only)

### Payments
- `POST /api/payments/upload` - Upload payment screenshot
- `GET /api/payments/my-payments` - Get user's payments
- `GET /api/payments/admin/pending` - Get pending payments (admin only)

### Admin
- `PATCH /api/admin/payments/approve` - Approve payment (admin only)
- `PATCH /api/admin/payments/reject` - Reject payment (admin only)
- `PATCH /api/admin/slots/assign` - Assign slot (admin only)
- `GET /api/admin/slots/:matchId` - Get match slots (admin only)

### Leaderboards
- `POST /api/leaderboards/upload` - Upload leaderboard image for OCR (admin only)
- `GET /api/leaderboards/match/:matchId` - Get leaderboard for match
- `GET /api/leaderboards/:leaderboardId` - Get leaderboard details

## Usage Examples

### 1. User Signup/Login
1. Go to http://localhost:5173
2. Click "Sign Up" and create account
3. Login with credentials

### 2. Create a Team
1. In Dashboard, click "Manage Teams"
2. Click "Create New Team"
3. Fill in team name, leader name, and players
4. Submit

### 3. Register for Match
1. Browse "Available Matches" in Dashboard
2. Click "View Details" on a match
3. Select your team from dropdown
4. Click "Register Now"
5. Upload payment screenshot when prompted

### 4. Admin Approve Payment
1. Go to `/admin` (must be admin user)
2. See pending payments list
3. View payment screenshot
4. Click "Approve" → Slot is auto-assigned or manually reassigned
5. Registration status updates to "approved"

### 5. Upload Leaderboard & Process OCR
1. In Admin Dashboard, go to "Upload Leaderboard"
2. Upload screenshot with format: `Team Name | Kills | Placement`
3. System extracts data via Tesseract.js
4. Leaderboard is created with prizes pre-calculated
5. Users can view final leaderboard and prizes

## OCR Leaderboard Format

The system expects leaderboard screenshots in this format:

```
Team Name | Kills | Placement
Alpha Squad | 45 | 1
Beta Team | 38 | 2
Gamma Team | 32 | 3
...
```

Each line should have: `Team Name | Kills (number) | Placement (number)`

## Prize Distribution

Default calculation (customizable by admin):
- **1st Place**: 50% of prize pool
- **2nd Place**: 35% of prize pool
- **3rd Place**: 15% of prize pool
- **Platform Fee**: 16.6% of total collection

Example: 12 teams × 100 entry fee = 1200 total
- Platform Fee: 200
- Prize Pool: 1000
  - 1st: 500
  - 2nd: 350
  - 3rd: 150

## Tournament Multi-Round System

Admins can create tournaments with flexible round structures:

```javascript
{
  "name": "Weekly Championship",
  "type": "tournament",
  "rounds": [
    { "roundNum": 1, "teamsSlots": 12, "advancingTeams": 6 },
    { "roundNum": 2, "teamsSlots": 6, "advancingTeams": 2 },
    { "roundNum": 3, "teamsSlots": 2, "advancingTeams": 1 }
  ]
}
```

- Round 1: 12 teams compete
- After OCR, top 6 advance automatically
- Round 2: 6 teams (finalists) compete
- Top 2 advance to finals (Round 3)
- Final leaderboard combines points from all rounds

## Key Validations

- Maximum 12 slots per match (auto-closes registration when full)
- Duplicate slot prevention
- Payment required before slot assignment
- OCR format validation (Team | Kills | Placement)
- Admin-only endpoints protected with middleware
- JWT verification on all protected routes
- Team leader must be specified
- Entry fee required for match creation

## Performance Optimization

- React Query caching for API responses
- Lazy loading of components
- Optimized image uploads (10MB limit, image types only)
- MongoDB indexing on frequently queried fields
- Zustand for lightweight state management

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env matches your setup
- Verify mongosha is reachable

### OCR Processing Slow
- Tesseract.js can take 3-5 seconds per image
- Ensure image quality is good
- Loading indicator is shown during processing

### JWT Token Expires
- Tokens expire after 7 days
- User must login again
- Automatic redirect to login on 401

### File Upload Issues
- Maximum file size: 10MB
- Allowed formats: JPEG, PNG, GIF
- Ensure `/backend/uploads` directory has write permissions

## Future Enhancements

- Real-time notifications with Socket.io
- PDF/Image export of leaderboards
- Tournament bracket visualization
- Refund system for rejected payments
- Custom prize distribution rules per match
- Team seeding for tournaments
- Ban/report system for teams
- Multi-language support
- Mobile app (React Native)

## Support

For issues or questions, please check:
1. Backend logs on http://localhost:5000/api/health
2. Browser console for frontend errors
3. MongoDB connection status
4. File permissions in `/uploads` directory

## License

MIT License - Feel free to use this for your esports tournaments!
