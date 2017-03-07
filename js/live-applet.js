   "use strict";

   SetPgnUrl("livepgn/games.pgn"); // enable this one for real live broadcast using the live-grab.sh script
// SetPgnUrl("demoLiveGames.pgn"); // enable this one for live broadcast demo

   SetImagePath("pgn4web/images");
// SetImageType("png");
   SetHighlightOption(true); // true or false

   SetGameSelectorOptions("Liste des parties", true, 0, 0, 0, 15, 15, 3, 0); // (head, num, chEvent, chSite, chRound, chWhite, chBlack, chResult, chDate);

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

   SetShortcutKeysEnabled(false);

   // set live broadcast; parameters are delay (refresh delay in minutes, 0 means no broadcast, default 0) alertFlag (if true, displays debug error messages, default false, this flag highlight top left square put it to false to stop this) demoFlag (if true starts broadcast demo mode, default false) stepFlag (if true, autoplays updates in steps, default false) endlessFlag (if true, keeps polling for new moves even after all games are finished)
   SetLiveBroadcast(0.25, false, false);  // enable this one for real live broadcast
// SetLiveBroadcast(0.25, true, true); // enable this one for live broadcast demo

   var showColorFlag=true;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

   function customFunctionOnPgnGameLoad() {
      customPgnHeaderTag("TimeControl", "GameTimeControl");
   }

   // customShortcutKey_Shift_8 defined by engine.js
   // customShortcutKey_Shift_9 defined by engine.js
   // customShortcutKey_Shift_0 defined by engine.js

function searchPlayer(name, FideId) {
  if (typeof(openFidePlayerUrl) == "function") { openFidePlayerUrl(name, FideId); }
}

function customFunctionOnMove() {
  var theObj;
  if (showColorFlag) {
    if (theObj = document.getElementById("whiteColorFlag")) {
      theObj.style.display = "inline-block";
      theObj.style.visibility = CurrentPly % 2 ? "hidden" : "visible";
    }
    if (theObj = document.getElementById("blackColorFlag")) {
      theObj.style.display = "inline-block";
      theObj.style.visibility = CurrentPly % 2 ? "visible" : "hidden";
    }
  }
}

function customFunctionOnPgnTextLoad() { document.getElementById('numGm').innerHTML = numberOfGames; }

function customFunctionOnPgnGameLoad() {
  var theObj;
  document.getElementById('currGm').innerHTML = currentGame+1;
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
}

function SwitchToAnalysis() {
	var modeech=document.getElementById("bouton").innerHTML;
	if (modeech=="analyse") {
		var fenpos=CurrentFEN();
                document.getElementById("echiquieranalyse").innerHTML = "<iframe src='pgn4web/engine.html"+"?fs="+fenpos+"&backgroundColorHex=FFFFFF&darkColorHex=cc9966&lightColorHex=ffcc99&squareSize=40&disableEngine=true&framePaddingRatio=0' width=360 height=360 frameborder=0 style='display:block; margin-left:12px;'></iframe>";
		document.getElementById("echiquieranalyse").style.display = "block"; //affiche echiquier d'analyse
		document.getElementById("GameBoard").style.display = "none"; //efface echiquier du live
		document.getElementById("bouton").innerHTML = "live"; //pour pouvoir reswitcher au live ensuite
	}
	else
	{
		SwitchToLive();
	}
}

function SwitchToLive() {
	document.getElementById("echiquieranalyse").style.display = "none"; //efface echiquier d'analyse
	document.getElementById("GameBoard").style.display = "block"; //affiche echiquier du live
	document.getElementById("bouton").innerHTML = "analyse"; //pour pouvoir reswitcher en analyse ensuite
}
