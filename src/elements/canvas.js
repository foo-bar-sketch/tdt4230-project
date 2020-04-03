/**
 * 
 * Creates the canvas we need
 * 
 */

const Canvas = () => {
    const element = document.createElement('canvas')

    // set properties
    element.id = 'webgl-window'

    // set style
    element.style.display = 'block'
    element.width = window.innerWidth
    element.height = window.innerHeight

    return element
}

export default Canvas
