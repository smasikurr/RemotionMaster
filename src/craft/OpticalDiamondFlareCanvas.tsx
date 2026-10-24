import React, { useEffect, useRef } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface OpticalDiamondFlareProps {
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
uniform float uPulse;
uniform float uShimmer;

void main() {
    vec2 p = gl_FragCoord.xy - 0.5 * iResolution.xy;
    
    // Anamorphic horizontal coordinates
    float xx = p.x;
    float yy = p.y;
    float r = length(p) + 1.0e-5;
    
    // Dynamic breathing scale
    float pulse = uPulse;
    float shimmer = uShimmer;
    
    // 1. Brilliant diamond starlight core
    float diamond_core = exp(-(abs(xx) + abs(yy)) / (22.0 * pulse));
    float diamond_glow = exp(-(abs(xx) + abs(yy)) / (75.0 * pulse)) * 0.75;
    float circle_core = exp(-r / (10.0 * pulse));
    float circle_glow = exp(-r / (110.0 * pulse)) * 0.45;
    
    // 2. Horizontal anamorphic flare (razor needle beam)
    float h_core = exp(-abs(yy) / (2.8 * pulse)) * exp(-abs(xx) / (560.0 * pulse));
    float h_long = exp(-abs(yy) / (1.5 * pulse)) * exp(-abs(xx) / (1120.0 * pulse)) * 0.55;
    float h_flare = h_core + h_long;
    
    // 3. Vertical diffraction spike
    float v_core = exp(-abs(xx) / (2.6 * pulse)) * exp(-abs(yy) / (480.0 * pulse));
    float v_long = exp(-abs(xx) / (1.4 * pulse)) * exp(-abs(yy) / (880.0 * pulse)) * 0.45;
    float v_flare = v_core + v_long;
    
    // 4. Short chromatic diagonal dispersion fans
    float sqrt2 = 1.41421356;
    float x_45 = (xx + yy) / sqrt2;
    float y_45 = (-xx + yy) / sqrt2;
    float diag_orange = exp(-abs(y_45) / 12.0) * exp(-abs(x_45) / (220.0 * shimmer));
    
    float x_135 = (-xx + yy) / sqrt2;
    float y_135 = (-xx - yy) / sqrt2;
    float diag_blue = exp(-abs(y_135) / 12.0) * exp(-abs(x_135) / (220.0 * shimmer));
    
    // Color synthesis: White core + Cardinal flares
    vec3 colWhite = vec3(1.0, 0.98, 1.0) * (h_flare + v_flare + diamond_core + diamond_glow * 0.95 + circle_core + circle_glow * 0.8);
    
    // Chromatic dispersion
    vec3 colOrange = vec3(0.95, 0.45, 0.10) * diag_orange;
    vec3 colBlue = vec3(0.18, 0.45, 1.00) * diag_blue;
    
    vec3 col = colWhite + colOrange + colBlue;
    
    // Subtle film dither
    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (dither - 0.5) * 0.005;
    
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export const OpticalDiamondFlareCanvas: React.FC<OpticalDiamondFlareProps> = ({
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

  // Dynamic optical pulse curve (matching reference video bursts)
  // Reference has subtle breathing with periodic intensity flaring
  const cycle = (frame % 300) / 300;
  const pulse = 1.0 + 0.28 * Math.sin(cycle * Math.PI * 4) + 0.15 * Math.sin(frame * 0.18);
  const shimmer = 1.0 + 0.22 * Math.cos(frame * 0.25);

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
    const uNames = ["iResolution", "iTime", "uPulse", "uShimmer"];
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
    if (u.uPulse) gl.uniform1f(u.uPulse, pulse);
    if (u.uShimmer) gl.uniform1f(u.uShimmer, shimmer);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [frame, fps, width, height, pulse, shimmer]);

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
