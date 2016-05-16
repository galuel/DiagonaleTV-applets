"use strict";

SetHighlightOption(true);
SetGameSelectorOptions("&middot;&middot;&middot;", true, 30, 0, 8, 15, 15, 3, 0); // (head, num, chEvent, chSite, chRound, chWhite, chBlack, chResult, chDate);
SetAutoplayDelay(2000); // milliseconds
SetAutostartAutoplay(false);
SetAutoplayNextGame(false);
SetShortcutKeysEnabled(true);

var pgnData_default = "";
var refreshMinutes_default = 0;
var initialGame_default = "first";
var pieceBaseSize_default = 96;
var pieceFont_default = "uscf";
var theme = new Array();         //        font    background  light     dark    highlight
theme[theme.length] = new Array("black",  "FFFFFF", "000000", "999999", "777777", "000000");
theme[theme.length] = new Array("blue",   "000000", "80B0E0", "E6EDF3", "A0BED8", "596978");
theme[theme.length] = new Array("braun",  "221100", "FFCE9E", "FFCE9E", "D18B47", "663300");
theme[theme.length] = new Array("dark",   "FFFFFF", "000000", "FFCE9E", "D18B47", "663300");
theme[theme.length] = new Array("gray",   "666666", "F4F4F4", "F4F4F4", "E0E0E0", "AAAAAA");
theme[theme.length] = new Array("green",  "333333", "EFF4EC", "EFF4EC", "C6CEC3", "999999");
theme[theme.length] = new Array("light",  "000000", "FFFFFF", "FFCE9E", "D18B47", "663300");
theme[theme.length] = new Array("pink",   "615F54", "EDE8D5", "EDE8D5", "CFCBB3", "F8CCA0");
theme[theme.length] = new Array("white",  "000000", "FFFFFF", "FFFFFF", "E4E4E4", "000000");
theme[theme.length] = new Array("wood",   "663300", "FFFFFF", "FFCC99", "CC9966", "663300");
theme[theme.length] = new Array("yellow", "54110C", "F2D798", "F2D798", "C9AD6F", "54110C");
var colorTheme_indexDefault = 2;
var colorThemeOptions = "";
for (var ii = 0; ii < theme.length; ii++) { colorThemeOptions += "'" + theme[ii][0] + "' | "; }
colorThemeOptions += "'random' ";

var fontSizeRatio_default = 0.8;
var pieceSizeRatio_default = 0.8;
var sizeRatio_min = 0.3;
var sizeRatio_max = 1;
var framePaddingRatio_default = 0;

var thisParamString = window.location.search;

var thisRegExp;

thisRegExp = /(&|\?)(help|h)=(true|t)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  document.write("<pre style='font-size: smaller;'>pgn4web dynamic-frame.html parameters" + "\n" +
    " - pgnData = file.pgn (no default)" + "\n" +
    " - initialGame = initial game (default " + initialGame_default + ")" + "\n" +
    " - live = if set true enables live broadcast with default values (default false)" + "\n" +
    " - refreshMinutes = live broadcast delay (default " + refreshMinutes_default + ")" + "\n" +
    " - refreshDemo = if set true sets live demo mode (default false)" + "\n" +
//    " - pieceBaseSize = size of baseline piece bitmap (default " + pieceBaseSize_default + ")" + "\n" +
    " - pieceFont = 'alpha' | 'merida' | 'uscf' | 'random' (default " + pieceFont_default + ")" + "\n" +
    " - colorTheme = " + colorThemeOptions + "(default '" + theme[colorTheme_indexDefault][0] + "')" + "\n" +
    " - fontColorHex = font color hex code, like FF0000 (default according to the selected color theme)" + "\n" +
    " - backgroundColorHex = page background color hex code, like FF0000 (default according to the selected color theme)" + "\n" +
    " - lightColorHex = light square color hex code, like FF0000 (default according to the selected color theme)" + "\n" +
    " - darkColorHex = dark square color hex code, like FF0000 (default according to the selected color theme)" + "\n" +
    " - highlightColorHex = highlight square color hex code, like FF0000, or 'transparent' for no highlight (default according to the selected color theme)" + "\n" +
    " - showColorFlag = if set true shows a color flag for the side to move (default false)" + "\n" +
    " - showEco = if set true shows the ECO code if available (default false)" + "\n" +
//    " - fontSizeRatio = font size ratio, from " + sizeRatio_min + " to " + sizeRatio_max + " (default " + fontSizeRatio_default + ")" + "\n" +
//    " - pieceSizeRatio = piece size ratio, from " + sizeRatio_min + " to " + sizeRatio_max + " (default " + pieceSizeRatio_default + ")" + "\n" +
//    " - framePaddingRatio = frame padding as a square ratio (default " + framePaddingRatio_default + ")" + "\n" +
//    " - horizontalCentered = if set true centers vertically the chessboard when in horizontal layout (default false)" + "\n" +
    " - bare = if set true shows chessboard only (default false)" + "\n" +
//    " - engineWinPrepareIdle = if set true preloads the analysis board with an empty board; use only for embedded analysis boards
//    " - debug = true | false (default false)" + "\n" +
    " - help = true" + "\n" +
    "</pre>");
}

// undocumented feature
thisRegExp = /(&|\?)(engineWinPrepareIdle|ewpi)=(true|t)(&|$)/i;
var engineWinPrepareIdle = (thisParamString.match(thisRegExp) !== null);

// undocumented feature
thisRegExp = /(&|\?)(debug|d)=(true|t)(&|$)/i;
var debug = (thisParamString.match(thisRegExp) !== null);
var dynamicFrameDebugString = "";

var liveString = "";
thisRegExp = /(&|\?)(live|l)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  liveString = unescape(thisParamString.match(thisRegExp)[3]);
}
if ((liveString == "true") || (liveString == "t")) {
  refreshMinutes_default = 1;
}

var alertFlag = false;
var demoFlag = false;
thisRegExp = /(&|\?)(refreshDemo|rd)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  var refreshDemo = unescape(thisParamString.match(thisRegExp)[3]);
  if ((refreshDemo == "true") || (refreshDemo == "t")) { alertFlag = demoFlag = true; }
}

