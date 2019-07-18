import express from 'express';

const router = express();

router.get('/', (req, res) => {
	res.send('wake up heroku!');
});

export default router;
