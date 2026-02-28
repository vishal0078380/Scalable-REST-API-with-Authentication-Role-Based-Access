const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Simple Swagger definition
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Test API',
            version: '1.0.0',
        },
    },
    apis: ['./test-swagger.js'], // Look for annotations in this file
};

const specs = swaggerJsdoc(options);

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Returns a test message
 *     responses:
 *       200:
 *         description: Successful response
 */
app.get('/test', (req, res) => {
    res.json({ message: 'Test working!' });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});