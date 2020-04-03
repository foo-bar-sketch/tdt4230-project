/**
 * Main program
 */
import Canvas from './elements/canvas'
import initBuffer from './gl/buffer'
import Program from './gl/program'
import vertexShader from './shaders/vertex'
import fragmentShader from './shaders/fragment'
import { SquareParticle, Particle, Sphere } from './gl/shapes'
import mat4 from 'gl-mat4'
import { SceneNode, GEOMETRY, POINT_LIGHT } from './gl/scenegraph'
import Audio from './elements/audio'
import loadTexture from './gl/texture'
import heart from '../res/mus/heart.wav'
import cong from '../res/mus/cong.wav'
import tex from '../res/textures/drop.png'

var numParticles = 2**14

var texture;

var cons = document.createElement('div')
cons.style.position = 'absolute'
cons.style.top = 0
cons.style.right = 0
cons.style.fontFamily = 'Monospace'
cons.style.color = '#aaa'
cons.style.fontSize = '1em'
cons.style.textAlign = 'right'
//cons.style.backgroundImage = 'url(' + tex + ')'
cons.setAttribute('id', 'console-box')
document.body.appendChild(cons)
cons.innerHTML = 'index: 0 <br /> played: 0'

var radiusAnim = []
//for (let i = 10; i < 200; i += 0.25) {
//    radiusAnim.push(i)
//}
for (let i = 10; i < 100; i+=2) {
    radiusAnim.push(i)
}

var xRad = []
for (let i=0; i < 4; i++) {
    xRad.push(Math.random())
}

for (let i = 100; i > 10; i-=2) {
    radiusAnim.push(i)
}
var index = 0

var audioData = require('../res/mus/cong_data.json')

var amplitudes = audioData.samples
console.log('number of samples: ' + amplitudes.length)
var sampleRate = audioData.sampling_rate

var audioElement = Audio(cong)
document.body.append(audioElement)

var particleNodes = []

// make particles live in different shells
var particleRhos = []
for (let i = 0; i < numParticles; i++) {
    let amount = Math.random()*2
    particleRhos.push(amount)
}

// make particles have different speeds
var particleSpeed = []
for (let i = 0; i < numParticles; i++) {
    let amount = Math.random()
    particleSpeed.push(amount)
}

var cameraInfo = {
    position: [0.0, 0.0, -20.0],
    rotation: [0.0, 0.0, 0.0]
}

var lights = {
    positions: [[0.0, 0.0, 0.0], [-30, 10, 30]],
    ids: ['centerLight', 'outsideLight']
}

const superShape = {
    x: ( phi, theta, rho) => {
        return rho*Math.sin(phi)*Math.cos(theta)
    },
    y: (phi, theta, rho) => {
        return rho*Math.sin(phi)*Math.sin(theta)
    },
    z: (phi, rho) => {
        return rho*Math.cos(phi)
    }
}

export const run = () => {
    // set body style
    const body = document.body
    body.style.margin = 0
    body.style.padding = 0

    //var audio = Audio('../res/mus/cong.wav')
    //body.appendChild(audio)

    // create and add gl window
    const glWin = Canvas()
    body.appendChild(glWin)

    // get context
    const gl = glWin.getContext('webgl')

    if (gl == null) {
        console.log('Unable to init WebGL.')
        return
    }
    // enable stuffs
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.blendFunc(gl.ONE, gl.SRC_ALPHA)
    gl.enable(gl.BLEND)

    // shaders
    const programInfo = Program(
        gl,
        vertexShader,
        fragmentShader,
        [
            'modMat',
            'viewMat',
            'projMat', 
            'normMat',
            'centerLightPos',
            'outsideLightPos',
            'particleDistance',
            'superRho',
            'uSampler'
        ])
    gl.useProgram(programInfo.program)

    // texture stuff
    texture = loadTexture(gl, tex)
    
    while (!gl.isTexture(texture)) { } // do nothing until the texture is loaded
    gl.activeTexture(gl.TEXTURE0)
    const actErr = gl.getError()
    if (actErr != gl.NO_ERROR) {
        console.log('There was an error activating the error: ' + actErr)
    }
    gl.bindTexture(gl.TEXTURE_2D, texture)
    const bindErr = gl.getError()
    if (bindErr != gl.NO_ERROR) {
        console.log('There was an error binding the texture: ' + bindErr)
    }
    gl.uniform1i(programInfo.uniformLoc.uSampler, 0)

    // check if saul goodman
    const texErr = gl.getError()
    if (texErr != gl.NO_ERROR) {
        console.log('There has been an error loading the texture: ' + texErr)
    }
    
    // init scene
    initScene(gl, numParticles, 'super', programInfo)

    var then = 0

    const render = (now) => {
        // clear color
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        
        // time management
        now *= 0.001
        const deltaTime = now - then
        //console.log('delta time: ' + deltaTime)
        then = now

        // update the frame
        updateFrame(gl, programInfo, audioElement.currentTime)
        // draw the frame
        renderFrame(gl, programInfo)
        
        // keep animation going
        requestAnimationFrame(render)
    }
    // start animation and music
    requestAnimationFrame(render)
    audioElement.play()
}

