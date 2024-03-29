namespace SprayMix {
    export class SprayMix {
        private _mixCodes : {base: Array<string>, secondary: Array<string>, insecticide: Array<string>, herbicide: Array<string>};
        public names : Array<string>;
        private _chems : ChemicalList.ChemicalList;
        readonly cost : number;


        public constructor(mixString:string, chemList:ChemicalList.ChemicalList) {
            this._mixCodes = {
                base: [],
                secondary: [],
                insecticide: [],
                herbicide: [],
            };
            /**
             * Array of the mix code split on the periods (split by categories)
             * @type {Array}
             */
            const splitByCategory = mixString.split('.');
            /**
             * Loops over the split codes and adds them to their respective categories
             * in the __mixCodes object. All __mixCodes entries are arrays that have been split on the
             * ampersands to account for multiple codes in a catgeories.
             */
            splitByCategory.forEach((item, index) => {
                if (index >= 4) {
                    throw new Error('Too many categories. Check extra periods!');
                }
                switch (index) {
                    case 0:
                        this._mixCodes['base'] = this.splitAmpersand(item);
                    case 1:
                        this._mixCodes['secondary'] = this.splitAmpersand(item);
                    case 2:
                        this._mixCodes['insecticide'] = this.splitAmpersand(item);
                    case 3:
                        this._mixCodes['herbicide'] = this.splitAmpersand(item);
                }
            });
            this._chems = chemList;
            this.cost = this.calculateCost();
            this.names = this.getChemicalNames();
        }

        private splitAmpersand(str:string) {
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
         * Returns just the names for the chemicals in the mix
         * Private method becauase this is used in the constructor to create the name
         * attribute which is how the names are accessed
         */
        private getChemicalNames() {
            const chemicals = this.getChemicals();
            return chemicals.map(currentChem => currentChem.name);
        }
        /**
         * Traverses the chemical list for all codes in mix object
         * @returns {Array<Chemical>} - list of Chemical objects for all chemicals in mix
         */
        private getChemicals() : Array<Chemical.Chemical> {
            const chemicals = [];
            for (const category in this._mixCodes) {
                const codesForCategory = this._mixCodes[category];
                for (let code of codesForCategory) {
                    const chemsInCode = this._chems.list[category][code];
                    for (let chem in chemsInCode) {
                        chemicals.push(this._chems.list[category][String(code)][chem]);
                    }
                }
            }
            return chemicals;
        }
        public calculateChemicalAmt(chemical: string, acres: number) {
            const finalAmts = this.names.reduce((finalObj, currentChemical) => {
                return { ...finalObj, [currentChemical]: 0 };
            }, {});

            for (const chem of this.getChemicals()) {
                finalAmts[chem.name] = chem.calculateApplicationCost(acres);
            }
            return finalAmts[chemical];
        }
        public getChemical(chemical: string) {
            return this.getChemicals().find(currentChem => currentChem.name === chemical);
        }
    }

    export function newSprayMix(mixString:string, chemList:ChemicalList.ChemicalList) {
        return new SprayMix(mixString, chemList);
    }

}