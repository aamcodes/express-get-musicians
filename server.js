const express = require('express');
const app = express();
const { Musician } = require('./Musician');
const { sequelize } = require('./db');

const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

app.post('/musicians', async (req, res) => {
	try {
		let { name, instrument } = req.body;
		if (!name || !instrument) {
			res.status(400).json({ message: 'All fields are required' });
		} else {
			await Musician.create({ name, instrument })
				.then((musician) => {
					res.status(201).json(musician);
				})
				.catch((err) => {
					res.status(500).json({
						message: 'Database Internal Error',
					});
				});
		}
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

app.put('/musicians/:id', async (req, res) => {
	try {
		let { id } = req.params;
		let { name, instrument } = req.body;
		if (!name || !instrument) {
			res.status(400).json({ message: 'All fields are required' });
		}
		await Musician.findByPk(id)
			.then((musician) => {
				musician.set({
					name,
					instrument,
				});
				musician.save();
				res.status(201).json(musician);
			})
			.catch((err) => {
				res.status(404).json({ message: 'Musician not found' });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

app.delete('/musicians/:id', async (req, res) => {
	try {
		let { id } = req.params;
		await Musician.findByPk(id)
			.then((musician) => {
				musician.destroy();
				res.status(201).json({ removed: musician });
			})
			.catch((err) => {
				res.status(404).json({ message: 'No musician found' });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

app.listen(port, () => {
	sequelize.sync();
	console.log(`Listening on port ${port}`);
});
