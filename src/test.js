function testList() {
    const finalList = getChemicalList();
    const testCode1 = '11&12.1&2.1&2&3.1&2';
    const testCode2 = '1.0.1&3.1';
    const testCode3 = '1.0.0.0';
    const testCode4 = '1&2&3&4&5.0.0.0';
    const testCode5 = 'A.0.0.1';
    const testCodes = [testCode1, testCode2, testCode3, testCode4, testCode5];
    for (let mix of testCodes) {
        const currentMix = new SprayMix(mix, finalList);
        console.log(currentMix.names, currentMix.cost);
    }
}
