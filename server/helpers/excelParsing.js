'use strict'

const Excel = require('exceljs')
// read from a file
const workbook = new Excel.Workbook()
workbook.xlsx.readFile(`${__dirname}/myFile.xlsx`)
  .then(function() {
    const worksheet = workbook.getWorksheet('Sheet1');
    worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
      console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
    })
})

// pipe from stream
const workbook2 = new Excel.Workbook()
// stream.pipe(workbook2.xlsx.createInputStream())

