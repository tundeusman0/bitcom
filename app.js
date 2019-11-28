const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');

const Routers = require('./routes/routes');

const publicPath = path.join(__dirname, './public');
const viewsPath = path.join(__dirname, './templates/views');

const app = express();

// bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.use(express.static(publicPath));

app.use('/', Routers);
app.get('*', (req, res) => {
  res.send('My 404 page');
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`express starting from port ${port}`);
});
