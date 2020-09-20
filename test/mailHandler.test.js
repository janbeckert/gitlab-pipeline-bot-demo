/* eslint-env mocha */

var assert = require('assert')

const Handler = require('../core/mailHandler.js')

describe('mailHandler', function () {
  describe('#getRecieverAddress', function () {
    it('return false for empty reciever lists', function () {
      const handler = new Handler('init@example.com', 'lead@example.com')

      assert.strictEqual(handler.getRecieverAddress({
        to: []
      }), false)
    })

    it('should find lead address in many reciever addresses', function () {
      const initAddress = 'init@example.com'
      const leadAddress = 'lead@example.com'
      const handler = new Handler(initAddress, leadAddress)

      assert.deepStrictEqual(handler.getRecieverAddress({
        to: [
          { address: 'text@example.com', name: 'Mr. Test' },
          { address: initAddress, name: '' },
          { address: 'demo@example.com', name: 'Mr. demp' },
          { address: 'Demo@example.com', name: 'Ms. Demp' }
        ]
      }), {
        isInit: true,
        isLead: false
      })

      assert.deepStrictEqual(handler.getRecieverAddress({
        to: [
          { address: 'text@example.com', name: 'Mr. Test' },
          { address: leadAddress, name: '' },
          { address: 'demo@example.com', name: 'Mr. demp' },
          { address: 'Demo@example.com', name: 'Ms. Demp' }
        ]
      }), {
        isInit: false,
        isLead: true
      })
    })

    it('should ignore case', function () {
      const initAddress = 'init@example.com'
      const handler = new Handler(initAddress, 'lead@example.com')

      assert.deepStrictEqual(handler.getRecieverAddress({
        to: [
          { address: 'text@example.com', name: 'Mr. Test' },
          { address: 'Init@Example.com', name: '' },
          { address: 'demo@example.com', name: 'Mr. demp' },
          { address: 'Demo@example.com', name: 'Ms. Demp' }
        ]
      }), {
        isInit: true,
        isLead: false
      })
    })
  })

  describe('#handleMail', function () {
    it('should call handler function', function () {
      let hasBeenCalled = false
      const fnc = function () {
        hasBeenCalled = true
      }

      const initAddress = 'init@example.com'
      const handler = new Handler(
        initAddress,
        'lead@example.com',
        fnc,
        () => {}
      )

      handler.handleMail({
        to: [
          { address: 'text@example.com', name: 'Mr. Test' },
          { address: 'Init@Example.com', name: '' },
          { address: 'demo@example.com', name: 'Mr. demp' },
          { address: 'Demo@example.com', name: 'Ms. Demp' }
        ]
      })

      assert.strictEqual(hasBeenCalled, true)
    })
  })
})
