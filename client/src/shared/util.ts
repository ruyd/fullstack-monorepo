import { PayloadAction } from '@reduxjs/toolkit'

export function success(
  res:
    | PayloadAction<
        void,
        string,
        {
          arg: Record<string, unknown>
          requestId: string
          requestStatus: 'fulfilled'
        },
        never
      >
    | PayloadAction<
        unknown,
        string,
        {
          arg: Record<string, unknown>
          requestId: string
          requestStatus: 'rejected'
          aborted: boolean
          condition: boolean
        }
      >
): boolean {
  return res.meta.requestStatus === 'fulfilled'
}
