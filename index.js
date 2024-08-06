require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { URL } = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

let urlDatabase = {}; // This object will store the mappings of short_url to original_url
let urlCounter = 1;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {  
  const url = req.body.url;
  try {
    const validUrl = new URL(url); // Validate the URL
    urlDatabase[urlCounter] = validUrl.href;
    res.json({ original_url: validUrl.href, short_url: urlCounter });
    urlCounter++;
  } catch (err) {
    res.json({ error: 'invalid URL' });
  }
});

app.get('/api/shorturl/:shortUrl', function(req, res) {
  const shortUrl = req.params.shortUrl;
  const originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
