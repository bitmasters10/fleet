require('./mongo');
const Admin = require('./models/Admin');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

async function seed() {
  try {
    const name = process.env.SUPERADMIN_NAME || 'Super Admin';
    const email = process.env.SUPERADMIN_EMAIL || 'superadmin@example.com';
    const password = process.env.SUPERADMIN_PASS || 'ChangeMe123!';

    // Check if a superadmin already exists (by role or email)
    let existing = await Admin.findOne({ role: 'superadmin' }).lean();
    if (!existing) existing = await Admin.findOne({ email }).lean();
    if (existing) {
      console.log('Superadmin already exists:', existing.email || existing.aid);
      process.exit(0);
    }

    const aid = uuidv4();
    const hashed = await bcrypt.hash(password, 10);

    const admin = new Admin({ aid, aname: name, email, pass: hashed, role: 'superadmin' });
    await admin.save();
    console.log('Superadmin created:', { aid, email });
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed superadmin:', err);
    process.exit(1);
  }
}

seed();
