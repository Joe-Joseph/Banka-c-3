import express from 'express';
import bodyParser from 'body-parser';
import 'babel-polyfill';
import router from './routes/router';

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to Banka' });
});

app.use('/api/v2', router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

export default app;
