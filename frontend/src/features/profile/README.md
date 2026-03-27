# Profile Feature Documentation

## Overview

The Profile feature enables users to manage their account information, view their heritage journeys, manage security settings, and maintain a list of favorite experiences.

## Structure

```
src/features/profile/
├── api/
│   ├── profileApi.jsx      # API service layer
│   └── index.js
├── components/
│   ├── ProfileSidebar.jsx
│   ├── PersonalInformationSection.jsx
│   ├── MyHeritageJourneysSection.jsx
│   ├── SecuritySettingsSection.jsx
│   ├── MyFavoritesSection.jsx
│   ├── ProfileSidebar.module.scss
│   ├── PersonalInformationSection.module.scss
│   ├── MyHeritageJourneysSection.module.scss
│   ├── SecuritySettingsSection.module.scss
│   ├── MyFavoritesSection.module.scss
│   └── index.js
├── pages/
│   ├── ProfilePage.jsx
│   ├── ProfilePage.module.scss
│   └── index.js
├── index.js
└── README.md
```

## Components

### ProfilePage

Main container component that manages section state and loads profile data.

**Props:** None (uses useAuth hook)
**State:**

- `profileData` - User profile information
- `activeSection` - Currently displayed section ('personal', 'journeys', 'security', 'favorites')
- `loading` - Loading state

### ProfileSidebar

Left sidebar showing user information and navigation menu.

**Props:**

- `user` - User profile data
- `activeSection` - Currently active section
- `onSectionChange` - Callback to change section

**Features:**

- User avatar with verification badge
- Status badges (Verified, Active)
- Navigation menu for all sections
- Activity log showing last 3 activities

### PersonalInformationSection

Form for editing personal profile information.

**Props:**

- `user` - Current user data

**Fields:**

- First Name
- Last Name
- Email (with clear button support)
- Phone Number

### MyHeritageJourneysSection

Display user's booked heritage experiences.

**Props:** None

**Features:**

- Grid layout of journey cards
- Journey image, title, date range, location, status badge
- Manage Booking button
- Empty state with link to explore

### SecuritySettingsSection

Security management interface.

**Props:**

- `user` - Current user data

**Features:**

- Password change form
- Two-factor authentication toggle
- Last login display
- Password confirmation validation

### MyFavoritesSection

Display favorite experiences.

**Props:** None

**Features:**

- List of favorite items with thumbnail
- Remove from favorites functionality
- Empty state with explore link
- Category and location tags

## API Endpoints

All API calls are made through `profileApi` service:

```javascript
// Get user profile
profileApi.getProfile();

// Update profile
profileApi.updateProfile(profileData);

// Get heritage journeys
profileApi.getHeritageJourneys();

// Get favorites
profileApi.getFavorites();

// Remove from favorites
profileApi.removeFavorite(favoriteId);

// Get activity log
profileApi.getActivityLog();

// Update password
profileApi.updatePassword(currentPassword, newPassword);

// Update 2FA
profileApi.updateTwoFactorAuth(enabled);
```

## Styling

All components use SCSS modules with:

- Responsive design (mobile-first)
- Variables from `@styles/_variables.scss`
- Mixins from `@styles/_mixins.scss`
- Consistent color scheme and spacing

### Responsive Breakpoints

- Mobile: < 480px
- Tablet: 481px - 768px
- Desktop: > 769px

## Usage

### Import in AppRouter

```jsx
import ProfilePage from '@features/profile/pages/ProfilePage';

<Route
  path="/profile"
  element={
    <ProtectedRoute requiredRoles={['customer', 'artisan', 'admin']}>
      <MainLayout>
        <ProfilePage />
      </MainLayout>
    </ProtectedRoute>
  }
/>;
```

## Styling Details

### Colors

- Primary: `$primary` (brown #a65d43)
- Background: `#f5f1eb` (light beige)
- Section Background: `#fef6f0` (off-white)
- Text: `$text_color` (#3d3326)

### Layout

- Sidebar: 280px (sticky on desktop)
- Main content: Flexible width
- Gap: 48px between sections
- Max-width: 1400px container

## Dependencies

- React 18+
- React Router v6
- Axios
- SCSS Modules
- useAuth hook (custom)

## Notes

- All components use React hooks (useState, useEffect, useRef)
- API responses expected to have `data` property
- Error handling integrated in all sections
- Loading states provided for async operations
- Form validation implemented where needed
