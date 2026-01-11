# Pet Profile Sharing - MVP Specification

## 1. Objective
Enable pet owners to quickly and securely share their pet's profile with third parties (veterinarians, pet sitters, family) via a web link or QR code, without requiring the recipient to have an account.

## 2. MVP Scope

### 2.1 Included Features (In-Scope)
*   **Share Modal**: A simplified modal accessible from the Pet Profile.
*   **Presets**: Two hardcoded sharing options:
    1.  **Basic Info**: Name, Breed, Age, Weight, Chip ID.
    2.  **Full Profile**: All of the above + Vaccinations, Medications, Medical History, and Documents.
*   **Link Generation**: Create a unique, secure URL (e.g., `mywaggli.app/share/xyz123`).
*   **QR Code**: Display a QR code for the generated link immediately.
*   **Active Links List**: A simple list showing currently active links.
*   **Revocation**: Ability to delete/revoke an active link, rendering it inaccessible.
*   **Public View Page**: A responsive, read-only web page displaying the shared data.

### 2.2 Excluded Features (Post-MVP)
*   Custom Templates (User-defined presets).
*   Granular Field-Level Permissions (e.g., "Hide Weight").
*   Co-owner Invitations (Write access/Account invites).
*   Link Expiration Dates (Links are permanent until revoked for MVP).
*   Password Protection for Links.
*   Access Logs/Analytics.

## 3. User Flows

### 3.1 Generate Share Link
1.  User clicks **"Share Profile"** button on Pet Profile Header.
2.  **Share Modal** opens.
3.  User selects **"Basic Info"** or **"Full Profile"** (Radio selection).
4.  User clicks **"Generate Link"**.
5.  System generates a unique token.
6.  Modal updates to show:
    *   **QR Code**.
    *   **Copy Link** button.
    *   **"Done"** button.

### 3.2 View Shared Profile (Recipient)
1.  Recipient opens link or scans QR code.
2.  Recipient sees a **Public Pet Profile** page.
    *   **Header**: Pet Photo, Name, Breed.
    *   **Content**: Tabs or Sections based on the shared preset (Basic vs Full).
3.  No login or registration required.

### 3.3 Manage Links
1.  User goes to **Pet Profile > Share Tab**.
2.  User sees a list of **Active Links**.
    *   Each item shows: Preset Name (e.g., "Basic Info"), Date Created.
3.  User clicks **"Revoke"** (Trash icon).
4.  Link is removed from the list and becomes invalid immediately.

## 4. UI Specifications
*Strict adherence to `constants/designSystem.ts`.*

### 4.1 Share Modal
*   **Component**: `components/ui/FormModal.tsx`.
*   **Presets**:
    *   Use `components/ui/Radio.tsx` (if available) or standard `Pressable` with `primary.500` border for selection.
    *   Cards should have `borderRadius.lg` (16px) and `background.secondary` (White).
