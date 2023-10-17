const crypto = require('crypto');


function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

function hashPassword(password, salt) {
    const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
    return hash;
}


export default function encrypt(password){
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    return {password: hashedPassword, salt};
}
