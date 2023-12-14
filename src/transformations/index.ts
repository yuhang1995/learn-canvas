import { createCanvas } from "../utils"

window.onload = () => {
    function draw() {
        const { canvas, canvasContext: ctx } = createCanvas()

        canvas.height = 300

        // ctx.fillRect(0, 0, 150, 150) // Draw a Black rectangle with default settings
        // ctx.save() // Save the original default state

        // ctx.fillStyle = "#09F" // Make changes to saved settings
        // ctx.fillRect(15, 15, 120, 120) // Draw a Blue rectangle with new settings
        // ctx.save() // Save the current state

        // ctx.fillStyle = "#FFF" // Make changes to saved settings
        // ctx.globalAlpha = 0.5
        // ctx.fillRect(30, 30, 90, 90) // Draw a 50%-White rectangle with newest settings

        // ctx.restore() // Restore to previous state
        // ctx.fillRect(45, 45, 60, 60) // Draw a rectangle with restored Blue setting

        // ctx.restore() // Restore to original state
        // ctx.fillRect(60, 60, 30, 30) // Draw a rectangle with restored Black setting

        const sin = Math.sin(Math.PI / 6)
        const cos = Math.cos(Math.PI / 6)
        ctx.translate(100, 100)
        let c = 0
        for (let i = 0; i <= 12; i++) {
            c = Math.floor((255 / 12) * i)
            ctx.fillStyle = `rgb(${c}, ${c}, ${c})`
            ctx.fillRect(0, 0, 100, 10)
            ctx.transform(cos, sin, -sin, cos, 0, 0)
        }

        ctx.setTransform(-1, 0, 0, 1, 100, 100)
        ctx.fillStyle = "rgba(255, 128, 255, 0.5)"
        ctx.fillRect(0, 50, 100, 100)
    }

    draw()
}
