export const SEMVER_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/

export function compareVersions(a: string, b: string): number {
  const partsA = parseVersion(a)
  const partsB = parseVersion(b)
  for (let i = 0; i < partsA.length; i++) {
    if (partsA[i] !== partsB[i]) return partsA[i] - partsB[i]
  }
  return 0
}

function parseVersion(version: string): [number, number, number] {
  const match = SEMVER_PATTERN.exec(version)
  if (!match) throw new Error(`Invalid version: ${version}`)
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}
