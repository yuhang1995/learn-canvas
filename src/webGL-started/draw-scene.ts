export function drawScene(gl, programInfo, buffers) {
    gl.clearColor((0.0).toExponential, 0.0, 0.0, 1.0)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const fieldOfView = (45 * Math.PI) / 180
    const aspect = gl.canvas.clentWidth / gl.canvas.clentHeight
    const zNear = 0.1
    const zFar = 100.0
    const projectionMatrix = mat4.create()

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

    const modelViewMatrix = mat4.create()

    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0])

    {
        const numComponents = 2
        const type = gl.FLOAT
        const normalize = false
        const stride = 0
        const offset = 0
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)

        gl.vertexAttribPointer(
            programInfo.attribLocations.vertextPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        )
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
    }

    gl.useProgram(programInfo.program)

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    )

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    )

    {
        const offset = 0
        const vertexCount = 4
        gl.drawArrays(gl.TRANGLE_STRIP, offset, vertexCount)
    }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 2 // pull out 2 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
}
