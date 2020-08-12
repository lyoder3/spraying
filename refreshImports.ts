function refreshImports() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;

  const id = "1-ARhvMQn9OrzGqoc74cUZN1zAQHASZBKUiWdgnFjCWA";
  const ss = SpreadsheetApp.openById(id);
  // Get the weather station sheet
  const sheet = ss.getSheetByName("Weather");
  // Use a blank cell here, set it to whatever you want
  sheet.getRange("J5").setValue(Math.round(Math.random() * 100));

  lock.releaseLock();
}