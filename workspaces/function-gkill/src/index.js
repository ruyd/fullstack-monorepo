const functions = require('@google-cloud/functions-framework')
const { google } = require('googleapis')
const { GoogleAuth } = require('google-auth-library')

const PROJECT_ID = 'mstream-368503'
const PROJECT_NAME = `projects/${PROJECT_ID}`
const billing = google.cloudbilling('v1').projects

const _setAuthCredential = () => {
  const client = new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/cloud-billing',
      'https://www.googleapis.com/auth/cloud-platform',
    ],
  })

  // Set credential globally for all requests
  google.options({
    auth: client,
  })
}

const _isBillingEnabled = async projectName => {
  try {
    const res = await billing.getBillingInfo({
      name: projectName,
    })
    console.log(res)
    return res.data.billingEnabled
  } catch (e) {
    console.log(
      'Unable to determine if billing is enabled on specified project, assuming billing is enabled',
    )
    return true
  }
}

const _disableBillingForProject = async projectName => {
  console.log('disabling billing')
  const res = await billing.updateBillingInfo({
    name: projectName,
    resource: {
      billingAccountName: '',
    }, // Disable billing
  })
  console.log(res)
  console.log('Billing Disabled')
  return `Billing disabled: ${JSON.stringify(res.data)}`
}

const onEvent = async cloudEvent => {
  console.log(`tapion`, cloudEvent.data)
  if (!cloudEvent.data.message?.data) {
    console.log('No message data')
    return 'No message data'
  }
  const decoded = Buffer.from(cloudEvent.data.message.data, 'base64').toString()
  console.log('decoded', decoded)
  const pubsubData = JSON.parse(decoded)
  console.log(`hadoken`, pubsubData)

  if (pubsubData.costAmount <= pubsubData.budgetAmount) {
    console.log('No action necessary.')
    return `No action necessary. (Current cost: ${pubsubData.costAmount})`
  }

  if (!PROJECT_ID) {
    console.log('no project specified')
    return 'No project specified'
  }

  _setAuthCredential()

  const billingEnabled = await _isBillingEnabled(PROJECT_NAME)
  if (billingEnabled) {
    console.log('disabling billing')
    return _disableBillingForProject(PROJECT_NAME)
  } else {
    console.log('billing already disabled')
    return 'Billing already disabled'
  }
}

functions.cloudEvent('helloPubSub', onEvent)
