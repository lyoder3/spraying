import { Chemical } from './chemical';

class ChemicalList {
  obj: any;

  constructor() {
    this.obj = {};
  }
  /**
   * Adds a chemical with given parameters to the overall list of chemicals
   * @param chemType {string} - The type/category of chemical "base", "insecticide", etc.
   * @param typeId {number} - The category id/number for the chemical <br> i.e. Manzate and Cohere is a 2 in the base category
   * @param chemical {Chemical} - The Chemical object to add
   */
  public addChemical(chemType: string, typeId: number, chemical: Chemical) {
    this.obj[chemType] = this.obj[chemType] || {};
    this.obj[chemType][typeId] = this.obj[chemType][typeId] || {};
    this.obj[chemType][typeId] = {
      ...this.obj[chemType][typeId],
      [chemical.name]: chemical,
    };
  }
  /**
   * @param chemType {string} - The category of chemical to retrieve
   * @param typeId {number} - The number in said category of the chemical
   * @returns An object that contains the actual Chemical objects of all the chemicals for said code
   */
  public getChemical(chemType: string, typeId: number) {
    return this.obj[chemType][typeId];
  }
}

export { ChemicalList };
