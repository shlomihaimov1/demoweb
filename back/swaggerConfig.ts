import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for your application',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };