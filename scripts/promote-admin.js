const path = require('path');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const targetEmail = 'naveenkumarchapala123@gmail.com';

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not set.');
}

const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function promoteAdmin(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`Admin claim set for ${email}`);
}

promoteAdmin(targetEmail)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to set admin claim:', err);
    process.exit(1);
  });
