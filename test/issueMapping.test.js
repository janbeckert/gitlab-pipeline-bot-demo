/* eslint-env mocha */

var assert = require('assert')

const Mapping = require('../core/issueMapping.js')

describe('issueMapping', function () {
  describe('#findIssue', function () {
    it('should find issue', function () {
      const mapping = new Mapping()
      mapping.addMapping(7, 'text@example.com')
      mapping.addMapping(2, 'Demo@example.com')

      assert.deepStrictEqual(mapping.findIssues('text@example.com'), [7])
    })

    it('should find issue independent of case', function () {
      const mapping = new Mapping()
      mapping.addMapping(7, 'text@example.com')
      mapping.addMapping(2, 'Demo@example.com')

      assert.deepStrictEqual(mapping.findIssues('demo@example.com'), [2])
    })

    it('should return empty array when no issue is found', function () {
      const mapping = new Mapping()
      mapping.addMapping(7, 'text@example.com')
      mapping.addMapping(2, 'Demo@example.com')

      assert.deepStrictEqual(mapping.findIssues('not-in-list@example.com'), [])
    })
  })
})
