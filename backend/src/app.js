
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./models/associations');
const setRoutes = require('./routes/index');


const app = express();
const PORT = process.env.PORT || 5200;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});