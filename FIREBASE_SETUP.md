# Firebase Setup Instructions

This project uses Firebase Firestore to store B2C lead data from various forms.

## Collection Structure

Your data is organized into separate collections:
- **`b2c_leads`** - Consumer leads from the B2C website
- **`b2b_leads`** - Business leads from B2B inquiries (if applicable)

This separation provides better organization, easier reporting, and cleaner analytics.

## Firestore Security Rules

You need to configure Firestore security rules in the Firebase Console to allow public writes to lead collections.

### Setting up Security Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **GatheredGraceB2C**
3. Navigate to **Firestore Database** → **Rules**
4. Replace the rules with the following:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public writes to b2c_leads collection (for form submissions)
    match /b2c_leads/{document} {
      // Anyone can create a new lead
      allow create: if true;

      // Only authenticated users can read/update/delete (admin only)
      allow read, update, delete: if request.auth != null;
    }

    // Allow public writes to b2b_leads collection (for B2B form submissions)
    match /b2b_leads/{document} {
      // Anyone can create a new lead
      allow create: if true;

      // Only authenticated users can read/update/delete (admin only)
      allow read, update, delete: if request.auth != null;
    }

    // Deny all access to other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish** to apply the rules

### Why these rules are secure:

- **Public writes only**: Anonymous users can ONLY create new documents in lead collections
- **No public reads**: Anonymous users cannot read existing data
- **No updates/deletes**: Anonymous users cannot modify or delete existing leads
- **Admin access**: Only authenticated users (you) can read, update, or delete leads
- **Other collections protected**: All other collections are completely locked down

## Collection Structure

### Collection: `b2c_leads`

Each document contains:

- `email` (string) - Lead's email address
- `full_name` (string, optional) - Lead's full name
- `lead_type` (string) - Type of form submission:
  - `email_signup` - Newsletter signup
  - `discount_popup` - Welcome discount popup
  - `custom_care_form` - Custom Care Gift form
  - `restore_form`, `reflect_form`, `rest_form` - Standard kit forms
  - `build_custom_kit` - Build Your Own Kit form
- `source_page` (string) - URL where the form was submitted
- `website_type` (string) - Always 'b2c'
- `metadata` (object) - Form-specific data (varies by lead_type)
- `created_at` (timestamp) - Auto-generated server timestamp

## Accessing Your Data

### Via Firebase Console:
1. Go to **Firestore Database** → **Data**
2. Click on the `b2c_leads` collection
3. View, search, and export your leads

### Via Firebase Admin SDK (for scripts/exports):
Install Firebase Admin: `npm install firebase-admin`

Example script to export leads:
```javascript
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const snapshot = await db.collection('b2c_leads').get();
const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
console.log(leads);
```

## Data Migration from Supabase

To migrate your existing Supabase data to Firebase:

1. **Read the migration guide**: See [scripts/MIGRATION_README.md](./scripts/MIGRATION_README.md)
2. **Download Firebase service account key** from Firebase Console
3. **Run the migration script**: `node scripts/migrate-supabase-to-firebase.mjs`

The migration script will:
- Export all data from Supabase `b2c_leads` table
- Automatically separate B2C and B2B leads
- Import them into separate Firestore collections: `b2c_leads` and `b2b_leads`
- Preserve all timestamps and metadata

## Code Migration from Supabase

All Supabase code has been replaced with Firebase Firestore:
- ✅ Removed `@supabase/supabase-js` package
- ✅ Deleted `src/lib/supabase.ts`
- ✅ Deleted `supabase/` migrations folder
- ✅ Updated all 5 form components to use Firebase
- ✅ Created `src/lib/firebase.ts` with Firebase config
- ✅ Created migration script for data transfer
- ✅ Separated B2C and B2B collections

## Firebase Configuration

The Firebase configuration is stored in `src/lib/firebase.ts`:
- Project ID: `gatheredgraceb2c`
- Region: Default (US)
- Database: `(default)`

All API keys in the code are safe to commit as they're client-side keys that work with Firestore security rules.