var refreshMinutes = refreshMinutes_default;
var stepFlag = true;
thisRegExp = /(&|\?)(refreshMinutes|rm)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  refreshMinutes = parseFloat(unescape(thisParamString.match(thisRegExp)[3]));
  if (isNaN(refreshMinutes)) { refreshMinutes = refreshMinutes_default; }
  if (refreshMinutes <= 0) { refreshMinutes = refreshMinutes_default; }
}
if (refreshMinutes) {
  pgnData_default = "live/live.pgn";
  initialGame_default = "\\[\\s*Result\\s*\"\\*\"\\s*\\]";
}

SetInitialHalfmove(refreshMinutes ? "end" : "start", true);

SetLiveBroadcast(refreshMinutes, alertFlag, demoFlag, stepFlag);

var pgnData = pgnData_default;
thisRegExp = /(&|\?)(pgnData|pd)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  pgnData = unescape(thisParamString.match(thisRegExp)[3]);
}
SetPgnUrl(pgnData);

var iniGame = initialGame_default;
thisRegExp = /(&|\?)(initialGame|ig)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  iniGame = unescape(thisParamString.match(thisRegExp)[3]);
}
SetInitialGame(iniGame);

// undocumented feature
var allowedPieceBaseSize = new Array(20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 52, 56, 60, 64, 72, 80, 88, 96, 112, 128, 144, 300);
var pieceBaseSize = pieceBaseSize_default;
thisRegExp = /(&|\?)(pieceBaseSize|pbs)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  var pieceBaseSize_input = unescape(thisParamString.match(thisRegExp)[3]);
  pieceBaseSize = parseInt(pieceBaseSize_input, 10);
  var validPieceBaseSize = false;
  for (var pieceBaseIndex in allowedPieceBaseSize) {
    if (pieceBaseSize === allowedPieceBaseSize[pieceBaseIndex]) {
      validPieceBaseSize = true;
      break;
    }
  }
  if (!validPieceBaseSize) {
    myAlert("warning: invalid pieceBaseSize=" + pieceBaseSize_input + ", reverting to " + pieceBaseSize_default + " as default");
    pieceBaseSize = pieceBaseSize_default;
  }
}

var pieceFont = pieceFont_default;
thisRegExp = /(&|\?)(pieceFont|pf)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  pieceFont = unescape(thisParamString.match(thisRegExp)[3]);
}
if (pieceFont == "a") { pieceFont = "alpha"; }
if (pieceFont == "m") { pieceFont = "merida"; }
if (pieceFont == "u") { pieceFont = "uscf"; }
if (pieceFont == "i") { pieceFont = "igorsvg"; }
if (pieceFont == "s") { pieceFont = "svgchess"; }
if (pieceFont == "t") { pieceFont = "tilesvg"; }
if ((pieceFont == "random") || (pieceFont == "r")) {
  pieceFont = ["alpha", "merida", "uscf"][Math.floor(3 * Math.random())];
}
if ((pieceFont != "alpha") && (pieceFont != "merida") && (pieceFont != "uscf") && (pieceFont != "igorsvg") && (pieceFont != "svgchess") && (pieceFont != "tilesvg")) { pieceFont = pieceFont_default; }
if ((pieceFont == "igorsvg") || (pieceFont == "svgchess") || (pieceFont == "tilesvg")) {
  SetImagePath("pgn4web/images/" + pieceFont);
  SetImageType("svg");
} else {
  SetImagePath("pgn4web/images/" + pieceFont + "/" + pieceBaseSize);
  SetImageType("png");
}

var colorTheme = theme[colorTheme_indexDefault][0];
thisRegExp = /(&|\?)(colorTheme|ct)=([\w]*|[\d]+)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  colorTheme = unescape(thisParamString.match(thisRegExp)[3]);
}
var colorTheme_index = colorTheme_indexDefault;
if (colorTheme == "random") { colorTheme_index = Math.floor(theme.length * Math.random()); }
else if (colorTheme.match(/^\d+$/)) { colorTheme_index = parseInt(colorTheme, 10) % theme.length; colorTheme = theme[colorTheme_index][0]; }
else { for (ii = 0; ii < theme.length; ii++) { if (theme[ii][0] === colorTheme) { colorTheme_index = ii; break; } } }

var fontColorHex_default = theme[colorTheme_index][1];
var backgroundColorHex_default = theme[colorTheme_index][2];
var lightColorHex_default = theme[colorTheme_index][3];
var darkColorHex_default = theme[colorTheme_index][4];
var highlightColorHex_default = theme[colorTheme_index][5];

var fontColorHex = fontColorHex_default;
thisRegExp = /(&|\?)(fontColorHex|fch)=([A-F0-9]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  fontColorHex = unescape(thisParamString.match(thisRegExp)[3]);
}

var backgroundColorHex = backgroundColorHex_default;
thisRegExp = /(&|\?)(backgroundColorHex|bch)=([A-F0-9]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  backgroundColorHex = unescape(thisParamString.match(thisRegExp)[3]);
}

var lightColorHex = lightColorHex_default;
thisRegExp = /(&|\?)(lightColorHex|lch)=([A-F0-9]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  lightColorHex = unescape(thisParamString.match(thisRegExp)[3]);
}

var darkColorHex = darkColorHex_default;
thisRegExp = /(&|\?)(darkColorHex|dch)=([A-F0-9]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  darkColorHex = unescape(thisParamString.match(thisRegExp)[3]);
}

var highlightColorHex = highlightColorHex_default;
thisRegExp = /(&|\?)(highlightColorHex|hch)=(t|transparent)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  highlightColorHex = "";
  clearShortcutSquares("D", "7");
} else {
  thisRegExp = /(&|\?)(highlightColorHex|hch)=([A-F0-9]*)(&|$)/i;
  if (thisParamString.match(thisRegExp) !== null) {
    highlightColorHex = unescape(thisParamString.match(thisRegExp)[3]);
  }
}

