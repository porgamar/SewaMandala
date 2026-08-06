console.log('Script started');
 
const password = process.argv[2];
console.log('Password argument received:', password);
 
if (!password) {
  console.error('Usage: node hashPassword.js yourChosenPassword');
  process.exit(1);
}
 
let bcrypt;
try {
  bcrypt = require('bcryptjs');
  console.log('bcryptjs loaded successfully');
} catch (err) {
  console.error('Failed to load bcryptjs:', err.message);
  process.exit(1);
}
 
bcrypt
  .hash(password, 10)
  .then((hash) => {
    console.log('HASH:', hash);
  })
  .catch((err) => {
    console.error('Hashing failed:', err.message);
  });
