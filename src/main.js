/**
 * Main js file for the project
 * 
 * 
 */
import { run } from './program'
import loadFile from './utils/loadFile'
import Audio from './elements/audio'
import wav from '../res/mus/cong.wav'

const main = () => {
    document.body.style.backgroundColor = '#000'
    var button = document.createElement('button')
    button.innerHTML = 'start'
    button.style.position = 'absolute'
    button.id = 'start-button'
    button.style.left = '100px'
    button.style.top = '200px'
    button.onclick = () => {
        document.getElementById('start-button').style.display = 'none'
        run()
    }
    document.body.appendChild(button)
    //run()
}


export default main
