import { Router } from 'express';
import WalletController from '../controllers/wallet.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/wallets/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current wallet balance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/balance', authenticate, WalletController.getBalance);

/**
 * @swagger
 * /api/wallets/fund:
 *   post:
 *     summary: Fund wallet
 *     tags: [Wallet]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *               payment_reference:
 *                 type: string
 *             required:
 *               - amount
 *               - payment_reference
 *     responses:
 *       201:
 *         description: Wallet funded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/fund', authenticate, WalletController.fundWallet);

/**
 * @swagger
 * /api/wallets/transfer:
 *   post:
 *     summary: Transfer funds to another user
 *     tags: [Wallet]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipient_email:
 *                 type: string
 *                 format: email
 *               amount:
 *                 type: number
 *                 minimum: 1
 *             required:
 *               - recipient_email
 *               - amount
 *     responses:
 *       201:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input or insufficient funds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/transfer', authenticate, WalletController.transfer);

/**
 * @swagger
 * /api/wallets/withdraw:
 *   post:
 *     summary: Withdraw funds from wallet
 *     tags: [Wallet]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *               bank_account:
 *                 type: string
 *             required:
 *               - amount
 *               - bank_account
 *     responses:
 *       201:
 *         description: Withdrawal successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input or insufficient funds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/withdraw', authenticate, WalletController.withdraw);

export default router;