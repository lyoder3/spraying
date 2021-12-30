namespace ChemicalList {
export class ChemicalList {
  list : {
    [key:string] : {
      [key: string] : {
        [key: string] : Chemical.Chemical
      }
    }
  }
  public constructor() 
  {
    this.list = {};
  }
  /**
   * Adds a chemical with given parameters to the overall list of chemicals
   * @param chemType {string} - The type/category of chemical "base", "insecticide", etc.
   * @param typeId {string} - The category id/number for the chemical <br> i.e. Manzate and Cohere is a 2 in the base category
   * @param chemical {Chemical} - The Chemical object to add
   */
  public addChemical(chemType:string, typeId:string, chemical:Chemical.Chemical) 
  {
    this.list[chemType] = this.list[chemType] || {};
    this.list[chemType][typeId] = this.list[chemType][typeId] || {};
        this.list[chemType][typeId] = {
            ...this.list[chemType][typeId],
            [chemical.name]: chemical,
        };
  }

  /**
   * Finds a chemical(s) by name or by type and ID
   * @param chemType {string} - The category of chemical to retrieve
   * @param typeId {string} - The number in said category of the chemical
   * @returns An object that contains the actual Chemical objects of all the chemicals for said code
   */
    public getChemical(name:string = '', chemType:string = null, typeId:string=null) : Chemical.Chemical {
        if (name.length > 0) {
          for (const cat in this.list) {
            for (const id in this.list[cat]) {
              for (const chemical in this.list[cat][id]) {
                if (name === chemical) {
                  return this.list[cat][id][chemical];
                }
              }
            }
            return null;
          }
        }
    }
}

export function newChemicalList () : ChemicalList {
  return new ChemicalList();
}
}