import { Chemical } from './chemical';
import { ChemicalList } from './chemicalList';
import { SprayMix } from './mix';

// Has a few tests for creating the chemical list and calculating mix stats
const ss = SpreadsheetApp.getActiveSpreadsheet();
const codesSheet = ss.getSheetByName('codes');
const data = codesSheet.getDataRange().getValues();

data.shift();

function createList(array: string[][]): ChemicalList {
  const finList = new ChemicalList();
  array.forEach(row => {
    const [type, typeId, name, units, rate, cost] = row;
    finList.addChemical(
      type,
      Number(typeId),
      new Chemical(name, Number(rate), Number(cost), units)
    );
  });
  return finList;
}

function testList() {
  const finalList = createList(data);
  const testCode1 = '11&12.1&2.1&2&3.1&2';
  const testCode2 = '1.0.1&3.1';
  const testCode3 = '1.0.0.0';
  const testCode4 = '1&2&3&4&5.0.0.0';

  const testCodes = [testCode1, testCode2, testCode3, testCode4];

  for (let mix of testCodes) {
    const currentMix = new SprayMix(mix, finalList.obj);
    console.log(currentMix.names, currentMix.cost);
  }
}
