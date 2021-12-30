namespace Utils {
    interface ChemTruck {
        [chemical: string] : {
            [key:string] : number|string;
            units : string
        } | {}
    }

    const ACREAGE_REGEX = new RegExp("Acre", "i");
    const TRUCK_REGEX = new RegExp("Truck", "i");
    const MIX_REGEX = new RegExp("Mix","i");


    /**
     * @param array {string[][]} - A list of rows of the chemcodes data from google sheets
     * @returns The ChemicalList object of all the chemicals in the passed array
     */
    export function createList(array:string[][]) {
        const list = ChemicalList.newChemicalList();
        array.forEach(row => {
            const [type, typeId, name, unit, rate, cost] = row;
            list.addChemical(type, String(typeId), Chemical.newChemical(name, Number(rate), Number(cost), unit));
        });
        return list;
    }

    /**
     * This function actually creates the ChemicalList object by using the built-in Apps Script
     * functions to collect the chemical codes data from the respective tab on the Google Sheet.
     */
    export function getChemicalList() {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const codesSheet = ss.getSheetByName('codes');
        const data = codesSheet.getDataRange().getValues();
        data.shift();
        const chemList = createList(data);
        return chemList;
    }

    /**
     * Special case of the *getSheetByRegex* function that finds the current week's spray intentions and removes
     * the header row before returning all the data
     */
    export function getWeekSheetData() {
        const weekSheet = getSheetByRegex(/W\d{2}\/\d{2}\/\d{4}/);
        const data = weekSheet.getDataRange().getValues();
        data.shift();
        return data;
    }

    /**
     * @param regex {RegExp} - The regular expression to search for across the sheet names on the current SpreadSheet
     */
    export function getSheetByRegex(regex:RegExp) {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheets = ss.getSheets();
        const sheet = sheets.find(current => {
            const currentSheetName = current.getSheetName();
            return regex.test(currentSheetName);
        });
        return sheet;
    }
    export function isDryUnit(unit: string) {
        const DRY_UNITS = ['lbm', 'ozm'];
        return DRY_UNITS.indexOf(unit) > -1;
    }
    export function convertUnits(amt: number, from: string, to: string) {
        const wetUnits = { gal: 128, qt: 32, pt: 16, oz: 1 };
        const dryUnits = { lbm: 16, ozm: 1 };
        if (amt === 0) return 0;
        if (from in dryUnits) {
            return (amt * dryUnits[from]) / dryUnits[to];
        }
        if (from in wetUnits) {
            return (amt * wetUnits[from]) / wetUnits[to];
        }
    }
    export function convertToLargestUnitOfType(amt:number, unit:string) {
        if (isDryUnit(unit)) {
            return Math.ceil(convertUnits(amt, unit, 'lbm'));
        }
        return Math.ceil(convertUnits(amt, unit, 'gal'));
    }
    export function getChemicalAmtPerTruck() : ChemTruck
    {
        // Find the spray sheet and pull its data
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const spraySheetRegex = new RegExp("W\d{1,2}*");
        const sheets = ss.getSheets();
        const spraySheet = sheets.find((sheet) => spraySheetRegex.test(sheet.getName()));
        const data = spraySheet.getDataRange().getValues();

        // Extract headers and find the indices of the columns we care about
        const header = data.shift();
        const columns = findColumns(header);
        

        // Prepare to loop over the sheet and extract acreage by chemical and by truck 
        const output:ChemTruck = {};
        const chems = getChemicalList();
        
        for (const row of data) {
            const [acreage, mix, truck] = [Number(row[columns.acreage]), row[columns.mix].toString() as string, row[columns.truck].toString() as string];
            const mixObj = SprayMix.newSprayMix(mix,chems);
            for (const chemical of mixObj.names) {
                const chemObj = mixObj.getChemical(chemical);
                output[chemical] = output[chemical] || {};
                output[chemical][truck] = output[chemical][truck] += (chemObj.rate*acreage*1.1) || chemObj.rate*acreage;
                output[chemical]['units'] = chemObj.unit;
            }
        }
        return output;
    }
    function findColumns(header: Array<any>) {
        const columns = {acreage: -1, mix: -1, truck: -1};
        
        for (let i = 0; i < header.length; i++) {
            if (ACREAGE_REGEX.test(header[i].toString())) columns["acreage"] == i;
            if (TRUCK_REGEX.test(header[i].toString())) columns["truck"] == i;
            if (MIX_REGEX.test(header[i].toString())) columns["mix"] == i;

            if (columns.acreage > 0 && columns.mix > 0 && columns.truck > 0) {
                break;
            }else if (i == header.length - 1) {
                for (const col in columns) {
                    if (columns[col] < 0) console.error(`${col} is missing or not matched!`);
                }
            }
        }
        return columns;
    }
}