function fetchChemCodesArray() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const chemCodesSheet = ss.getSheetByName("codes");
  return chemCodesSheet.getRange("A2:F").getValues();
}

function convertArrayToTree(arr) {
  const chemicalTree = new Tree("root");
  arr.forEach((row) => {
    const [group, groupId, name] = row.slice(0, 3);
    const chemData = row.slice(3);

    chemicalTree.add(row.slice(0, 3).join("/"))

    const groupNode = chemicalTree.root.children.filter(child => child.value === group)[0];
    const groupIdNode = groupNode.children.filter(child => child.value === groupId)[0];
    const chemicalNode = groupIdNode.children.filter(child => child.value === name)[0];

    chemData.forEach((item) => {
      chemicalNode.addNode(item)
    })
  })
  return chemicalTree;
}

function GETCHEMICALSFROMCODE(mixCode) {
  const chemicalTree = convertArrayToTree(fetchChemCodesArray());

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
