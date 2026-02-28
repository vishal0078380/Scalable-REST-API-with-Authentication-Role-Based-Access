module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10
};