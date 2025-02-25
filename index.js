const express = require('express');
const morgan = require('morgan');
const errorhandler = require('errorhandler');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorhandler());

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
