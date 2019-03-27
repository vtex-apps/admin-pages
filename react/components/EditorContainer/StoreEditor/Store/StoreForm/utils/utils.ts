export function tryParseJson(str: string): { [k: string]: any } {
  let parsed = null
  try {
    if (str) {
      parsed = JSON.parse(str)
    }
  } catch (e) {
    console.log(e)
  }
  return parsed
}
