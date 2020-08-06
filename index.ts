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

function testChemicalTree() {
    const chemicalTree = convertArrayToTree(fetchChemCodesArray());

    console.log(chemicalTree.find("Manzate"));
}

