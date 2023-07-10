import fs from "fs"
import { readFile } from "fs/promises";


async function read() {
    const obj = JSON.parse(await readFile('credentials.json'))
    console.log(obj.reqKey)


}

read()

const token1 = '1234'
const token2 = '321'

console.log(!token1 || !token2)
// if any token is undefined or null returns true