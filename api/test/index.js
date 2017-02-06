const request = require('superagent')
const expect = require('chai').expect
const config = require('../../config')
const aepify = require('../../osdi-express/utils/aepify')

describe('GET /', () => {
  it('should fetch aep', done => {
    request
      .get(config.baseUrl)
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal(aepify(config))
        done()
      })
  })
})

let onePersonLink
describe('GET /people', () => {
  let nextLink

  it('should return valid hal', done => {
    request
      .get(config.baseUrl + '/people?param=dummy')
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.be.an.object
        expect(res.body).to.have.deep.property('_links.next')
        nextLink = res.body._links.next.href
        expect(res.body).to.have.deep.property('_links.osdi:people')
        onePersonLink = res.body._links['osdi:people'][0].href
        expect(res.body).to.have.deep.property('_embedded.osdi:people')
        done()
      })
  })


  it('should paginate', done => {
    request
      .get(nextLink)
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.be.an.object
        expect(res.body).to.have.deep.property('_links.next')
        expect(res.body).to.have.deep.property('_links.prev')
        expect(res.body).to.have.deep.property('_links.osdi:people')
        expect(res.body).to.have.deep.property('_embedded.osdi:people')
        done()
      })
  })

  it('should accept odata style queries', done => {
    request
      .get(nextLink)
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.be.an.object
        expect(res.body).to.have.deep.property('_links.next')
        expect(res.body).to.have.deep.property('_links.prev')
        expect(res.body).to.have.deep.property('_links.osdi:people')
        expect(res.body).to.have.deep.property('_embedded.osdi:people')
        done()
      })
  })
})

describe('GET /people/:id', () => {
  it('should return valid hal', done => {
    request
      .get(config.baseUrl + '/people?')
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.be.an.object
        done()
      })
  })
})

let newPersonId
describe('POST /people', () => {
  it('should return the posted person', done => {
    request
      .post(config.baseUrl + '/people')
      .send(require('./person'))
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.be.an.object
        newPersonId = res.body.uuid
        done()
      })
  })

  it('person should now be getable', done => {
    request
      .get(config.baseUrl + '/people/' + newPersonId)
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.be.an.object
        done()
      })
  })

  // TODO -- add validation for person and cause the api call to fail
})

describe('PUT /people/:id', () => {
  it('should overwrite the property', done => {
    request
      .put(config.baseUrl + '/people/' + newPersonId)
      .send({givenName: 'johnny'})
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body.givenName).to.equal('johnny')
        done()
      })
  })

  // TODO -- add validation for person and cause the api call to fail
})

let oneEventLink
describe('GET /events', () => {
    let nextLink

    it('should return valid hal', done => {
        request
            .get(config.baseUrl + '/events?param=dummy')
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an.object
                expect(res.body).to.have.deep.property('_links.next')
                nextLink = res.body._links.next.href
                expect(res.body).to.have.deep.property('_links.osdi:events')
                oneEventLink = res.body._links['osdi:events'][0].href
                expect(res.body).to.have.deep.property('_embedded.osdi:events')
                done()
            })
    })


    it('should paginate', done => {
        request
            .get(nextLink)
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an.object
                expect(res.body).to.have.deep.property('_links.next')
                expect(res.body).to.have.deep.property('_links.prev')
                expect(res.body).to.have.deep.property('_links.osdi:events')
                expect(res.body).to.have.deep.property('_embedded.osdi:events')
                done()
            })
    })

    it('should accept odata style queries', done => {
        request
            .get(nextLink)
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an.object
                expect(res.body).to.have.deep.property('_links.next')
                expect(res.body).to.have.deep.property('_links.prev')
                expect(res.body).to.have.deep.property('_links.osdi:events')
                expect(res.body).to.have.deep.property('_embedded.osdi:events')
                done()
            })
    })
})

describe('GET /events/:id', () => {
    it('should return valid hal', done => {
        request
            .get(config.baseUrl + '/events?')
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an.object
                done()
            })
    })
})

let newEventId
describe('POST /events', () => {
    it('should return the posted person', done => {
        request
            .post(config.baseUrl + '/events')
            .send(require('./person'))
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an.object
                newEventId = res.body.uuid
                done()
            })
    })

    it('person should now be getable', done => {
        request
            .get(config.baseUrl + '/events/' + newEventId)
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an.object
                done()
            })
    })

    // TODO -- add validation for person and cause the api call to fail
})

describe('PUT /events/:id', () => {
    it('should overwrite the property', done => {
        request
            .put(config.baseUrl + '/events/' + newEventId)
            .send({name: 'johnny'})
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.name).to.equal('johnny')
                done()
            })
    })

    it('should not succeed for an incorrect field', done => {
        request
            .put(config.baseUrl + '/events/' + newEventId)
            .send({obviouslyFakeField: 'pls dont succeed',
                    name: 'johnny5' })
            .end((err, res) => {
                expect(res.status).to.equal(200)
                console.log(res.body)
                expect(res.body.name).to.equal('johnny5')
                expect(res.body.obviouslyFakeField).to.be.undefined
                done()
            })
    })

    // TODO -- add validation for person and cause the api call to fail
})
