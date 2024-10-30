import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { User } from '../types';
import WalletService from './wallet.service';

export class AuthService {
  async register(userData: Partial<User>): Promise<{ user: Partial<User>, token: string }> {
    const trx = await db.transaction();

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password!, 10);
      
      // Create user
      const user = {
        id: uuidv4(),
        email: userData.email,
        password: hashedPassword,
        first_name: userData.first_name,
        last_name: userData.last_name
      };

      await trx('users').insert(user);

      // Create wallet for user
      await WalletService.createWallet(user.id);

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      await trx.commit();

      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async login(email: string, password: string): Promise<{ user: Partial<User>, token: string }> {
    const user = await db('users').where({ email }).first();

    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}

export default new AuthService();