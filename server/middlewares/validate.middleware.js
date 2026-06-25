function validate(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            return res.status(400).json({ message: 'Validation failed', error: error.errors || error.message });
        }
    };
}

module.exports = validate;