var showColorFlagString = "false";
thisRegExp = /(&|\?)(showColorFlag|scf)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  showColorFlagString = unescape(thisParamString.match(thisRegExp)[3]);
}
var showColorFlag = ((showColorFlagString == "true") || (showColorFlagString == "t"));

var showEcoString = "false";
thisRegExp = /(&|\?)(showEco|se)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  showEcoString = unescape(thisParamString.match(thisRegExp)[3]);
}
var showEco = ((showEcoString == "true") || (showEcoString == "t"));

// undocumented feature
var fontSizeRatio = fontSizeRatio_default;
thisRegExp = /(&|\?)(fontSizeRatio|fsr)=([0-9.]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  fontSizeRatio = parseFloat(unescape(thisParamString.match(thisRegExp)[3]));
  if (isNaN(fontSizeRatio) || (fontSizeRatio < sizeRatio_min) || (fontSizeRatio > sizeRatio_max)) { fontSizeRatio = fontSizeRatio_default; }
}

// undocumented feature
var pieceSizeRatio = pieceSizeRatio_default;
thisRegExp = /(&|\?)(pieceSizeRatio|psr)=([0-9.]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  pieceSizeRatio = parseFloat(unescape(thisParamString.match(thisRegExp)[3]));
  if (isNaN(pieceSizeRatio) || (pieceSizeRatio < sizeRatio_min) || (pieceSizeRatio > sizeRatio_max)) { pieceSizeRatio = pieceSizeRatio_default; }
}

// undocumented feature
var framePaddingRatio = framePaddingRatio_default;
thisRegExp = /(&|\?)(framePaddingRatio|fpr)=([0-9.]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  framePaddingRatio = parseFloat(unescape(thisParamString.match(thisRegExp)[3]));
  if (isNaN(framePaddingRatio)) { framePaddingRatio = framePaddingRatio_default; }
}

// undocumented feature
var horizontalCenteredString = "";
thisRegExp = /(&|\?)(horizontalCentered|hc)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  horizontalCenteredString = unescape(thisParamString.match(thisRegExp)[3]);
}
var horizontalCentered = ((horizontalCenteredString == "true") || (horizontalCenteredString == "t"));

var bareString = "";
thisRegExp = /(&|\?)(bare|b)=([^&]*)(&|$)/i;
if (thisParamString.match(thisRegExp) !== null) {
  bareString = unescape(thisParamString.match(thisRegExp)[3]);
}
var bare = ((bareString == "true") || (bareString == "t"));


function myRulesLength(sheet) {
  if (sheet.cssRules) { return sheet.cssRules.length; }
  if (sheet.rules) { return sheet.rules.length; }
  return null;
}

function myInsertRule(sheet, selector, declaration) {
  if (sheet.insertRule) { sheet.insertRule(selector + "{ " + declaration + " }", myRulesLength(sheet)); }
  else if (sheet.addRule) { sheet.addRule(selector, declaration); }
}

function myDeleteRule(sheet, index) {
  if (sheet.deleteRule) { sheet.deleteRule(index); }
  else if (sheet.removeRule) { sheet.removeRule(index); }
}

function toggleColorFlag() {
  var theObj;
  showColorFlag = !showColorFlag;
  if (!showColorFlag) {
    if (theObj = document.getElementById("whiteColorFlag")) { theObj.style.display = "none"; }
    if (theObj = document.getElementById("whiteColorFlagFiller")) { theObj.style.display = "none"; }
    if (theObj = document.getElementById("blackColorFlag")) { theObj.style.display = "none"; }
    if (theObj = document.getElementById("blackColorFlagFiller")) { theObj.style.display = "none"; }
  }
  myOnResize();
}

function toggleShowEco() {
  if (showEco = !showEco) {
    fixHeaderItem("ECO", "GameECO", "ECO");
    fixHeaderItem("ECO", "GameECOFiller", "ECO");
  } else {
    var theObj;
    if (theObj = document.getElementById("GameECO")) { theObj.innerHTML = theObj.title = ""; }
    if (theObj = document.getElementById("GameECOFiller")) { theObj.innerHTML = theObj.title = ""; }
  }
}

