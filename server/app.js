import express from 'express';
import bodyParser from 'body-parser';
import 'babel-polyfill';
import swagger from 'swagger-ui-express';
import swager from '../swagger.json';
import router from './routes/router';

const app = express();

app.use('/banka', swagger.serve, swagger.setup(swager));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content,Accepted,Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH ,OPTIONS');
  next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to Banka' });
});

app.use('/api/v2', router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

export default app;
