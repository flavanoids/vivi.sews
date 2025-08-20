import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = 'ADMIN';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  // Verify the hash works
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash verification:', isValid);
}

generateHash();
