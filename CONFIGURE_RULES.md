# Configure Firestore Security Rules

## Step 1: Open Firebase Console

1. Go to: https://console.firebase.google.com/
2. Select project: **GatheredGraceB2C**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top

## Step 2: Copy These Rules

Select and copy the entire rules below:

```
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

## Step 3: Paste and Publish

1. **Delete all existing rules** in the editor
2. **Paste the rules** from above
3. Click **Publish** button
4. Wait for confirmation message: "Rules published successfully"

## Step 4: Verify

You should see a green checkmark and the message "Rules are published"

---

**That's it!** Your forms will now be able to save data to Firestore.

Next step: Run the data migration script.
