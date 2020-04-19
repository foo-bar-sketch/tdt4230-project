/**
 * Main program
 */
import Canvas from './elements/canvas'
import initBuffer from './gl/buffer'
import Program from './gl/program'
import vertexShader from './shaders/vertex'
import fragmentShader from './shaders/fragment'
import { nablaParticle, SquareParticle, Particle, Sphere } from './gl/shapes'
import mat4 from 'gl-mat4'
import { SceneNode, GEOMETRY, POINT_LIGHT } from './gl/scenegraph'
import Audio from './elements/audio'
import loadTexture from './gl/texture'
import bubble from './gl/animation'
//import heart from '../res/mus/heart.wav'
import sails from '../res/mus/sails.wav'
//import cong from '../res/mus/cong.wav'
//import bad from '../res/mus/bad-guy.wav'
//import tex from '../res/textures/blueSmokey.png'
//import tex from '../res/textures/drop.png'
import tex from '../res/textures/water.png'
//import tex from '../res/textures/fire.png'
//import tex from '../res/textures/fire2.jpg'
//import tex from '../res/textures/water2.png'
//import tex from '../res/textures/sand.jpg'

/**
 * global variables
 */

var numParticles = 2**11

var texture

var cons
var panel
var startButton
var stopButton
var particleCount

var particleRhos = []
var particleSpeed = []
 
var particleVectors = []

var particleNodes = []

var cameraInfo = {
    position: [0.0, 0.0, -15.0],
    rotation: [0.0, 0.0, 0.0]
}

var lights = {
    positions: [[0.0, 0.0, 0.0], [-30, 10, 30]],
    ids: ['centerLight', 'outsideLight']
}

/**
 * Fix the audio data and eleemnt
 */
var audioData = require('../res/mus/sails_data.json')

var amplitudes = audioData.samples
var sampleRate = audioData.sampling_rate

var audioElement = Audio(sails)

/**
 * Parametric equation for a sphere using spherical coordinates
 */
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

/**
 * Initiates the necessary global variables and the UI for settings
 */
export const init = () => {
    document.body.style.backgroundColor = '#000'
    panel = document.createElement('div')

    panel.style.width = window.innerWidth-20 + 'px'
    panel.style.margin = 0
    panel.style.padding = '5px 2px 5px 2px'
    panel.style.position = 'absolute'

    startButton = document.createElement('button')
    startButton.id = 'start-button'
    startButton.style.float = 'left'
    startButton.style.backgroundColor = '#333'
    startButton.style.color = '#eee'
    startButton.style.border = '1px solid #eee'
    startButton.style.margin = '0 5px 0 5px'
    startButton.innerHTML = 'start'
    startButton.onclick = () => {
        let val = parseInt(document.getElementById('particle-count').value)
        numParticles = !isNaN(val) && val > 0 && val < 22 ? 2**val : 2**11

        startButton.setAttribute('disabled', true)
    
        for (let i = 0; i < numParticles; i++) {
            let amount = Math.random()
            particleRhos.push(amount)
        }

        // make particles have different speeds
        for (let i = 0; i < numParticles; i++) {
            let amount = Math.random() * 0.1
            particleSpeed.push(amount)
        }

        // create particle vectors
        for (let i = 0; i < numParticles; i++) {
            let delta = 2*Math.PI / Math.sqrt(numParticles)
            let particlesPerPhi = Math.sqrt(numParticles) / 2
            let theta = Math.floor(i / particlesPerPhi) * delta
            let phi = (i % particlesPerPhi) * delta
            if (Math.random() > 0.3) {
                particleVectors.push([
                    Math.sin(phi)*Math.cos(theta),
                    Math.sin(phi)*Math.sin(theta),
                    Math.cos(phi)
                ])
            } else {
                const z = Math.random() > 0.5 ? -Math.random() : Math.random()
                const y = Math.random() > 0.5 ? -Math.random() : Math.random()
                const x = Math.random() > 0.5 ? -Math.random() : Math.random()
                particleVectors.push([x, y, z])
            }
        }
        run()
    }

    stopButton = document.createElement('button')
    stopButton.style.float = 'left'
    stopButton.style.border = '1px solid #eee'
    stopButton.style.backgroundColor = '#333'
    stopButton.style.color = '#eee'
    stopButton.style.margin = '0 5px 0 5px'
    stopButton.innerHTML = 'stop'
    stopButton.onclick = () => {
        location.reload()
    }

    document.body.style.fontFamily = 'Monospace'
    document.body.style.fonsSize = '1em'
    
    const particleCountCont = document.createElement('div')
    particleCountCont.style.margin = '0 5px 0 5px'
    const particleText = document.createElement('p')
    particleText.innerHTML = 'Particle Count: 2^'
    particleText.style.margin = '3px 0 0 0'
    particleText.style.float = 'left'
    particleText.style.color = '#eee'
    particleCount = document.createElement('input')
    particleCount.id = 'particle-count'
    particleCount.setAttribute('type', 'text')
    particleCount.style.margin = '0 2px 0 2px'
    particleCount.style.float = 'left'
    particleCount.style.border = '1px solid #eee'
    particleCount.style.backgroundColor = '#333'
    particleCount.style.color = '#eee'
    particleCount.value = '11'
    particleCount.style.width = 15 + 'px'
    particleCountCont.appendChild(particleText)
    particleCountCont.appendChild(particleCount)

    //const audioFileCont = document.createElement('div')
    //audioFileCont.style.margin = '0 5px 0 5px'
    //const audioText = document.createElement('p')
    //audioText.innerHTML = 'Audio Track: '
    //audioText.style.margin = '3px 0 0 0'
    //audioText.style.float = 'left'
    //audioText.style.color = '#eee'
    //const audioFile = document.createElement('select')
    //audioFile.id = 'audiofile'
    //audioFile.style.float = 'left'
    //audioFile.style.border = '1px solid #eee'
    //audioFile.style.backgroundColor = '#333'
    //audioFile.style.color = '#eee'
    //const badOption = document.createElement('option')
    //badOption.innerHTML = 'Bad Guy'
    //badOption.setAttribute('value', 'bad')
    //const sailsOption = document.createElement('option')
    //sailsOption.innerHTML = 'Black Sails'
    //sailsOption.setAttribute('value', 'sails')
    //const congOption = document.createElement('option')
    //congOption.innerHTML = 'Congregation'
    //congOption.setAttribute('value', 'cong')
    //audioFile.appendChild(sailsOption)
    //audioFile.appendChild(congOption)
    //audioFile.appendChild(badOption)
    //audioFileCont.appendChild(audioText)
    //audioFileCont.appendChild(audioFile)
    //console.log(audioFile.value)

    cons = document.createElement('div')
    cons.style.float = 'right'
    cons.style.fontFamily = 'Monospace'
    cons.style.color = '#aaa'
    cons.style.fontSize = '1em'
    cons.style.textAlign = 'right'
    //cons.style.backgroundImage = 'url(' + tex + ')'
    cons.setAttribute('id', 'console-box')
    cons.innerHTML = 'index: 0 <br /> played: 0'

    panel.appendChild(startButton)
    panel.appendChild(stopButton)
    panel.appendChild(particleCountCont)
    panel.appendChild(cons)

    document.body.appendChild(panel)
}


