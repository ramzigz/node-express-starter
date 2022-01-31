/* eslint-disable no-undef */
import dotenv from 'dotenv';

const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');

dotenv.config({ path: '.env' });

before((done) => {
  describe('POST /login', () => {
    it('should return 200 OK', (loginDone) => {
      // authenticatedUser
      request(app)
        .post('/login')

        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({
          email: 'admin@gmail.com', password: 'p@ssword++',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.status).to.equal(200);
          // expect(res).to.have.cookie('sessionid');
          // expect(res.body).to.be.an('object');
        })
        .end(loginDone);
    });
  });
  done();
});

before((done) => {
  describe('POST /signup', () => {
    it('should return 200 OK', (signupDone) => {
      request(app)
        .post('/signup')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({

          email: 'test@gmail.com',
          password: '123456789',
          firstName: 'Test',
          lastName: 'Test',
          phone: '12345678',
          gender: 'MALE',
          birthdate: '01-01-2000',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.status).to.equal(200);
          // expect(res).to.have.cookie('sessionid');
          // expect(res.body).to.be.an('object');
        })
        .end(signupDone);
    });
  });
  done();
});
before((done) => {
  describe('GET /users', () => {
    it('should return 200 OK', () => {
      request(app)
        .get('/users')
        .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXIiOnsiX2lkIjoiNjBlMWI4NDk2OWU4ZWUwMDIzNjlhZjMwIiwiZW1haWwiOiJhZG1pbi5sb2thdG91dEBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4ifX0sImlhdCI6MTYyODc2MjA4NywiZXhwIjoxNjI5MzY2ODg3fQ.SbmjoP_AgBCrI4lmoadnN2hmUOGIyKp3-Qq_jAqE6VM' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.status).to.equal(200);
          // expect(res).to.have.cookie('sessionid');
          // expect(res.body).to.be.an('object');
        })
        .end();
    });
  });
  done();
});
