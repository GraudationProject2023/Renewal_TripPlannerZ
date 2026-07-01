// Import heapdump only on server-side
let heapdump: any = null

try {
  if (typeof window === 'undefined') {
    // Only import heapdump in Node.js environment
    heapdump = require('heapdump')
  }
} catch (e) {
  console.warn('heapdump not available:', (e as Error).message)
}

import { join } from 'path'

const getDividedUnit = (data: number): string => {
  return (data / 1024 / 1024).toFixed(2)
}

function logMemoryUsage() {
  const used = process.memoryUsage()
  const formatted = {
    rss: `${getDividedUnit(used.rss)} MB`,
    heapTotal: `${getDividedUnit(used.heapTotal)} MB`,
    heapUsed: `${getDividedUnit(used.heapUsed)} MB`,
    external: `${getDividedUnit(used.external)} MB`,
  }
}

function checkAndDumpIfNeeded(): void {
  if (!heapdump) return // Skip if heapdump is not available

  const { heapUsed, heapTotal } = process.memoryUsage()
  const threshold = heapTotal * 0.8 // Dump when over 80% usage

  if (heapUsed > threshold) {
    const snapshotPath = join(
      process.cwd(),
      `./heap-${Date.now()}.heapsnapshot`,
    )

    heapdump.writeSnapshot(snapshotPath, (err: any, filename: string) => {
      if (err) console.error('[heapdump] Failed to write:', err)
      else console.log(`[heapdump] Snapshot saved: ${filename}`)
    })
  }
}

async function main() {
  // Don't execute in browser environment
  if (typeof window !== 'undefined') {
    return
  }

  // Initial memory usage
  logMemoryUsage()

  // Monitor memory every 5 seconds
  const interval = setInterval(() => {
    logMemoryUsage()
    checkAndDumpIfNeeded()
  }, 5000)

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    clearInterval(interval)
    logMemoryUsage()
    process.exit(0)
  })

  // Keep the process running
  await new Promise(() => {})
}

// Only execute on server-side
if (typeof window === 'undefined') {
  main().catch(console.error)
}

// Export empty object for browser environment
export default {}
