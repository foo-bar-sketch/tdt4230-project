/**
 * Source for the vertex shader
 */
const vertexShader = `
    attribute vec3 position;
    attribute vec3 normal_in;
    attribute vec3 color;
    attribute vec2 uv;
    
    uniform mat4 modMat;
    uniform mat4 viewMat;
    uniform mat4 projMat;
    uniform mat4 normMat;

    varying highp vec3 normal_out;
    varying highp vec3 position_out;
    varying highp vec3 color_out;
    varying highp vec2 uv_out;

    void main() {
        normal_out = normalize(mat3(normMat)*normal_in);
        uv_out = uv;
        gl_Position = projMat * viewMat * modMat * vec4(position, 1.0);
        color_out = color;
        position_out = vec3(modMat * vec4(position, 1.0));
    }
`

export default vertexShader
