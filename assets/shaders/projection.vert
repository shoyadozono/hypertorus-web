attribute vec4 aPosition4D;
attribute vec4 aColor;

uniform float uAngle;
uniform vec4 uCameraPosition4D;
uniform mat4 uModel4D;
uniform mat4 uView4D;

varying lowp vec4 vColor;

void main() {
    vec4 position4D = uModel4D * aPosition4D;
    float t = 1.0 / tan(uAngle * 0.5);
    vec4 v = position4D - uCameraPosition4D;
    float s = t / dot(v, vec4(uView4D[0][3], uView4D[1][3], uView4D[2][3], uView4D[3][3]));
    vec3 position3D = vec3(
        s * dot(v, vec4(uView4D[0][0], uView4D[1][0], uView4D[2][0], uView4D[3][0])),
        s * dot(v, vec4(uView4D[0][1], uView4D[1][1], uView4D[2][1], uView4D[3][1])),
        s * dot(v, vec4(uView4D[0][2], uView4D[1][2], uView4D[2][2], uView4D[3][2]))
    );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position3D, 1.0);
    gl_PointSize = 1.0;
    vColor = aColor;
}