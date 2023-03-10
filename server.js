const express = require('express');
const app = express();
const { sequelize } = require('./db');
const magicianRouter = require('./router');
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes
app.use('/magicians', magicianRouter);

app.listen(port, () => {
	sequelize.sync();
	console.log(`Listening on port ${port}`);
});
