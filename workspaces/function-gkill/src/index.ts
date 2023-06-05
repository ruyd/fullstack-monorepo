// import * as functions from '@google-cloud/functions-framework'
import { google } from 'googleapis'
import { GoogleAuth, OAuth2Client } from 'google-auth-library'
import { CloudEventFunction } from '@google-cloud/functions-framework/build/src/functions'
import { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher'
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth'
import { GlobalOptions } from 'googleapis/build/src/apis/abusiveexperiencereport'

const PROJECT_ID = 'mstream-368503'
const PROJECT_NAME = `projects/${PROJECT_ID}`
const billing = google.cloudbilling('v1').projects

export const onBudgetMessage: CloudEventFunction<PubsubMessage> = async cloudEvent => {
  console.log('tapion', cloudEvent, cloudEvent.data)
  if (!cloudEvent?.data) {
    console.log('No message data')
    return 'No message data'
  }

  const decoded = JSON.parse(
    Buffer.from(JSON.stringify(cloudEvent.data) as string, 'base64').toString()
  )

  console.log(decoded)
  console.log(decoded.costAmount)
  console.log(decoded.budgetAmount)

  if (decoded.costAmount <= decoded.budgetAmount) {
    console.log('No action necessary.')
    return `No action necessary. (Current cost: ${decoded.costAmount})`
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

/**
 * @return {Promise} Credentials set globally
 */
const _setAuthCredential = () => {
  const client = new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/cloud-billing',
      'https://www.googleapis.com/auth/cloud-platform'
    ]
  })

  // Set credential globally for all requests
  google.options({
    auth: client as unknown as GlobalOptions['auth']
  })
}

/**
 * Determine whether billing is enabled for a project
 * @param {string} projectName Name of project to check if billing is enabled
 * @return {bool} Whether project has billing enabled or not
 */
const _isBillingEnabled = async (projectName: string) => {
  try {
    const res = await billing.getBillingInfo({
      name: projectName
    })
    console.log(res)
    return res.data.billingEnabled
  } catch (e) {
    console.log(
      'Unable to determine if billing is enabled on specified project, assuming billing is enabled'
    )
    return true
  }
}

/**
 * Disable billing for a project by removing its billing account
 * @param {string} projectName Name of project disable billing on
 * @return  Text containing response from disabling billing
 */
const _disableBillingForProject = async (projectName: string) => {
  const res = await billing.updateBillingInfo({
    name: projectName,
    resource: {
      billingAccountName: ''
    } // Disable billing
  } as any)
  console.log(res)
  console.log('Billing Disabled')
  return `Billing disabled: ${JSON.stringify(res.data)}`
}

// functions.cloudEvent('main', onBudgetMessage)
exports.main = onBudgetMessage
