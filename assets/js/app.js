
// SETLISTFM API - SEARCH ARTIST AND GET SETLIST DATE/LOCATION/AND VIEW

$("#submitPress").on("click", function(event) {
    event.preventDefault();
    var artistName = $("#user-input").val();
    searchSetlistFM(artistName);
});

function searchMBID(mbid) {
    var originalURL = "https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=" + mbid.replace(/\"/g, "") + "&p=1";
    var queryURL = "https://cors-anywhere.herokuapp.com/" + originalURL
    $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "json",
// this headers section is necessary for CORS-anywhere
      headers: {
        "x-requested-with": "xhr",
        "x-api-key": "6d1b43e2-d601-4dee-91e1-9889e57516f7"
      }
    }).done(function(response) {
      artistSetlists = response.setlist;
      console.log(artistSetlists);

      for (var i = 0; i < artistSetlists.length; i++) {
        console.log(artistSetlists[i]);
        var dateText = $("<p>").html(artistSetlists[i].eventDate);
        var citystateText = $("<p>").html((artistSetlists[i].venue.city.state) + ", " + (artistSetlists[i].venue.city.name));
        // var stateText = $("<p>").html(artistSetlists[i].venue.city.state);        
        var button = $(
            `<button id="view-button" data-url=${(artistSetlists[i].url)}>View</button>`
        );
        $("#setlist-results").append(dateText, citystateText, button)
       
        // $("#setlist-results").append(button)

        }
        $(document).on("click", "#view-button", function(event) {
            event.preventDefault();
            var link = $(this).attr("data-url");
            console.log(this);
            console.log("view button was clicked");
            window.open(link, "_blank")
        });

    });
  
};

function searchSetlistFM(artistName) {
    var originalURL = "https://api.setlist.fm/rest/1.0/search/artists?artistName=" + artistName + "&p=1&sort=relevance"
    var queryURL = "https://cors-anywhere.herokuapp.com/" + originalURL

    $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "json",
      // this headers section is necessary for CORS-anywhere
      headers: {
        "x-requested-with": "xhr",
        "x-api-key": "6d1b43e2-d601-4dee-91e1-9889e57516f7"
      }
    }).done(function(response) {
      var artistMBID = JSON.stringify(response.artist[0].mbid);
      
      // This function does the setlist lookup and performs HTML front-end stuff
      searchMBID(artistMBID);
    }).fail(function(jqXHR, textStatus) { 
      console.error(textStatus)
    })
  };


// SPOTIFY API

// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'abf37ff11aff48afb9ba75f4debfc293';
const redirectUri = 'http://localhost:8888/callback';
const scopes = [
  'user-top-read'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
    $("#login").on("click", function(event){
        event.preventDefault
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
});

// Make a call using the token
$.ajax({
   url: "https://api.spotify.com/v1/me/top/artists",
   type: "GET",
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
     // Do something with the returned data
     data.items.map(function(artist) {
       let item = $('<li>' + artist.name + '</li>');
       item.appendTo($('#top-artists'));
     });
   }
});
}