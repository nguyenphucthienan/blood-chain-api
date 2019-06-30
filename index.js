const express = require('express');
const app = express();
const config = require('./config');

require('./startups/utils')(app);
require('./startups/db')();
require('./startups/routes')(app);

app.listen(config.port, () => {
  console.log(`Server listening on PORT ${config.port}`);
});
