import { createCanvas } from "../utils"

function draw() {
    const { canvas, canvasContext: ctx } = createCanvas()
    canvas.width = 1024 // 设置画布宽度
    canvas.height = 1024 // 设置画布高度

    const layerSize = 256 // 每个图层包含的方格数量
    const squareSize = canvas.width / layerSize // 方格尺寸

    let colorIndex = 0
    for (let layer = 0; layer < Math.ceil(16777216 / layerSize); layer++) {
        for (let r = 0; r < 256; r++) {
            for (let g = 0; g < 256; g++) {
                for (let b = 0; b < 256; b++) {
                    const red = r
                    const green = g
                    const blue = b
                    const color = `rgb(${red}, ${green}, ${blue})`
                    ctx.fillStyle = color

                    const x = (colorIndex % layerSize) + layer * layerSize
                    const y = Math.floor(colorIndex / layerSize)
                    ctx.fillRect(
                        x * squareSize,
                        y * squareSize,
                        squareSize,
                        squareSize
                    )

                    colorIndex++
                    if (colorIndex >= 16777216) {
                        break
                    }
                }
                if (colorIndex >= 16777216) {
                    break
                }
            }
            if (colorIndex >= 16777216) {
                break
            }
        }
    }
}

window.onload = function () {
    draw()
}
