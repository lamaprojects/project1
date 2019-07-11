const axios = require("axios");
const router = require("express").Router();
var originalURL =
"https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=" +
mbid.replace(/\"/g, "") +
"&p=1";
router.get("/artist", (req, res) => {
  axios
    .get(originalURL, { params: req.query })
    .then(({ data: { results } }) => res.json(results))
    .catch(err => res.status(422).json(err));
});

module.exports = router;
