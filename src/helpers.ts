/**
 * Helper function module
 * @module helpers
 */

import { Chemical } from './chemical';
import { ChemicalList } from './chemicalList';

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
 * Calculates the acres per mix per truck and stores in JavaScript object
 * e.g. {"3.0.0.1": {214: 30.21, 215:12.45} ...}
 * This format is easy to work with in the code but needs to be separated out to be ouptut
 * to an actual Google Sheet. Hence why this function is in the "helpers" file.
 */
function calculateMixAcresPerTruck() {
  const data = getWeekSheetData();
  const totalAcreage = {};
  // Pull out acreage and add it to total for that mix and truck
  for (const row of data) {
    const acreage = row[2];
    const truck = row[5];
    const mix = row[6];
    const field = row[1];
    // Skips the row if it's a TOTAL row
    if (field === 'TOTAL') {
      continue;
    }
    totalAcreage[mix] = totalAcreage[mix] || {};
    totalAcreage[mix][truck] = totalAcreage[mix][truck] || 0;
    totalAcreage[mix][truck] += acreage;
  }
  return totalAcreage;
}
/**
 * Special case of the *getSheetByRegex* function that finds the current week's spray intentions and removes
 * the header row before returning all the data
 */

function getWeekSheetData() {
  const weekSheet = getSheetByRegex(/W\d{2}\/\d{2}\/\d{4}/);
  const data = weekSheet.getDataRange().getValues();
  data.shift();
  return data;
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
/**
 * A function that gets the unique chemicals that are required for a given week's sprays
 */
function getUniqueChemicals() {
  const weeklySheet = getWeekSheetData();
  const uniqueMixes = [];
  const uniqueChemicals = [];
}

export {
  createList,
  getChemicalList,
  calculateMixAcresPerTruck,
  getWeekSheetData,
  getSheetByRegex,
  getUniqueChemicals,
};
