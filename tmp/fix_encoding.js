const fs = require('fs');

const filePath = 'c:\\Users\\andre\\Desktop\\WebProject\\assets\\css\\style.css';
const buffer = fs.readFileSync(filePath);

// Simple detection: UTF-16 LE usually has 0x00 every other byte if it's mostly ASCII
let isUtf16Le = false;
if (buffer[0] === 0xFF && buffer[1] === 0xFE) isUtf16Le = true;
else if (buffer[1] === 0x00 && buffer[3] === 0x00) isUtf16Le = true;

let content;
if (isUtf16Le) {
    content = buffer.toString('utf16le');
} else {
    // Try to just read it as a string and see if it looks like garbage
    content = buffer.toString('utf8');
}

// Write it back as pure UTF-8 no BOM
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed encoding. File now UTF-8.');
