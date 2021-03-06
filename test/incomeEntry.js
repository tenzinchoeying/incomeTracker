let mongoose = require("mongoose");
let IncomeEntry = require('../models/incomeEntry');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
//var request = require('superagent');

chai.use(chaiHttp);


describe('Income', () => {
  beforeEach((done) => { //Before each test empty the database
    IncomeEntry.remove({}, (err) => { 
      done();         
    });     
  });


  /* Test the /GET route. This gets all the books in the catalogue. */
  describe('/GET localhost:3000/books', () => {
    it('it should GET all the entries', (done) => {
      chai.request(server).get('/api/income')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  });

  /* Test the /POST route. This will insert a book into the database */

  describe('/POST localhost:3000/api/income', () => {
    it('it should POST a book', (done) => {
      let incomeEntry = {
        date : '2/5/2018',
        description : 'February paycheck',
        income : 682,
        incomeType :'salary' 
      };
      chai.request(server).post('/api/income')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(incomeEntry)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('date');
        res.body.should.have.property('description');
        res.body.should.have.property('income');
        done();
      });
    });
  });

  /* Test the /Get id route. This will get a specific entry by id. */
  describe('/GET/:id /api/income', () => {
    it('it should GET an incomeEntry by the given id', (done) => {
      let incomeEntry = new IncomeEntry({ date: "5/6/2017",
                                          description: 'January salary', income: 3440,
                                          incomeType: "salary" });
      incomeEntry.save((err, incomeEntry) => {
        chai.request(server).get('/api/income/' + incomeEntry.id)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('date');
          res.body.should.have.property('description');
          res.body.should.have.property('income');
          res.body.should.have.property('incomeType');
          res.body.should.have.property('_id').eql(incomeEntry.id);
          done();
        });
      });

    });
  });


  describe('/PUT/:id incomeEntry', () => {
    it('it should UPDATE an incomeEntry given the id', (done) => {
      let incomeEntry = new IncomeEntry({date: "01/28/2018",
                                        description: 'July salary', income: 334,
                                        incomeType: 'dividends'})
      incomeEntry.save((err, incomeEntry) => {
        let changeEntry = {
          date: "02/19/18",
          income: 532,
          incomeType: 'salary',
        };

        chai.request(server).put('/api/income/' + incomeEntry.id).send(changeEntry)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          //res.body.should.have.property('numPages');
          done();
        });
      });
    });
  });

  describe('/DELETE/:id income', () => {
    it('it should DELETE an incomeEntry given the id', (done) => {
      let incomeEntry = new IncomeEntry({date: "02/12/18",
                                        description: 'June salary', income: 713,
                                        incomeType: "dividends"})
      incomeEntry.save((err, incomeEntry) => {
        chai.request(server).delete('/api/income/' + incomeEntry.id)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          done();
        });
      });
    });
  });

});

