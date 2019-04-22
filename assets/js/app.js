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
            `<button data-url=${(artistSetlists[i].url)}>View</button>`
        );

        $("#setlist-results").append(dateText, citystateText, button)
 
        // $("#setlist-results").append(button)

        }

    });
  
}

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
