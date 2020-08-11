function fetchChemCodesArray() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const chemCodesSheet = ss.getSheetByName("codes");
  return chemCodesSheet.getRange("A2:F").getValues();
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

function GETCHEMICALSFROMCODE(mixCode) {
  const chemicalTree = makeChemicalTree();

  const splitMix = mixCode.toString().match(/(\d)(?:\.)(\d&?\d?)(?:\.)(\d&?\d?)(?:\.)(\d&?\d?)/);

  const justTheCodes = splitMix.slice(1);

  const chemicalNodes = [];

  justTheCodes.forEach((code, index) => {
        const splitByAmp = code.split("&");

        if (code === "0") {
          return;
        } else {
          switch (index) {
            case 0:
              const chemicalsForCode = chemicalTree.root.find("base").find(splitByAmp[0]);
              chemicalNodes.push(chemicalsForCode);
              break;
            case 1:
              if (splitByAmp.length === 1) {
                const chemicalsForCode = chemicalTree.root.find("secondary").find(splitByAmp[0]);
                chemicalNodes.push(chemicalsForCode);
              } else {
                splitByAmp.forEach((code) => {
                  const chemicalsForCode = chemicalTree.root.find("secondary").find(code);
                  chemicalNodes.push(chemicalsForCode);
                })
              }
              break;
            case 2:
              if (splitByAmp.length === 1) {
                const chemicalsForCode = chemicalTree.root.find("insecticide").find(splitByAmp[0]);
                chemicalNodes.push(chemicalsForCode);
              } else {
                splitByAmp.forEach((code) => {
                  const chemicalsForCode = chemicalTree.root.find("insecticide").find(code);
                  chemicalNodes.push(chemicalsForCode);
                })
              }
              break;
            case 3:
              if (splitByAmp.length === 1) {
                const chemicalsForCode = chemicalTree.root.find("herbicide").find(splitByAmp[0]);
                chemicalNodes.push(chemicalsForCode);
              } else {
                splitByAmp.forEach((code) => {
                  const chemicalsForCode = chemicalTree.root.find("herbicide").find(code);
                  chemicalNodes.push(chemicalsForCode);
                })
              }
              break;
            default:
              throw new Error("Array index is out of range");
          }

        }
      }
  )

  const chemicals = [];

  chemicalNodes.forEach((node) => {
    if (node.children.length === 1) {
      chemicals.push([node.children[0].value]);
    } else {
      for (const child of node.children) {
        chemicals.push([child.value]);
      }
    }
  })
  return chemicals;
}

function getUniqueChemicals(uniqueMixes) {
  // uniqueMixes is an array with the acreage for each mix included
  const chemicals = uniqueMixes.map((row) => {
    return GETCHEMICALSFROMCODE(row[0]);
  });
  const arr = [];
  chemicals.forEach((chemList) => chemList.forEach((chem) => arr.push(chem[0])));
  return [...new Set(arr)];
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

