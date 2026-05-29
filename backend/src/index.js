require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api', routes);
app.use('/api/upload', uploadRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`FitEnd backend rodando na porta ${port}`);
});
