import app from './app.js';
import { PORT } from './config.js';
import cookieParser from 'cookie-parser';

app.use(cookieParser());

app.listen(PORT);
console.log('Server on port', PORT);

