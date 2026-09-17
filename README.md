# Anti-Caste Platform

A community-driven web application for anti-caste awareness, education, and solidarity. Users can share posts, videos, files, and chat with each other. Admins can manage users, content, and reports.

---

## Architecture

```
anticaste/
├── frontend/
│   ├── index.html                    # Entry point
│   ├── css/
│   │   ├── tokens.css                # Design tokens (colors, spacing, fonts)
│   │   ├── base.css                  # Reset & base styles
│   │   ├── layout.css                # App shell, header, nav, grid
│   │   ├── components.css            # All component styles
│   │   └── responsive.css            # Mobile/tablet/desktop breakpoints
│   └── js/
│       ├── mock-data.js              # Static data (users, posts, library, discussions)
│       ├── auth.js                   # Validation helpers & password hashing
│       ├── state.js                  # Global state + localStorage persistence
│       ├── app.js                    # Router & app initialization
│       ├── nav.js                    # Header & bottom navigation
│       ├── components/
│       │   ├── toast.js              # Toast notifications
│       │   ├── states.js             # Empty/error/loading states
│       │   ├── modal.js              # Modal + CreateContentModal + ReportModal
│       │   ├── post-card.js          # Post card component
│       │   ├── video-card.js         # Video card component
│       │   ├── file-card.js          # File card component
│       │   └── library-card.js       # Library resource card
│       └── pages/
│           ├── home.js               # Homepage feed
│           ├── library.js            # Knowledge archive
│           ├── posted.js             # All published posts
│           ├── register.js           # User registration
│           ├── login.js              # User/Admin login
│           ├── profile.js            # User profile
│           ├── chat.js               # One-on-one messaging
│           └── admin.js              # Admin dashboard
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript (no frameworks) |
| Routing | Hash-based (`#/path`) |
| Storage | `localStorage` |
| Auth | Client-side session tokens |
| Build | None — runs directly in browser |

---

## Features

### User Features
- **Registration** — Photo upload (base64), name, mobile, Individual/Employee type
- **Login** — Email + password authentication
- **Homepage** — Published posts feed with filters (All, Posts, Videos, Files)
- **Posted** — Browse all published content with search
- **Library** — Searchable knowledge archive by category
- **Community** — Discussions and events
- **Chat** — One-on-one messaging with other users
- **Profile** — View/edit profile, My Posts, Saved posts

### Admin Features
- **Admin Login** — userid: `admin` / password: `admin123`
- **Dashboard** — Stats overview (users, content, pending, reports)
- **User Management** — View, suspend, activate, delete users
- **Content Moderation** — Approve/reject pending posts
- **Report Management** — Resolve or dismiss reports

---

## Routes

| Hash | Page | Auth Required |
|------|------|---------------|
| `#/` | Homepage | No |
| `#/login` | Login | No |
| `#/register` | Register | No |
| `#/posted` | All Posts | Yes |
| `#/library` | Library | No |
| `#/community` | Community | No |
| `#/chat` | Chat | Yes |
| `#/profile` | Profile | Yes |
| `#/admin` | Admin Dashboard | Admin |

---

## Data Storage (localStorage)

| Key | Type | Description |
|-----|------|-------------|
| `ac_users` | `Array<User>` | All registered users |
| `ac_session` | `Object` | Current logged-in user/admin |
| `ac_chats` | `Array<Chat>` | Chat rooms with messages |

### User Object
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "type": "individual",
  "photo": "data:image/...;",
  "password": "h_abc123",
  "status": "active",
  "created": "2025-09-10"
}
```

### Chat Object
```json
{
  "id": "1_2",
  "participants": [1, 2],
  "messages": [
    {
      "id": 1725000000000,
      "from": 1,
      "to": 2,
      "body": "Hello!",
      "created": "2025-09-10T12:00:00.000Z",
      "read": false
    }
  ]
}
```

---

## Demo Credentials

| Role | Email/UserID | Password |
|------|-------------|----------|
| User | justice@example.com | password123 |
| User | equality@example.com | password123 |
| User | dalit@example.com | password123 |
| Admin | admin | admin123 |

---

## How to Run

1. Open `frontend/index.html` in any modern browser
2. No server required — everything runs client-side

---

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1e293b` | Dark blue-gray, primary actions |
| `--color-accent` | `#d97706` | Amber, highlights & links |
| `--color-success` | `#16a34a` | Success states |
| `--color-error` | `#dc2626` | Error states |
| `--color-bg` | `#f8fafc` | Page background |
| `--color-surface` | `#ffffff` | Card backgrounds |

### Spacing
`--space-1` (4px) → `--space-2` (8px) → `--space-3` (12px) → `--space-4` (16px) → `--space-6` (24px) → `--space-8` (32px)

### Typography
- Base: 16px
- Small: 14px
- Large: 18px
- XL: 20px
- 2XL: 24px

---

## File Load Order

```
mock-data.js    → Static data (loaded first)
auth.js         → Validation helpers
state.js        → Global state management
components/*    → UI components
pages/*         → Page renderers
nav.js          → Navigation
app.js          → Router & init (loaded last)
```
