const axios = require("axios");
const router = require("express").Router();

router.get("/artist/:name", (req, res) => {
  var artistName = req.params.name;
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
  }).then(data => res.json(data.data.artist[0]))
    .catch(err => res.status(422).json(err));;
});

router.get("/mbid/:id", (req, res) => {
  var id = req.params.id;
  var originalURL = "https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=" + id 
  axios.request({
    url: originalURL,
    method: "GET",
    dataType: "json",
    // this headers section is necessary for CORS-anywhere
    headers: {
      "x-requested-with": "xhr",
      "x-api-key": "6d1b43e2-d601-4dee-91e1-9889e57516f7"
    }
  }).then(data => res.json(data.data))
    .catch(err => res.status(422).json(err));
});

module.exports = router;
