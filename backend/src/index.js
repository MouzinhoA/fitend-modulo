require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`FitEnd backend rodando na porta ${port}`);
});
