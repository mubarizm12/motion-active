Dependencies only flow inward — the Domain has no knowledge of the database or web framework.

---

## Features

### Authentication
- Register and login with JWT tokens
- Passwords hashed with BCrypt
- Tokens persisted securely on device with Expo SecureStore

### Step Logging & Points Engine
- Log steps manually and earn Motion Points automatically
- Milestone bonuses at 5,000 and 10,000 steps
- Daily step cap of 50,000 to prevent abuse
- Points transaction history

### Rewards Shop
- Browse available Motion Sportswear rewards ordered by cost
- Redeem rewards with points — balance and stock validated server-side
- View full redemption history

### Leaderboard
- Global leaderboard ranked by total Motion Points
- Your row highlighted on the mobile app

### Mobile App (iOS)
- Clean white/black/green design
- Login and register screens with form validation
- Home screen — log steps, see points update live
- Leaderboard screen — ranked list with your entry highlighted
- Rewards shop — browse, confirm and redeem with one tap

---

## Points System

| Activity | Points |
|---|---|
| Every 1,000 steps | 10 points |
| 5,000 steps in one log | +25 bonus |
| 10,000 steps in one log | +50 bonus |
| Daily cap | 50,000 steps |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/Auth/register | Register a new user |
| POST | /api/Auth/login | Login and receive JWT token |

### Steps
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/Steps/log | ✅ | Log steps and earn points |

### Leaderboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/Leaderboard/global | ✅ | Global leaderboard ranked by points |

### Rewards
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/Rewards | ✅ | Browse all active rewards |
| POST | /api/Rewards/redeem | ✅ | Redeem a reward with points |
| GET | /api/Rewards/my-redemptions | ✅ | View redemption history |

---

## Getting Started

### Prerequisites
- .NET 8 SDK
- PostgreSQL database (or Supabase free tier)
- Node.js 20+
- Expo Go app on iOS

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/mubarizm12/projects.git
cd projects/backend
```

2. Configure your connection string and JWT settings in `MotionActive.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=...;Database=postgres;Username=...;Password=..."
  },
  "Jwt": {
    "Key": "your-secret-key",
    "Issuer": "MotionActive",
    "Audience": "MotionActiveUsers"
  }
}
```

3. Run migrations:
```bash
cd MotionActive.Infrastructure
dotnet ef database update --startup-project ../MotionActive.API
```

4. Run the API:
```bash
cd MotionActive.API
dotnet run
```

5. Open Swagger at `http://localhost:5164/swagger`

### Mobile Setup

```bash
cd projects/motion-active/mobile
npm install
npx expo start
```

Update `services/api.ts` with your local IP address, then scan the QR code with Expo Go on your iPhone.

---

## Roadmap

- [ ] AI fitness coach (Python FastAPI microservice)
- [ ] Apple Health integration for automatic step syncing
- [ ] Friends system and private leaderboards
- [ ] Weekly and monthly leaderboard resets
- [ ] Push notifications for milestones and challenges
- [ ] Azure deployment pipeline
- [ ] Shopify reward integration

---

## Author

Built by Mubariz Malik — [github.com/mubarizm12](https://github.com/mubarizm12)