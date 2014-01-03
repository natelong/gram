precision mediump float;

void main(){
    gl_FragColor = vec4(vec3(gl_FragCoord.z / gl_FragCoord.w), 1.0);
}
