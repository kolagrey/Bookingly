import '@testing-library/jest-dom'
import { server } from './src/mocks/server'

// Mock window.URL.createObjectURL
window.URL.createObjectURL = jest.fn()
window.URL.revokeObjectURL = jest.fn()

// Establish API mocking before all tests.
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())