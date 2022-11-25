import OnboardingDialog from '../profile/OnboardingDialog'

/**
 * Multi component dialogs that return null if not open
 * Dev Note: Single component level dialogs -> inside component
 * @returns
 */
export default function Dialogs() {
  return (
    <>
      <OnboardingDialog />
    </>
  )
}

export const GlobalDialogs = {
  Omboard: `onboard`,
}
