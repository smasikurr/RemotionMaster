precision highp float;
precision highp sampler2D;

varying vec2 vUV;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
    float L = texture2D(uVelocity, vUV - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUV + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uVelocity, vUV + vec2(0.0, uTexelSize.y)).y;
    float B = texture2D(uVelocity, vUV - vec2(0.0, uTexelSize.y)).y;

    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
