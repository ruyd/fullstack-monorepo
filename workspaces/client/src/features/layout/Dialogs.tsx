import OnboardingDialog from '../profile/OnboardingDialog'

/**
 * Multi component dialogs that return null if not open
 * Dev Note: Single component level dialogs -> component folder
 * @returns
 */
export default function GlobalDialogs() {
  return (
    <>
      <OnboardingDialog />
    </>
  )
}
