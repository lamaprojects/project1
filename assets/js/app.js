$(document).ready(function() {
  console.log("ready!");
  var user = "";
  //THESE ARE HELPER FUNCTIONS TO BREAK DOWN THE URL AND SAVE THE ACCESS TOKEN
  function getParameterByName(name) {
    var match = RegExp("[#&]" + name + "=([^&]*)").exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
  }
  function getAccessToken() {
    return getParameterByName("access_token");
  }
  var access_token = getAccessToken();
  // console.log("Access token attempted to set:", access_token);
  localStorage.setItem("access_token", access_token);
  //Setting the access token to setup spotifyAPI to extend usage

  function getUsername(callback) {
    //THIS IS AN IIFE (YOU TO FILL THIS IN)
    console.log("getUsername");
    var url = "https://api.spotify.com/v1/me/";
    $.ajax(url, {
      dataType: "json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      },
      success: function(data) {
        console.log("pulled username response", data);
        user = data;
        return data
      },
      error: function(error) {
        console.log(error);
        return error;
      }
    });
  }

  
  getUsername();
  //DIscover more queries here: https://github.com/jmperez/spotify-web-api-js
  // SETLISTFM API - SEARCH ARTIST AND GET SETLIST DATE/LOCATION/AND VIEW
  function retrieveElvisAlbum() {
    var spotifyApi = new SpotifyWebApi();
    //get Elvis' albums, passing a callback. When a callback is passed, no Promise is returned
    spotifyApi.setAccessToken(access_token);
    //create a playlist
    // spotifyApi.createPlaylist(
    //   user.display_name,
    //   { name: "Winter is coming...with Elvis" },
    //   function() {
    //     console.log("Setup the new playlist");
    //   }
    // );
    //retrieve album data
    spotifyApi.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE", function(err, data) {
      if (err) console.error(err);
      else console.log("Artist albums", data);
    });
  }

  retrieveElvisAlbum()

  $("#submitPress").on("click", function(event) {
    event.preventDefault();
    var artistName = $("#user-input").val();
    searchSetlistFM(artistName);
  });

  function searchMBID(mbid) {
    // CORS-anywhere hack - we're doing this instead of creating a server
    var originalURL =
      "https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=" +
      mbid.replace(/\"/g, "") +
      "&p=1";
    var queryURL = "https://cors-anywhere.herokuapp.com/" + originalURL;
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
        var citystateText = $("<p>").html(
          artistSetlists[i].venue.city.state +
            ", " +
            artistSetlists[i].venue.city.name
        );
        // var stateText = $("<p>").html(artistSetlists[i].venue.city.state);
        var button = $(
          `<button id="view-button" data-url=${
            artistSetlists[i].url
          }>View</button>`
        );
        var songText = $("<p>").html(
          artistSetlists[i].sets.set[0].song[0].name
        );
        console.log(songText);
        $("#setlist-results").append(dateText, citystateText, button);

        // $("#setlist-results").append(button)
      }
      $(document).on("click", "#view-button", function(event) {
        event.preventDefault();
        var link = $(this).attr("data-url");
        console.log(this);
        console.log("view button was clicked");
        window.open(link, "_blank");
      });
    });
  }

  function searchSetlistFM(artistName) {
    var originalURL =
      "https://api.setlist.fm/rest/1.0/search/artists?artistName=" +
      artistName +
      "&p=1&sort=relevance";
    var queryURL = "https://cors-anywhere.herokuapp.com/" + originalURL;

    $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "json",
      // this headers section is necessary for CORS-anywhere
      headers: {
        "x-requested-with": "xhr",
        "x-api-key": "6d1b43e2-d601-4dee-91e1-9889e57516f7"
      }
    })
      .done(function(response) {
        var artistMBID = JSON.stringify(response.artist[0].mbid);

        // This function does the setlist lookup and performs HTML front-end stuff
        searchMBID(artistMBID);
      })
      .fail(function(jqXHR, textStatus) {
        console.error(textStatus);
      });
  }

  // // SPOTIFY API

  // // Get the hash of the url
  // const hash = window.location.hash
  // .substring(1)
  // .split('&')
  // .reduce(function (initial, item) {
  //   if (item) {
  //     var parts = item.split('=');
  //     initial[parts[0]] = decodeURIComponent(parts[1]);
  //   }
  //   return initial;
  // }, {});
  // window.location.hash = '';

  // // Set token
  // let _token = hash.access_token;

  // const authEndpoint = 'https://accounts.spotify.com/authorize';

  // // Replace with your app's client ID, redirect URI and desired scopes
  // const clientId = 'abf37ff11aff48afb9ba75f4debfc293';
  // const redirectUri = 'https://reliveapp.github.io/project1/';
  // const scopes = [
  //   'user-top-read'
  // ];

  // // If there is no token, redirect to Spotify authorization
  // if (!_token) {
  //     $("#login").on("click", function(event){
  //         event.preventDefault
  //         window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
  // });

  // Make a call using the token
  // $.ajax({
  //    url: "https://api.spotify.com/v1/me/top/artists",
  //    type: "GET",
  //    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
  //    success: function(data) {
  //      // Do something with the returned data
  //      data.items.map(function(artist) {
  //        let item = $('<li>' + artist.name + '</li>');
  //        item.appendTo($('#top-artists'));
  //      });
  //    }
  // });
});
