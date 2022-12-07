import CheckoutDialog from '../shop/CheckoutDialog'
import OnboardingDialog from '../profile/OnboardingDialog'

/**
 * Multi component dialogs that return null if not open
 * Dev Note: Single component level dialogs -> inside component
 * @returns
 */
export default function Dialogs() {
  return (
    <>
      <CheckoutDialog />
      <OnboardingDialog />
    </>
  )
}

export const GlobalDialogs = {
  Omboard: `onboard`,
}
