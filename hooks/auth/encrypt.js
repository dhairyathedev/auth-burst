const crypto = require('crypto');


function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

function hashPassword(password, salt) {
    const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
    return hash;
}


export default function encrypt(password, salt){
    const saltLocal = generateSalt();
    const hashedPassword = hashPassword(password, salt ? salt :  saltLocal);
    return {password: hashedPassword, salt: salt ? salt : saltLocal};
}

export function hashTOTPToken(secret_token, password, uid) {
    // Generate a random initialization vector (IV)
    const iv = crypto.randomBytes(16); // 16 bytes for AES-256

    // Derive a key using PBKDF2
    const passwordKey = crypto.pbkdf2Sync(password, uid, 5000, 32, 'sha256');

    // Create a cipher with AES-256-CTR and the generated IV
    const cipher = crypto.createCipheriv('aes-256-ctr', passwordKey, iv);

    // Encrypt your data (replace '1234' with your actual data)
    let encryptedTOTPToken = cipher.update(secret_token, 'utf8', 'hex');
    encryptedTOTPToken += cipher.final('hex');

    // Include the IV in the result (it's essential for decryption)
    const result = {
        iv: iv.toString('hex'),
        encryptedTOTPToken: encryptedTOTPToken,
    };

    return result;
}

export function decodeTOTPToken(encryptedData, password, uid) {
    // Convert the hex-encoded IV back to a Buffer
    const iv = Buffer.from(encryptedData.iv, 'hex');

    // Derive the key using PBKDF2
    const passwordKey = crypto.pbkdf2Sync(password, uid, 5000, 32, 'sha256');

    // Create a decipher with AES-256-CTR and the provided IV
    const decipher = crypto.createDecipheriv('aes-256-ctr', passwordKey, iv);

    // Decrypt the data
    let decryptedTOTPToken = decipher.update(encryptedData.encryptedTOTPToken, 'hex', 'utf8');
    decryptedTOTPToken += decipher.final('utf8');

    return decryptedTOTPToken;
}