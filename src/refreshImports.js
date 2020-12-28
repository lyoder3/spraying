/**
 * Run on a schedule to recalculate the cell that triggers the weather data import
 * functions to update
 */
function refreshImports() {

    // The lock prevents other changes that may be occurring on the sheet
    // From interfering with the update
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(5000))
        // If the lock fails, then the function just returns null meaning it doesn't work
        // This is good becasue we don't want changes users may be making to interfere with the
        // changes this script makes
        return;

    // Unique identifier from url for the spreadsheet
    const id = "1-ARhvMQn9OrzGqoc74cUZN1zAQHASZBKUiWdgnFjCWA";
    // opens the spreadsheet
    const ss = SpreadsheetApp.openById(id);
    // Get the weather station sheet
    const sheet = ss.getSheetByName("Weather");
    // Updates the value of J5 with a random integer
    sheet.getRange("J5").setValue(Math.round(Math.random() * 100));
    // releases the lock, allowing other changes to continue going through as normal
    lock.releaseLock();
}
