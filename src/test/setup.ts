import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// Mock Supabase client if needed globally
// vi.mock('../lib/supabase', () => ({
//   supabase: {
//     auth: {
//       getSession: vi.fn(),
//       onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
//     },
//     from: vi.fn(() => ({
//       select: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn() })) })),
//     })),
//   },
// }))
