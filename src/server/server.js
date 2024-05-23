const Hapi = require('@hapi/hapi');
const routes = require('./routes');
require('dotenv').config();
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    server.ext('onPreResponse', function (req, h) {
        const response = req.response;
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi'
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }
        else if (response.isBoom && response.output.statusCode === 413) {
            const newResponse = h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000'
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }
        else if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi'
            });
            newResponse.code(400);
            return newResponse;
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();