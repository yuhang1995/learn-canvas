import path from "path";
import url from 'url';
import fsPromise from 'node:fs/promises';
import childProcess from "node:child_process";

const args = process.argv.slice(2);

const dirname = args[0]

if (!dirname) {
    console.error('请输入文件夹名称')
    process.exit()
}

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.resolve(__dirname, 'src')
const templatepath = path.resolve(__dirname, 'template')

if (!dirname) {
    console.error('请输入文件夹名称')
    process.exit()
}

const dirPath = path.join(srcPath, dirname)

const filePath = (file = 'index.html') => path.join(srcPath, dirname, file)

const indexTemplate = `window.onload = () => {}`

await fsPromise.mkdir(dirPath)
    .then(() => fsPromise.readFile(path.join(templatepath, 'index.html'), { encoding: "utf-8" }))
    .then(template => template.replace(/HTMLNAME/g, dirname))
    .then(template => fsPromise.writeFile(filePath(), template))
    .then(() => fsPromise.writeFile(filePath('index.ts'), indexTemplate, {
        encoding: "utf-8"
    }))
    .then(() => {
        console.log('创建成功')
        childProcess.exec(`code ${filePath('index.ts')}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行命令时出错：${error}`);
                return;
            }
            console.log(`成功打开文件 ${filePath('index.ts')}`);
        })
    })
    .catch(console.error);
