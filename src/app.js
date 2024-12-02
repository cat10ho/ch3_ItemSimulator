import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import AccountsRouter from "./routes/accounts.router.js";
import CharactersRouter from "./routes/characters.router.js";
import CharacterInventorysRouter from "./routes/CharacterInventorys.router.js"; //이거 대문자 불편하네;;
import ItemRouter from "./routes/item.router.js";
import CharacterItemsRouter from "./routes/characterItems.router.js";
import ShopRouter from "./routes/shop.router.js";
import path from "path";
import cors from 'cors';
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));  
const __filename = fileURLToPath(import.meta.url); 

console.log(`__dirname     ->`, __dirname);
console.log(`__filename    ->`, __filename);
console.log(`process.cwd() ->`, process.cwd());

const app = express();
const PORT = 3018;

const publicPath = path.join(process.cwd(), 'assets');

console.log(publicPath);
app.use(express.static(publicPath)); //경로의 파일을 사용할수 있게 만들어줌.
//express static file serving
//express 스태틱파일 서빙 

app.use(cors());
app.use(express.static(path.resolve("assets")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/",(req,res)=>{return res.sendFile(path.join(publicPath , "login.html"))});
app.use("/api", [
  AccountsRouter,
  CharactersRouter,
  CharacterInventorysRouter,
  ItemRouter,
  CharacterItemsRouter,
  ShopRouter,
]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});