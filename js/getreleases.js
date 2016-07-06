getRelease("galuel","applets-pgn4web","applets-releases");
function getRelease(user, repo, Id) {
   var xmlhttp = new XMLHttpRequest();
   xmlhttp.onreadystatechange = function() {
       if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var myArr = JSON.parse(xmlhttp.responseText);
          release = populateRelease(myArr,Id);
       }
   }
   xmlhttp.open("GET", "https://api.github.com/repos/" + user + "/" + repo + "/releases", true);
   xmlhttp.send();
}
function populateRelease(arr,Id) {
   var release = arr[0].tag_name;
   document.getElementById(Id).innerHTML = release;
}
