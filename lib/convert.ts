const fs = require('fs');
const forge = require('node-forge');

const pkcs1Pem = fs.readFileSync('private-key.pem', 'utf8');

// Convert PEM to PKCS#1 PrivateKey
const privateKey = forge.pki.privateKeyFromPem(pkcs1Pem);

// Convert to PKCS#8
const pkcs8Pem = forge.pki.privateKeyToPem(privateKey);

fs.writeFileSync('private-key.pem', pkcs8Pem);
console.log('✅ Converted to PKCS#8');


