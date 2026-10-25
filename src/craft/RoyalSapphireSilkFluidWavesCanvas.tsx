import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface RoyalSapphireSilkFluidWavesCanvasProps {
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
    
    // Fanning angle
    float ang = 0.92 - 0.18 * (p.x + 0.5);
    vec2 vDir = vec2(cos(ang), sin(ang));
    vec2 uDir = vec2(-sin(ang), cos(ang));
    
    float u = dot(p, uDir);
    float v = dot(p, vDir);
    
    // Gentle fluid fabric undulation
    float warp = 0.065 * sin(v * 2.2 + t * 0.45) + 0.030 * cos(v * 4.5 - t * 0.32);
    
    // Folds wave profile (9.8 frequency for 3-4 wide voluptuous silk folds)
    float fold_phase = (u + warp) * 9.8 - t * 0.32 + 0.6;
    float z = sin(fold_phase) * 0.5 + 0.5;
    
    // Finite difference normals
    float eps = 0.005;
    vec2 p_dx = p + vec2(eps, 0.0);
    vec2 p_dy = p + vec2(0.0, eps);
    
    float ang_x = 0.92 - 0.18 * (p_dx.x + 0.5);
    float u_x = dot(p_dx, vec2(-sin(ang_x), cos(ang_x)));
    float v_x = dot(p_dx, vec2(cos(ang_x), sin(ang_x)));
    float w_x = 0.065 * sin(v_x * 2.2 + t * 0.45) + 0.030 * cos(v_x * 4.5 - t * 0.32);
    float z_x = sin((u_x + w_x) * 9.8 - t * 0.32 + 0.6) * 0.5 + 0.5;
    
    float ang_y = 0.92 - 0.18 * (p_dy.x + 0.5);
    float u_y = dot(p_dy, vec2(-sin(ang_y), cos(ang_y)));
    float v_y = dot(p_dy, vec2(cos(ang_y), sin(ang_y)));
    float w_y = 0.065 * sin(v_y * 2.2 + t * 0.45) + 0.030 * cos(v_y * 4.5 - t * 0.32);
    float z_y = sin((u_y + w_y) * 9.8 - t * 0.32 + 0.6) * 0.5 + 0.5;
    
    vec3 norm = normalize(vec3(-(z_x - z) / eps, -(z_y - z) / eps, 0.32));
    
    vec3 lightDir = normalize(vec3(-0.55, 0.65, 0.52));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    
    float ndotl = max(0.0, dot(norm, lightDir));
    float diff = (ndotl + 0.38) / 1.38;
    
    float ndotv = max(0.0, dot(norm, viewDir));
    float sheen = pow(1.0 - ndotv, 2.5);
    
    // Left-to-right illumination bias matching reference
    float illum = clamp(1.0 - (p.x * 0.45 - p.y * 0.22), 0.75, 1.25);
    
    // Soft Luxurious Royal Sapphire Palette
    vec3 c_trough = vec3(0.035, 0.085, 0.320); // Midnight ocean navy
    vec3 c_mid = vec3(0.065, 0.260, 0.680);    // Royal sapphire
    vec3 c_crest = vec3(0.120, 0.520, 0.780);  // Soft cyan satin
    vec3 c_spec = vec3(0.250, 0.650, 0.880);   // Sheen glint
    
    float z_diff = clamp(z * diff, 0.0, 1.0);
    vec3 col_base;
    if (z_diff < 0.42) {
        col_base = mix(c_trough, c_mid, z_diff / 0.42);
    } else {
        col_base = mix(c_mid, c_crest, (z_diff - 0.42) / 0.58);
    }
    vec3 col = (col_base + c_spec * (sheen * z * 0.40)) * illum;
    
    // 8-bit film grain dither to prevent banding
    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    vec3 col_final = col + (dither - 0.5) * 0.004;
    
    gl_FragColor = vec4(clamp(col_final * uBrightness, 0.0, 1.0), 1.0);
}
`;

export const RoyalSapphireSilkFluidWavesCanvas: React.FC<
  RoyalSapphireSilkFluidWavesCanvasProps
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
        backgroundColor: "#030826",
        ...style,
      }}
    />
  );
};
