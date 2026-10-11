/**
 * Friendsgiving sign-up backend.
 *
 * Lives inside your Google Sheet (Extensions → Apps Script). The website reads
 * the "Spread" and "Event" tabs through doGet and adds new rows through doPost.
 * Guests can only add rows. You edit or delete anything right in the Sheet.
 */

const SPREAD_TAB = 'Spread';
const EVENT_TAB = 'Event';
const COURSES = ['Appetizers', 'Mains', 'Sides', 'Desserts', 'Drinks'];

/** Run once from the Apps Script editor to create the tabs and default event text. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let spread = ss.getSheetByName(SPREAD_TAB) || ss.insertSheet(SPREAD_TAB);
  if (spread.getLastRow() === 0) {
    spread.appendRow(['Added', 'Name', 'Party size', 'Dish', 'Course']);
    spread.setFrozenRows(1);
    spread.getRange('A1:E1').setFontWeight('bold');
  }
  const courseRule = SpreadsheetApp.newDataValidation().requireValueInList(COURSES, true).build();
  spread.getRange('E2:E1000').setDataValidation(courseRule);

  let event = ss.getSheetByName(EVENT_TAB) || ss.insertSheet(EVENT_TAB);
  if (event.getLastRow() === 0) {
    const rows = [
      ['Field', 'Value', 'What it changes'],
      ['lead', 'Please join us for', 'Small line above the title'],
      ['title', 'Friendsgiving', 'Script title in the invite'],
      ['day', 'SATURDAY', 'Day line'],
      ['date', 'NOVEMBER 7TH, 2026', 'Date line'],
      ['time', 'at 1 o’clock in the afternoon', 'Time line'],
      ['calendarTitle', "Friendsgiving at Kristine & Daniel's", 'Calendar event name'],
      ['start', '2026-11-07T13:00', 'Calendar start (YYYY-MM-DDTHH:MM)'],
      ['end', '2026-11-07T17:00', 'Calendar end (YYYY-MM-DDTHH:MM)'],
      ['location', '4198 Rosenbaum Ave', 'Calendar location'],
      ['details', "Please bring a dish you're thankful for.", 'Calendar notes'],
    ];
    event.getRange(1, 1, rows.length, 3).setNumberFormat('@').setValues(rows);
    event.setFrozenRows(1);
    event.getRange('A1:C1').setFontWeight('bold');
    event.autoResizeColumns(1, 3);
  }

  const blank = ss.getSheetByName('Sheet1');
  if (blank && ss.getSheets().length > 2 && blank.getLastRow() === 0) ss.deleteSheet(blank);
}

function doGet() {
  return json({ entries: readEntries(), event: readEvent() });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.website) return json({ ok: true }); // spam trap filled in: pretend it worked

    const name = clean(body.name, 60);
    const dish = clean(body.dish, 80);
    const course = COURSES.indexOf(body.course) >= 0 ? body.course : '';
    const party = Math.min(12, Math.max(1, Math.round(Number(body.party) || 1)));
    if (!name || !dish || !course) return json({ ok: false, error: 'Name, dish and course are required.' });

    lock.waitLock(10000);
    sheet(SPREAD_TAB).appendRow([new Date(), name, party, dish, course]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: 'Could not save. Try again.' });
  } finally {
    lock.releaseLock();
  }
}

function readEntries() {
  const sh = sheet(SPREAD_TAB);
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 5).getDisplayValues()
    .filter(r => r[1] && r[3])
    .map(r => ({ name: r[1], party: Number(r[2]) || 1, dish: r[3], course: r[4] }));
}

function readEvent() {
  const sh = sheet(EVENT_TAB);
  const out = {};
  if (sh.getLastRow() < 2) return out;
  sh.getRange(2, 1, sh.getLastRow() - 1, 2).getDisplayValues()
    .forEach(([k, v]) => { if (k && v) out[k.trim()] = v.trim(); });
  return out;
}

function sheet(name) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error('Missing tab "' + name + '". Run setup() once.');
  return sh;
}

/** Trim, cap length, and stop text from being read as a spreadsheet formula. */
function clean(value, max) {
  let s = String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
