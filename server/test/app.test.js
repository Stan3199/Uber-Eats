const { expect } = require('chai');
const request = require('request');
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert').strict;
const app = require('../index');

const should = chai.should();

chai.use(chaiHttp);
console.log(require('chai').request);
const agent = require('chai').request.agent(app);
const token = "JWT eyJhbGciOiJIUzI11NIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsImlzQ3VzdG9tZXIiOnRydWUsInN0YXR1cyI6MSwiaWF0IjoxNjM2OTE3MTg0LCJleHAiOjE2Mzc5MjUxODR9.0_ufNQEryBfoumK3VkdrwLxJGCcW7TUV1rSTm-XQPeU";

describe('/GET restaurants', () => {
  it('it should retrun restaurants', (done) => {
    let uid = "61818794057fb417414ebe70";
    
    agent.get('/restaurant/getRestaurants',{
      headers: { authorization: `${token}` }, uid }).end((err1, res1) => {
        // console.log(res1);
        // console.log(err1);
      res1.should.have.status(200);
      res1.should.be.a('object');
      done();
    });
  });
});

describe('/GET orders', () => {
  it('it should return orders placed by user', (done) => {
    let uid = "61818794057fb417414ebe70";
    agent.get('/restaurant/getAllDishes',{
      headers: { authorization: `${token}` }, uid }).end((err1, res1) => {
      res1.should.have.status(200);
      res1.should.be.a('object');
      done();
    });
  });
});