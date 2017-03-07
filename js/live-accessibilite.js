   "use strict";

   SetPgnUrl("livepgn/games.pgn"); // enable this one for real live broadcast using the live-grab.sh script
// SetPgnUrl("demoLiveGames.pgn"); // enable this one for live broadcast demo

   SetImagePath("pgn4web/images");
// SetImageType("png");
   SetHighlightOption(false); // true or false

   SetGameSelectorOptions(null, true, 0, 0, 0, 15, 15, 3, 0); // (head, num, chEvent, chSite, chRound, chWhite, chBlack, chResult, chDate);

   SetCommentsIntoMoveText(false);
   SetCommentsOnSeparateLines(false);
   SetAutoplayDelay(1000); // milliseconds
   SetAutostartAutoplay(false);
// SetAutoplayNextGame(false); // if set, move to the next game at the end of the current game during autoplay
   var initialGame = getParameterByName('initialGame');
   SetInitialGame(initialGame); // number of game to be shown at load, from 1 (default); values (keep the quotes) of "first", "last", "random" are accepted; other string values assumed as PGN search string

// SetInitialVariation(0); // number for the variation to be shown at load, 0 (default) for main variation

   // make sure each time a game is loaded the last played move is shown
   SetInitialHalfmove("end", true); // halfmove number to be shown at load, 0 (default) for start position; values (keep the quotes) of "start", "end", "random", "comment" (go to first comment or variation), "variation" (go to the first variation) are also accepted. Second parameter if true applies the setting to every selected game instead of startup only

   SetShortcutKeysEnabled(true);

   // set live broadcast; parameters are delay (refresh delay in minutes, 0 means no broadcast, default 0) alertFlag (if true, displays debug error messages, default false, this flag highlight top left square put it to false to stop this) demoFlag (if true starts broadcast demo mode, default false) stepFlag (if true, autoplays updates in steps, default false) endlessFlag (if true, keeps polling for new moves even after all games are finished)
   SetLiveBroadcast(0.25, false, false);  // enable this one for real live broadcast
// SetLiveBroadcast(0.25, true, true); // enable this one for live broadcast demo

function searchPlayer(name, FideId) {
  if (typeof(openFidePlayerUrl) == "function") { openFidePlayerUrl(name, FideId); }
}

function customFunctionOnPgnTextLoad() { document.getElementById('numGm').innerHTML = numberOfGames; }

function customFunctionOnPgnGameLoad() {
  var theObj;
  document.getElementById('currGm').innerHTML = currentGame+1;
  customPgnHeaderTag('TimeControl', 'GameTimeControl');
  customPgnHeaderTag('WhiteTitle', 'GameWhiteTitle');
  customPgnHeaderTag('WhiteElo', 'GameWhiteElo');
  customPgnHeaderTag('BlackTitle', 'GameBlackTitle');
  customPgnHeaderTag('BlackElo', 'GameBlackElo');
  customPgnHeaderTag('ECO', 'GameECO');
  customPgnHeaderTag('Opening', 'GameOpening');
  if (theObj = document.getElementById('GameOpening')) { theObj.innerHTML = fixCommentForDisplay(theObj.innerHTML); }
  customPgnHeaderTag('Variation', 'GameVariation');
  if (theObj = document.getElementById('GameVariation')) { theObj.innerHTML = fixCommentForDisplay(theObj.innerHTML); }
  customPgnHeaderTag('Result', 'ResultAtGametextEnd');

   // customShortcutKey_Shift_8 defined by engine.js
   // customShortcutKey_Shift_9 defined by engine.js
   // customShortcutKey_Shift_0 defined by engine.js  
}

// -----------------------
// Special adds
// -----------------------
// Get Parameters in URL

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Customisation of customFunctionOnMove() to display the refreshed FEN.

function customFunctionOnMove() {
  document.getElementById('FENText').value = CurrentFEN();
  document.getElementById('GameResult').value = gameResult[currentGame];
  document.getElementById('audioClick').play();
}

function setAudioVolume() {
  document.getElementById('audioClick').volume=0.5;
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
