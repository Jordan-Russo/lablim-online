const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

app.use(cors());

app.use('/api', apiRoutes);

app.listen(process.env.PORT || 8080, () => {
  console.log('Server listening on port 8080');
})