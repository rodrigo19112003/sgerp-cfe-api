import dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hola, API funcionando con TypeScript 🚀");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
