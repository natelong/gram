attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform mat4 uLightBias;
uniform mat4 uLightProjection;
uniform mat4 uLightView;

uniform vec3 uAmbientColor;
uniform vec3 uLightDirection;
uniform vec3 uLightColor;

varying vec4 vColor;
varying vec3 vLightWeighting;
varying vec4 vLightPosition;

void main(void) {
    vec4 v      = vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * uVMatrix * uMMatrix * v;
    vColor      = aVertexColor;

    vec3 transformedNormal = normalize(uNMatrix * aVertexNormal);
    float lightWeighting   = max(dot(transformedNormal, uLightDirection), 0.0);
    vLightWeighting        = uAmbientColor + uLightColor * lightWeighting;

    vLightPosition = uLightProjection * uLightView * uMMatrix * v;
}