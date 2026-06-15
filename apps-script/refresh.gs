/**
 * Claude Stock Analyzer — Google Sheets Auto-Refresh
 * 
 * Forces GOOGLEFINANCE formulas to recalculate every 15 minutes
 * so the sheet stays current even when not open in a browser.
 * 
 * Setup: Run createTrigger() once to activate the schedule.
 * The forceRefresh() function will then run automatically.
 * 
 * Author: Praveen Gaur
 * Repo: https://github.com/pravngaur/claude-stock-analyzer
 */

function forceRefresh() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Temporarily clear and restore cell F2 to force full recalculation
  // of all GOOGLEFINANCE formulas across the sheet
  var cell = sheet.getActiveSheet().getRange("F2");
  var formula = cell.getFormula();
  
  cell.setValue("refreshing...");
  SpreadsheetApp.flush();
  Utilities.sleep(500);
  cell.setFormula(formula);
  SpreadsheetApp.flush();
  
  Logger.log("Sheet refreshed at: " + new Date());
}

function createTrigger() {
  // Delete any existing triggers first to avoid duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  // Create new trigger — runs every 15 minutes
  // Note: 15 minutes is the minimum interval Google Apps Script supports
  ScriptApp.newTrigger("forceRefresh")
    .timeBased()
    .everyMinutes(15)
    .create();
    
  Logger.log("Trigger created — forceRefresh will run every 15 minutes");
}

function deleteTrigger() {
  // Run this if you want to stop the auto-refresh
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  Logger.log("All triggers deleted — auto-refresh stopped");
}
