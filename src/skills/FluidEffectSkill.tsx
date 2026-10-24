import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface FluidEffectSkillProps {
  colors?: [string, string, string]; // [deepBase, midFluid, crestHighlight]
  viscosity?: number;
  speed?: number;
  scale?: number;
  vorticity?: number;
  brightness?: number;
  style?: React.CSSProperties;
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUV;
void main() {
    vUV = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUV;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uScale;
uniform float uVorticity;
uniform float uBrightness;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

// Simplex-inspired analytical curl noise vector field for divergence-free fluid advection
vec2 curlNoise(vec2 p, float t) {
    float eps = 0.005;
    // Potential field psi
    float n1 = sin(p.x * 1.5 + t * 0.8) * cos(p.y * 1.4 - t * 0.6);
    float n2 = sin(p.x * 2.8 - t * 1.1 + n1 * 1.2) * cos(p.y * 2.5 + t * 0.9);
    
    // Curl = (dPsi/dy, -dPsi/dx)
    float psi_y = (sin(p.x * 1.5 + t * 0.8) * cos((p.y + eps) * 1.4 - t * 0.6) - n1) / eps;
    float psi_x = (sin((p.x + eps) * 1.5 + t * 0.8) * cos(p.y * 1.4 - t * 0.6) - n1) / eps;
    
    return vec2(psi_y, -psi_x) * uVorticity;
}

void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    p *= uScale;
    float t = iTime * uSpeed;
    
    vec2 pWarp = p;
    // 4 Iterative Advection Passes
    for (int i = 1; i <= 4; i++) {
        float fi = float(i);
        vec2 vel = curlNoise(pWarp * (0.8 + 0.3 * fi), t * 0.5);
        pWarp += (vel * 0.35 / fi) + vec2(
            sin(fi * 1.1 * pWarp.y + t * 0.3) * (0.4 / fi),
            cos(fi * 1.2 * pWarp.x + t * 0.35) * (0.4 / fi)
        );
    }
    
    // Surface heightfield / fluid density
    float d = sin(pWarp.x * 1.1 + 0.3 * pWarp.y) * cos(pWarp.y * 1.0 - 0.2 * pWarp.x);
    d = d * 0.5 + 0.5;
    
    // Finite differences for analytical surface normal & 3D liquid lighting
    vec2 eps = vec2(0.005, 0.0);
    vec2 p_x = p + eps.xy;
    vec2 p_y = p + eps.yx;
    for (int i = 1; i <= 4; i++) {
        float fi = float(i);
        vec2 vel_x = curlNoise(p_x * (0.8 + 0.3 * fi), t * 0.5);
        p_x += (vel_x * 0.35 / fi) + vec2(
            sin(fi * 1.1 * p_x.y + t * 0.3) * (0.4 / fi),
            cos(fi * 1.2 * p_x.x + t * 0.35) * (0.4 / fi)
        );
        vec2 vel_y = curlNoise(p_y * (0.8 + 0.3 * fi), t * 0.5);
        p_y += (vel_y * 0.35 / fi) + vec2(
            sin(fi * 1.1 * p_y.y + t * 0.3) * (0.4 / fi),
            cos(fi * 1.2 * p_y.x + t * 0.35) * (0.4 / fi)
        );
    }
    float d_x = sin(p_x.x * 1.1 + 0.3 * p_x.y) * cos(p_x.y * 1.0 - 0.2 * p_x.x) * 0.5 + 0.5;
    float d_y = sin(p_y.x * 1.1 + 0.3 * p_y.y) * cos(p_y.y * 1.0 - 0.2 * p_y.x) * 0.5 + 0.5;
    
    vec3 normal = normalize(vec3(-(d_x - d) * 18.0, -(d_y - d) * 18.0, 1.0));
    vec3 lightDir = normalize(vec3(-0.5, 0.7, 0.7));
    float diff = max(0.0, dot(normal, lightDir));
    
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(0.0, dot(normal, halfVec)), 24.0);
    float fresnel = pow(1.0 - max(0.0, normal.z), 2.2);
    
    // Multi-tone liquid shading
    vec3 col = mix(uColorA, uColorB, smoothstep(0.2, 0.65, d));
    col = mix(col, uColorC, smoothstep(0.60, 0.95, d));
    
    col = col * (diff * 0.75 + 0.25) + vec3(1.0) * spec * 0.7 + uColorC * fresnel * 0.45;
    
    // Smooth void falloff
    col *= smoothstep(0.12, 0.28, d);
    
    // Dither against banding
    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (dither - 0.5) * 0.005;
    
    gl_FragColor = vec4(clamp(col * uBrightness, 0.0, 1.0), 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export const FluidEffectSkill: React.FC<FluidEffectSkillProps> = ({
  colors = ["#020b18", "#0088cc", "#66ddff"],
  speed = 0.35,
  scale = 2.4,
  vorticity = 1.2,
  brightness = 1.05,
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  const uniformsRef = useRef<{ [key: string]: WebGLUniformLocation | null }>({});

  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true, antialias: true });
    if (!gl) return;
    glRef.current = gl;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    programRef.current = program;

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    bufferRef.current = buffer;

    gl.useProgram(program);
    const uNames = [
      "iResolution",
      "iTime",
      "uSpeed",
      "uScale",
      "uVorticity",
      "uBrightness",
      "uColorA",
      "uColorB",
      "uColorC",
    ];
    const uMap: { [key: string]: WebGLUniformLocation | null } = {};
    for (const name of uNames) {
      uMap[name] = gl.getUniformLocation(program, name);
    }
    uniformsRef.current = uMap;

    return () => {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
    };
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const buffer = bufferRef.current;
    const u = uniformsRef.current;
    if (!gl || !program || !buffer) return;

    gl.viewport(0, 0, width, height);
    gl.useProgram(program);

    const aPos = gl.getAttribLocation(program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const timeInSec = frame / fps;
    const [cAr, cAg, cAb] = hexToRgb(colors[0]);
    const [cBr, cBg, cBb] = hexToRgb(colors[1]);
    const [cCr, cCg, cCb] = hexToRgb(colors[2]);

    if (u.iResolution) gl.uniform2f(u.iResolution, width, height);
    if (u.iTime) gl.uniform1f(u.iTime, timeInSec);
    if (u.uSpeed) gl.uniform1f(u.uSpeed, speed);
    if (u.uScale) gl.uniform1f(u.uScale, scale);
    if (u.uVorticity) gl.uniform1f(u.uVorticity, vorticity);
    if (u.uBrightness) gl.uniform1f(u.uBrightness, brightness);
    if (u.uColorA) gl.uniform3f(u.uColorA, cAr, cAg, cAb);
    if (u.uColorB) gl.uniform3f(u.uColorB, cBr, cBg, cBb);
    if (u.uColorC) gl.uniform3f(u.uColorC, cCr, cCg, cCb);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [frame, fps, width, height, colors, speed, scale, vorticity, brightness]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
};
