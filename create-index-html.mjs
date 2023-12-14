import fsPromise from 'node:fs/promises'
import path from 'node:path'


export async function createIndexHtml(directories) {
    const srcPath = 'src'

    const indexHtmlTemplate = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>学习canvas</title>
        </head>

        <body>
            <!-- ！！不要更改这个文件，该文件是动态创建的 -->
            <ul>
                ${directories.map(item => `<li>
                    <a href=${item.path}>${item.name}</a>
                </li>`).join(' ')}
            </ul>
        </body>

        </html>
    `

    return await fsPromise.writeFile(path.join(srcPath, 'index.html'), indexHtmlTemplate, {
        encoding: "utf-8"
    })
}


