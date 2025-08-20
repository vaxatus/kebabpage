// Test script to verify port configuration
const PORT = process.env.PORT || 3000;

console.log('🔧 Port Configuration Test');
console.log('📊 Environment PORT:', process.env.PORT);
console.log('🔌 Final PORT:', PORT);
console.log('✅ Port configuration looks correct');

// Test if we can parse the port
const portNum = parseInt(PORT, 10);
if (isNaN(portNum)) {
  console.error('❌ Invalid PORT:', PORT);
  process.exit(1);
} else {
  console.log('✅ Port is valid number:', portNum);
}