/**
 * 
 * @param {number} particles number of particles to use
 * @param {shape} shape which super shape to use
 */
const initScene = (gl, particles, shape, programInfo) => {
    // create the meshes for the scene
    var meshes = []
    for (let i = 0; i < particles; i++) {
        meshes.push(Particle())
        //meshes.push(Sphere(0.2, 3, 3)) 
    }
    // create VAOs for all the meshes
    var VAOs = []
    for (let i = 0; i < particles; i++) {
        VAOs.push(initBuffer(gl, programInfo.attribLoc, meshes[i]))
    }
    for (let i = 0; i < particles; i++) {
        particleNodes.push(SceneNode(
            [0.0, 0.0, 0.0], // position
            [0.0, 0.0, 0.0], // rotation
            [0.06, 0.06, 0.06], // scale
            [0.0, 0.0, 0.0], // reference point
            VAOs[i], // VAO id
            meshes[i].indices.length, // VAO count
            GEOMETRY, // node type
        ))
    }
}

/**
 * Updates scene nodes according to animations
 */
const updateFrame = (gl, programInfo, now) => {
    let n = particleNodes.length
    // make the radius bounce
    var index = Math.round(now*sampleRate)
    cons.innerHTML = 'index: ' + index + '<br />played: ' + now
    let rho = index < amplitudes.length ? 2 + Math.abs(amplitudes[index])*5 : 2
    //console.log(rho)
    gl.uniform1f(programInfo.uniformLoc.superRho, rho)

    let xRho = Math.min(1.0, Math.abs(Math.cos(now/2*Math.PI)) + 0.3)
    let yRho = Math.min(1.0, Math.abs(Math.sin(now/2*Math.PI)) + 0.3)
    //index += 1
    //index = index % radiusAnim.length
    //let rho = radiusAnim[index]
    for (let i = 0; i < n; i++) {
        let currentNode = particleNodes[i]
        let baseRho = particleRhos[i]
        let deltaRho = Math.sin(rho*particleSpeed[i])
        let delta = 5 * Math.PI / Math.sqrt(n)
        let particlesPerPhi = Math.sqrt(n) / 2
        let theta = Math.floor(i / particlesPerPhi) * delta
        let phi = (i % particlesPerPhi) * delta
        let position = [
            currentNode.position[0] + superShape.x(phi, theta, deltaRho + rho*xRho),
            currentNode.position[1] + superShape.y(phi, theta, deltaRho + rho*yRho),
            currentNode.position[2] + superShape.z(phi, deltaRho)]
        let particleRho = Math.sqrt(position[0]*position[0] + position[1]*position[1] + position[2]*position[2])
        gl.uniform1f(programInfo.uniformLoc.particleDistance, particleRho)
        if (particleRho > rho) {
            currentNode.position = [
                superShape.x(phi, theta, baseRho),
                superShape.y(phi, theta, baseRho),
                superShape.z(phi, baseRho)
            ]
        } else {
            currentNode.position = position 
        }
        //currentNode.position = [superShape.x(phi, theta, rho), superShape.y(phi, theta, rho), superShape.z(phi, rho)]
        currentNode.rotation[1] -= Math.PI/100
        //currentNode.rotation[0] -= Math.PI/100
        particleNodes[i] = currentNode
    }
    // update the transformations
    updateTransformations()

    // rotate the camera so it will go around
    cameraInfo.rotation = [0, cameraInfo.rotation[1] + Math.PI/100, 0]
    cameraInfo.rotation[0] += Math.PI/100

    // perspective matrix
    const fov = 45 * Math.PI / 180
    const asp = gl.canvas.clientWidth / gl.canvas.clientHeight
    const zNear = 0.1
    const zFar = 400.0
    const projMat = mat4.create()

    mat4.perspective(
        projMat,
        fov,
        asp,
        zNear,
        zFar
    )

    gl.uniformMatrix4fv(
        programInfo.uniformLoc.projMat,
        false,
        projMat
    )

    const viewMat = mat4.create()
    mat4.translate(viewMat, viewMat, cameraInfo.position)
    mat4.rotate(viewMat, viewMat, cameraInfo.rotation[1], [0, 1, 0])
    mat4.rotate(viewMat, viewMat, cameraInfo.rotation[0], [1, 0, 0])
    mat4.rotate(viewMat, viewMat, cameraInfo.rotation[2], [0, 0, 1])
    // make camera location available to the shader
    gl.uniform3f(programInfo.uniformLoc.camLoc, cameraInfo.position[0], cameraInfo.position[1], cameraInfo.position[2])
    gl.uniformMatrix4fv(
        programInfo.uniformLoc.viewMat,
        false,
        viewMat
    )
}

