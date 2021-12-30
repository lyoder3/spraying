/**
 * Vertically (across rows) outputs the chemical names for a given mix code
 * Main use of this is to list chemicals in a mix on the Formulation Calculator page
 * @param mixCodeString {string} - Mix code text
 * @returns {string[]} - List of chemical names
 */
function CHEMICALSINMIX(mixCodeString:string) {
    const chemList = Utils.getChemicalList();
    const mix = SprayMix.newSprayMix(mixCodeString, chemList);
    return mix.names;
}

/**
 * Calculates the cost for a given mix and acreage
 * @param mix {string}
 * @param acreage {number}
 * @returns {number} - Total cost for that application
 */
function MIXCOST(mix: string, acreage: number): number {
  const chemList = Utils.getChemicalList();
  const mixObj = SprayMix.newSprayMix(mix, chemList);
  return mixObj.cost * acreage;
}

function TRUCKLOADING() {
  const chemicalAmtsByTruck = Utils.getChemicalAmtPerTruck();
  const outputArr = [];
  const trucks = ['214', '215','Aerial']

  for (const chemical in chemicalAmtsByTruck) {
    const unit = chemicalAmtsByTruck[chemical]['units'] as string;
    const convertedUnit = Utils.isDryUnit(unit) ? 'lbm':'gal';
    const chemicalRow: (string|number)[] = [chemical];

    for (const vehicle of trucks) {
      const amount = chemicalAmtsByTruck[chemical][vehicle] as number;
      const convertedAmount = Utils.convertToLargestUnitOfType(amount, unit);
      chemicalRow.push(convertedAmount);
    }
    chemicalRow.push(convertedUnit);
    outputArr.push(chemicalRow);
  }
  return outputArr;
}