*   **Primary Action**:
    *   Button: "Generate Link" (`variant="filled"`, Color: `primary.500` #607AFB).

### 4.2 Active Links List (Share Tab)
*   **Container**: Simple vertical list.
*   **Card Item**:
    *   Background: `white`.
    *   Border: 1px solid `border.primary`.
    *   Content:
        *   **Left**: Icon (Globe/Link), Preset Name (`body.large`), Created Date (`label.small` text `text.tertiary`).
        *   **Right**: "Copy" button (`variant="ghost"`, Icon only), "Revoke" button (`variant="ghost"`, color `error.500`).

### 4.3 Public Profile Page (`app/share/[token].tsx`)
*   **Layout**: Simplified version of the main profile.
*   **Theme**: Light mode only for MVP consistency (or auto-detect).
*   **Components**: Reuse `PetProfileHeader` (read-only mode) and simplified `HealthTab` / `OverviewTab` components that accept a `readonly` prop to hide "Edit" buttons.

## 5. Technical Implementation

### 5.1 Database Schema
**Table**: `sharing_links`
*   `id` (UUID, Primary Key)
*   `pet_id` (UUID, Foreign Key)
*   `token` (String, Unique, Index)
*   `preset_type` (String: 'BASIC' | 'FULL')
*   `created_at` (Timestamp)
*   `created_by` (UUID, Foreign Key)

*Note: No `permissions` JSON column for MVP; rely on `preset_type`.*

### 5.2 API / Backend
*   **Generate**: `POST /api/share` -> Creates row in `sharing_links`.
*   **Revoke**: `DELETE /api/share/:id` -> Deletes row.
*   **Get Public Data**: `GET /api/public/pet/:token`
    *   **Security**: This endpoint must **NOT** require Auth headers.
    *   **Logic**:
        1.  Find active link by `token`.
        2.  Fetch pet data based on `preset_type`.
        3.  Return sanitized JSON (exclude internal IDs/owner info).

### 5.3 Frontend Routes
*   `app/(tabs)/pets/pet-detail.tsx`: Update to include "Share" button and Modal.
*   `app/web/pets/[id]/index.tsx`: Update to include "Share" tab.
*   `app/share/[token].tsx`: Public view page.

## 6. Cross-Platform Design Specifications

### 6.1 Layout & Responsiveness
The application must adapt seamlessly between Desktop (Web) and Mobile (Web App/PWA) environments.

#### **Breakpoints**
Defined in `utils/responsive.ts`:
*   **Mobile**: < 768px (Phone)
*   **Tablet**: 768px - 1023px
*   **Desktop**: ≥ 1024px

#### **Grid System**
*   **Mobile**: 1 Column (Stack). Gutter: 16px. Margin: 16px.
*   **Tablet**: 2 Columns. Gutter: 16px. Margin: 24px.
*   **Desktop**: 3+ Columns (or 12-col grid). Gutter: 24px. Margin: 32px. Max-width container: 1200px.

#### **Navigation Patterns**
*   **Mobile**: 
    *   **Floating Tab Bar** (`components/layout/FloatingTabBar.tsx`) positioned at bottom.
    *   **Back Navigation**: Standard stack navigation header with Back button.
*   **Desktop**:
    *   **Sidebar Navigation** (`components/desktop/layout/SidebarNav.tsx`) fixed on left.
    *   **Top Bar**: Breadcrumbs and Profile/Actions area.

### 6.2 Style Guidelines
Reference: `constants/designSystem.ts`

#### **Typography Scaling**
Using `responsive.typography.scaledSize`:
*   **Headlines**:
    *   Desktop: H1 (32px), H2 (28px).
    *   Mobile: H1 (24px), H2 (20px).
*   **Body Text**:
    *   Desktop: 16px (Regular/Medium).
    *   Mobile: 14px (Regular) for density.

#### **Color & Accessibility**
*   **Primary Color**: Blue `#607AFB` (`primary.500`).
*   **Contrast**: All text must meet WCAG AA standards (Ratio ≥ 4.5:1).
    *   Primary text on White background: `#111827` (`neutral.900`).
    *   Secondary text on White background: `#6B7280` (`neutral.600`).
*   **Dark Mode**: Supported via `useColorScheme`.
    *   Background: `#111827` (`neutral.950`).
    *   Cards: `#1F2937` (`neutral.900`).

#### **Interactive States**
*   **Desktop**:
    *   **Hover**: Brightness +10% or Background opacity 10%.
    *   **Focus**: 2px Outline Ring (`colors.border.focus` #0A84FF).
*   **Mobile**:
    *   **Active/Pressed**: Opacity 0.7 or Scale 0.98.
    *   **Focus**: Standard OS indicators for inputs.

### 6.3 Mobile-Specific Requirements
*   **Touch Targets**: Minimum 44x44 points for all interactive elements.
*   **Spacing**: `spacing.md` (16px) minimum between vertical touch targets.
*   **Modals**: Use **Bottom Sheet** pattern (`FormModal` variant) for better reachability.
    *   Drag handle at top.
    *   Slide up animation.
*   **Performance**: Avoid heavy layout animations; use `transform` and `opacity`.

### 6.4 Desktop-Specific Requirements
*   **Mouse Interaction**: Cursor pointer on clickable elements.
*   **Layout**:
    *   Use side-by-side layouts for master-detail views (e.g., Pet List | Pet Details).
    *   Cards should use fixed or grid-based widths, not full width stretch unless necessary.
*   **Modals**:
    *   **Centered Dialog** with backdrop.
    *   Max-width: 500px (small) to 800px (large).
    *   Close on `Esc` key or backdrop click.
*   **Keyboard Shortcuts**: Support standard navigation keys (`Esc` to close, `Enter` to submit).

### 6.5 Visual Wireframes (Layout Descriptions)

#### **A. Share Modal**
**Mobile View (Bottom Sheet)**
```text
+-------------------------+
|      (Drag Handle)      |
|  Share Profile      (X) |  <-- Header
+-------------------------+
| [O] Basic Info          |  <-- Radio Card
|     Name, Age, Breed... |
+-------------------------+
| [ ] Full Profile        |  <-- Radio Card
|     + Health, Docs...   |
+-------------------------+
|                         |
| [ Generate Link       ] |  <-- Full Width Button (48px height)
|                         |
+-------------------------+
```

**Desktop View (Centered Dialog)**
```text
+--------------------------------------------------+
|  Share Profile                               (X) | <-- 24px Padding
+--------------------------------------------------+
|  Select what you want to share:                  |
|                                                  |
|  +---------------------+  +--------------------+ |
|  | [O] Basic Info      |  | [ ] Full Profile   | | <-- Side-by-side cards
|  |     Name, Age...    |  |     + Health...    | |
|  +---------------------+  +--------------------+ |
|                                                  |
+--------------------------------------------------+
|                  [ Cancel ] [ Generate Link -> ] | <-- Right aligned actions
+--------------------------------------------------+
```

#### **B. Public Profile Page**
**Mobile View (Stacked)**
```text
+-----------------------+
|  < Back               |
|  [    Photo    ]      | <-- Centered Avatar
|      Luna             |
|   Golden Retr.        |
+-----------------------+
|  [ Overview ] [Health]| <-- Scrollable Tabs
+-----------------------+
|  Identity             |
|  -------------------  |
|  Chip: 123...         |
|  Weight: 24kg         |
+-----------------------+
|  Vaccines             |
|  -------------------  |
|  Rabies (Due Oct 24)  |
+-----------------------+
```

**Desktop View (Two Column)**
```text
+---------------------------------------------------------------+
|  Waggli Logo                                                  |
+----------------------+----------------------------------------+
|                      |  [ Overview ]  [ Health ]  [ Docs ]    |
|   [ Photo ]          |                                        |
|                      |  Identity             Vaccinations     |
|    Luna              |  +----------------+   +--------------+ |
|    Golden Retriever  |  | Chip: 123...   |   | Rabies       | |
|    3 Years           |  | Weight: 24kg   |   | Due: Oct 24  | |
|                      |  +----------------+   +--------------+ |
|   [ Download PDF ]   |                                        |
|                      |  Medical History                       |
|                      |  +-----------------------------------+ |
|                      |  | Checkup (Sep 12) - Healthy        | |
|                      |  +-----------------------------------+ |
+----------------------+----------------------------------------+
```

### 6.6 Implementation Consistency Checklist
*   [ ] Use `ResponsiveShell` wrapper for authenticated pages.
*   [ ] Use `designSystem.components.button.responsive` for button sizing.
*   [ ] Ensure `FormModal` adapts: `presentationStyle="pageSheet"` (Mobile) vs `transparent` (Desktop).
*   [ ] Verify `FloatingTabBar` is hidden on Desktop and `SidebarNav` is hidden on Mobile.
