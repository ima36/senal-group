/**
 * Minimal .env loader for the standalone scripts.
 *
 * `next dev` and `next build` read .env themselves, but a plain `tsx` process
 * does not — and Node's own --env-file flag is rejected inside NODE_OPTIONS, so
 * it cannot be set from a package script. Rather than add a dependency for
 * fifteen lines, this parses the file directly.
 *
 * Side-effecting module: import it *first*, before anything that reads
 * process.env at module scope (payload.config.ts does).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(dirname, '..', '.env')

if (fs.existsSync(envPath)) {
  const contents = fs.readFileSync(envPath, 'utf8')

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separator = line.indexOf('=')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    if (!key || key in process.env) continue // a real environment variable wins

    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  }
}
