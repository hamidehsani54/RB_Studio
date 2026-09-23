// Runs before every test file: point Payload at a throwaway test database.
// Set TEST_DATABASE_URL=postgres://… to run the same tests against PostgreSQL.
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'file:./test.db'
process.env.PAYLOAD_SECRET = 'test-secret-do-not-use-in-production'
process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
process.env.PREVIEW_SECRET = 'test-preview'
delete process.env.SMTP_HOST
