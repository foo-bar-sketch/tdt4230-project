/**
 * Audio element
 */

const Audio = (url) => {
    var element = document.createElement('audio')
    element.preload = true
    //var src = document.createElement('source')
    element.setAttribute('src', url)
    return element
}

export default Audio
