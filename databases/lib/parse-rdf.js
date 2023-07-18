'use strict'

const cheerio = require('cheerio')

module.exports = (rdf) => {
  const $ = cheerio.load(rdf)

  const book = {}

  book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '')
  book.title = $('dcterms\\:title').text()
  book.authors = $('pgterms\\:agent pgterms\\:name')
    .toArray()
    .map((element) => $(element).text())
    
  // Brackers introduce a css attribute selector and the '$=' indicates that 
  // we want elements whose 'rdf:resource' attribute ends with '/LCSH'
  book.subjects = $('[rdf\\:resource$="/LCSH"]')
    .parent()
    .find('rdf\\:value')
    .toArray()
    .map((element) => $(element).text())

  // Extract LCC field
  book.lcc = $('[rdf\\:resource$="/LCC"]')
    .parent()
    .find('rdf\\:value')
    .text()

  return book
}
