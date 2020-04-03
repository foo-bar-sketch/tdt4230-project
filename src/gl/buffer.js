/**
 * Buffer init
 */

/**
 * Adds data to a buffer
 * @param {ctx} gl webgl context
 * @param {Array[vec4]} data data to add to buffer
 */
const initBuffer = (gl, attribLoc, mesh) => {

    // vertices
    const vBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(mesh.vertices),
        gl.STATIC_DRAW
    )
    gl.vertexAttribPointer(
        attribLoc.position, // attribute location
        3, // num components
        gl.FLOAT, // type
        false, // normalize
        0, // stride
        0 // offset
    )
    gl.enableVertexAttribArray(attribLoc.position)

    // normals
    const nBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(mesh.normals),
        gl.STATIC_DRAW
    )
    gl.vertexAttribPointer(
        attribLoc.normal, // attribute location
        3, // num components
        gl.FLOAT, // type
        true, // normalize
        0, // stride
        0 // offset
    )
    gl.enableVertexAttribArray(attribLoc.normal)

    // colors
    const cBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(mesh.colors),
        gl.STATIC_DRAW
    )
    gl.vertexAttribPointer(
        attribLoc.color, // attribute location
        3, // num components
        gl.FLOAT, // type
        true, // normalize
        0, // stride
        0 // offset
    )
    gl.enableVertexAttribArray(attribLoc.color)

    // texture coordinates
    const tBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(mesh.uvs),
        gl.STATIC_DRAW
    )
    //console.log('uv loc: ' + attribLoc.uv)
    gl.vertexAttribPointer(
        attribLoc.uv, // attribute location
        2, // num components
        gl.FLOAT, // type
        false, // normalize
        0, // stride
        0 // offset
    )
    gl.enableVertexAttribArray(attribLoc.uv)

    // indices
    const iBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer)
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(mesh.indices),
        gl.STATIC_DRAW
    )

    return {
        position: vBuffer,
        normal: nBuffer,
        uv: tBuffer,
        indices: iBuffer
    }
}

export default initBuffer
