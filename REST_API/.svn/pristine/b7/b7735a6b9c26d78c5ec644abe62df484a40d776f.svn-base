const XLSX = require('xlsx')

const expense = XLSX.readFile('expense.xlsx')

const firstWSheetName = expense.SheetNames[expense.SheetNames.length - 1];
const firstWSheet = expense.Sheets[firstWSheetName];

firstWSheet['A4'].v = '2020.02.01 ~ 2020.02.29';

console.log(firstWSheet['A4'].v);