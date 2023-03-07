const express = require('express');
const app = express();
const { Musician } = require('./Musician');
const { sequelize } = require('./db');

const port = 3000;

//TODO
app.get('/musicians', async (req, res) => {
	try {
		await Musician.findAll()
			.then((musicians) => {
				res.status(200).json(musicians);
			})
			.catch((err) => {
				res.status(404).json({ message: 'No musicians exist' });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

app.get('/musicians/:id', async (req, res) => {
	try {
		await Musician.findByPk(req.params.id)
			.then((musician) => {
				res.status(200).json(musician);
			})
			.catch((err) => {
				res.status(404).json({ message: 'Musician cannot be found' });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

app.listen(port, () => {
	sequelize.sync();
	console.log(`Listening on port ${port}`);
});
