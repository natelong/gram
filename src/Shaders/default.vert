attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform vec3 uAmbientColor;
uniform vec3 uLightDirection;
uniform vec3 uLightColor;

varying vec4 vColor;
varying vec3 vLightWeighting;

void main(void) {
    vec4 v      = vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * uVMatrix * uMMatrix * v;
    vColor      = aVertexColor;

    if(aVertexNormal.x == 0.0 && aVertexNormal.y == 0.0 && aVertexNormal.z == 0.0) {
        vLightWeighting = vec3(1.0);
    } else {
        vec3 transformedNormal = normalize(uNMatrix * aVertexNormal);
        float lightWeighting   = max(dot(transformedNormal, uLightDirection), 0.0);
        vLightWeighting        = uAmbientColor + uLightColor * lightWeighting;
    }
}