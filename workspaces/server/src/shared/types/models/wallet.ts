import { Wallet, WalletTransaction } from '@lib'
import { DataTypes } from 'sequelize'
import { addModel } from 'src/shared/db'

export const WalletModel = addModel<Wallet>('wallet', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  balance: {
    type: DataTypes.NUMBER
  },
  currency: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  }
})

export const WalletTransactionModel = addModel<WalletTransaction>('wallet_transaction', {
  transactionId: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID
  },
  orderId: {
    type: DataTypes.UUID
  },
  amount: {
    type: DataTypes.STRING
  }
})
