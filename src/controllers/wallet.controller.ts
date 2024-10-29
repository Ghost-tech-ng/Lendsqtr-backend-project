import { Request, Response } from 'express';
import WalletService from '../services/wallet.service';
import { validateTransfer, validateWithdraw, validateFunding } from '../validators/wallet.validator';

export class WalletController {
  async getBalance(req: Request, res: Response) {
    try {
      const userId = req.user.id; // From auth middleware
      const wallet = await WalletService.getWallet(userId);

      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      return res.json({
        balance: wallet.balance,
        currency: wallet.currency
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async fundWallet(req: Request, res: Response) {
    try {
      const { error } = validateFunding(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const userId = req.user.id;
      const { amount } = req.body;

      const transaction = await WalletService.fundWallet(userId, amount);

      return res.status(201).json({
        message: 'Wallet funded successfully',
        transaction
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async transfer(req: Request, res: Response) {
    try {
      const { error } = validateTransfer(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const userId = req.user.id;
      const transaction = await WalletService.transfer(userId, req.body);

      return res.status(201).json({
        message: 'Transfer successful',
        transaction
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async withdraw(req: Request, res: Response) {
    try {
      const { error } = validateWithdraw(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const userId = req.user.id;
      const transaction = await WalletService.withdraw(userId, req.body);

      return res.status(201).json({
        message: 'Withdrawal successful',
        transaction
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new WalletController();