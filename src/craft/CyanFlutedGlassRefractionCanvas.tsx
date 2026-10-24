import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface CyanFlutedGlassRefractionCanvasProps {
  fluteCount?: number;
  refractionStrength?: number;
  waveSpeed?: number;
  beamWidth?: number;
  contrast?: number;
  brightness?: number;
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
uniform float uWaveSpeed;
uniform float uBeamWidth;
uniform float uContrast;
uniform float uBrightness;

// Rich cinematic teal/cyan palette matching reference
vec3 getBeamColor(float val) {
    vec3 c0 = vec3(0.004, 0.016, 0.030); // Deep Obsidian Charcoal Navy
    vec3 c1 = vec3(0.022, 0.125, 0.185); // Deep Ocean Slate Teal
    vec3 c2 = vec3(0.055, 0.320, 0.400); // Rich Peacock Teal
    vec3 c3 = vec3(0.140, 0.680, 0.740); // Vibrant Oceanic Cyan
    vec3 c4 = vec3(0.420, 0.880, 0.900); // Soft Specular Peak Glint

    if (val < 0.25) {
        return mix(c0, c1, val / 0.25);
    } else if (val < 0.55) {
        return mix(c1, c2, (val - 0.25) / 0.30);
    } else if (val < 0.82) {
        return mix(c2, c3, (val - 0.55) / 0.27);
    } else {
        return mix(c3, c4, (val - 0.82) / 0.18);
    }
}

void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    // 1. Lenticular Fluted Glass Geometry (36 to 40 flutes)
    float fluteU = fract(uv.x * uFluteCount);
    float u = fluteU * 2.0 - 1.0;

    // Cylindrical normal
    float nx = u * 0.85;
    float refractDist = -nx * (uRefractionStrength * 0.045);
    vec2 sampleUv = vec2(uv.x + refractDist, uv.y);

    // 2. High-Speed Sweeping Volumetric Caustic Light Beam
    float t = uTime * uWaveSpeed;

    // Primary sweeping beam: moves horizontally & diagonally across the frame
    float beamCenterX = 0.5 + 0.38 * sin(t * 1.15);
    float beamCenterY = 0.5 + 0.25 * cos(t * 0.85);
    vec2 beamCenter = vec2(beamCenterX, beamCenterY);

    float beamAngle = 0.45 + 0.25 * sin(t * 0.75);
    vec2 beamDir = vec2(cos(beamAngle), sin(beamAngle));
    vec2 beamNormal = vec2(-beamDir.y, beamDir.x);

    vec2 delta = (sampleUv - beamCenter) * vec2(aspect, 1.0);
    float distPerp = dot(delta, beamNormal);
    float distAlong = dot(delta, beamDir);

    float ripple = sin(distAlong * 5.0 - t * 2.8) * 0.12 + cos(distAlong * 10.0 + t * 3.5) * 0.05;
    float totalPerp = distPerp + ripple;
    float beamCore = exp(-pow(totalPerp / (uBeamWidth * 0.32), 2.0));

    // Secondary ambient counter-sweep beam
    float beam2CenterX = 0.5 - 0.35 * cos(t * 0.95);
    float beam2CenterY = 0.45 + 0.30 * sin(t * 1.25);
    vec2 delta2 = (sampleUv - vec2(beam2CenterX, beam2CenterY)) * vec2(aspect, 1.0);
    float distPerp2 = dot(delta2, vec2(0.65, 0.75));
    float beam2Core = exp(-pow((distPerp2 + sin(delta2.y * 6.0 + t * 2.2) * 0.08) / (uBeamWidth * 0.42), 2.0)) * 0.55;

    float lightIntensity = clamp((beamCore * 1.25 + beam2Core) * uContrast, 0.0, 1.2);

    // Smooth cylindrical rib shading: peaks smoothly in center, soft shadow at rib valleys
    float ribShading = pow(sin(fluteU * 3.14159265), 0.65);

    // Subtle specular crest glint
    float crest = pow(max(0.0, 1.0 - abs(u) * 0.96), 4.5);
    vec3 specularGlint = vec3(0.40, 0.85, 0.90) * crest * lightIntensity * 0.45;

    vec3 baseColor = getBeamColor(lightIntensity * ribShading);
    vec3 finalColor = (baseColor + specularGlint) * uBrightness;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const CyanFlutedGlassRefractionCanvas: React.FC<CyanFlutedGlassRefractionCanvasProps> = ({
  fluteCount = 36,
  refractionStrength = 1.0,
  waveSpeed = 1.35,
  beamWidth = 1.0,
  contrast = 1.35,
  brightness = 1.05,
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
      uWaveSpeed: gl.getUniformLocation(program, 'uWaveSpeed'),
      uBeamWidth: gl.getUniformLocation(program, 'uBeamWidth'),
      uContrast: gl.getUniformLocation(program, 'uContrast'),
      uBrightness: gl.getUniformLocation(program, 'uBrightness'),
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
    if (u.uWaveSpeed) gl.uniform1f(u.uWaveSpeed, waveSpeed);
    if (u.uBeamWidth) gl.uniform1f(u.uBeamWidth, beamWidth);
    if (u.uContrast) gl.uniform1f(u.uContrast, contrast);
    if (u.uBrightness) gl.uniform1f(u.uBrightness, brightness);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [frame, width, height, fps, fluteCount, refractionStrength, waveSpeed, beamWidth, contrast, brightness]);

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
