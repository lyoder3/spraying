namespace Chemical {

export enum Unit {
  ozm,
  lbm,
  gal,
  qt,
  pt,
  oz,
  NA
}
export class Chemical {
    /**
     * @param name {string} - Name of chemical
     * @param rate {number} - Rate that it is applied per acre in units passed
     * @param cost {number} - Cost per acre
     * @param unit {string} - Units that must match one of those defined in the private variable
     */

    /**
     * @static List of allowed units
     */

    public name : string;
    readonly rate : number;
    readonly cost : number;
    private _unit : Unit;

    public constructor(name:string, rate:number = 0, cost:number = 0, unit:string = 'NA') {
        this.name = name;
        this.rate = rate;
        this.cost = cost;
        this._unit = Unit[unit];
    }

    /**
     * @param val {string}
     * Takes a unit string and checks if it is valid before setting
     */

    set unit (val:string) {
      if (Unit[val]) this.unit = Unit[val];
      else {
        console.log("WARNING: INVALID UNIT\N SETTING UNIT TO N/A");
        console.log(`Unit must be on of the following: ${Unit}`)
        this._unit = Unit.NA;
      }
    }

    /**
     * This is setup this way so you can't set the unit to an invalid value.
     * The setter function checks that the passed unit is valid before saving to the actual unit property
     */

    get unit() : string {
      return Unit[this._unit];
    }

    /**
     * @param acres {number} - Acres chemical applied to
     * @returns {number} - The total cost of the application
     */
    public calculateApplicationCost(acres:number) : number {
      return this.cost * acres;
    }

}

export function newChemical (name:string, rate:number = 0, cost:number = 0, unit:string = 'NA') : Chemical {
  return new Chemical(name, rate, cost, unit);
}
}