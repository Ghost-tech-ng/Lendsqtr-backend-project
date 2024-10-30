import { Router } from 'express';
import WalletController from '../controllers/wallet.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // Protect all wallet routes

router.get('/balance', WalletController.getBalance);
router.post('/fund', WalletController.fundWallet);
router.post('/transfer', WalletController.transfer);
router.post('/withdraw', WalletController.withdraw);

export default router;