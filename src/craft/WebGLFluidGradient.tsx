import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface WebGLFluidGradientProps {
  width?: number;
  height?: number;
  movementMode?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  // 0: Default Circular, 1: Linear, 2: Vortex, 3: Resonance, 4: Perturbation, 5: Burst, 6: Flow/Water, 7: Static
  scale?: number;
  phaseX?: number;
  velocity?: number;
  mode1Detail?: number;
  mode1Twist?: number;
  mode2Speed?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number; // 0 - 360
  rgbMultiplier?: [number, number, number];
  colorOffset?: number;
  grainAmount?: number;
  grainSize?: number;
  posterize?: number;
  scanlines?: number;
  colorPalette?: [number, number, number][]; // Normalized RGB [0..1]
  style?: React.CSSProperties;
  className?: string;
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vTexCoord;
void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vTexCoord = (aPosition + 1.0) * 0.5;
}
`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 vTexCoord;

uniform vec2 iResolution;
uniform float iTime;
uniform float uScale;
uniform float uPhaseX;
uniform float uVelocity;
uniform float uMode1Detail;
uniform float uMode1Twist;
uniform float uMode2Speed;
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uHue;
uniform vec3 uRgbMultiplier;
uniform float uColorOffset;
uniform float uGrainAmount;
uniform float uGrainSize;
uniform float uPosterize;
uniform float uScanlines;
uniform int uMovementMode;

const int iterationTime1 = 16;
const int iterationTime2 = 12;

float f(in vec2 p) {
    float time = iTime;
    vec2 pOffset = vec2(0.0);
    
    if (uMovementMode == 0) {
        float timeOffset = time * uVelocity + uPhaseX;
        return sin(p.x + sin(p.y + timeOffset)) * sin(p.y * p.x * 0.1 + time * uVelocity);
    } else if (uMovementMode == 1) {
        float timeOffset = time * uVelocity;
        pOffset = vec2(timeOffset * 0.5, timeOffset * 0.3);
        return sin((p.x + pOffset.x) + sin((p.y + pOffset.y) + uPhaseX)) * sin((p.y + pOffset.y) * (p.x + pOffset.x) * 0.1);
    } else if (uMovementMode == 2) {
        float dist = length(p);
        float angle = atan(p.y, p.x) + time * uVelocity * 2.0 / (dist + 0.5);
        float vortex = dist * 0.3;
        pOffset = vec2(cos(angle), sin(angle)) * vortex;
        return sin((p.x + pOffset.x) + sin((p.y + pOffset.y) + uPhaseX)) * sin((p.y + pOffset.y) * (p.x + pOffset.x) * 0.1);
    } else if (uMovementMode == 3) {
        float freq1 = 2.0;
        float freq2 = 3.0;
        float wave1 = sin(p.x * freq1 + time * uVelocity) * sin(p.y * freq1 + time * uVelocity * 0.7);
        float wave2 = cos(p.x * freq2 + time * uVelocity * 1.3) * cos(p.y * freq2 + time * uVelocity * 0.9);
        pOffset = vec2(wave1 * 0.2 + wave2 * 0.15, wave1 * 0.15 - wave2 * 0.2);
        return sin((p.x + pOffset.x) + sin((p.y + pOffset.y) + uPhaseX)) * sin((p.y + pOffset.y) * (p.x + pOffset.x) * 0.1);
    } else if (uMovementMode == 4) {
        float noise1 = sin(p.x * 3.14159 + time * uVelocity) * cos(p.y * 2.71828 + time * uVelocity * 1.1);
        float noise2 = cos(p.x * 2.71828 - time * uVelocity * 0.8) * sin(p.y * 3.14159 - time * uVelocity);
        pOffset = vec2(noise1 * 0.25, noise2 * 0.25);
        return sin((p.x + pOffset.x) + sin((p.y + pOffset.y) + uPhaseX)) * sin((p.y + pOffset.y) * (p.x + pOffset.x) * 0.1);
    } else if (uMovementMode == 5) {
        vec2 center1 = vec2(0.3, 0.3);
        vec2 center2 = vec2(-0.3, -0.3);
        vec2 dir1 = normalize(p - center1);
        vec2 dir2 = normalize(p - center2);
        float dist1 = length(p - center1);
        float dist2 = length(p - center2);
        float expansion1 = sin(time * uVelocity * 2.0) * dist1 * 0.3;
        float expansion2 = cos(time * uVelocity * 2.0) * dist2 * 0.3;
        pOffset = dir1 * expansion1 + dir2 * expansion2;
        return sin((p.x + pOffset.x) + sin((p.y + pOffset.y) + uPhaseX)) * sin((p.y + pOffset.y) * (p.x + pOffset.x) * 0.1);
    } else if (uMovementMode == 6) {
        float flowX = sin(p.y * 1.5 + time * uVelocity) * 0.4;
        float flowY = cos(p.x * 1.5 + time * uVelocity * 0.7) * 0.4;
        float curl = sin(p.x * p.y * 2.0 + time * uVelocity) * 0.2;
        pOffset = vec2(flowX + curl, flowY - curl);
        return sin((p.x + pOffset.x) + sin((p.y + pOffset.y) + uPhaseX)) * sin((p.y + pOffset.y) * (p.x + pOffset.x) * 0.1);
    } else {
        return sin(p.x + sin(p.y + uPhaseX)) * sin(p.y * p.x * 0.1);
    }
}

struct Field {
    vec2 vel;
    vec2 pos;
};

Field computeField(in vec2 p) {
    Field fld;
    vec2 ep = vec2(0.05, 0.0);
    vec2 rz = vec2(0.0);
    
    for (int i = 0; i < iterationTime1; i++) {
        float t0 = f(p);
        float t1 = f(p + ep.xy);
        float t2 = f(p + ep.yx);
        vec2 g = vec2((t1 - t0), (t2 - t0)) / ep.xx;
        vec2 t = vec2(-g.y, g.x);
        
        p += (uMode1Twist * 0.01) * t + g * (1.0 / uMode1Detail);
        
        if (uMovementMode == 0) {
            p.x += sin(iTime * uMode2Speed / 10.0) / 10.0;
            p.y += cos(iTime * uMode2Speed / 10.0) / 10.0;
        } else if (uMovementMode == 6) {
            float flowX = sin(p.y * 2.0 + iTime * uMode2Speed / 8.0);
            float flowY = cos(p.x * 2.0 + iTime * uMode2Speed / 10.0);
            float swirl = sin(p.x * p.y * 3.0 + iTime * uMode2Speed / 12.0) * 0.5;
            p.x += (flowX + swirl) / 16.0;
            p.y += (flowY - swirl) / 16.0;
        }
        rz = g;
    }
    
    fld.vel = rz;
    for (int i = 1; i < iterationTime2; i++) {
        p.x += 0.3 / float(i) * sin(float(i) * 3.0 * p.y + iTime * uMode2Speed) + 0.5;
        p.y += 0.3 / float(i) * cos(float(i) * 3.0 * p.x + iTime * uMode2Speed) + 0.5;
    }
    fld.pos = p;
    return fld;
}

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 fragCoord = vTexCoord * iResolution;
    vec2 p = fragCoord.xy / iResolution.xy - 0.5;
    p.x *= iResolution.x / iResolution.y;
    p *= uScale;
    
    Field fld = computeField(p);
    
    // Smooth fluid color synthesis
    vec2 fp = fld.pos;
    float r = cos(fp.x + fp.y + 1.0) * 0.5 + 0.5;
    float g = sin(fp.x + fp.y + 1.0) * 0.5 + 0.5;
    float b = (sin(fp.x + fp.y) + cos(fp.x + fp.y)) * 0.3 + 0.5;
    vec3 col = sin(vec3(-0.3, 0.1, 0.5) + fp.x - fp.y) * 0.65 + 0.35;
    col = mix(col, vec3(r, g, b), 0.5);
    
    // Channel multipliers & color offset
    col *= uRgbMultiplier;
    col += vec3(uColorOffset);
    
    // HSL Adjustments
    vec3 hsv = rgb2hsv(clamp(col, 0.0, 1.0));
    hsv.x = fract(hsv.x + uHue / 360.0);
    hsv.y = clamp(hsv.y * uSaturation, 0.0, 1.0);
    col = hsv2rgb(hsv);
    
    // Contrast & Brightness
    col = (col - 0.5) * uContrast + 0.5;
    col *= uBrightness;
    
    // Scanlines
    if (uScanlines > 0.001) {
        float sl = sin(fragCoord.y * 1.5) * 0.5 + 0.5;
        col -= sl * uScanlines * 0.15;
    }
    
    // Micro Film Grain
    if (uGrainAmount > 0.001) {
        float noise = fract(sin(dot(fragCoord.xy + vec2(iTime * 12.34), vec2(12.9898, 78.233))) * 43758.5453);
        col += (noise - 0.5) * uGrainAmount * 0.1;
    }
    
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export const WebGLFluidGradient: React.FC<WebGLFluidGradientProps> = ({
  width = 3840,
  height = 2160,
  movementMode = 6, // Fluid flow by default
  scale = 6.0,
  phaseX = 0.1,
  velocity = 0.2,
  mode1Detail = 180.0,
  mode1Twist = 35.0,
  mode2Speed = 2.0,
  brightness = 1.0,
  contrast = 1.1,
  saturation = 1.2,
  hue = 0.0,
  rgbMultiplier = [1.0, 1.0, 1.0],
  colorOffset = 0.0,
  grainAmount = 0.05,
  scanlines = 0.0,
  style = {},
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  const uniformsRef = useRef<{ [key: string]: WebGLUniformLocation | null }>({});

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initialize WebGL once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true, antialias: true });
    if (!gl) {
      console.warn("WebGL not supported for WebGLFluidGradient");
      return;
    }
    glRef.current = gl;

    // Compile Vertex Shader
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("Vertex shader compile failed:", gl.getShaderInfoLog(vs));
    }

    // Compile Fragment Shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Fragment shader compile failed:", gl.getShaderInfoLog(fs));
    }

    // Create & link program
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link failed:", gl.getProgramInfoLog(program));
    }
    programRef.current = program;

    // Setup full-screen quad buffer
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    bufferRef.current = buffer;

    // Cache uniform locations
    gl.useProgram(program);
    const uniformNames = [
      "iResolution",
      "iTime",
      "uScale",
      "uPhaseX",
      "uVelocity",
      "uMode1Detail",
      "uMode1Twist",
      "uMode2Speed",
      "uBrightness",
      "uContrast",
      "uSaturation",
      "uHue",
      "uRgbMultiplier",
      "uColorOffset",
      "uGrainAmount",
      "uScanlines",
      "uMovementMode",
    ];
    const uMap: { [key: string]: WebGLUniformLocation | null } = {};
    for (const name of uniformNames) {
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

  // Render every frame synchronously
  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const buffer = bufferRef.current;
    const u = uniformsRef.current;
    if (!gl || !program || !buffer) return;

    gl.viewport(0, 0, width, height);
    gl.useProgram(program);

    // Bind quad buffer
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Uniform updates
    const timeInSeconds = frame / fps;
    if (u.iResolution) gl.uniform2f(u.iResolution, width, height);
    if (u.iTime) gl.uniform1f(u.iTime, timeInSeconds);
    if (u.uScale) gl.uniform1f(u.uScale, scale);
    if (u.uPhaseX) gl.uniform1f(u.uPhaseX, phaseX);
    if (u.uVelocity) gl.uniform1f(u.uVelocity, velocity);
    if (u.uMode1Detail) gl.uniform1f(u.uMode1Detail, mode1Detail);
    if (u.uMode1Twist) gl.uniform1f(u.uMode1Twist, mode1Twist);
    if (u.uMode2Speed) gl.uniform1f(u.uMode2Speed, mode2Speed);
    if (u.uBrightness) gl.uniform1f(u.uBrightness, brightness);
    if (u.uContrast) gl.uniform1f(u.uContrast, contrast);
    if (u.uSaturation) gl.uniform1f(u.uSaturation, saturation);
    if (u.uHue) gl.uniform1f(u.uHue, hue);
    if (u.uRgbMultiplier) gl.uniform3f(u.uRgbMultiplier, rgbMultiplier[0], rgbMultiplier[1], rgbMultiplier[2]);
    if (u.uColorOffset) gl.uniform1f(u.uColorOffset, colorOffset);
    if (u.uGrainAmount) gl.uniform1f(u.uGrainAmount, grainAmount);
    if (u.uScanlines) gl.uniform1f(u.uScanlines, scanlines);
    if (u.uMovementMode) gl.uniform1i(u.uMovementMode, movementMode);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [
    frame,
    fps,
    width,
    height,
    movementMode,
    scale,
    phaseX,
    velocity,
    mode1Detail,
    mode1Twist,
    mode2Speed,
    brightness,
    contrast,
    saturation,
    hue,
    rgbMultiplier,
    colorOffset,
    grainAmount,
    scanlines,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
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
