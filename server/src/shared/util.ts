import { validate, v4 } from 'uuid'

export function dashifyUUID(i: string): string {
  return (
    i.substring(0, 8) +
    '-' +
    i.substring(8, 4) +
    '-' +
    i.substring(12, 4) +
    '-' +
    i.substring(16, 4) +
    '-' +
    i.substring(20)
  )
}

export function tryDashesOrNewUUID(undashed?: string): string {
  if (undashed) {
    const candidate = dashifyUUID(undashed)
    if (validate(candidate)) {
      return candidate
    }
  }
  return v4()
}
