import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface CrimsonVelvetFluidWavesCanvasProps {
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
    vec2 wx = p;
    
    // 4 harmonic fluid warp iterations with vertical drapery bias
    for (int i = 1; i <= 4; i++) {
        float fi = float(i);
        wx.x += (0.45 / fi) * sin(fi * 1.15 * wx.y + t * 0.45) + 0.08 * cos(t * 0.2);
        wx.y += (0.55 / fi) * cos(fi * 0.95 * wx.x + t * 0.35) + 0.12 * sin(t * 0.25);
    }
    
    float red_coord = wx.x * 0.76 + wx.y * 0.38 - 0.20;
    float z_red = pow(max(0.0, 1.0 - abs(sin(red_coord))), 1.25);
    
    float blue_coord = wx.x * 0.76 + wx.y * 0.38 + 1.22;
    float z_blue = pow(max(0.0, 1.0 - abs(sin(blue_coord))), 1.4);
    
    vec2 eps = vec2(0.005, 0.0);
    vec2 wx_x = p + eps.xy;
    vec2 wx_y = p + eps.yx;
    for (int i = 1; i <= 4; i++) {
        float fi = float(i);
        wx_x.x += (0.45 / fi) * sin(fi * 1.15 * wx_x.y + t * 0.45) + 0.08 * cos(t * 0.2);
        wx_x.y += (0.55 / fi) * cos(fi * 0.95 * wx_x.x + t * 0.35) + 0.12 * sin(t * 0.25);
        wx_y.x += (0.45 / fi) * sin(fi * 1.15 * wx_y.y + t * 0.45) + 0.08 * cos(t * 0.2);
        wx_y.y += (0.55 / fi) * cos(fi * 0.95 * wx_y.x + t * 0.35) + 0.12 * sin(t * 0.25);
    }
    
    float zr_x = pow(max(0.0, 1.0 - abs(sin(wx_x.x * 0.76 + wx_x.y * 0.38 - 0.20))), 1.25);
    float zr_y = pow(max(0.0, 1.0 - abs(sin(wx_y.x * 0.76 + wx_y.y * 0.38 - 0.20))), 1.25);
    vec3 norm_r = normalize(vec3(-(zr_x - z_red) / eps.x, -(zr_y - z_red) / eps.x, 1.0));
    
    float zb_x = pow(max(0.0, 1.0 - abs(sin(wx_x.x * 0.76 + wx_x.y * 0.38 + 1.22))), 1.4);
    float zb_y = pow(max(0.0, 1.0 - abs(sin(wx_y.x * 0.76 + wx_y.y * 0.38 + 1.22))), 1.4);
    vec3 norm_b = normalize(vec3(-(zb_x - z_blue) / eps.x, -(zb_y - z_blue) / eps.x, 1.0));
    
    vec3 lightDir = normalize(vec3(-0.55, 0.65, 0.52));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);
    
    float diff_r = max(0.0, dot(norm_r, lightDir));
    float spec_r = pow(max(0.0, dot(norm_r, halfVec)), 22.0);
    float fresnel_r = pow(1.0 - norm_r.z, 2.0);
    float r_mask = clamp((z_red - 0.18) * 4.2, 0.0, 1.0);
    
    vec3 col_red = (
        vec3(0.98, 0.02, 0.05) * (diff_r * 0.9 + 0.3) * pow(z_red, 0.85) +
        vec3(1.0, 0.25, 0.28) * spec_r * 1.1 +
        vec3(0.9, 0.05, 0.14) * fresnel_r * 0.75
    ) * r_mask;
    
    float diff_b = max(0.0, dot(norm_b, lightDir));
    float spec_b = pow(max(0.0, dot(norm_b, halfVec)), 18.0);
    float fresnel_b = pow(1.0 - norm_b.z, 2.2);
    float b_mask = clamp((z_blue - 0.16) * 4.0, 0.0, 1.0);
    
    vec3 col_blue = (
        vec3(0.03, 0.15, 0.34) * (diff_b * 0.85 + 0.25) * pow(z_blue, 0.95) +
        vec3(0.14, 0.32, 0.62) * spec_b * 0.85 +
        vec3(0.05, 0.20, 0.42) * fresnel_b * 0.65
    ) * b_mask;
    
    vec3 col = col_blue * (1.0 - r_mask * 0.95) + col_red;
    
    // Micro film dither against 8-bit banding
    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (dither - 0.5) * 0.005;
    
    gl_FragColor = vec4(clamp(col * uBrightness, 0.0, 1.0), 1.0);
}
`;

export const CrimsonVelvetFluidWavesCanvas: React.FC<CrimsonVelvetFluidWavesCanvasProps> = ({
  width = 3840,
  height = 2160,
  speed = 0.35,
  scale = 2.3,
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