var horizontalLayout;
function myOnResize() {
  var ww, wh;
  if (window.innerWidth && window.innerHeight) { ww = window.innerWidth; wh = window.innerHeight; }
  else if (document.documentElement && document.documentElement.clientWidth) { ww = document.documentElement.clientWidth; wh = document.documentElement.clientHeight; }
  else if (document.body && document.body.clientWidth) { ww = document.body.clientWidth; wh = document.body.clientHeight; }
  else { return false; }

  var squareSize;
  if (bare) {
    horizontalLayout = (ww >= wh);
    squareSize = Math.min(ww / (8 + 2 * framePaddingRatio), wh / (8 + 2 * framePaddingRatio));
  } else {
    var squareSize_H = Math.min(ww / (16 / 9), wh) / (8 + 2 * framePaddingRatio);
    var squareSize_V = Math.min(ww, wh / (16 / 9)) / (8 + 2 * framePaddingRatio);
    horizontalLayout = (squareSize_H >= squareSize_V);
    squareSize = horizontalLayout ? squareSize_H : squareSize_V;
  }
  var framePadding = Math.floor(framePaddingRatio * squareSize);
  squareSize = Math.floor(squareSize);
  var bodyHeight = wh - 2 * framePadding;
  var lineHeight;
  if (horizontalLayout) {
    lineHeight = Math.floor(squareSize * 8 / 16.5);
  } else {
    lineHeight = Math.floor(Math.min((wh - framePadding * 2 - squareSize * 8) / (11 + 6/2), squareSize * 8 / 16.5));
  }
  var fontSize = Math.floor(lineHeight * fontSizeRatio);
  if (fontSize > lineHeight) { fontSize = lineHeight; }
  var squareBorderWidth = Math.min(Math.ceil(squareSize / 50), 3);
  var bareSquareSize = squareSize - 2 * squareBorderWidth;
  var pieceSize = Math.floor(squareSize * pieceSizeRatio);
  if (pieceSize > bareSquareSize) { pieceSize = Math.floor(bareSquareSize); }
  var headerContainerWidth = horizontalLayout ? ww - 2 * framePadding - 9 * squareSize + Math.floor(3 * lineHeight / 4) : ww - 2 * framePadding;

  if (document.styleSheets.length === 0) { return false; }

  var sheet = document.styleSheets[0];
  var oldRules = myRulesLength(sheet);

  myInsertRule(sheet, "html", "overflow: hidden;");
  myInsertRule(sheet, "body", "-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none; -webkit-text-size-adjust: none; -moz-text-size-adjust: none; -ms-text-size-adjust: none; -o-text-size-adjust: none; text-size-adjust: none; -webkit-touch-callout: none; height: " + bodyHeight + "px; padding: 0px; margin: " + framePadding + "px; white-space: nowrap; overflow: hidden; color: #" + fontColorHex + "; background-color: #" + backgroundColorHex + "; font-family: sans-serif; line-height: " + lineHeight + "px; font-size: " + fontSize + "px;");
  myInsertRule(sheet, "a", "text-decoration: none; color: #" + fontColorHex + ";");
  if (bare) {
    myInsertRule(sheet, ".boardTable", "margin-left: " + Math.floor((ww - 2 * framePadding - 8 * squareSize) / 2) + "px; margin-top: " + Math.floor((wh - 2 * framePadding - 8 * squareSize) / 2) + "px;");
  } else {
    if (horizontalLayout) { myInsertRule(sheet, ".boardTable", "float: left;" + (horizontalCentered ? " margin-top: " + Math.floor((wh - 2 * framePadding - 8 * squareSize) / 2) + "px;" : "")); }
    else { myInsertRule(sheet, ".boardTable", "margin-left: " + Math.floor((ww - 2 * framePadding - 8 * squareSize) / 2) + "px;"); }
  }
  myInsertRule(sheet, ".pieceImage", "cursor: pointer; width: " + pieceSize + "px; height: " + pieceSize + "px;");
  myInsertRule(sheet, ".whiteSquare", "width: " + bareSquareSize + "px; height: " + bareSquareSize + "px; border-style: solid; border-width: " + squareBorderWidth + "px;" + "background-color: #" + lightColorHex + "; border-color: #" + lightColorHex + ";");
  myInsertRule(sheet, ".blackSquare", "width: " + bareSquareSize + "px; height: " + bareSquareSize + "px; border-style: solid; border-width: " + squareBorderWidth + "px;" + "background-color: #" + darkColorHex + "; border-color: #" + darkColorHex + ";");
  myInsertRule(sheet, ".highlightWhiteSquare", "width: " + bareSquareSize + "px; height: " + bareSquareSize + "px; border-style: solid; border-width: " + squareBorderWidth + "px;" + "background-color: #" + lightColorHex + "; border-color: #" + (highlightColorHex ? highlightColorHex : lightColorHex) + ";");
  myInsertRule(sheet, ".highlightBlackSquare", "width: " + bareSquareSize + "px; height: " + bareSquareSize + "px; border-style: solid; border-width: " + squareBorderWidth + "px;" + "background-color: #" + darkColorHex + "; border-color: #" + (highlightColorHex ? highlightColorHex : darkColorHex) + ";");
  myInsertRule(sheet, ".headerContainer", "width: " + headerContainerWidth + "px; white-space: nowrap; overflow: hidden;" + (horizontalLayout ? " float: right; text-align: left;" + (horizontalCentered ? " margin-top: " + Math.floor((wh - 2 * framePadding - 8 * squareSize) / 2) + "px;" : "") : " text-align: center;"));
  if (LiveBroadcastDelay > 0) {
    myInsertRule(sheet, ".gameButtons", "display: none;");
  } else {
    myInsertRule(sheet, ".liveStatusLine", "display: none;");
    if (horizontalLayout) { myInsertRule(sheet, ".gameButtons", "width: " + (headerContainerWidth - lineHeight) + "px; " + "text-align: left;"); }
    var buttonCss = "cursor: pointer; margin: 0px; padding: 0px; width: " + Math.floor(3 * lineHeight / 2) + "px !important; height: " + lineHeight + "px; color: #" + fontColorHex + "; border-style: none; -moz-appearance: none; -webkit-appearance: none; background-color: #" + backgroundColorHex + "; font-family: sans-serif; line-height: " + lineHeight + "px; font-size: " + fontSize + "px;";
    myInsertRule(sheet, ".buttonControl", buttonCss);
    myInsertRule(sheet, ".buttonControlPlay", buttonCss);
    myInsertRule(sheet, ".buttonControlStop", buttonCss);
    myInsertRule(sheet, ".buttonControlSpace", "margin: 0px; padding: 0px; width: " + Math.floor(lineHeight / 4) + "px !important;");
  }
  myInsertRule(sheet, ".colorFlag", "height: " + Math.floor(0.45 * fontSize) + "px; width: " + Math.floor(0.45 * fontSize) + "px; border-width: 1px; border-color: #" + fontColorHex + "; border-style: solid; margin-bottom: " + Math.floor(0.1 * fontSize) + "px; margin-left: " + Math.floor(5 * lineHeight / 9) + "px; margin-right: " + Math.floor(5 * lineHeight / 9) + "px;");
  myInsertRule(sheet, ".leftRightSpacing", "margin-left: " + Math.floor(lineHeight / 2) + "px; margin-right: " + Math.floor(lineHeight / 2) + "px;");
  if (!horizontalLayout) {
    var variableSpacerLineHeight = Math.floor(Math.min((wh - framePadding * 2 - squareSize * 8 - lineHeight * 11) / 6, lineHeight / 2));
    var variableSpacerFontSize = Math.floor(variableSpacerLineHeight * 0.8);
    myInsertRule(sheet, ".variableSpacer", "line-height: " + variableSpacerLineHeight + "px; font-size: " + variableSpacerFontSize + "px;");
  }
  myInsertRule(sheet, ".gameLiveStatusExtraInfoLeft", horizontalLayout ? "display: none;" : "");
  myInsertRule(sheet, ".showGameListLink", "padding-right: " + squareSize + "px; padding-left: " + (horizontalLayout ? 0 : squareSize) + "px;");
  var gameListFontHorizontalRatio = 28;
  var gameListFontVerticalRatio = 24;
  var gameListFontSize = Math.floor(Math.min((ww - framePadding * 2) / gameListFontHorizontalRatio, (wh - framePadding * 2) / gameListFontVerticalRatio));
  gameListLineHeight = Math.floor(1.9 * gameListFontSize);
  var gameListPadding = Math.floor(gameListLineHeight / 2);
  gameListBodyHeight = gameListLineHeight * Math.floor((wh - 2 * framePadding - gameListLineHeight - 2.5 * gameListPadding) / gameListLineHeight);
  gameListNumGames = Math.round(gameListBodyHeight / gameListLineHeight);
  myInsertRule(sheet, ".gameList", "display: none; position: absolute; overflow: hidden; font-size: " + gameListFontSize + "px; line-height: " + gameListLineHeight + "px;");
  myInsertRule(sheet, ".gameListHeader", "overflow: hidden; height: " + gameListLineHeight + "px; width: " + (ww - 2 * framePadding) + "px; padding-top: " + gameListPadding + "px; padding-bottom: " + gameListPadding + "px;");
  myInsertRule(sheet, ".gameListHeaderItem", "display: inline-block; overflow: hidden; text-align: center; width: " + ((ww - 2 * framePadding) / 7) + "px;");
  myInsertRule(sheet, ".gameListHeaderButton", "cursor: pointer; display: inline-block; min-width: " + ((ww - 2 * framePadding) / 14) + "px;");
  myInsertRule(sheet, ".gameListBody", "height: " + gameListBodyHeight + "px; width: " + (ww - 2 * framePadding) + "px; overflow-x: hidden; overflow-y: auto; scrollbar-base-color: #" + backgroundColorHex + "; -webkit-overflow-scrolling: touch; overflow-scrolling: touch;");
  myInsertRule(sheet, ".gameListBodyItems", "");
  var gameListMarginSpacing = Math.floor((gameListFontSize * gameListFontHorizontalRatio) * (6 / 32) / 5);
  var gameListPlayerSpacing = Math.floor((gameListFontSize * gameListFontHorizontalRatio) * (9 / 32));
  myInsertRule(sheet, ".gameListRow", "cursor: pointer;");
  myInsertRule(sheet, ".gameListRowSelected", "color: #" + backgroundColorHex + "; background-color: #" + fontColorHex + ";");
  myInsertRule(sheet, ".gameListBodyItemsPlayer", "overflow: hidden; width: " + gameListPlayerSpacing + "px; margin-left: " + gameListMarginSpacing + "px; margin-right: " + gameListMarginSpacing + "px;");
  myInsertRule(sheet, ".gameListBodyItemsPlayerWhite", "text-align: right; margin-left: " + (2 * gameListMarginSpacing) + "px;");
  myInsertRule(sheet, ".gameListBodyItemsPlayerBlack", "");
  myInsertRule(sheet, ".gameListBodyItemsResult", "text-align: center; min-width: 5ex; margin-left: 0px; margin-right: 0px;");
  myInsertRule(sheet, ".gameListBodyItemsEventRound", "margin-left: " + (2 * gameListMarginSpacing) + "px; margin-right: " + (2 * gameListMarginSpacing) + "px;");

  for (var ii = 0; ii < oldRules; ii++) { myDeleteRule(sheet, 0); }

  var theObj;

  if (theObj = document.getElementById("boardTable")) {
    theObj.style.height = (squareSize * 8) + "px";
    theObj.style.width = (squareSize * 8) + "px";
  }

  if (theObj = document.getElementById("HeaderContainer")) { theObj.style.display = bare ? "none" : document.getElementById("GameBoard").style.display; }

  if (!firstStart) {
    fixColorFlag();
    fixECO();
  }

  dynamicFrameDebugString = "fw=" + ww + " fh=" + wh + " fp=" + framePadding + " fs=" + fontSize + " ss=" + squareSize + " sb=" + squareBorderWidth + " ps=" + pieceSize + " pbs=" + pieceBaseSize;

  return pieceSize;
}


