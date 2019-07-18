import express from 'express';
import * as admin from 'firebase-admin';
import * as User from '../controllers/user_controller'

const router = express();

router.route('/')
	.get((req, res) => {
		User.getAll()
			.then((response) => {
				res.send(response);
			})
			.catch((error) => {
				res.status(500).send(error.message);
			});
	})

router.route('/:id')
	.get((req, res) => {
		// authenticate user token
		admin.auth().verifyIdToken(req.params.id)
			.then((decodedToken) => {
				User.read(decodedToken.uid)
					.then((user) => {
						res.send(user);
					})
					.catch((error) => {
						if (error.message.startsWith('User with id:')) {
							res.status(404).send(error.message);
						} else {
							res.status(500).send(error.message);
						}
					});
			})
		// authentication of token failed
			.catch((error) => {
				res.status(401).send(error.message);
			});
	})
	.post((req, res) => {
		// authenticate user token
		admin.auth().verifyIdToken(req.params.id)
		// create user
			.then((decodedToken) => {
				User.read(decodedToken.uid)
					.then((user) => {
						res.send(user);
					})
					.catch((error) => {
						if (error.message.startsWith('User with id:')) {
							User.create(decodedToken.uid, req.body)
								.then((result) => {
									res.send(result);
								})
								.catch((error) => {
									res.status(500).send(error.message);
								});
						} else {
							res.status(500).send(error.message);
						}
					});
			})
		// authentication of token failed
			.catch((error) => {
				res.status(401).send(error.message);
			});
	})
	.put((req, res) => {
		// authenticate user token
		admin.auth().verifyIdToken(req.params.id)
		// create user
			.then((decodedToken) => {
				User.update(decodedToken.uid, req.body)
					.then((result) => {
						res.send(result);
					})
					.catch((error) => {
						res.status(500).send(error.message);
					});
			})
		// authentication of token failed
			.catch((error) => {
				res.status(401).send(error.message);
			});
	})
	.delete((req, res) => {
		// authenticate user token
		admin.auth().verifyIdToken(req.params.id)
		// create user
			.then((decodedToken) => {
				User.del(decodedToken.uid)
					.then((result) => {
						res.send(result);
					})
					.catch((error) => {
						res.status(500).send(error.message);
					});
			})
		// authentication of token failed
			.catch((error) => {
				res.status(401).send(error.message);
			});
	});


export default router;
