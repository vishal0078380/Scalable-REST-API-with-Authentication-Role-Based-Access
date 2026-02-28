const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: 'B3.0.0',
            description: 'Task Manager API with Authentication & Role-Based Access Control',
        },
        servers: [{
            url: 'http://localhost:3000', // Make sure this matches your server
            description: 'Development server'
        }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token in format: Bearer <token>'
                }
            }
        }
    },
    apis: [
        './src/routes/*.js',
    ],
};

const specs = swaggerJsdoc(options);
module.exports = specs;