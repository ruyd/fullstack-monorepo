## debug


## Commit Flow
`epic | feature -> develop -> master`
- Feature branches are created from, merged to, develop
- Pre-commit compile check 

## Push Flow
- Pre-push tests against docker environment, push if okay
- Github Action Tests are run against testing environment 
- If tests pass, build container with branch tag
- Push built container image to registry
- Trigger environment redeployment

| Branch | Environment |
| --- | --- |
| master | Production |
| develop | Testing |
| feature | Review App |
| epic | Review App |
| epic-feature | none |


## Container Flow

Image Tags are based on the branch name and not hash, with latest being environment source 

`Branch -> Tests -> Container -> Environment`

Github Actions can use the branch name hints like `review` for review app and web hook creation

