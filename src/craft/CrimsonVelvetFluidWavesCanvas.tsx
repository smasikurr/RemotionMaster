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
    
    // Fanning angle: steeper (~55 deg) at left, flaring (~42 deg) toward right
    float ang = 0.84 - 0.22 * (p.x + 0.6);
    vec2 vDir = vec2(cos(ang), sin(ang));
    vec2 uDir = vec2(-sin(ang), cos(ang));
    
    float u = dot(p, uDir);
    float v = dot(p, vDir);
    
    // Gentle fluid fabric undulation
    float warp = 0.045 * sin(v * 2.2 + t * 0.42) + 0.020 * cos(v * 4.2 - t * 0.28);
    
    // Folds wave profile (sharp crests, rounded valleys, 14.5 frequency for 4 wide folds)
    float fold_phase = (u + warp) * 14.5 - t * 0.30 + 0.8;
    float wave = sin(fold_phase) * 0.5 + 0.5;
    float z = wave * wave * (3.0 - 2.0 * wave);
    
    // Mask: fade folds towards upper-right into smooth dark burgundy backdrop
    float foldMask = clamp(1.0 - (p.x * 0.72 - p.y * 0.52 + 0.20), 0.0, 1.0);
    foldMask = foldMask * foldMask * (3.0 - 2.0 * foldMask);
    float z_masked = z * foldMask;
    
    // Finite difference normals
    float eps = 0.005;
    vec2 p_dx = p + vec2(eps, 0.0);
    vec2 p_dy = p + vec2(0.0, eps);
    
    float ang_x = 0.84 - 0.22 * (p_dx.x + 0.6);
    float u_x = dot(p_dx, vec2(-sin(ang_x), cos(ang_x)));
    float v_x = dot(p_dx, vec2(cos(ang_x), sin(ang_x)));
    float w_x = 0.045 * sin(v_x * 2.2 + t * 0.42) + 0.020 * cos(v_x * 4.2 - t * 0.28);
    float wave_x = sin((u_x + w_x) * 14.5 - t * 0.30 + 0.8) * 0.5 + 0.5;
    float fm_x = clamp(1.0 - (p_dx.x * 0.72 - p_dx.y * 0.52 + 0.20), 0.0, 1.0);
    fm_x = fm_x * fm_x * (3.0 - 2.0 * fm_x);
    float z_x = (wave_x * wave_x * (3.0 - 2.0 * wave_x)) * fm_x;
    
    float ang_y = 0.84 - 0.22 * (p_dy.x + 0.6);
    float u_y = dot(p_dy, vec2(-sin(ang_y), cos(ang_y)));
    float v_y = dot(p_dy, vec2(cos(ang_y), sin(ang_y)));
    float w_y = 0.045 * sin(v_y * 2.2 + t * 0.42) + 0.020 * cos(v_y * 4.2 - t * 0.28);
    float wave_y = sin((u_y + w_y) * 14.5 - t * 0.30 + 0.8) * 0.5 + 0.5;
    float fm_y = clamp(1.0 - (p_dy.x * 0.72 - p_dy.y * 0.52 + 0.20), 0.0, 1.0);
    fm_y = fm_y * fm_y * (3.0 - 2.0 * fm_y);
    float z_y = (wave_y * wave_y * (3.0 - 2.0 * wave_y)) * fm_y;
    
    vec3 norm = normalize(vec3(-(z_x - z_masked) / eps, -(z_y - z_masked) / eps, 0.32));
    
    vec3 lightDir = normalize(vec3(-0.55, 0.65, 0.52));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    
    float ndotl = max(0.0, dot(norm, lightDir));
    float diff = (ndotl + 0.32) / 1.32;
    
    float ndotv = max(0.0, dot(norm, viewDir));
    float sheen = pow(1.0 - ndotv, 2.2);
    
    float ambient = 0.035 + 0.10 * foldMask;
    
    float r = (ambient + 0.76 * diff * z_masked + 0.28 * sheen * z_masked);
    float g = (0.002 + 0.020 * sheen * z_masked);
    float b = (0.004 + 0.030 * sheen * z_masked);
    
    // 8-bit film grain dither to prevent banding
    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    vec3 col = vec3(r, g, b) + (dither - 0.5) * 0.004;
    
    gl_FragColor = vec4(clamp(col * uBrightness, 0.0, 1.0), 1.0);
}
`;

export const CrimsonVelvetFluidWavesCanvas: React.FC<
  CrimsonVelvetFluidWavesCanvasProps
> = ({
  width = 3840,
  height = 2160,
  speed = 0.35,
  scale = 1.0,
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

    const gl = canvas.getContext("webgl", {
      preserveDrawingBuffer: true,
      antialias: true,
    });
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
      "uBrightness",
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
        display: "block",
        backgroundColor: "#0d0003",
        ...style,
      }}
    />
  );
};
