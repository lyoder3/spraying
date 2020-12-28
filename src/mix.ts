import { Chemical } from './chemical';

class SprayMix {
  mixCodes: any;
  readonly cost: number;
  chemlist: {};
  readonly names: string[];
  readonly chemicals: Chemical[];

  /**
   * Creates a SprayMix object
   * @param mixString {string} - The mix code to make a mix object for
   * @param chemlist {object} - The chemList object with all chemicals to construct the mix from
   */
  constructor(mixString: string, chemlist: {}) {
    this.mixCodes = {
      base: [],
      secondary: [],
      insecticide: [],
      herbicide: [],
    };

    /**
     * Array of the mix code split on the periods (split by categories)
     * @type {Array}
     */
    const splitByCategory: Array<any> = mixString.split('.');

    /**
     * Loops over the split codes and adds them to their respective categories
     * in the mixCodes object. All mixCodes entries are arrays that have been split on the
     * ampersands to account for multiple codes in a catgeories.
     */
    splitByCategory.forEach((item, index) => {
      if (index >= 4) {
        throw new Error('Too many categories. Check extra periods!');
      }
      switch (index) {
        case 0:
          this.mixCodes['base'] = this.splitAmpersand(item);
        case 1:
          this.mixCodes['secondary'] = this.splitAmpersand(item);
        case 2:
          this.mixCodes['insecticide'] = this.splitAmpersand(item);
        case 3:
          this.mixCodes['herbicide'] = this.splitAmpersand(item);
      }
    });

    this.chemlist = chemlist;

    this.cost = this.calculateCost();
    this.chemicals = this.getChemicals();
    this.names = this.chemicals.map(chemical => chemical.name);
  }

  /**
   * Splits the given string on ampersands
   * @param str {string}
   */
  public splitAmpersand(str: string) {
    return str.split('&');
  }

  /**
   * Calculates the cost of the mix by looping over all the chemicals in the mix
   * and keeping a running sum of their costs per acre
   */
  private calculateCost() {
    const chemicals = this.getChemicals();
    return chemicals.reduce((totalCost, currentChemical) => {
      return (totalCost += currentChemical.cost);
    }, 0);
  }
  /**
   * Traverses the chemical list for all codes in mix object
   * @returns {Array<Chemical>} - list of Chemical objects for all chemicals in mix
   */
  private getChemicals(): Array<Chemical> {
    const chemicals = [];
    for (const category in this.mixCodes) {
      const codesForCategory = this.mixCodes[category];
      for (let code of codesForCategory) {
        const chemsInCode = this.chemlist[category][code];
        for (let chem in chemsInCode) {
          chemicals.push(this.chemlist[category][code][chem]);
        }
      }
    }
    return chemicals;
  }
  public calculateChemicalAmt(chemical: string, acres: number) {
    const finalAmts = this.names.reduce((finalObj, currentChemical) => {
      return { ...finalObj, [currentChemical]: 0 };
    }, {});
    for (const chem of this.chemicals) {
      finalAmts[chem.name] = chem.getAmountOfApplication(acres);
    }
    return finalAmts[chemical];
  }
  public getChemical(chemical: string) {
    return this.chemicals.find(currentChem => currentChem.name === chemical);
  }
}

export { SprayMix };
