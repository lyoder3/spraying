/**
 * Helper function module
 * @module helpers
 */

import { couldStartTrivia } from 'typescript';
import { Chemical } from './chemical';
import { ChemicalList } from './chemicalList';
import { SprayMix } from './mix';

/**
 * @param array {string[][]} - A list of rows of the chemcodes data from google sheets
 * @returns The ChemicalList object of all the chemicals in the passed array
 */
function createList(array: string[][]): ChemicalList {
  const list = new ChemicalList();
  array.forEach(row => {
    const [type, typeId, name, unit, rate, cost] = row;
    const currentChem = { name: [name], unit: [unit], rate: [rate] };
    list.addChemical(
      type,
      Number(typeId),
      new Chemical(name, Number(rate), Number(cost), unit)
    );
  });
  return list;
}

/**
 * This function actually creates the ChemicalList object by using the built-in Apps Script
 * functions to collect the chemical codes data from the respective tab on the Google Sheet.
 * Then it runs the **object** property of the ChemicalList which is what contains the actual data
 */
function getChemicalList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const codesSheet = ss.getSheetByName('codes');
  const data = codesSheet.getDataRange().getValues();

  data.shift();

  const chemList = createList(data);
  return chemList.obj;
}

/**
 * @param regex {RegExp} - The regular expression to search for across the sheet names on the current SpreadSheet
 */
function getSheetByRegex(regex: RegExp) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const sheet = sheets.find(current => {
    const currentSheetName = current.getSheetName();
    return regex.test(currentSheetName);
  });
  return sheet;
}

function convertUnits(amt: number, from: string, to: string) {
  const wetUnits = { gal: 128, qt: 32, pt: 16, oz: 1 };
  const dryUnits = { lbm: 16, ozm: 1 };
  if (amt === 0) return 0;
  if (from in dryUnits) {
    return (amt * dryUnits[from]) / dryUnits[to];
  }
  if (from in wetUnits) {
    return (amt * wetUnits[from]) / wetUnits[to];
  }
}
function convertToLargestUnitOfType(amt: number, currentUnit: string) {
  if (isDryUnit(currentUnit)) {
    return Math.ceil(convertUnits(amt, currentUnit, 'lbm'));
  } else {
    return Math.ceil(convertUnits(amt, currentUnit, 'gal'));
  }
}
function isDryUnit(unit: string) {
  const DRY_UNITS = ['lbm', 'ozm'];
  return DRY_UNITS.indexOf(unit) > -1;
}

function calculateCostOfMixes(mixArray: string[]): number {
  const chemList = getChemicalList();
  return mixArray.reduce((sum, currentMix) => {
    const mixObj = new SprayMix(currentMix, chemList);
    const cost = mixObj.cost;
    return sum + cost;
  }, 0);
}

export {
  createList,
  getChemicalList,
  getSheetByRegex,
  convertToLargestUnitOfType,
  calculateCostOfMixes,
  isDryUnit,
};
