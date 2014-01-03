precision mediump float;

varying vec4 vColor;
varying vec3 vLightWeighting;
varying vec4 vLightPosition;

uniform sampler2D uDepth;

void main(void) {

    vec4 color;

    // if(gl_FrontFacing) {
        color = vec4(vColor.rgb * vLightWeighting, vColor.a);
    // } else {
    //     color = vec4(vColor.rgb * vLightWeighting * vec3(-1), vColor.a);
    // }

    float depth = vLightPosition.z / vLightPosition.w;
    if(depth > texture2D(uDepth, vLightPosition.xy).r) {
        // color *= 0.5;
        color = vec4(0, 0, 1, 1);
    }

    if(texture2D(uDepth, vLightPosition.xy).z > 0.2) {
        //color = vec4(1, 0, 0, 1);
    }

    gl_FragColor = color;
}