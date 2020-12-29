import {
  getMixAcresByTruck,
  getChemicalList,
  getChemicalAmtPerTruck,
  DRY_UNITS,
  convertUnits,
  isDryUnit,
  convertToLargestUnitOfType,
} from './helpers';
import { SprayMix } from './mix';

/**
 * Vertically (across rows) outputs the chemical names for a given mix code
 * Main use of this is to list chemicals in a mix on the Formulation Calculator page
 * @param mixCodeString {string} - Mix code text
 * @returns {string[]} - List of chemical names
 */
function CHEMICALSINMIX(mixCodeString: string): string[] {
  const chemList = getChemicalList();

  const mix = new SprayMix(mixCodeString, chemList);

  return mix.names;
}

/**
 * Outputs to a sheet with headers ['Mix', '214 Acres', '215 Acres', 'Aerial Acres']
 * Calculates these values for all mixes on current weekly spray sheet
 * @returns {string[][]}
 */
function MIXACRESPERTRUCK(): string[][] {
  /**
   * Total acreage object
   * See {@link calculateMixAcresPerTruck} in helpers file
   * @type {object}
   */
  const totalAcreage: object = getMixAcresByTruck();
  const finalArray = [['Mix', '214 Acres', '215 Acres', 'Aerial Acres']];
  for (let mix in totalAcreage) {
    finalArray.push([
      mix,
      totalAcreage[mix]['214'],
      totalAcreage[mix]['215'],
      totalAcreage[mix]['Aerial'],
    ]);
  }

  return finalArray;
}

/**
 * Calculates the cost for a given mix and acreage
 * @param mix {string}
 * @param acreage {number}
 * @returns {number} - Total cost for that application
 */
function MIXCOST(mix: string, acreage: number): number {
  const chemList = getChemicalList();
  const mixObj = new SprayMix(mix, chemList);
  return mixObj.cost * acreage;
}

function TRUCKLOADING() {
  const chemicalAmtsByTruck = getChemicalAmtPerTruck();
  const outputArr = [];
  const vehicleNames = ['214', '215', 'Aerial'];

  for (const chemical in chemicalAmtsByTruck) {
    const allTruckArray = [];
    const name = chemical;
    const originalUnit = chemicalAmtsByTruck[chemical]['unit'];
    const convertedUnit = isDryUnit(originalUnit) ? 'lbm' : 'gal';
    for (const vehicle of vehicleNames) {
      const originalAmt = chemicalAmtsByTruck[chemical][vehicle] || 0;
      const convertedAmt = convertToLargestUnitOfType(
        originalAmt,
        originalUnit
      );
      allTruckArray.push(convertedAmt);
    }
    const combinedTotal = allTruckArray.reduce(
      (sum, currentVal) => (sum += currentVal),
      0
    );
    outputArr.push([name, ...allTruckArray, convertedUnit, combinedTotal]);
  }
  return outputArr;
}

function YTDCOST(): number {
  return 1.0;
}
