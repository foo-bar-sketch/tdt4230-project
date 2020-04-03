/**
 * Creates meshes of various shapes
 * 
 */
import Mesh from './mesh'


/**
 * Returns a square 2d particle
 */
export const SquareParticle = () => {
    var vertices = [
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0,
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0
    ]
    var normals = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
    ]
    var colors = [
        //15.0/255, 94.0/255, 156.0/255,
        35.0/255, 137.0/255, 218.0/255,
        //35.0/255, 137.0/255, 218.0/255,
        35.0/255, 137.0/255, 218.0/255,
        28.0/255, 163.0/255, 236.0/255,
        90.0/255, 188.0/255, 216.0/255,
        //15.0/255, 94.0/255, 156.0/255,
    ]
    var indices = [
        0, 1, 2,
        0, 2, 3,
    ]
    var uvs = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]
    return Mesh(
        vertices,
        normals,
        uvs,
        colors,
        indices
    )
}

/**
 * Returns a 2d particle
 */
export const Particle = () => {
    var vertices = [
        -1.0,  0.0,  0.0, // left
         0.0, -1.0,  0.0, // bottom
         1.0,  0.0,  0.0, // right
         0.0,  1.0,  0.0, // top
         0.0,  0.0,  0.0, // center
    ]
    var normals = [
        -1.0,  0.0,  0.0,
         0.0, -1.0,  0.0,
         1.0,  0.0,  0.0,
         0.0,  1.0,  1.0,
         0.0,  0.0,  1.0,
    ]
    var colors = [
        //15.0/255, 94.0/255, 156.0/255,
        35.0/255, 137.0/255, 218.0/255,
        //35.0/255, 137.0/255, 218.0/255,
        35.0/255, 137.0/255, 218.0/255,
        28.0/255, 163.0/255, 236.0/255,
        90.0/255, 188.0/255, 216.0/255,
        15.0/255, 94.0/255, 156.0/255,
    ]
    var indices = [
        0, 4, 3, // t0
        0, 1, 4, // t1
        1, 2, 4, // t2
        4, 2, 3, // t3
    ]
    var uvs = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.5, 0.5
    ]

    return Mesh(vertices, normals, uvs, colors, indices)
}

/**
 * Genereates a sphere mesh
 * @param {number} r the length of the radius
 * @returns Mesh the sphere mesh
 */
export const Sphere = (sphereRadius, slices, layers) => {
    var vertices = []
    var normals = []
    var colors = []
    var indices = []
    var uvs = []

    const toRadians = (degrees) => degrees * Math.PI / 180

    const degreesPerLayer = 180.0 / layers
    const degreesPerSlice = 360.0 / slices

    var i = 0

    for (let layer = 0; layer < layers; layer++) {
        let nextLayer = layer + 1

        let currentAngleZDegrees = degreesPerLayer * layer
        let nextAngleZDegrees = degreesPerLayer * nextLayer

        let currentZ = -Math.cos(toRadians(currentAngleZDegrees))
        let nextZ = -Math.cos(toRadians(nextAngleZDegrees))

        let radius = Math.sin(toRadians(currentAngleZDegrees))
        let nextRadius = Math.sin(toRadians(nextAngleZDegrees))

        for (let slice = 0; slice < slices; slice++) {
            let currentSliceAngleDegrees = slice * degreesPerSlice
            let nextSliceAngleDegrees = (slice + 1) * degreesPerSlice

            let currentDirectionX = Math.cos(toRadians(currentSliceAngleDegrees))
            let currentDirectionY = Math.sin(toRadians(currentSliceAngleDegrees))

            let nextDirectionX = Math.cos(toRadians(nextSliceAngleDegrees))
            let nextDirectionY = Math.sin(toRadians(nextSliceAngleDegrees))

            // vertices
            vertices.push(sphereRadius * radius * currentDirectionX)
            vertices.push(sphereRadius * radius * currentDirectionY)
            vertices.push(sphereRadius * currentZ)

            vertices.push(sphereRadius * radius * nextDirectionX)
            vertices.push(sphereRadius * radius * nextDirectionY)
            vertices.push(sphereRadius * currentZ)

            vertices.push(sphereRadius * nextRadius * nextDirectionX)
            vertices.push(sphereRadius * nextRadius * nextDirectionY)
            vertices.push(sphereRadius * nextZ)

            vertices.push(sphereRadius * radius * currentDirectionX)
            vertices.push(sphereRadius * radius * currentDirectionY)
            vertices.push(sphereRadius * currentZ)

            vertices.push(sphereRadius * nextRadius * nextDirectionX)
            vertices.push(sphereRadius * nextRadius * nextDirectionY)
            vertices.push(sphereRadius * nextZ)
 
            vertices.push(sphereRadius * nextRadius * currentDirectionX)
            vertices.push(sphereRadius * nextRadius * currentDirectionY)
            vertices.push(sphereRadius * nextZ)

            // normals
            normals.push(radius * currentDirectionX)
            normals.push(radius * currentDirectionY)
            normals.push(currentZ)

            normals.push(radius * nextDirectionX)
            normals.push(radius * nextDirectionY)
            normals.push(currentZ)

            normals.push(nextRadius * nextDirectionX)
            normals.push(nextRadius * nextDirectionY)
            normals.push(nextZ)

            normals.push(radius * currentDirectionX)
            normals.push(radius * currentDirectionY)
            normals.push(currentZ)

            normals.push(nextRadius * nextDirectionX)
            normals.push(nextRadius * nextDirectionY)
            normals.push(nextZ)

            normals.push(nextRadius * currentDirectionX)
            normals.push(nextRadius * currentDirectionY)
            normals.push(nextZ)

            // indices
            indices.push(i + 0)
            indices.push(i + 1)
            indices.push(i + 2)
            indices.push(i + 3)
            indices.push(i + 4)
            indices.push(i + 5)

            for (let j = 0; j < 6; j++) {
                let vertex = vertices[i + j]
                uvs.push(0.5 + (Math.atan(vertex[2], vertex[1]) / (2.0 * Math.PI)))
                uvs.push(0.5 - (Math.asin(vertex[1]) / Math.PI))
            }

            i += 6
        }
    }

    for (let i=0; i < vertices.length; i++) {
        colors.push([1.0, 1.0, 1.0])
    }

    return Mesh(vertices, normals, uvs, colors, indices)
}

/**
 * Generates a cube mesh
 * @param {number} l the length of the sides
 * @returns Mesh the cube mesh
 */
export const Cube = (l) => {
    
}

/**
 * Generates a box mesh
 * @param {number} l the length of the box
 * @param {number} w the width of the box
 * @param {number} h the height of the box
 * @returns Mesh the box mesh
 */
export const Box = (l, w, h) => {

}
