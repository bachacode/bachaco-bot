const needle = require('needle');
const tenor = process.env.TENOR_KEY;
let searchTerms = '9277925'
let url = `https://tenor.googleapis.com/v2/posts?ids=${searchTerms}&key=${tenor}`;
needle.get(url, async (err, res) => {
  let json = res.body;

  console.log(json.results[0]);
})