function customFunctionOnCheckLiveBroadcastStatus() {
  updateBareShortcut();
}

function customDebugInfo() {
  var dbg = "";
  if (highlightColorHex) { dbg += "highlightOption=" + highlightOption + " "; }
  if (LiveBroadcastDelay === 0) { dbg += "initialHalfmove=" + initialHalfmove + " "; }
  dbg += "showColorFlag=" + showColorFlag + " " + "showEco=" + showEco;
  if (debug) { dbg += " " + dynamicFrameDebugString; }
  return dbg;
}

var textSelectOptionsLast = "none";
var currentGameLast = -1;
var gameListBodyHeight = -1;
var gameListLineHeight = -1;
var gameListNumGames = -1;
function fillGameList(force) {
  var theObj;
  if (theObj = document.getElementById("GameSelSelect")) { textSelectOptions = theObj.innerHTML; }
  if ((currentGame !== currentGameLast) || (textSelectOptions !== textSelectOptionsLast) || (numberOfGames == 1)) { // textSelectOptions not updated when there's only one game
    currentGameLast = currentGame;
    textSelectOptionsLast = textSelectOptions;
    force = true;
    if (theObj = document.getElementById("GameListBodyItems")) {
      var thisNum, thisResult, thisGameTitle1, thisGameTitle2;
      var text = "<table width='100%' cellspacing='0' cellpadding='0' border='0'>";
      for (thisNum = 0; thisNum < numberOfGames; thisNum++) {
        thisGameTitle1 = gameWhite[thisNum] || "";
        thisGameTitle1 += (thisGameTitle1 && gameBlack[thisNum]) ? "   " : "";
        thisGameTitle1 += gameBlack[thisNum] || "";
        thisGameTitle1 += (thisGameTitle1 && gameResult[thisNum]) ? "   " : "";
        thisGameTitle1 += gameResult[thisNum] || "";
        thisGameTitle2 =  gameEvent[thisNum] || "";
        thisGameTitle2 += (thisGameTitle2 && gameRound[thisNum]) ? "   " : "";
        thisGameTitle2 += gameRound[thisNum] || "";
        text += "<tr class='gameListRow" + (currentGame === thisNum ? " gameListRowSelected" : "") + "' onclick='selectGameList(" + thisNum + ");' title='" + thisGameTitle1 + (thisGameTitle1 && thisGameTitle2 ? "\n" : "") + thisGameTitle2 + "'>";
        text += "<td><div class='gameListBodyItemsPlayer gameListBodyItemsPlayerWhite'>" + gameWhite[thisNum] + "</div></td>";
        if ((gameWhite[thisNum] !== "") || (gameBlack[thisNum] !== "") || (gameResult[thisNum] != "*")) {
          thisResult = gameResult[thisNum];
          if (thisResult == "1/2-1/2") { thisResult = "1/2"; }
          else if (thisResult.length > 3) { thisResult = "?"; }
          else if (thisResult == "*") { thisResult = "&lowast;"; }
        } else {
          thisResult = "";
        }
        text += "<td><div class='gameListBodyItemsResult'>" + thisResult + "</div></td>";
        text += "<td><div class='gameListBodyItemsPlayer gameListBodyItemsPlayerBlack'>" + gameBlack[thisNum] + "</div></td>";
        text += "<td width='100%'>";
        if (gameEvent[thisNum] || gameRound[thisNum]) {
          text += "<div class='gameListBodyItemsEventRound'>" + gameEvent[thisNum] + ((gameEvent[thisNum] && gameRound[thisNum]) ? " &nbsp;&nbsp;&nbsp;&nbsp; " : "") + gameRound[thisNum] + "</div>";
        }
        text += "</td></tr>";
      }
      text += "</table>";
      theObj.innerHTML = text;
    }
  }
  if (force) {
    setTimeout("autoscrollGameListBody(-1);", 111);
  }
}

