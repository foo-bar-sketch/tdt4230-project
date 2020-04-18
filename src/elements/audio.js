/**
 * Audio element
 */

/**
 * Creates an audio html element
 * @param {string} url url for the source audio file
 */
const Audio = (url) => {
    var element = document.createElement('audio')
    element.preload = true
    //var src = document.createElement('source')
    element.setAttribute('src', url)
    return element
}

export default Audio
