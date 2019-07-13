
const axios = require("axios");
var artistName = "Beyonce";
var originalURL =
"https://api.setlist.fm/rest/1.0/search/artists?artistName=" +
artistName +
"&p=1&sort=relevance";
axios.request({
    url: originalURL,
    method: "GET",
    dataType: "json",
    // this headers section is necessary for CORS-anywhere
    headers: {
      "x-requested-with": "xhr",
      "x-api-key": "6d1b43e2-d601-4dee-91e1-9889e57516f7"
    }
  }).then(data => console.log(data.data));
  