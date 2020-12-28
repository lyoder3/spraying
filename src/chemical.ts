/**
 * See the tutorials section of this documentation for how to use the class
 */
class Chemical {
  /**
   * @property Name of chemical
   */
  name: string;
  /**
   * @property Per acre applcication rate
   */
  rate: number;
  /**
   * @property Cost per acre
   */
  cost: number;
  /**
   * @property Hidden unit property. Uses getters and setters defined below
   */
  private _unit: string;
  /**
   * @static List of allowed units
   */
  static UNITS = ['ozm', 'lbm', 'gal', 'qt', 'pt', 'oz', 'N/A'];

  /**
   * @param name {string} - Name of chemical
   * @param rate {number} - Rate that it is applied per acre in units passed
   * @param cost {number} - Cost per acre
   * @param unit {string} - Units that must match one of those defined in the private variable
   */

  constructor(
    name: string,
    rate: number = 0,
    cost: number = 0,
    unit: string = 'N/A'
  ) {
    this.name = name;
    this.rate = rate;
    this.cost = cost;
    this._unit = unit;
  }
  /**
   * @param val {string}
   * Takes a unit string and checks if it is valid before setting
   */
  set unit(val: string) {
    if (Chemical.UNITS.indexOf(val) >= 0) {
      this._unit = val;
    } else {
      console.log("WARNING: INVALID UNIT\nSetting unit to 'N/A'");
      console.log(`Unit must be one of the following: ${Chemical.UNITS}`);
      this._unit = 'N/A';
    }
  }
  /**
   * This is setup this way so you can't set the unit to an invalid value.
   * The setter function checks that the passed unit is valid before saving to the actual unit property
   */
  get unit(): string {
    return this._unit;
  }
  /**
   * @param acres {number} - Acres chemical applied to
   * @returns {number} - The total cost of the application
   */
  getCostOfApplication(acres: number) {
    return this.cost * acres;
  }
}

export { Chemical };
