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
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
    vColor      = aVertexColor;

    vec3 transformedNormal = uNMatrix * aVertexNormal;
    float lightWeighting   = max(dot(transformedNormal, uLightDirection), 0.0);
    vLightWeighting        = uAmbientColor + uLightColor * lightWeighting;
}