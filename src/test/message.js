require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa'
const SAMPLE_AUTHOR_ID = 'bbbbbbbbbbbb'


describe('Message API endpoints', () => {
    beforeEach((done) => {
        
        const sampleUser = new User({
            username: 'myuser',
            password: 'mypassword',
            _id: SAMPLE_AUTHOR_ID
        })

        const sampleMessage = new Message({
            body: 'mybody',
            title: "mytitle",
            author: SAMPLE_AUTHOR_ID,
            _id: SAMPLE_OBJECT_ID
        })
        Promise.all([sampleMessage.save(), sampleUser.save()])
        .then(() => {
            done()
        })
    })

    afterEach((done) => {
        // TODO: add any afterEach code here
        deletion1 = User.deleteOne({ username: 'myuser'})
        deletion2 = Message.deleteOne({ _id: SAMPLE_OBJECT_ID })
        Promise.all([deletion1, deletion2]).then(() => {
            done()
        })
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get('/messages')
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            done()
        })
    })

    it('should get one specific message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get(`/messages/${SAMPLE_OBJECT_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            // expect(res.body.body).to.equal('mybody')
            done()
        })
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .post('/messages')
        .send({body: 'mybody', title: 'title', author: SAMPLE_AUTHOR_ID})
        .end((err,res) => {
            if (err) { done(err)}
            expect(res.body.message).to.be.an('object')
            expect(res.body.message).to.have.property('body', 'mybody')

            Message.findOne({body: 'mybody'}).then(message => {
                expect(message).to.be.an('object')
                done()
            }).catch((err) => {
                if (err) { done(err)}
                throw err.message
            })
        })
    })

    it('should update a message', (done) => {
        chai.request(app)
        .put(`/messages/${SAMPLE_OBJECT_ID}`)
        .send({body: 'mybody'})
        .end((err, res) => {
            if (err) { done(err) }
            expect(res.body.message).to.be.an('object')
            expect(res.body.message).to.have.property('body', 'mybody')

            // check that user is actually inserted into database
            Message.findOne({body: 'mybody'}).then(message => {
                expect(message).to.be.an('object')
                done()
            })
        })
    })

    it('should delete a message', (done) => {
        chai.request(app)
        .delete(`/messages/${SAMPLE_OBJECT_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res.body.message).to.equal("Successfully deleted.")
            expect(res.body._id).to.equal(SAMPLE_OBJECT_ID)

            Message.findOne({_id: SAMPLE_OBJECT_ID}).then(message => {
                console.log(message)
                expect(message).to.equal(null)
                done()
            })
        })
    })
})
