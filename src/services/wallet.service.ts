import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { Wallet, Transaction, TransferRequest, WithdrawRequest } from '../types';

export class WalletService {
  private db: Knex;

  constructor() {
    this.db = db;
  }

  async createWallet(userId: string): Promise<Wallet> {
    const wallet = {
      id: uuidv4(),
      user_id: userId,
      balance: 0,
      currency: 'NGN',
      status: 'active'
    };

    await this.db('wallets').insert(wallet);
    return wallet;
  }

  async getWallet(userId: string): Promise<Wallet | null> {
    return await this.db('wallets')
      .where({ user_id: userId })
      .first();
  }

  async fundWallet(userId: string, amount: number): Promise<Transaction> {
    const trx = await this.db.transaction();

    try {
      const wallet = await trx('wallets')
        .where({ user_id: userId })
        .first();

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Update wallet balance
      await trx('wallets')
        .where({ id: wallet.id })
        .update({
          balance: this.db.raw('balance + ?', [amount]),
          updated_at: new Date()
        });

      // Create transaction record
      const transaction = {
        id: uuidv4(),
        wallet_id: wallet.id,
        type: 'credit',
        amount,
        status: 'completed',
        reference: `FUND-${uuidv4()}`,
        metadata: { source: 'wallet_funding' }
      };

      await trx('transactions').insert(transaction);
      await trx.commit();

      return transaction;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async transfer(userId: string, { recipient_email, amount }: TransferRequest): Promise<Transaction> {
    const trx = await this.db.transaction();

    try {
      // Get sender's wallet
      const senderWallet = await trx('wallets')
        .where({ user_id: userId })
        .first();

      if (!senderWallet) {
        throw new Error('Sender wallet not found');
      }

      if (senderWallet.balance < amount) {
        throw new Error('Insufficient funds');
      }

      // Get recipient's wallet
      const recipient = await trx('users')
        .where({ email: recipient_email })
        .first();

      if (!recipient) {
        throw new Error('Recipient not found');
      }

      const recipientWallet = await trx('wallets')
        .where({ user_id: recipient.id })
        .first();

      // Debit sender
      await trx('wallets')
        .where({ id: senderWallet.id })
        .update({
          balance: this.db.raw('balance - ?', [amount]),
          updated_at: new Date()
        });

      // Credit recipient
      await trx('wallets')
        .where({ id: recipientWallet.id })
        .update({
          balance: this.db.raw('balance + ?', [amount]),
          updated_at: new Date()
        });

      // Create transaction record
      const transaction = {
        id: uuidv4(),
        wallet_id: senderWallet.id,
        type: 'debit',
        amount,
        status: 'completed',
        reference: `TRF-${uuidv4()}`,
        metadata: {
          recipient_wallet_id: recipientWallet.id,
          recipient_email
        }
      };

      await trx('transactions').insert(transaction);
      await trx.commit();

      return transaction;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async withdraw(userId: string, { amount, bank_account }: WithdrawRequest): Promise<Transaction> {
    const trx = await this.db.transaction();

    try {
      const wallet = await trx('wallets')
        .where({ user_id: userId })
        .first();

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.balance < amount) {
        throw new Error('Insufficient funds');
      }

      // Update wallet balance
      await trx('wallets')
        .where({ id: wallet.id })
        .update({
          balance: this.db.raw('balance - ?', [amount]),
          updated_at: new Date()
        });

      // Create transaction record
      const transaction = {
        id: uuidv4(),
        wallet_id: wallet.id,
        type: 'debit',
        amount,
        status: 'completed',
        reference: `WTH-${uuidv4()}`,
        metadata: {
          bank_account,
          withdrawal_type: 'bank_transfer'
        }
      };

      await trx('transactions').insert(transaction);
      await trx.commit();

      return transaction;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

export default new WalletService();