function autoscrollGameListBody(thisGame) {
  var theObj = document.getElementById("GameListBody");
  if (theObj) {
    if (thisGame == -1) {
      thisGame = currentGame + 1 - Math.ceil(gameListNumGames / 2);
    }
    theObj.scrollLeft = 0;
    theObj.scrollTop = thisGame * gameListLineHeight;
  }
}

var oldHeaderContainerDisplay;
function showGameList() {
  if (numberOfGames < 2) { return; }
  var theObj = document.getElementById("GameList");
  if ((theObj) && (theObj.style.display == "block")) { return; }
  disableShortcutKeysAndStoreStatus();
  fillGameList(true);
  if (theObj = document.getElementById("HeaderContainer")) {
    oldHeaderContainerDisplay = theObj.style.display;
    theObj.style.display = "none";
  }
  if (theObj = document.getElementById("GameBoard")) { theObj.style.display = "none"; }
  if (theObj = document.getElementById("GameList")) { theObj.style.display = "block"; }
}

function selectGameList(gameNum) {
  var theObj = document.getElementById("GameList");
  if ((theObj) && (theObj.style.display === "")) { return; }
  if (gameNum != -1) { Init(gameNum); }
  if (theObj = document.getElementById("GameList")) { theObj.style.display = ""; }
  if (theObj = document.getElementById("GameBoard")) { theObj.style.display = ""; }
  if (theObj = document.getElementById("HeaderContainer")) { theObj.style.display = oldHeaderContainerDisplay; }
  restoreShortcutKeysStatus();
}

function toggleGameListHorizontalScroll() {
  var theObj = document.getElementById("GameListBody");
  if (theObj) { theObj.scrollLeft = theObj.scrollLeft ? 0 : theObj.offsetWidth; }
}

var liveBroadcastUpdateTicker = 0;
var previousPlyNumber = -1;
function customFunctionOnPgnTextLoad() {
  var noGamesLoaded = (numberOfGames == 1) && (PlyNumber === 0) && (StartPly === 0) && (!gameWhite[0]) && (!gameBlack[0]) && (!gameResult[0]) && (!gameFEN[0]);
  if (LiveBroadcastDelay > 0) {
    if (previousPlyNumber !== PlyNumber) {
      previousPlyNumber = PlyNumber;
      liveBroadcastUpdateTicker++;
    }
    document.title = liveBroadcastUpdateTicker + "." + LiveBroadcastGamesRunning + "." + numberOfGames + " live broadcast" + (demoFlag ? " demo" : "");
  } else {
    if (noGamesLoaded) { document.title = alertNum ? "PGN data error" : "chess games"; }
    else { document.title = numberOfGames + " game" + (numberOfGames == 1 ? "" : "s"); }
  }

  fillGameList(false);
  if (theObj = document.getElementById("ShowGameListLink")) {
    theObj.title = "select from " + numberOfGames + " games";
    var text = "", ii;
    for (ii = 0; ii <= 4 + Math.log(numberOfGames)/Math.LN2; ii++) { text += "&middot; "; }
    text += "&middot;";
    theObj.innerHTML = text;
  }
  if (theObj = document.getElementById("ShowGameList")) {
    theObj.style.visibility = numberOfGames > 1 ? "visible" : "hidden";
  }
  if (numberOfGames > 1) {
    boardShortcut("F5", "show games list", function(t,e){ showGameList(); });
  } else {
    boardShortcut("F5", "", function(t,e){});
  }
  if (engineWinPrepareIdle) {
    showEngineAnalysisBoard(true, true);
    engineWinPrepareIdle = false;
  }

<!-- AppCheck: customFunctionOnPgnTextLoad -->

}

function fixHeaderItem(tag, objectId, label) {
  var theObj = document.getElementById(objectId);
  if (theObj) {
    var tagValue = simpleHtmlentitiesDecode(tag ? customPgnHeaderTag(tag, objectId) : theObj.innerHTML);
    if (tagValue) {
      theObj.title = label + ": " + tagValue;
      theObj.className = "leftRightSpacing";
    } else {
      theObj.title = label;
      theObj.className = "";
    }
  }
}

