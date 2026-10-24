import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface OrganicFluidPlasmaProps {
  width?: number;
  height?: number;
  speed?: number;
  scale?: number;
  brightness?: number;
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
uniform float uSpeed;
uniform float uScale;
uniform float uBrightness;

void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    p *= uScale;
    
    float t = iTime * uSpeed;
    vec2 p_warp = p;
    
    // 4 harmonic fluid warp iterations (GradientGen vector field + Shadertoy)
    for (int i = 1; i <= 4; i++) {
        float fi = float(i);
        p_warp.x += (0.52 / fi) * sin(fi * 1.35 * p_warp.y + t * 0.42) + 0.10 * cos(t * 0.2);
        p_warp.y += (0.52 / fi) * cos(fi * 1.35 * p_warp.x + t * 0.42) + 0.10 * sin(t * 0.2);
    }
    
    // Height field
    float z = sin(p_warp.x * 0.92) * cos(p_warp.y * 0.92);
    z = z * 0.5 + 0.5; // [0, 1]
    
    // Finite differences for analytical surface normals & 3D lighting
    vec2 eps = vec2(0.005, 0.0);
    vec2 p_wx = p + eps.xy;
    vec2 p_wy = p + eps.yx;
    for (int i = 1; i <= 4; i++) {
        float fi = float(i);
        p_wx.x += (0.52 / fi) * sin(fi * 1.35 * p_wx.y + t * 0.42) + 0.10 * cos(t * 0.2);
        p_wx.y += (0.52 / fi) * cos(fi * 1.35 * p_wx.x + t * 0.42) + 0.10 * sin(t * 0.2);
        p_wy.x += (0.52 / fi) * sin(fi * 1.35 * p_wy.y + t * 0.42) + 0.10 * cos(t * 0.2);
        p_wy.y += (0.52 / fi) * cos(fi * 1.35 * p_wy.x + t * 0.42) + 0.10 * sin(t * 0.2);
    }
    float z_x = sin(p_wx.x * 0.92) * cos(p_wx.y * 0.92) * 0.5 + 0.5;
    float z_y = sin(p_wy.x * 0.92) * cos(p_wy.y * 0.92) * 0.5 + 0.5;
    
    vec3 normal = normalize(vec3(-(z_x - z) * 20.0, -(z_y - z) * 20.0, 1.0));
    vec3 lightDir = normalize(vec3(0.4, 0.6, 0.7));
    float diffuse = max(0.0, dot(normal, lightDir));
    
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(0.0, dot(normal, halfVec)), 10.0);
    
    // Calibrated Ridge & Crest distributions
    float ridge = exp(-pow(z - 0.62, 2.0) / (2.0 * 0.012));
    float crest = exp(-pow(z - 0.69, 2.0) / (2.0 * 0.0012));
    
    // Deep black mask for cavernous valleys
    float black_mask = 1.0 / (1.0 + exp(-(z - 0.38) * 18.0));
    
    // Color composition: Midnight abyss -> Royal sapphire -> Electric azure -> Specular peak
    vec3 colBase = vec3(0.02, 0.14, 0.44) * z * black_mask;
    vec3 colCyan = vec3(0.18, 0.68, 1.00) * ridge * (diffuse * 0.7 + 0.4) * black_mask;
    vec3 colCrest = (vec3(0.95, 0.98, 1.0) * crest * (diffuse * 0.6 + 0.5) + vec3(0.6, 0.7, 0.8) * spec) * black_mask;
    
    vec3 col = (colBase + colCyan + colCrest) * uBrightness;
    
    // Micro film dither against 8-bit quantization banding
    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (dither - 0.5) * 0.006;
    
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export const OrganicFluidPlasma: React.FC<OrganicFluidPlasmaProps> = ({
  width = 3840,
  height = 2160,
  speed = 0.42,
  scale = 3.8,
  brightness = 1.0,
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  const uniformsRef = useRef<{ [key: string]: WebGLUniformLocation | null }>({});

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true, antialias: true });
    if (!gl) {
      console.warn("WebGL not supported for OrganicFluidPlasma");
      return;
    }
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
    const uNames = ["iResolution", "iTime", "uSpeed", "uScale", "uBrightness"];
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

  // Update per frame
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
    if (u.uSpeed) gl.uniform1f(u.uSpeed, speed);
    if (u.uScale) gl.uniform1f(u.uScale, scale);
    if (u.uBrightness) gl.uniform1f(u.uBrightness, brightness);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [frame, fps, width, height, scale, speed, brightness]);

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
