const express = require('express');
const app = express();
const { sequelize } = require('./db');
const musicianRouter = require('./router');
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes
app.use('/musicians', musicianRouter);

app.listen(port, () => {
	sequelize.sync();
	console.log(`Listening on port ${port}`);
});