function customFunctionOnPgnGameLoad() {
  myOnResize();
  fixHeaderItem(null, "GameEvent", "event");
  fixHeaderItem(null, "GameSite", "site");
  fixHeaderItem(null, "GameDate", "date");
  fixHeaderItem(null, "GameRound", "round");
  fixHeaderItem(null, "GameWhite", "white player");
  fixHeaderItem(null, "GameBlack", "black player");
  fixHeaderItem(null, "GameResult", "result");
  fixHeaderItem("Section", "GameSection", "section");
  fixHeaderItem("Stage", "GameStage", "stage");
  fixHeaderItem("WhiteTitle", "GameWhiteTitle", "white title");
  fixHeaderItem("WhiteElo", "GameWhiteElo", "white elo");
  fixHeaderItem("WhiteTeam", "GameWhiteTeam", "white team");
  fixHeaderItem("BlackTitle", "GameBlackTitle", "black title");
  fixHeaderItem("BlackElo", "GameBlackElo", "black elo");
  fixHeaderItem("BlackTeam", "GameBlackTeam", "black team");
  if (showEco) {
    fixHeaderItem("ECO", "GameECO", "ECO");
    fixHeaderItem("ECO", "GameECOFiller", "ECO");
  }
  updateBareShortcut();
  var theObj = document.getElementById("GameResult");
  if (theObj) { theObj.innerHTML = theObj.innerHTML.replace(/\*/g, "&lowast;").replace(/(\d)-(\d)/g, "$1<span style='font-weight:normal;'>&nbsp;-&nbsp</span>$2"); }

  var livePlaceholderDetected = (LiveBroadcastDelay > 0) && (PlyNumber === 0) && (StartPly === 0) && (!gameWhite[currentGame]) && (!gameBlack[currentGame]) && (!gameFEN[currentGame]);
  if (theObj = document.getElementById("GameResultLine")) { theObj.style.display = livePlaceholderDetected ? "none" : ""; }
  if (theObj = document.getElementById("GameWhiteClockLine")) { theObj.style.display = livePlaceholderDetected ? "none" : ""; }
  if (theObj = document.getElementById("GameBlackClockLine")) { theObj.style.display = livePlaceholderDetected ? "none" : ""; }

<!-- AppCheck: customFunctionOnPgnGameLoad -->

}

function customFunctionOnMove() {
  var extraMoves = 2;

  document.getElementById("GamePrevMoves").innerHTML = "";
  document.getElementById("GameCurrMove").innerHTML = "";
  document.getElementById("GameNextMoves").innerHTML = "";
  var theObj = document.getElementById("GamePrevMoves");
  var thisPly = Math.max(CurrentPly - extraMoves - 1, StartPly);
  if (thisPly > StartPly) { theObj.innerHTML += "... "; }
  for (; thisPly < Math.min(CurrentPly + extraMoves, StartPly + PlyNumber); thisPly++) {
    if (thisPly == CurrentPly) {
      theObj = document.getElementById("GameNextMoves");
    }
    if (thisPly % 2 === 0) { theObj.innerHTML += Math.floor(1 + thisPly / 2) + ". "; }
    if (thisPly == CurrentPly - 1) {
      theObj = document.getElementById("GameCurrMove");
    }
    theObj.innerHTML += Moves[thisPly] + " ";
  }
  if (thisPly < StartPly + PlyNumber) { theObj.innerHTML += "..."; }

  fixHeaderItem(null, "GameWhiteClock", "white clock");
  fixHeaderItem(null, "GameBlackClock", "black clock");
  fixColorFlag();
  fixECO();

<!-- AppCheck: customFunctionOnMove -->

}


function fixColorFlag() {
  var theObj;

  if (showColorFlag) {
    var whiteFlagPadding = (horizontalLayout || ((theObj = document.getElementById("GameWhiteClock")) && (theObj.innerHTML)));
    if (theObj = document.getElementById("whiteColorFlag")) {
      theObj.style.display = "inline-block";
      theObj.style.visibility = CurrentPly % 2 ? "hidden" : "visible";
    }
    if (theObj = document.getElementById("whiteColorFlagFiller")) {
      theObj.style.display = whiteFlagPadding ? "inline-block" : "none";
      theObj.style.visibility = "hidden";
    }
    var blackFlagPadding = (horizontalLayout || ((theObj = document.getElementById("GameBlackClock")) && (theObj.innerHTML)));
    if (theObj = document.getElementById("blackColorFlag")) {
      theObj.style.display = "inline-block";
      theObj.style.visibility = CurrentPly % 2 ? "visible" : "hidden";
    }
    if (theObj = document.getElementById("blackColorFlagFiller")) {
      theObj.style.display = blackFlagPadding ? "inline-block" : "none";
      theObj.style.visibility = "hidden";
    }
  }
}

function fixECO() {
  var theObj = document.getElementById("GameECOFiller");
  if (theObj) {
    theObj.style.display = horizontalLayout ? "none" : "";
  }
}

function searchPlayer(name, FideId) {
  if (typeof(openFidePlayerUrl) == "function") { openFidePlayerUrl(name, FideId); }
}

function customShortcutKey_Shift_1() {
  searchPlayer(gameWhite[currentGame], customPgnHeaderTag('WhiteFideId'));
}

function customShortcutKey_Shift_2() {
  searchPlayer(gameBlack[currentGame], customPgnHeaderTag('BlackFideId'));
}

function customShortcutKey_Shift_3() {
  toggleBareChessboard();
}

var showFullscreenChessboardTimeout = null;
function customShortcutKey_Shift_4() {
  if (showFullscreenChessboardTimeout) {
    clearTimeout(showFullscreenChessboardTimeout);
    showFullscreenChessboardTimeout = null;
    showFullscreenChessboard(true);
  } else {
    showFullscreenChessboardTimeout = setTimeout("showFullscreenChessboardTimeout = false; showFullscreenChessboard(false);", 333);
  }
}

