const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'https://pdf-ly.vercel.app',
    'http://localhost:3000',
  ],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const compressRoute = require('./routes/compress');
const convertRoute = require('./routes/convert');

app.use('/api/compress', compressRoute);
app.use('/api/convert', convertRoute);

app.get('/', (req, res) => {
  res.send('PDF Editor Backend is running.');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
