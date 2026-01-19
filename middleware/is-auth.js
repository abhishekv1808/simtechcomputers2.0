const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/admin/login');
    }
    try {
        const decoded = jwt.verify(token, 'somesupersecretsecret');
        req.admin = decoded;
        next();
    } catch (err) {
        return res.redirect('/admin/login');
    }
};
