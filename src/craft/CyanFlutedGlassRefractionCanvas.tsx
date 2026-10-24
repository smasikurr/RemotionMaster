import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface CyanFlutedGlassRefractionCanvasProps {
  fluteCount?: number;
  refractionStrength?: number;
  waveScale?: number;
  waveSpeed?: number;
  specularPower?: number;
  brightness?: number;
  contrast?: number;
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vUv = (aPosition + 1.0) * 0.5;
}
`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform float uFluteCount;
uniform float uRefractionStrength;
uniform float uWaveScale;
uniform float uWaveSpeed;
uniform float uSpecularPower;
uniform float uBrightness;
uniform float uContrast;

// Muted, authentic architectural fluted glass teal/cyan palette
vec3 getCausticColor(float val) {
    vec3 c0 = vec3(0.008, 0.024, 0.045); // Deep Obsidian Charcoal Navy
    vec3 c1 = vec3(0.032, 0.165, 0.225); // Deep Ocean Slate Teal
    vec3 c2 = vec3(0.075, 0.380, 0.455); // Rich Muted Oceanic Teal
    vec3 c3 = vec3(0.240, 0.780, 0.820); // Radiant Seafoam Cyan
    vec3 c4 = vec3(0.550, 0.940, 0.950); // Soft Seafoam Highlight

    if (val < 0.28) {
        return mix(c0, c1, val / 0.28);
    } else if (val < 0.58) {
        return mix(c1, c2, (val - 0.28) / 0.30);
    } else if (val < 0.84) {
        return mix(c2, c3, (val - 0.58) / 0.26);
    } else {
        return mix(c3, c4, (val - 0.84) / 0.16);
    }
}

void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    // 1. Vertical Fluted Glass Geometry (Rib width ~100px in 4K, 38 flutes)
    float fluteU = fract(uv.x * uFluteCount);
    float u = fluteU * 2.0 - 1.0; // range [-1.0, 1.0]

    // Convex cylindrical profile
    float nx = u * 0.85;
    float nz = sqrt(max(0.001, 1.0 - nx * nx));

    // Optical Snell Refraction displacement: horizontally compresses and refracts background light
    float refractOffset = -nx * (uRefractionStrength * 0.055);
    vec2 sampleUv = vec2(uv.x + refractOffset, uv.y);

    // 2. Large Majestic Sweeping Caustic Waves
    float t = uTime * uWaveSpeed;
    vec2 p = vec2(sampleUv.x * aspect, sampleUv.y) * uWaveScale;

    // Large sweeping diagonal fluid wave 1
    float w1 = sin(p.x * 1.4 + p.y * 1.1 + t * 0.48);
    // Counter-drifting ambient glow wave 2
    float w2 = cos(p.x * 1.8 - p.y * 1.5 - t * 0.36 + 0.8);
    // Smooth moving caustic pool center
    vec2 c1 = vec2(aspect * 0.5 + sin(t * 0.22) * 0.4, 0.5 + cos(t * 0.28) * 0.35);
    float d1 = length(vec2(sampleUv.x * aspect, sampleUv.y) - c1);
    float w3 = sin(d1 * 2.8 - t * 0.52);
    // Secondary soft wash
    float w4 = cos(p.x * 0.9 + sin(p.y * 2.0 + t * 0.3) * 0.8);

    // Composite smooth caustic density
    float density = (w1 * 0.38 + w2 * 0.32 + w3 * 0.20 + w4 * 0.10) * 0.5 + 0.5;
    density = clamp((density - 0.5) * uContrast + 0.5, 0.0, 1.0);

    vec3 baseColor = getCausticColor(density);

    // 3. Fluted Glass Specular & Shading
    // Soft, natural curved crest reflection (smooth broad falloff, not hard line)
    float crest = pow(max(0.0, 1.0 - abs(u) * 0.92), uSpecularPower);
    vec3 specularColor = vec3(0.35, 0.85, 0.88) * crest * density * 0.45;

    // Gentle groove shadow between flutes
    float grooveShadow = smoothstep(0.99, 0.72, abs(u));
    // Soft cylindrical curved shading
    float ribShading = nz * 0.60 + 0.40;

    // Composite
    vec3 finalColor = (baseColor * ribShading + specularColor) * grooveShadow * uBrightness;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const CyanFlutedGlassRefractionCanvas: React.FC<CyanFlutedGlassRefractionCanvasProps> = ({
  fluteCount = 38,
  refractionStrength = 1.0,
  waveScale = 1.35,
  waveSpeed = 0.85,
  specularPower = 2.2,
  brightness = 1.0,
  contrast = 1.25,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
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

    gl.useProgram(program);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    uniformsRef.current = {
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uTime: gl.getUniformLocation(program, 'uTime'),
      uFluteCount: gl.getUniformLocation(program, 'uFluteCount'),
      uRefractionStrength: gl.getUniformLocation(program, 'uRefractionStrength'),
      uWaveScale: gl.getUniformLocation(program, 'uWaveScale'),
      uWaveSpeed: gl.getUniformLocation(program, 'uWaveSpeed'),
      uSpecularPower: gl.getUniformLocation(program, 'uSpecularPower'),
      uBrightness: gl.getUniformLocation(program, 'uBrightness'),
      uContrast: gl.getUniformLocation(program, 'uContrast'),
    };
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const u = uniformsRef.current;
    if (!gl || !program) return;

    gl.viewport(0, 0, width, height);
    gl.useProgram(program);

    const time = frame / fps;

    if (u.uResolution) gl.uniform2f(u.uResolution, width, height);
    if (u.uTime) gl.uniform1f(u.uTime, time);
    if (u.uFluteCount) gl.uniform1f(u.uFluteCount, fluteCount);
    if (u.uRefractionStrength) gl.uniform1f(u.uRefractionStrength, refractionStrength);
    if (u.uWaveScale) gl.uniform1f(u.uWaveScale, waveScale);
    if (u.uWaveSpeed) gl.uniform1f(u.uWaveSpeed, waveSpeed);
    if (u.uSpecularPower) gl.uniform1f(u.uSpecularPower, specularPower);
    if (u.uBrightness) gl.uniform1f(u.uBrightness, brightness);
    if (u.uContrast) gl.uniform1f(u.uContrast, contrast);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [frame, width, height, fps, fluteCount, refractionStrength, waveScale, waveSpeed, specularPower, brightness, contrast]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
};
