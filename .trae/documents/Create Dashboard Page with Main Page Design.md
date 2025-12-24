## Dashboard Page Implementation Plan

Based on my analysis of the existing codebase, I'll create a dashboard page that exactly replicates the main page design with the following components:

### 1. **Header Section Replication**
- **Profile Image**: 48x48px circular avatar with fallback to initials
- **Greeting Text**: "Hello," text (13px) and user name (17px, font-weight: 600)
- **Notification Button**: 40x40px circular button with bell icon and badge
- **Gradient Background**: Linear gradient from `#A8D5FF` to `#E8F4FF`

### 2. **Pet Image Display**
- **Pet Avatar Circle**: 72x72px circular container with emoji fallback
- **Active State**: 3px border in primary color (#0A84FF) for selected pet
- **Horizontal Scroll**: Pet selection carousel with "Add new" option
- **Image Scaling**: Full-width/height images with border-radius 36

### 3. **Quick Actions Panel**
- **Card Dimensions**: 80x80px cards with 20px border-radius
- **Icon Styling**: 32px MaterialCommunityIcons in primary color
- **Action Items**: Add Visit, Add Treatment, Add Vaccine, Log Weight, Add Event
- **Horizontal Scroll**: Scrollable row with 8px gap between cards



### 5. **Upcoming Events Display**
- **List Cards**: 16px padding, 16px border-radius, row layout
- **Event Information**: Title, subtitle, and chevron navigation
- **Interactive Elements**: Touchable cards with navigation functionality

