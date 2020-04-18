/**
 * Code belonging to the scenegraph
 */
import mat4 from 'gl-mat4'

export const GEOMETRY = 0
export const POINT_LIGHT = 1

/**
 * Holds info about a scenenode
 * @param {vec3} position 
 * @param {vec3} rotation 
 * @param {int} scale 
 * @param {vec3} refPoint 
 * @param {int} vaoID 
 * @param {int} vaoCount 
 * @param {str} nodeType 
 */
export const SceneNode = (position, rotation, scale, refPoint, vaoID, vaoCount, nodeType, lightId=null) => {
    return {
        position: position,
        rotation: rotation,
        scale: scale,
        animFunc: (x) => Math.exp(x),
        refPoint: refPoint,
        vaoID: vaoID,
        vaoCount: vaoCount,
        nodeType: nodeType,
        lightId: lightId,
        children: [],
        currentTransformation: mat4.create,
    }
}

/**
 * Binds parent and child together
 * @param {SceneNode} parent 
 * @param {SceneNode} child 
 */
export const addChild = (parent, child) => {
    parent.children.push(child)
}
