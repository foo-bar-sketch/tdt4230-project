/**
 * Source for the fragment shader
 * 
 */

const fragmentShader = `
    varying highp vec3 color_out;
    varying highp vec3 normal_out;
    varying highp vec3 position_out;
    varying highp vec2 uv_out;

    uniform mediump vec3 camLoc;
    uniform mediump vec3 centerLightPos;
    uniform mediump vec3 outsideLightPos;
    uniform mediump float particleDistance;
    uniform mediump float superRho;
    uniform mediump vec3 fireCol;

    uniform sampler2D uSampler; 

    void main() {
        highp vec3 normal = normalize(normal_out);
        highp vec2 uv = uv_out;
        highp vec3 vColor = color_out;
        highp vec3 cameLoc = vec3(0.0);
        mediump float shinyness = 15.0;
        mediump vec4 texCol = texture2D(uSampler, vec2(uv.s, uv.t));
        mediump vec3 fragCol = vec3(texCol);
        mediump vec3 diffColor = vec3(0.0);
        mediump vec3 specColor = vec3(0.0);
        mediump float ambLightInt = 0.9;
        mediump vec3 ambCol = ambLightInt * texCol.rgb;
        mediump float distanceCol = 1.0 / (particleDistance);

        for(int i = 1; i < 2; i++) {
            mediump vec3 lightPos = vec3(0.0);
            if (i == 1) {
                lightPos = centerLightPos;
            } else {
                lightPos = outsideLightPos;
            }
            mediump vec3 lightDir = normalize(lightPos - position_out);
            mediump vec3 specDir = reflect(-lightDir, normal);
            mediump vec3 camDir = normalize(camLoc - position_out);

            // compute light left w.r.t distance
            mediump float la = 1.0;
            mediump float lb = 0.005;
            mediump float lc = 0.001;
            mediump float leftOverLight = 1.0 / distance(lightPos, position_out);

            mediump float diffLightInt = max(dot(normal, lightDir), 0.0);
            mediump float specLightInt = pow(max(dot(camDir, specDir), 0.0), shinyness);
            diffColor += diffLightInt * texCol.rgb * leftOverLight;
            specColor += specLightInt * texCol.rgb * leftOverLight;
        }
        mediump vec4 color = vec4((diffColor + specColor + ambCol), texCol.a*distanceCol); //fragCol * distanceCol;
        gl_FragColor = color;
    }
`

export default fragmentShader
