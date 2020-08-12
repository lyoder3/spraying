function onEdit(e) {
  const timezone = "GMT-4";
  const timestamp_format = "MM-dd-yyyy hh:mm:ss"; // Timestamp Format.
  const timeStamp = Utilities.formatDate(
      new Date(),
      timezone,
      timestamp_format);
  const updateColName = "Applicator";

  const sheet = e.range.getSheet();

  const editColumn = e.range.getColumn();
  const row = e.range.getRow();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
  const updateColIndex = headers[0].indexOf(updateColName) + 1;
  if (row > 1) {
    if (editColumn == updateColIndex) {
      const dateCell = sheet.getRange(row, updateColIndex + 1);
      const windSpeedCell = dateCell.offset(0, 1);
      const tempCell = windSpeedCell.offset(0, 1);
      dateCell.setValue(timeStamp);
      const town = sheet.getRange(row, headers[0].indexOf("Town") + 1).getValue();
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const weatherSheet = ss.getSheetByName("Weather");
      const weatherData = weatherSheet.getDataRange().getValues();
      for (let i = 0; i < weatherData.length; i++) {
        if (weatherData[i][0] == town) {
          const temp = weatherData[i][2];
          const wind = weatherData[i][3];
          tempCell.setValue(temp);
          windSpeedCell.setValue(wind);
        }
      }
    }
  }
}