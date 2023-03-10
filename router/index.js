const express = require('express');
const router = express.Router();
const { Musician } = require('./Musician');

//TODO
router.get('/musicians', async (req, res) => {
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

router.get('/musicians/:id', async (req, res) => {
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

router.post('/musicians', async (req, res) => {
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

router.put('/musicians/:id', async (req, res) => {
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

router.delete('/musicians/:id', async (req, res) => {
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

module.exports = router;
