'use strict'

const parseRDF = require('../lib/parse-rdf.js')
const fs = require('fs')
const expect = require('chai').expect
const rdf = fs.readFileSync(`${__dirname}/pg132.rdf`)

describe('parseRDF', () => {
    it('should be a function', () => {
        expect(parseRDF).to.be.a('function')
    })
})