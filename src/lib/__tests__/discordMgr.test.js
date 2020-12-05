const DiscordMgr = require('../discordMgr')

describe('DiscordMgr', () => {
  let sut
  let USERNAME = 'oedtest'
  const CHALLENGE_CODE = '123'
  const FAKE_DID = 'did:key:z6MkkyAkqY9bPr8gyQGuJTwQvzk8nsfywHCH4jyM1CgTq4KA'
  const DISCORD_TOKEN = 'abc123'

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
    sut = new DiscordMgr()
  })

  test('empty constructor', () => {
    expect(sut).not.toBeUndefined()
  })

  test('setSecrets', () => {
    expect(sut.isSecretsSet()).toEqual(false)
    sut.setSecrets({
      DISCORD_TOKEN
    })
    expect(sut.isSecretsSet()).toEqual(true)
    expect(sut.token).not.toBeUndefined()
  })

  test('startDirectMessage() no username', done => {
    sut
      .startDirectMessage(null)
      .then(resp => {
        fail("shouldn't return")
      })
      .catch(err => {
        expect(err.message).toEqual('no username provided')
        done()
      })
  })

  test('startDirectMessage() user not found', done => {
    sut.client.login = jest.fn(() => null)
    sut.client.users.cache.get = jest.fn(() => null)
    sut
      .startDirectMessage(USERNAME)
      .then(resp => {
        fail("shouldn't return")
      })
      .catch(err => {
        expect(err.message).toEqual('user not found')
        done()
      })
  })

  test.skip('startDirectMessage() happy case', done => {
    sut.client.login = jest.fn(() => null)
    sut.client.users.cache.get = jest.fn(() => null)
    sut
      .startDirectMessage(USERNAME)
      .then(resp => {
        expect
      })
      .catch(err => {
        expect(err.message).toEqual('no username provided')
        done()
      })
  })

  test.skip('client authenticated', done => {
    // todo
  })

  test('saveRequest() happy case', done => {
    sut.store.write = jest.fn()
    sut.store.quit = jest.fn()
    sut
      .saveRequest(USERNAME, FAKE_DID)
      .then(resp => {
        expect(/[a-zA-Z0-9]{32}/.test(resp)).toBe(true)
        done()
      })
      .catch(err => {
        fail(err)
        done()
      })
  })

  test('findDidInDirectMessages() no did', done => {
    sut
      .findDidInDirectMessages(null, CHALLENGE_CODE)
      .then(resp => {
        fail("shouldn't return")
      })
      .catch(err => {
        expect(err.message).toEqual('no did provided')
        done()
      })
  })
  test('findDidInDirectMessages() no challengeCode', done => {
    sut
      .findDidInDirectMessages(FAKE_DID, null)
      .then(resp => {
        fail("shouldn't return")
      })
      .catch(err => {
        expect(err.message).toEqual('no challengeCode provided')
        done()
      })
  })

  test.skip('findDidInDirectMessages() did not found', done => {
    sut.store.quit = jest.fn()
    sut.store.read = jest.fn(() => ({
      username: USERNAME,
      timestamp: Date.now(),
      challengeCode: CHALLENGE_CODE
    }))
    sut.client.get = jest.fn(() => {
      return Promise.resolve({ data: [] })
    })
    sut
      .findDidInDirectMessages(FAKE_DID, CHALLENGE_CODE)
      .then(resp => {
        expect(resp).toEqual({
          verification_url: '',
          username: USERNAME
        })
        done()
      })
      .catch(err => {
        fail(err)
        done()
      })
  })

  test.skip('findDidInGists() incorrect challenge code', done => {
    sut.store.quit = jest.fn()
    sut.store.read = jest.fn(() => ({
      username: USERNAME,
      timestamp: Date.now(),
      challengeCode: CHALLENGE_CODE
    }))
    sut.client = jest.fn(() => {
      return Promise.resolve({ data: [] })
    })

    sut
      .findDidInDirectMessages(FAKE_DID, 'incorrect challenge code')
      .then(resp => {
        fail("shouldn't return")
      })
      .catch(err => {
        expect(err.message).toEqual('Challenge Code is incorrect')
        done()
      })
  })

  test.skip('findDidInDirectMessages() Challenge created over 30min ago', done => {
    sut.store.quit = jest.fn()
    sut.store.read = jest.fn(() => ({
      username: USERNAME,
      timestamp: Date.now() - 31 * 60 * 1000,
      challengeCode: CHALLENGE_CODE
    }))
    sut
      .findDidInDirectMessages(FAKE_DID, CHALLENGE_CODE)
      .then(resp => {
        fail("shouldn't return")
      })
      .catch(err => {
        expect(err.message).toEqual(
          'The challenge must have been generated within the last 30 minutes'
        )
        done()
      })
  })

  test.skip('findDidInDirectMessages() did found', done => {
    sut.store.quit = jest.fn()
    sut.store.read = jest.fn(() => ({
      username: USERNAME,
      timestamp: Date.now(),
      challengeCode: CHALLENGE_CODE
    }))
    sut.client.get = jest.fn(() => {
      return Promise.resolve({
        data: [
          { full_text: 'my did is ' + FAKE_DID, id_str: '1078648593987395584' }
        ]
      })
    })

    sut
      .findDidInDirectMessages(FAKE_DID, CHALLENGE_CODE)
      .then(resp => {
        expect(resp).toEqual({
          verification_url: FAKE_TWEET,
          username: USERNAME
        })
        done()
      })
      .catch(err => {
        fail(err)
        done()
      })
  })
})
