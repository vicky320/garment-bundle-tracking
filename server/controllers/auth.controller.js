const { authenticateUser, createUser } = require('../services/auth.service');
const { loginSchema } = require('../validations/auth.validation');

async function login(req, res) {
    try {
        const data = loginSchema.parse(req.body);
        const authResult = await authenticateUser(data.email, data.password);
        if (!authResult) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        return res.json(authResult);
    } catch (error) {
        return res.status(400).json({ message: 'Login failed', error: error.message });
    }
}

async function register(req, res) {
    try {
        const { name, email, password, role } = req.body;
        const user = await createUser({ name, email, password, role });
        return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        return res.status(400).json({ message: 'Registration failed', error: error.message });
    }
}

module.exports = { login, register };
