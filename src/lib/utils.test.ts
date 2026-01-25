import { describe, it, expect } from 'vitest'
import {
  formatRelativeTime,
  formatDuration,
  formatFileSize,
  isValidEmail,
  getFileExtension,
  truncateText,
  generateSlug,
  formatShortTimeAgo
} from './utils'

describe('Utils', () => {
  describe('formatRelativeTime', () => {
    it('returns "1 day ago" for yesterday', () => {
      // Subtracting 23 hours to be safe with Math.ceil logic in utils
      const yesterday = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
      expect(formatRelativeTime(yesterday)).toBe('1 day ago')
    })
  })

  describe('formatDuration', () => {
    it('formats seconds to MM:SS', () => {
      expect(formatDuration(65)).toBe('1:05')
      expect(formatDuration(125)).toBe('2:05')
      expect(formatDuration(0)).toBe('0:00')
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes to readable string', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
    })
  })

  describe('isValidEmail', () => {
    it('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
    })
  })

  describe('getFileExtension', () => {
    it('returns extension from filename', () => {
      expect(getFileExtension('image.png')).toBe('png')
      expect(getFileExtension('archive.tar.gz')).toBe('gz')
    })
  })

  describe('truncateText', () => {
    it('truncates text if longer than max length', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...')
    })

    it('returns original text if shorter than max length', () => {
      expect(truncateText('Hi', 5)).toBe('Hi')
    })
  })

  describe('generateSlug', () => {
    it('converts text to slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world')
      expect(generateSlug('Test 123 !@#')).toBe('test-123')
    })
  })

  describe('formatShortTimeAgo', () => {
    it('returns "xm" for minutes', () => {
      const now = Date.now()
      expect(formatShortTimeAgo(new Date(now - 1000 * 60 * 5).toISOString())).toBe('5m')
      // Small buffer to avoid 0m flickering if test runs super fast
      expect(formatShortTimeAgo(new Date(now - 100).toISOString())).toBe('0m')
    })

    it('returns "xh" for hours', () => {
      const now = Date.now()
      expect(formatShortTimeAgo(new Date(now - 1000 * 60 * 60 * 2).toISOString())).toBe('2h')
    })

    it('returns "xd" for days', () => {
      const now = Date.now()
      expect(formatShortTimeAgo(new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString())).toBe('3d')
    })
  })
})
