import request from 'supertest';
import app from '../index';
import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';

describe('Wallet API', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Setup test user and get auth token
    testUserId = uuidv4();
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      });

    authToken = response.body.token;
  });

  afterAll(async () => {
    await db('users').where({ id: testUserId }).del();
    await db.destroy();
  });

  describe('GET /api/wallets/balance', () => {
    it('should return wallet balance for authenticated user', async () => {
      const response = await request(app)
        .get('/api/wallets/balance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('balance');
      expect(response.body).toHaveProperty('currency');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/wallets/balance');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/wallets/fund', () => {
    it('should fund wallet successfully', async () => {
      const response = await request(app)
        .post('/api/wallets/fund')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 1000,
          payment_reference: 'TEST-PAYMENT-REF'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('transaction');
      expect(response.body.transaction.type).toBe('credit');
    });
  });

  describe('POST /api/wallets/transfer', () => {
    it('should fail transfer with insufficient funds', async () => {
      const response = await request(app)
        .post('/api/wallets/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          recipient_email: 'recipient@example.com',
          amount: 1000000 // Amount greater than balance
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Insufficient funds');
    });
  });

  describe('POST /api/wallets/withdraw', () => {
    it('should process withdrawal successfully', async () => {
      // First fund the wallet
      await request(app)
        .post('/api/wallets/fund')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 1000,
          payment_reference: 'TEST-PAYMENT-REF'
        });

      const response = await request(app)
        .post('/api/wallets/withdraw')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 500,
          bank_account: 'TEST-BANK-ACCOUNT'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('transaction');
      expect(response.body.transaction.type).toBe('debit');
    });
  });
});