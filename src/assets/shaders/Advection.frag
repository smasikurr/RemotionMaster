precision highp float;
precision highp sampler2D;

varying vec2 vUV;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDissipation;

void main() {
    vec2 coord = vUV - uDt * texture2D(uVelocity, vUV).xy * uTexelSize;
    gl_FragColor = uDissipation * texture2D(uSource, coord);
}
