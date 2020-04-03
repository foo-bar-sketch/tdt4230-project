/**
 * Mesh file
 */

/**
 * An object defined by vertices, normals, texture coordinates and indices
 * @param {Array[vec4]} vertices
 * @param {Array[vec4]} normals
 * @param {Array[vec4]} uvs
 * @param {Arra[vec3]} colors
 * @param {Array[int]} indices
 */
const Mesh = (vertices, normals, uvs, colors, indices) => {
    return {
        vertices: vertices,
        normals: normals,
        uvs: uvs,
        colors: colors,
        indices: indices,
    }
}

export default Mesh
