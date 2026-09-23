import fs from 'fs'

const files = ['test.db', 'test.db-journal', 'test.db-wal', 'test.db-shm']
const clean = () =>
  files.forEach((f) => {
    try {
      fs.rmSync(f, { force: true })
    } catch {
      /* still locked by SQLite on Windows — removed at the start of the next run */
    }
  })

/** Fresh test database before the run, removed afterwards. */
export default function setup() {
  clean()
  return clean
}
