import * as fs from 'fs'
import { convert_text } from './module_from_God-sejong/mainscript.js'

fs.readFile('./input.txt', 'utf8', function (err, data) {
    if(err){
        console.log(err)
        return;
    }
    fs.writeFileSync('output.txt', convert_text(data))
})