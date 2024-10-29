export interface User {
    id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface Wallet {
    id: string;
    user_id: string;
    balance: number;
    currency: string;
    status: 'active' | 'inactive';
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface Transaction {
    id: string;
    wallet_id: string;
    type: 'credit' | 'debit';
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    reference: string;
    metadata?: Record<string, any>;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface TransferRequest {
    recipient_email: string;
    amount: number;
  }
  
  export interface WithdrawRequest {
    amount: number;
    bank_account: string;
  }
  
  export interface FundWalletRequest {
    amount: number;
    payment_reference: string;
  }