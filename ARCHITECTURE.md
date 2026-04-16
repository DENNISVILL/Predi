# 🏗 Predix Architecture

## 🛠 Tech Stack

### Frontend Web (SaaS)
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS + Framer Motion
- **State**: Zustand (Global Store)
- **Routing**: React Router v6

### Mobile App
- **Framework**: React Native (Expo SDK 50)
- **Styling**: NativeWind (Tailwind for Native)
- **Navigation**: React Navigation (Stack + Drawer)
- **State**: Zustand (Shared logic concepts)

### Backend (Security Layer)
- **Runtime**: Node.js + Express
- **Function**: AI Proxy & Payment Webhooks
- **Security**: Rate Limiting, CORS, Environment Variable masking
- **Database**: PostgreSQL (Planned for Production via Hetzner)

## 🔄 Data Flow

### 1. AI Interaction (Chat/Predictions)
```mermaid
graph LR
    User[User (Web/Mobile)] -->|Request| Proxy[Backend Proxy (Node.js)]
    Proxy -->|Auth + API Key| Gemini[Google Gemini API]
    Gemini -->|Response| Proxy
    Proxy -->|Sanitized JSON| User
```
*Why?* This prevents exposure of the `GEMINI_API_KEY` to the client browser/app.

### 2. Authentication (Current vs Planned)
- **Current (Dev)**: LocalStorage / AsyncStorage persistence.
- **Planned (Prod)**: Supabase Auth or JWT linked to PostgreSQL.

## 📱 Mobile Architecture
The mobile app lives in `/mobile` but shares design tokens via Tailwind.
- **Navigation**: Uses a Drawer-based main layout for "Hub" feel.
- **Performance**: Heavy computation (e.g., trend analysis) is offloaded to the AI, the app only renders results.

## 🔒 Security Measures
1.  **Environment Variables**: All sensitive keys (`.env`) are gitignored.
2.  **Proxy Server**: No direct API calls to LLMs from client.
3.  **Payment Security**: Using "Merchant of Record" (Paddle/Lemon Squeezy) to handle compliance; we never touch credit card data.
