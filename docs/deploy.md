
## Github Actions Setup for Google Cloud

Workload Identity provides keyless federation for external resources like GKE and Github Actions
https://github.com/google-github-actions/auth#setup

gcloud iam workload-identity-pools create "default-pool" \
  --project="mstream-368503" \
  --location="global" \
  --display-name="Default Pool"

gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project="mstream-368503" \
  --location="global" \
  --workload-identity-pool="default-pool" \
  --display-name="Github Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.aud=assertion.aud,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

gcloud iam service-accounts create "github" \
  --project="mstream-368503" \
  --description="Github Actions" \
  --display-name="Github Actions"

gcloud iam service-accounts add-iam-policy-binding "github@mstream-368503.iam.gserviceaccount.com" \
  --project="mstream-368503" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/364055912546/locations/global/workloadIdentityPools/default-pool/*"

gcloud iam workload-identity-pools providers describe "github-provider" \
  --project="mstream-368503" \
  --location="global" \
  --workload-identity-pool="default-pool" \
  --format="value(name)"
