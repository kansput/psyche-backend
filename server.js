require('dotenv').config();
const Hapi = require('@hapi/hapi');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const { getTestHistory, saveTestHistory } = require('./routes/historyRoutes');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3002,
        host: process.env.HOST || 'localhost',
    });

    // Debugging: Cek apakah routes sudah benar
    console.log('Auth Routes:', authRoutes);
    console.log('Test Routes:', testRoutes);
    console.log('History Routes:', { getTestHistory, saveTestHistory });

    // Register all routes
    server.route([
        ...authRoutes,
        ...testRoutes,
        {
            method: 'GET',
            path: '/history',
            handler: getTestHistory
        },
        {
            method: 'POST',
            path: '/history',
            handler: saveTestHistory
        }
    ]);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();