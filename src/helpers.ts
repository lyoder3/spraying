/**
 * Helper function module
 * @module helpers
 */

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
 * Calculates the acres per mix per truck and stores in JavaScript object
 * e.g. {"3.0.0.1": {214: 30.21, 215:12.45} ...}
 * This format is easy to work with in the code but needs to be separated out to be ouptut
 * to an actual Google Sheet. Hence why this function is in the "helpers" file.
 */
function getMixAcresByTruck() {
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
function getChemicalAmtPerTruck() {
  const weeklySheet = getWeekSheetData();
  const chemList = getChemicalList();
  const mixAcresByTruck = getMixAcresByTruck();
  const chemicalAmtByTruck = {};
  const truckList = ['214', '215', 'Aerial'];

  for (const truck of truckList) {
    for (const mix in mixAcresByTruck) {
      const mixObj = new SprayMix(mix, chemList);
      const chemicals = mixObj.names;
      chemicals.forEach(chemical => {
        if (mixAcresByTruck[mix][truck] > 0) {
          const chemicalObj = mixObj.getChemical(chemical);
          chemicalAmtByTruck[chemical] = chemicalAmtByTruck[chemical] || {};
          chemicalAmtByTruck[chemical][truck] =
            chemicalAmtByTruck[chemical][truck] || 0;
          const newAmt = Math.ceil(
            chemicalObj.getAmountOfApplication(mixAcresByTruck[mix][truck]) *
              1.1
          );
          chemicalAmtByTruck[chemical][truck] += newAmt;
          chemicalAmtByTruck[chemical]['unit'] =
            chemicalAmtByTruck[chemical]['unit'] || chemicalObj.unit;
        }
      });
    }
  }
  return chemicalAmtByTruck;
}

export {
  createList,
  getChemicalList,
  getMixAcresByTruck,
  getWeekSheetData,
  getSheetByRegex,
  getChemicalAmtPerTruck,
};
