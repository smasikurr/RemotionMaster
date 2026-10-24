precision highp float;
precision highp sampler2D;

varying vec2 vUV;
uniform sampler2D uDensity;
uniform vec2 uTexelSize;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uShading;

void main() {
    vec4 c = texture2D(uDensity, vUV);
    float d = c.r;

    // Normal evaluation via finite differences for 3D liquid sheen
    float dL = texture2D(uDensity, vUV - vec2(uTexelSize.x, 0.0)).r;
    float dR = texture2D(uDensity, vUV + vec2(uTexelSize.x, 0.0)).r;
    float dT = texture2D(uDensity, vUV + vec2(0.0, uTexelSize.y)).r;
    float dB = texture2D(uDensity, vUV - vec2(0.0, uTexelSize.y)).r;

    vec3 normal = normalize(vec3((dL - dR) * 15.0, (dB - dT) * 15.0, 1.0));
    vec3 lightDir = normalize(vec3(-0.5, 0.7, 0.8));
    float diff = max(0.0, dot(normal, lightDir));

    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(0.0, dot(normal, halfVec)), 28.0);
    float fresnel = pow(1.0 - max(0.0, normal.z), 2.5);

    // Multi-color palette mapping
    vec3 col = mix(uColorA, uColorB, smoothstep(0.1, 0.6, d));
    col = mix(col, uColorC, smoothstep(0.5, 0.95, d));

    col = col * (diff * 0.7 + 0.3) + vec3(1.0) * spec * 0.6 + uColorC * fresnel * 0.4;
    col *= smoothstep(0.02, 0.15, d);

    gl_FragColor = vec4(col, 1.0);
}