/**
 * Runs the animation
 */
export const run = () => {
    // set body style
    const body = document.body
    body.style.margin = 0
    body.style.padding = 0

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
    //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
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
    var frameRate = 1/60

    const render = (now) => {
        // time management
        now *= 0.001
        const deltaTime = now - then
        //console.log('delta time: ' + deltaTime)
        then = now
        // framerate cap
        if (deltaTime >= frameRate) {
            // clear color
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            // update the frame
            updateFrame(gl, programInfo, now, audioElement.currentTime, deltaTime)
            // draw the frame
            renderFrame(gl, programInfo)
        }
        
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
        meshes.push(nablaParticle())
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
            [0.02, 0.02, 0.02], // scale
            [0.0, 0.0, 0.0], // reference point
            VAOs[i], // VAO id
            meshes[i].indices.length, // VAO count
            GEOMETRY, // node type
        ))
    }
}

/**
 * Updates particles position
 * @param {ctx} gl webgl context
 * @param {Object} programInfo necessary info about shader programs
 * @param {number} audioTime the current time of the audio track
 * @param {number} currentTime the current time since start of animation
 * @param {number} deltaTime time since last frame
 */
const updateFrame = (gl, programInfo, audioTime, currentTime, deltaTime) => {
    let n = particleNodes.length
    // make the radius bounce
    var maxRho = 0.4
    var minRho = 0
    var index = Math.round(audioTime*sampleRate) % amplitudes.length
    cons.innerHTML = 'index: ' + index + '<br />played: ' + currentTime
    let lastIndex = index > 0 ? index - 1 : 0
    let nextIndex = index < n -1 ? index + 1: n - 1
    let amplitude = amplitudes[index]
    
    //console.log(rho)
    gl.uniform1f(programInfo.uniformLoc.superRho, amplitude*maxRho)

    // get the position of the nodes
    particleNodes = bubble(particleNodes, particleRhos, particleVectors, audioTime, currentTime, amplitude, maxRho, minRho, superShape)

    updateTransformations()

    // rotate the camera so it will go around
    cameraInfo.rotation = [0, cameraInfo.rotation[1] + Math.PI/300, 0]
    //cameraInfo.rotation[0] += Math.PI/100

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
 * @param {Object} programInfo necessary info about shader programs (attrib/uniform loc, etc.)
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
        const nodeRho = Math.sqrt(
            node.position[0]*node.position[0] +
            node.position[1]*node.position[1] +
            node.position[2]*node.position[2])
        gl.uniform1f(programInfo.uniformLoc.particleDistance, nodeRho)
    }
}

/**
 * renders the entire frame
 * @param {ctx} gl webgl context
 * @param {Object} programInfo necessary info about the shader programs (attrib/uniform loc, etc.)
 */
const renderFrame = (gl, programInfo) => {
    renderNodes(gl, programInfo)
}
