import React, { useEffect, useRef } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface AnalogFilmBurnCanvasProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float uFlashIntensity;
uniform float uLeakIntensity;
uniform vec2 uLeakPos;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float xx = uv.x;
    float yy = 1.0 - uv.y;
    
    // 1. Full-frame Solarized Film Burn Flash
    vec2 flashCenter = vec2(0.55, 0.38);
    vec2 dFlash = (vec2(xx, yy) - flashCenter) * vec2(1.0, 1.15);
    float rFlash = length(dFlash);
    float core = exp(-rFlash * rFlash * 3.2);
    
    float flashR = 248.0 + 3.0 * core;
    float flashG = 145.0 + 55.0 * core + 20.0 * (1.0 - yy) - 15.0 * xx;
    float flashB = 132.0 + 38.0 * core + 25.0 * (1.0 - xx) * yy;
    vec3 flashCol = vec3(flashR, flashG, flashB) / 255.0;
    
    // 2. Sweeping Light Leak Blob (emulsion overexposure)
    vec2 leakDiff = (vec2(xx, yy) - uLeakPos) * vec2(0.75, 1.3);
    float leakDist = length(leakDiff);
    float leakStrength = exp(-leakDist * leakDist * 2.4);
    
    vec3 leakCol = mix(vec3(0.85, 0.06, 0.14), vec3(1.0, 0.80, 0.18), smoothstep(0.12, 0.75, leakStrength));
    
    // Celluloid dark stock base
    vec3 col = vec3(0.015, 0.012, 0.014);
    col += leakCol * leakStrength * uLeakIntensity;
    col = mix(col, flashCol, uFlashIntensity);
    
    // Authentic 35mm film grain dither
    float grain = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 17.3), vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.032;
    
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export const AnalogFilmBurnCanvas: React.FC<AnalogFilmBurnCanvasProps> = ({
  width = 3840,
  height = 2160,
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  const uniformsRef = useRef<{ [key: string]: WebGLUniformLocation | null }>({});

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic light leak and flash envelope across the 360 frames (6.0s)
  // 1. Initial light leak on right edge (frame 40 - 130, peak at 90)
  const leakIntensity = interpolate(
    frame,
    [30, 85, 95, 140],
    [0.0, 1.15, 1.10, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const leakX = interpolate(frame, [30, 140], [0.95, 0.70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leakY = interpolate(frame, [30, 140], [0.55, 0.48], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Major Solarized Film Burn Flash (frame 175 - 255, peak at 210 = 3.5s)
  const flash1 = interpolate(
    frame,
    [175, 205, 215, 255],
    [0.0, 1.0, 0.95, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 3. Secondary Outro Light Flash (frame 310 - 355, peak at 330)
  const flash2 = interpolate(
    frame,
    [310, 330, 355],
    [0.0, 0.85, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const totalFlash = Math.min(1.0, flash1 + flash2);

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
    const uNames = ["iResolution", "iTime", "uFlashIntensity", "uLeakIntensity", "uLeakPos"];
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
    if (u.iResolution) gl.uniform2f(u.iResolution, width, height);
    if (u.iTime) gl.uniform1f(u.iTime, timeInSec);
    if (u.uFlashIntensity) gl.uniform1f(u.uFlashIntensity, totalFlash);
    if (u.uLeakIntensity) gl.uniform1f(u.uLeakIntensity, leakIntensity);
    if (u.uLeakPos) gl.uniform2f(u.uLeakPos, leakX, leakY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [frame, fps, width, height, totalFlash, leakIntensity, leakX, leakY]);

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
