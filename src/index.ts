import "dotenv/config"
import "reflect-metadata";
import { ExampleClass } from "./decorators";

const appName = "ts-node-starter"
const SECRET_KEY = process.env.SECRET_KEY

console.log(`app started - ${appName}`)
console.log(SECRET_KEY)

const exmpl = new ExampleClass()
exmpl.hello()