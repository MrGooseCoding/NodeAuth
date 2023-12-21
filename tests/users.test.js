const app = require('../app.js')
const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;

const User = require('../models/user.js')

// Note that in order for some tests to work, the database needs to have some dummy data

const dummyUser = {
    id: 'f85cb688-701d-4c64-9087-42d62c8e0fcd',
    email: 'dummyuser@dummyuser.com',
    username: 'dummy.user',
    display_name: 'Dummy User',
    description: 'This is my dummy description',
    status: null,
    date_created: '2023-11-16 19:12:19',
    token: 'f7131fcc-a979-4df1-8164-ffd0fb68a557'
}

const post = async (path, data) => await supertest(app).post(path)
                                    .send(data)
                                    .set('Accept', 'application/json')
                                    .expect('Content-Type', /json/)

describe('User API', () => {
    it('should get a list of users (search)', async () => {
        const data = {
            "username": dummyUser.username,
        }
        const res = await post('/api/users/search/', data)

        expect(res.status).to.equal(200);
        expect(res.body).be.instanceOf(Array)
    });

    it('should retrieve a single user (getById)', async () => {
        const data = {
            "id": dummyUser.id,
        }

        const res = await post('/api/users/getById/', data)

        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal(dummyUser.username)
    })

    it('should retrieve a single user (getByToken)', async () => {
        const data = {
            "token": dummyUser.token,
        }

        const res = await post('/api/users/getByToken/', data)

        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal(dummyUser.username)
    })

    it('should create an user (create)', async () => {
        const newDummyUser = {
            email: 'dummyuser3@dummyuser.com',
            username: 'dummy.user.3',
            display_name: 'Dummy User 3',
            description: 'This is my dummy description',
            password: 'dummypassword'
        }

        const res = await post('/api/users/create/', newDummyUser)
        
        expect(res.status).to.equal(201)
        expect(res.body.username).to.equal(newDummyUser.username)
    })

    it('should update username (update/username)', async () => {
        const data = {
            username: "dummy_user",
            token:  dummyUser.token
        }

        const res = await post('/api/users/update/username/', data)

        expect(res.status).to.equal(201)
        expect(res.body.username).to.equal(data.username)
    })

    it('should update display_name (update/display_name)', async () => {
        const data = {
            display_name: "Dummy User :)",
            token:  dummyUser.token
        }

        const res = await post('/api/users/update/display_name/', data)

        expect(res.status).to.equal(201)
        expect(res.body.display_name).to.equal(data.display_name)
    })

    it('should update description (update/description)', async () => {
        const data = {
            description: "This is my other dummy description",
            token:  dummyUser.token
        }

        const res = await post('/api/users/update/description/', data)

        expect(res.status).to.equal(201)
        expect(res.body.description).to.equal(data.description)
    })

    it('should update password (update/password)', async () => {
        const data = {
            password: "dummypassword2",
            token:  dummyUser.token
        }

        const res = await post('/api/users/update/password/', data)

        //const valid = await User.authenticate(dummyUser.username, data.password)[0]

        expect(res.status).to.equal(201)
        //expect(valid).true()
    })


});

describe("Invalid cases", () => {

})