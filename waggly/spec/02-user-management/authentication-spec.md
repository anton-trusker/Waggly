# Authentication Specification

## Overview

This document specifies all authentication methods, security requirements, and session management for the Waggly platform.

---

## Authentication Methods

### 1. Email/Password Authentication

**Flow**:
```
User enters email + password
  → Supabase Auth validates credentials
    → JWT token issued (access + refresh)
      → Session stored client-side
```

**Requirements**:

| Requirement | Specification |
|-------------|---------------|
| Password min length | 8 characters |
| Password complexity | 1 uppercase, 1 lowercase, 1 number |
| Email verification | Required within 24 hours |
| Password reset | Via email link (expires 1 hour) |
| Rate limiting | 5 failed attempts = 15 min lockout |

**Supabase Configuration**:
```typescript
// Authentication settings
{
  SITE_URL: 'https://waggly.app',
  EMAIL_CONFIRM_REDIRECT_URL: 'waggly://auth/confirm',
  PASSWORD_RESET_URL: 'waggly://auth/reset-password',
  MINIMUM_PASSWORD_LENGTH: 8,
  MAILER_SECURE_EMAIL_CHANGE_ENABLED: true
}
```

---

### 2. Social Login - Google OAuth

**Flow**:
```
User taps "Continue with Google"
  → Expo AuthSession opens Google OAuth
    → User grants permissions
      → Google returns authorization code
        → Supabase exchanges for tokens
          → User created/linked in database
```

**Required Scopes**:
- `email` - User's email address
- `profile` - User's name and profile picture

**Configuration**:
```typescript
// Google OAuth settings
{
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI: 'waggly://oauth/callback'
}
```

---

### 3. Social Login - Apple Sign-In

**Flow**:
```
User taps "Continue with Apple"
  → iOS native Apple Sign-In
    → User authenticates with Face ID/Touch ID
      → Apple returns identity token
        → Supabase validates and creates session
```

**Required Scopes**:
- `email` - User's email (may be private relay)
- `fullName` - User's name (only on first sign-in)

**iOS Requirements**:
- Sign in with Apple capability enabled
- Associated domains configured

---

## Session Management

### Token Structure

**Access Token (JWT)**:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "iat": 1640000000,
  "exp": 1640003600
}
```

**Token Lifetimes**:

| Token Type | Lifetime | Refresh Strategy |
|------------|----------|------------------|
| Access Token | 1 hour | Auto-refresh before expiry |
| Refresh Token | 7 days | New token on use |
| Session | 30 days | Extended on activity |

### Session Storage

**React Native (Expo)**:
```typescript
import * as SecureStore from 'expo-secure-store';

// Secure storage for tokens
await SecureStore.setItemAsync('supabase-auth', JSON.stringify(session));
```

---

## Security Requirements

### Password Security

```sql
-- Password hashing (handled by Supabase/GoTrue)
-- Uses bcrypt with cost factor 10
```

**Password Rules**:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Optional: Check against common passwords list

### Multi-Factor Authentication (Future)

**Phase 2 Implementation**:
- TOTP-based (Google Authenticator compatible)
- SMS backup codes
- Required for admin accounts

### Session Security

| Security Measure | Implementation |
|------------------|----------------|
| HTTPS only | Enforced at edge |
| Token encryption | AES-256 at rest |
| Session binding | IP + User-Agent fingerprint |
| Concurrent sessions | Max 5 devices |
| Logout all devices | Available in settings |

---

## API Authentication

### Request Headers

```http
Authorization: Bearer <access_token>
X-Client-Version: 1.0.0
X-Device-ID: <unique_device_id>
```

### Supabase Client Configuration

```typescript
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: {
        getItem: (key) => SecureStore.getItemAsync(key),
        setItem: (key, value) => SecureStore.setItemAsync(key, value),
        removeItem: (key) => SecureStore.deleteItemAsync(key),
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

---

## Row Level Security (RLS)

### User Data Access

```sql
-- Users can only read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### Pet Access Control

```sql
-- Pet owner access
CREATE POLICY "Owners can access their pets"
  ON pets FOR ALL
  USING (auth.uid() = user_id);

-- Co-owner access
CREATE POLICY "Co-owners can access shared pets"
  ON pets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM co_owners
      WHERE co_owners.pet_id = pets.id
      AND co_owners.user_id = auth.uid()
      AND co_owners.status = 'accepted'
    )
  );
```

---

## Error Handling

### Authentication Errors

| Error Code | Message | User Action |
|------------|---------|-------------|
| `invalid_credentials` | "Invalid email or password" | Retry or reset password |
| `email_not_confirmed` | "Please verify your email" | Check inbox |
| `user_not_found` | "No account with this email" | Sign up |
| `too_many_requests` | "Too many attempts, try later" | Wait 15 minutes |
| `session_expired` | "Session expired, please login" | Re-authenticate |

### Error Response Format

```json
{
  "error": {
    "code": "invalid_credentials",
    "message": "Invalid email or password",
    "status": 401
  }
}
```

---

## Audit Logging

### Logged Events

| Event | Data Captured |
|-------|---------------|
| Login success | User ID, timestamp, IP, device |
| Login failure | Email, timestamp, IP, reason |
| Password change | User ID, timestamp |
| Session logout | User ID, device, reason |
| Permission change | Actor, target user, old/new permissions |

### Log Storage

```sql
CREATE TABLE auth_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```
