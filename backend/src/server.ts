import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // 追加
import dotenv from 'dotenv';
import authRouter from './auth/auth';

const app = express();
const BASIC_INFO = require('./basic_info.ts');

dotenv.config({ path: BASIC_INFO.ENV_PATH });

app.use(cors());

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRouter);

const server = http.createServer(app);
server.listen(BASIC_INFO.PORT, () => {
  console.log('Server started on port ' + BASIC_INFO.PORT);
});
