const express = require('express');
const router = express.Router();
const { Musician } = require('../Musician');
const { check, validationResult } = require('express-validator');

//TODO
router.get('/', async (req, res) => {
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

router.get('/:id', async (req, res) => {
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

router.post(
	'/',
	[
		check(['name', 'instrument']).not().isEmpty().trim(),
		check('name')
			.isLength({ min: 2, max: 20 })
			.withMessage('name must be at least 2 - 10 characters long'),
	],
	async (req, res) => {
		try {
			let errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ error: errors.array() });
			} else {
				let { name, instrument } = req.body;
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
	}
);

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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
