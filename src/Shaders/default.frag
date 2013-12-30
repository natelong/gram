precision mediump float;

varying vec4 vColor;
varying vec3 vLightWeighting;

void main(void) {
    if(!gl_FrontFacing) {
        gl_FragColor = vec4(vColor.rgb * vLightWeighting * vec3(-1), vColor.a);
    } else {
        gl_FragColor = vec4(vColor.rgb * vLightWeighting, vColor.a);
    }
}