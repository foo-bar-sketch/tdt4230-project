/**
 * Takes care of getting shader programs
 */
import initShaderProgram from './shader'

/**
 * Creates a program
 * @param {ctx} gl webgl context
 * @param {str} vSrc vertex shader source
 * @param {str} fSrc fragment shader source
 * @param {Object[str]} uniforms uniform names
 * @returns program info object
 */
const Program = (gl, vSrc, fSrc, uniforms = []) => {
    // init shader program
    const shaderProgram = initShaderProgram(gl, vSrc, fSrc)
    
    // create program info
    const programInfo = {
        program: shaderProgram,
        attribLoc: {
            position: gl.getAttribLocation(shaderProgram, 'position'),
            normal: gl.getAttribLocation(shaderProgram, 'normal_in'),
            uv: gl.getAttribLocation(shaderProgram, 'uv'),
            color: gl.getAttribLocation(shaderProgram, 'color'),
        },
        uniformLoc: {},
    }
    //console.log("position attribute location is: " + gl.getAttribLocation(shaderProgram, 'position'))
    //console.log("normal attribute location is: " + gl.getAttribLocation(shaderProgram, 'normal_in'))
    //console.log("uv attribute location is: " + gl.getAttribLocation(shaderProgram, 'uv'))

    // loop through uniforms and add the locations to program info
    uniforms.forEach(
        uName => {
            //console.log(uName + " location: " + gl.getUniformLocation(shaderProgram, uName))
            programInfo.uniformLoc[uName] = gl.getUniformLocation(shaderProgram, uName)
        })

    return programInfo
}

export default Program
