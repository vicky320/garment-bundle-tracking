const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Style = require('../models/Style');
const Bundle = require('../models/Bundle');
const Stock = require('../models/Stock');
const StageHistory = require('../models/StageHistory');

const initialUsers = [
    {
        name: 'Factory Operator',
        email: 'operator@connoisseur.test',
        password: 'Operator@123',
        role: 'operator',
    },
    {
        name: 'Factory Manager',
        email: 'manager@connoisseur.test',
        password: 'Manager@123',
        role: 'manager',
    },
];

async function seedUsers() {
    for (const userData of initialUsers) {
        const existing = await User.findOne({ email: userData.email });
        if (existing) continue;

        const password = await bcrypt.hash(userData.password, 10);
        await User.create({
            name: userData.name,
            email: userData.email,
            password,
            role: userData.role,
        });
        console.log(`Seeded user: ${userData.email}`);
    }
}

async function seedSampleData() {
    const existingStyle = await Style.findOne({ sku: 'SF-001' });
    if (existingStyle) return;

    const styles = await Style.create([
        { sku: 'SF-001', styleName: 'Summer Shirt', description: 'Light fabric shirt for summer.' },
        { sku: 'KN-012', styleName: 'Kurtā Set', description: 'Classic kurta outfit.' },
        { sku: 'DJ-054', styleName: 'Denim Jacket', description: 'Structured denim jacket.' },
    ]);

    const bundles = await Bundle.create([
        { bundleCode: 'BND-001', style: styles[0]._id, quantity: 12, currentStage: 'Stitching' },
        { bundleCode: 'BND-002', style: styles[1]._id, quantity: 8, currentStage: 'Finishing' },
        { bundleCode: 'BND-003', style: styles[2]._id, quantity: 5, currentStage: 'Packing' },
        { bundleCode: 'BND-004', style: styles[0]._id, quantity: 10, currentStage: 'Factory Store' },
        { bundleCode: 'BND-005', style: styles[1]._id, quantity: 7, currentStage: 'Dispatch' },
        { bundleCode: 'BND-006', style: styles[2]._id, quantity: 20, currentStage: 'Cutting' },
    ]);

    await Stock.create([
        { bundle: bundles[3]._id, quantity: 10, location: 'Factory Store' },
        { bundle: bundles[4]._id, quantity: 7, location: 'Dispatch' },
    ]);

    const manager = await User.findOne({ role: 'manager' });
    if (manager) {
        await StageHistory.create([
            { bundle: bundles[0]._id, operator: manager._id, fromStage: 'Cutting', toStage: 'Stitching' },
            { bundle: bundles[1]._id, operator: manager._id, fromStage: 'Cutting', toStage: 'Stitching' },
            { bundle: bundles[1]._id, operator: manager._id, fromStage: 'Stitching', toStage: 'Finishing' },
            { bundle: bundles[2]._id, operator: manager._id, fromStage: 'Cutting', toStage: 'Stitching' },
            { bundle: bundles[2]._id, operator: manager._id, fromStage: 'Stitching', toStage: 'Finishing' },
            { bundle: bundles[2]._id, operator: manager._id, fromStage: 'Finishing', toStage: 'Packing' },
            { bundle: bundles[3]._id, operator: manager._id, fromStage: 'Cutting', toStage: 'Stitching' },
            { bundle: bundles[3]._id, operator: manager._id, fromStage: 'Stitching', toStage: 'Finishing' },
            { bundle: bundles[3]._id, operator: manager._id, fromStage: 'Finishing', toStage: 'Packing' },
            { bundle: bundles[3]._id, operator: manager._id, fromStage: 'Packing', toStage: 'Factory Store' },
            { bundle: bundles[4]._id, operator: manager._id, fromStage: 'Cutting', toStage: 'Stitching' },
            { bundle: bundles[4]._id, operator: manager._id, fromStage: 'Stitching', toStage: 'Finishing' },
            { bundle: bundles[4]._id, operator: manager._id, fromStage: 'Finishing', toStage: 'Packing' },
            { bundle: bundles[4]._id, operator: manager._id, fromStage: 'Packing', toStage: 'Factory Store' },
            { bundle: bundles[4]._id, operator: manager._id, fromStage: 'Factory Store', toStage: 'Dispatch' },
        ]);
    }

    console.log('Seeded sample style, bundle, stock, and history data');
}

module.exports = async function seedAll() {
    await seedUsers();
    await seedSampleData();
};
