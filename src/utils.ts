export function getRootNode(id: string = "root") {
    return document.getElementById(id)
}

export function createCanvas(id: string = "canvas") {
    const root = getRootNode()
    const canvas = document.createElement("canvas")
    canvas.id = id

    root.appendChild(canvas)

    return {
        canvas,
        canvasContext: canvas.getContext("2d"),
    }
}
