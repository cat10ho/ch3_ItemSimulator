import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import AccountsRouter from './routes/accounts.router.js';
import CharactersRouter from './routes/characters.router.js'
import CharacterInventorysRouter from './routes/CharacterInventorys.router.js' //이거 대문자 불편하네;;
import ItemRouter from './routes/item.router.js'
import CharacterItemsRouter from './routes/characterItems.router.js'

const app = express();
const PORT = 3018;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', [AccountsRouter,CharactersRouter,CharacterInventorysRouter,ItemRouter,CharacterItemsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});