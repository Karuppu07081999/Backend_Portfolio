
require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const webapp = express();
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
const cors = require('cors');

const bodyParser = require('body-parser');
webapp.use(bodyParser.json());
webapp.use(cors());



const UserRoute = require('./UserRoute')
const AdminRoute = require('./AdminRoute')

webapp.use('/user',UserRoute)
webapp.use('/admin',AdminRoute)


webapp.listen(port, () => {
  console.log(`Server running on port ${port} !!`);
});
