export function selectFile(contentType: string, multiple = false): Promise<File[]> {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = multiple
    input.accept = contentType
    input.onchange = () => {
      const files = Array.from(input.files || [])
      resolve(files)
    }
    input.click()
  })
}

export async function selectJsonFile<T extends Record<string, unknown>>(): Promise<T | null> {
  const result = await selectFile('.json')
  if (!result[0]) {
    return null
  }
  const file = await result[0].text()
  const obj = JSON.parse(file)
  return obj as T
}