/**
 * Updates the nodes according to the transformations needed
 */
const updateTransformations = () => {

    for (let i = 0; i < particleNodes.length; i++) {
        // while there are nodes in the queue
        let currentNode = particleNodes[i]
        // update the node transformation
        let T = mat4.create()
        
        mat4.translate(T, T, currentNode.position)
        //mat4.translate(T, T, currentNode.refPoint)
        mat4.rotate(T, T, currentNode.rotation[1], [0, 1, 0])
        mat4.rotate(T, T, currentNode.rotation[0], [1, 0, 0])
        mat4.rotate(T, T, currentNode.rotation[2], [0, 0, 1])
        mat4.scale(T, T, currentNode.scale)
        //mat4.translate(T, T, -currentNode.refPoint)

        currentNode.currentTransformation = T

        particleNodes[i] = currentNode
    }
}

/**
 * Renders all the nodes
 * @param {ctx} gl webgl ctx
 */
const renderNodes = (gl, programInfo) => {
    for (let i = 0; i < particleNodes.length; i++) {
        let node = particleNodes[i]
        // send transformation matrix as uniform
        gl.uniformMatrix4fv(
            programInfo.uniformLoc.modMat,
            false,
            node.currentTransformation
        )

        // get the normal matrix
        let invTran = mat4.create()
        mat4.invert(invTran, node.currentTransformation)
        mat4.transpose(invTran, invTran)
        gl.uniformMatrix4fv(programInfo.uniformLoc.normMat, false, invTran)

        // check if saul goodman
        const glErr = gl.getError()
        if (glErr != gl.NO_ERROR) {
            console.log('There has been an error with the normal matrix: ' + glErr)
        }
        

        // send the light locations
        for (let i= 0; i < lights.positions.length; i++) {
            let position = lights.positions[i]
            let id = lights.ids[i]
            gl.uniform3f(programInfo.uniformLoc[id], position[0], position[1], position[2])
        }
        // render the node
        const offset = 0
        const vertexCount = node.vaoCount
        const type = gl.UNSIGNED_SHORT
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
        // check if saul goodman
        const err = gl.getError()
        if(err != gl.NO_ERROR)  {
            console.log('There has been an error: ' + err)
        }
    }
}

/**
 * renders the entire frame
 */
const renderFrame = (gl, programInfo) => {
    renderNodes(gl, programInfo)
}

/**
 * Draws the scene
 * @param {*} gl webgl context
 * @param {*} programInfo info about the shader program
 * @param {*} buffers buffers to use for drawing
 * @param {*} mesh mesh to draw
 */
const drawScene = (gl, programInfo, buffers, mesh) => {


    const modViewMat = mat4.create()

    mat4.translate(
        modViewMat,
        modViewMat,
        [0.0, 0.0, -6.0]
    )
    
    mat4.rotateY(modViewMat, modViewMat, Math.PI / 2.9)
    mat4.rotateX(modViewMat, modViewMat, Math.PI / 2.9)
    mat4.scale(modViewMat, modViewMat, [.05, .05, .05])


    

    {
        const offset = 0
        const vertexCount = mesh.indices.length
        const type = gl.UNSIGNED_SHORT
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)

        // check if saul goodman
        let err = gl.getError()
        if(err != gl.NO_ERROR) {
            console.log('There was an error drawing the scene: ' + err)
        }
    }
}
