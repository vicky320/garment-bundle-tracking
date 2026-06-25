function getDashboard(req, res) {
    res.json({
        message: 'Manager dashboard data',
        currentUser: { id: req.user._id, name: req.user.name, role: req.user.role },
    });
}

module.exports = { getDashboard };
