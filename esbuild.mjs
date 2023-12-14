import * as esbuild from "esbuild"
import { copy } from 'esbuild-plugin-copy'
import fs from "fs"
import path from "path"
import { createIndexHtml } from "./create-index-html.mjs"

const input = "src"
const outDir = "dist"
let directories = []

try {
    const files = fs.readdirSync(input, { withFileTypes: true })

    // 过滤出文件夹
    directories = files
        .filter((file) => file.isDirectory())
        .map((file) => file.name)

    await createIndexHtml(directories.map(item => ({
        name: item,
        path: `/${item}/index.html`
    })))
} catch (err) {
    console.error("无法读取目录:", err)
}

function resolvePath(...arg) {
    return path.resolve(...arg)
}

function createInputPath(...arg) {
    return resolvePath(input, ...arg)
}

const result = await esbuild.context({
    bundle: true,
    entryPoints: directories.map((dir) => createInputPath(dir, "index.ts")),
    outdir: outDir,
    sourcemap: true,
    plugins: [
        copy({
            assets: [
                {
                    from: 'src/index.html',
                    to: './'
                },
                ...directories.map(dir => (
                    {
                        from: `src/${dir}/index.html`,
                        to: dir
                    }
                ))
            ],
            watch: true,
        })
    ]
})


await result.watch().then(res => {
    console.log('file change watching...')
    return res
})

const serverResult = await result.serve({
    servedir: 'dist',
    port: 3000,
})

console.log(`ready: http://localhost:${serverResult.port}`)