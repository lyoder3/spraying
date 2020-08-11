function fetchChemCodesArray() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const chemCodesSheet = ss.getSheetByName("codes");
  return chemCodesSheet.getRange(2, 1, chemCodesSheet.getLastRow() - 1, 6).getValues();
}

function convertArrayToTree(arr) {
  const chemicalTree = new Tree("root");
  arr.forEach((row) => {
    chemicalTree.add(row.slice(0, 3).join("/"))
  })
  return chemicalTree;
}

function makeChemicalTree() {
  return convertArrayToTree(fetchChemCodesArray());
}

function getChemicalsForCode(splitByAmpersand: string[], chemicalTree: Tree, category: "base" | "secondary" | "insecticide" | "herbicide", chemicals: any[]) {
  const categoryNode = chemicalTree.find(category);
  splitByAmpersand.forEach((code) => {
    const chemicalsForCode = categoryNode.find(code).children;
    chemicalsForCode.forEach((chemical) => chemicals.push(chemical.value));
  })
  return chemicals;
}

function testGetChemicals() {
  Logger.log(GETCHEMICALSFROMCODE("2.0.0.0"));
}

function GETCHEMICALSFROMCODE(mixCode) {
  const chemicalTree = makeChemicalTree();

  const splitMix = mixCode.toString().match(/(\d)(?:\.)(\d&?\d?)(?:\.)(\d&?\d?)(?:\.)(\d&?\d?)/);

  const justTheCodes = splitMix.slice(1);

  return justTheCodes.reduce((chemicals, code, index) => {
    const splitByAmpersand = code.split("&");

    if (code === "0") {
      return chemicals;
    } else {
      switch (index) {
        case 0:
          return getChemicalsForCode(splitByAmpersand, chemicalTree, "base", chemicals);
          break;
        case 1:
          return getChemicalsForCode(splitByAmpersand, chemicalTree, "secondary", chemicals);
          break;
        case 2:
          return getChemicalsForCode(splitByAmpersand, chemicalTree, "insecticide", chemicals);
          break;
        case 3:
          return getChemicalsForCode(splitByAmpersand, chemicalTree, "herbicide", chemicals);
          break;
        default:
          throw new Error("Array index is out of range");
      }
    }
  }, []);
}

function getUniqueChemicals(uniqueMixes) {
  // uniqueMixes is an array with the acreage for each mix included
  const chemicals = uniqueMixes.map((row) => {
    return GETCHEMICALSFROMCODE(row[0]);
  });
  const arr = [];
  chemicals.forEach((mix) => {
    mix.forEach(chemical => arr.push(chemical))
  });
  return [...new Set(arr)];
}

function testGetUniqueChemicals() {
  const uniquMixe = [["2.2.0.0", "302.26", "69.94", "0"], ["7.6.1.4&5", "34.92", "77.6", "0"]];
  Logger.log(getUniqueChemicals(uniquMixe));
}

function calculateTotalVolumes(uniqueMixAcreageArray) {
  const chemicalObj = getUniqueChemicals(uniqueMixAcreageArray).reduce((obj, chemical) => ({
    ...obj,
    [chemical]: {214: 0, 215: 0, aerial: 0}
  }), {});

  for (const row of uniqueMixAcreageArray) {
    const mix = row[0];
    const twoFourteenAcres = row[1];
    const twoFifteenAcres = row[2];
    const aerialAcres = row[3];

    const chemicals = GETCHEMICALSFROMCODE(mix);
    for (const chemical of chemicals) {
      chemicalObj[chemical][214] += twoFourteenAcres;
      chemicalObj[chemical][215] += twoFifteenAcres;
      chemicalObj[chemical].aerial += aerialAcres;
    }
  }
  return Object.keys(chemicalObj).map((key) => [key, chemicalObj[key][214], chemicalObj[key][215], chemicalObj[key].aerial]);
}

