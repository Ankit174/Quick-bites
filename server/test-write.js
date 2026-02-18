const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../client/public');
const testFile = path.join(targetDir, 'test-write.txt');

console.log('Target Dir:', targetDir);

try {
    fs.writeFileSync(testFile, 'test');
    console.log('Write success!');
    fs.unlinkSync(testFile);
    console.log('Cleanup success!');
} catch (err) {
    console.error('Write failed:', err);
}
