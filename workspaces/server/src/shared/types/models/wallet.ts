import { Wallet, WalletTransaction } from '@lib'
import { DataTypes } from 'sequelize'
import { addModel } from 'src/shared/db'

export const WalletModel = addModel<Wallet>('wallet', {
  walletId: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2)
  },
  currency: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  }
})

export const WalletTransactionModel = addModel<WalletTransaction>('walletTransaction', {
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
