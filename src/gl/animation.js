/**
 * creates an animation for a particle system
 */

/**
 * Bubble animation
 * @param {Array[SceneNode]} particles all of the scene nodes
 * @param {Array[number]} particleRhos base particle Rhos
 * @param {vec3} particleVectors direction of particle
 * @param {number} audioTime current time of the audio track
 * @param {number} currentTime current time since start of animation
 * @param {number} amplitude amplitude of the audio track (normalized)
 * @param {number} maxRho maximum distance of particle from center of super shape
 * @param {number} minRho minimum distance of particle from center of super shape
 * @param {Object[function]} superShape parametric equation of super shape
 *
 * @returns {Array[SceneNode]} the particle nodes with updated positions
 */
const bubble = (particles, particleRhos, particleVectors, audioTime, currentTime, amplitude, maxRho, minRho, superShape) => {
    const n = particles.length
    var particleNodes = []
    let rho = amplitude*maxRho

    for (let i = 0; i < n; i++) {
        let reset = Math.random()
        let currentParticle = particles[i]
        let particleVector = particleVectors[i]
        let delta = currentParticle.animFunc(currentTime)
        let newRho = minRho  + delta
        let position = [0, 0, 0]
        if (newRho > maxRho || reset > 0.80) {
            position[0] = minRho * particleVector[0]
            position[1] = minRho * particleVector[1]
            position[2] = minRho * particleVector[2]
            currentParticle.animFunc = (x) => amplitude*Math.sqrt(x)
        } else {
            position[0] = newRho * particleVector[0]
            position[1] = newRho * particleVector[1]
            position[2] = newRho * particleVector[2]
        }
        
        currentParticle.position = position
        currentParticle.rotation[1] -= Math.PI/300
        particleNodes.push(currentParticle)
    }
    return particleNodes
}

export default bubble