function customShortcutKey_Shift_5() {
  SetHighlight(!highlightOption);
}

function customShortcutKey_Shift_6() {
  toggleShowEco();
}

function customShortcutKey_Shift_7() {
  toggleColorFlag();
}

// customShortcutKey_Shift_8 defined by engine.js
// customShortcutKey_Shift_9 defined by engine.js
// customShortcutKey_Shift_0 defined by engine.js

function toggleBareChessboard() {
  bare = !bare;
  myOnResize();
  updateBareShortcut();
}

function showFullscreenChessboard(newWin) {
  var win = window;
  if (newWin) { win.open(location.href.replace(/(pieceBaseSize|pbs)=[^&]*/gi, ""), "_blank"); }
  else {
    while (win.parent !== win) { win = win.parent; }
    win.location.href = location.href.replace(/(pieceBaseSize|pbs)=[^&]*/gi, "");
  }
}

function toggleInitialHalfmove(reset2default) {
  SetInitialHalfmove(reset2default ? 'start' : (initialHalfmove == 'end' ? 'start' : 'end'), true);
  GoToMove(initialHalfmove == 'end' ? StartPlyVar[0] + PlyNumberVar[0] : StartPlyVar[0], 0);
}


boardShortcut("E7", "toggle ECO code", function(t,e){ toggleShowEco(); });

// disable FlipBoard functionality, otherwise remember to redefine FlipBoard() to include myOnResize()
var warnedFlipBoard = false;
function FlipBoard() { if (!warnedFlipBoard) { myAlert("warning: flip board functionality disabled", false, true); warnedFlipBoard = true; } }


boardShortcut("F7", "toggle side to move flag", function(t,e){ toggleColorFlag(); });

if (LiveBroadcastDelay === 0) {
  boardShortcut("G6", "toggle initial halfmove", function(t,e){ toggleInitialHalfmove(e.shiftKey); });
}

if ((window.parent !== window) && (!engineWinPrepareIdle)) {
  boardShortcut("H5", "show fullscreen chessboard", function(t,e){ showFullscreenChessboard(e.shiftKey); });
}

function updateBareShortcut() {
  boardShortcut("G5", bare ? "unhide game info\n\n" + gameTooltipInfo() : "maximize chessboard and hide game info", function(t,e){ toggleBareChessboard(); });
}

function meaningfulHeader(tagValue) {
  return ((typeof(tagValue) == "string") && (tagValue.match(/[^\s?.-]/)));
}

function gameTooltipInfo() {
  var headerValue;
  var str = "game " + (currentGame+1) + " of " + numberOfGames;
  if (LiveBroadcastDelay > 0) { str += ",  " + LiveBroadcastGamesRunning + " live"; }
  if (meaningfulHeader(gameEvent[currentGame])) { str+= "\nevent:  " + gameEvent[currentGame];
    if (meaningfulHeader(headerValue = customPgnHeaderTag("Section"))) { str+= "  " + headerValue; }
    if (meaningfulHeader(headerValue = customPgnHeaderTag("Stage"))) { str+= "  " + headerValue; }
  }
  if (meaningfulHeader(gameSite[currentGame])) { str+= "\nsite:  " + gameSite[currentGame]; }
  if (meaningfulHeader(gameDate[currentGame])) { str+= "\ndate:  " + gameDate[currentGame]; }
  if (meaningfulHeader(gameRound[currentGame])) { str+= "\nround:  " + gameRound[currentGame]; }
  if (meaningfulHeader(gameWhite[currentGame])) { str+= "\nwhite:  " + gameWhite[currentGame];
    if (meaningfulHeader(headerValue = customPgnHeaderTag("WhiteTitle"))) { str+= "  " + headerValue; }
    if (meaningfulHeader(headerValue = customPgnHeaderTag("WhiteElo"))) { str+= "  " + headerValue; }
    if (meaningfulHeader(headerValue = customPgnHeaderTag("WhiteTeam"))) { str+= "  " + headerValue; }
  }
  if (meaningfulHeader(gameBlack[currentGame])) { str+= "\nblack:  " + gameBlack[currentGame];
    if (meaningfulHeader(headerValue = customPgnHeaderTag("BlackTitle"))) { str+= "  " + headerValue; }
    if (meaningfulHeader(headerValue = customPgnHeaderTag("BlackElo"))) { str+= "  " + headerValue; }
    if (meaningfulHeader(headerValue = customPgnHeaderTag("BlackTeam"))) { str+= "  " + headerValue; }
  }
  if (meaningfulHeader(gameResult[currentGame])) { str+= "\nresult:  " + gameResult[currentGame]; }
  return str;
}

function searchNextEventRound(backward) {
  searchPgnGame('\\[\\s*Event\\s*"(?!' + fixRegExp(gameEvent[currentGame]) + '"\\s*\\])|\\[\\s*Section\\s*"(?!' + fixRegExp(customPgnHeaderTag("Section")) + '"\\s*\\])|\\[\\s*Stage\\s*"(?!' + fixRegExp(customPgnHeaderTag("Stage")) + '"\\s*\\])|\\[\\s*Round\\s*"(?!' + fixRegExp(gameRound[currentGame]) + '"\\s*\\])', backward);
}

var lastOrientation;
var lastOrientationTimeout = null;
simpleAddEvent(window, "orientationchange", function() {
  var theObj;
  if (typeof(window.orientation) == "undefined") { return; }
  if (window.orientation === lastOrientation) { return; }
  var lastOrientationTimeoutString = "lastOrientationTimeout = null;";
  if (lastOrientationTimeout) {
    clearTimeout(lastOrientationTimeout);
    if ((theObj = document.getElementById("GameList")) && (theObj.style.display)) { selectGameList(-1); }
    lastOrientationTimeoutString += " refreshPgnSource();";
  } else {
    setTimeout("autoscrollGameListBody(-1);", 111);
  }
  lastOrientationTimeout = setTimeout(lastOrientationTimeoutString, 1800);
  lastOrientation = window.orientation;
});
