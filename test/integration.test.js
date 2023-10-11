const express = require('express');

const request = require('supertest');

const router = require('../src/healthapi');

 

const app = express();

app.use('/healthz', router);

 

describe('Test Suite: Healthz Integration Test Cases', () => {   

    it('Test Case 1: GET API Case, when DB is connected', (done) => {

        request(app).get('/healthz')

        .expect(503)

        .end((err, res) => {

        if (err) return done(err);

        expect(res.body.status);

        done();

      });

    });

});
