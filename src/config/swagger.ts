import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Demo Credit Wallet Service API',
      version: '1.0.0',
      description: 'API documentation for Demo Credit wallet functionality',
      contact: {
        name: 'API Support',
        url: 'https://lendsqr.com/support',
        email: 'support@lendsqr.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            first_name: {
              type: 'string',
              description: 'User first name'
            },
            last_name: {
              type: 'string',
              description: 'User last name'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password'
            }
          },
          required: ['email', 'password', 'first_name', 'last_name']
        },
        Wallet: {
          type: 'object',
          properties: {
            balance: {
              type: 'number',
              format: 'float',
              description: 'Current wallet balance'
            },
            currency: {
              type: 'string',
              description: 'Wallet currency',
              example: 'NGN'
            }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Transaction ID'
            },
            type: {
              type: 'string',
              enum: ['credit', 'debit'],
              description: 'Transaction type'
            },
            amount: {
              type: 'number',
              format: 'float',
              description: 'Transaction amount'
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed'],
              description: 'Transaction status'
            },
            reference: {
              type: 'string',
              description: 'Unique transaction reference'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export const specs = swaggerJsdoc(options);