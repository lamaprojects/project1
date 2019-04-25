// SPOTIFY API

// Get the hash of the url

const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

// Set token
let _token = hash.access_token;

const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "abf37ff11aff48afb9ba75f4debfc293";
const redirectUri = "https://reliveapp.github.io/project1/search.html";
const scopes = ["playlist-modify-private"];
// TEST CODE
// var api = new SpotifyWebApi({
//   clientId: clientId,
//   clientSecret: 'c3c1be8950dd4e74b747b21920b8ac20',
//   redirectUri
// });
//THESE ARE HELPER FUNCTIONS TO BREAK DOWN THE URL AND SAVE THE ACCESS TOKEN
function getParameterByName(name) {
  var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
function getAccessToken() {
  return getParameterByName('access_token');
}
function getIdToken() {
  return ('id_token');
}
//THIS IS AN IIFE (YOU TO FILL THIS IN)
$(function () {
  var access_token = getAccessToken();getParameterByName
  console.log("Access token attempted to set:",access_token)
  localStorage.setItem("access_token", access_token);
  // Optional: an ID Token will be returned by Auth0
  // if your response_type argument contained id_token
  var id_token = getIdToken();

  // Use the Access Token to make API calls
  // ...
});

// api.createPlaylist('laylajoo', { name: 'A name for the playlist' }, function(){
//   console.log("do some things after the call ")
// });


// TEST CODE END
// If there is no token, redirect to Spotify authorization
if (!_token) {
  $("#login").on("click", function(event) {
    event.preventDefault;
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
  });
  
}


