const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const { PORT } = require('./config/env');
const seedAll = require('./seed/initialUsers');


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Connoisseur Fashions backend is running.');
});

app.use(errorHandler);

connectDatabase()
    .then(async () => {
        await seedAll();
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed...', error);
        process.exit(1);
    });
