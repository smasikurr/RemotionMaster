import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface HalftoneParticleDotWaveTerrainCanvasProps {
  cols?: number;
  rows?: number;
  loopDurationSeconds?: number;
}

// 4x4 Matrix Utilities for WebGL View & Projection
function createPerspectiveMatrix(fovYRad: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1.0 / Math.tan(fovYRad / 2.0);
  const nf = 1.0 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;

  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;

  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;

  out[12] = 0;
  out[13] = 0;
  out[14] = (2 * far * near) * nf;
  out[15] = 0;
  return out;
}

function createLookAtMatrix(eye: number[], center: number[], up: number[]): Float32Array {
  const z0 = eye[0] - center[0];
  const z1 = eye[1] - center[1];
  const z2 = eye[2] - center[2];
  let len = 1 / Math.hypot(z0, z1, z2);
  const zx = z0 * len;
  const zy = z1 * len;
  const zz = z2 * len;

  const x0 = up[1] * zz - up[2] * zy;
  const x1 = up[2] * zx - up[0] * zz;
  const x2 = up[0] * zy - up[1] * zx;
  len = 1 / Math.hypot(x0, x1, x2);
  const xx = x0 * len;
  const xy = x1 * len;
  const xz = x2 * len;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  const out = new Float32Array(16);
  out[0] = xx;
  out[1] = yx;
  out[2] = zx;
  out[3] = 0;

  out[4] = xy;
  out[5] = yy;
  out[6] = zy;
  out[7] = 0;

  out[8] = xz;
  out[9] = yz;
  out[10] = zz;
  out[11] = 0;

  out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
  out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  out[15] = 1;
  return out;
}

function multiplyMatrices(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    const ai0 = a[i];
    const ai1 = a[i + 4];
    const ai2 = a[i + 8];
    const ai3 = a[i + 12];
    out[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
    out[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
    out[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
    out[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }
  return out;
}

const VERTEX_SHADER = `
precision highp float;

attribute vec2 aBasePos;

uniform float uTime;
uniform float uLoopDuration;
uniform mat4 uViewProj;
uniform vec3 uCameraPos;
uniform vec2 uViewportSize;

varying vec3 vColor;
varying float vAlpha;

void main() {
    float x = aBasePos.x;
    float z = aBasePos.y;
    
    // Fundamental loop frequency for seamless 12.0s loop
    float w0 = 6.28318530718 / uLoopDuration;
    float p1 = 1.0 * w0 * uTime;
    float p2 = 2.0 * w0 * uTime;
    float p3 = 3.0 * w0 * uTime;
    float p4 = 4.0 * w0 * uTime;
    
    // Multi-frequency organic undulating wave terrain with wider, gentle rolling dunes
    float wave1 = sin(x * 0.55 + p2) * cos(z * 0.42 - p1) * 0.55;
    float wave2 = sin((x * 0.38 + z * 0.32) - p3) * 0.40;
    float wave3 = cos(x * 0.82 - z * 0.52 + p2) * 0.24;
    float wave4 = sin(z * 0.70 + p4) * 0.16;
    float wave5 = cos((x - z) * 0.45 + p1) * 0.12;
    
    float y = wave1 + wave2 + wave3 + wave4 + wave5;
    
    vec3 worldPos = vec3(x, y, z);
    vec4 clipPos = uViewProj * vec4(worldPos, 1.0);
    gl_Position = clipPos;
    
    // Elevation-dependent normalization & crest power
    float normY = clamp((y + 1.15) / 2.3, 0.0, 1.0);
    float crestPower = pow(normY, 1.45);
    
    // Camera distance calculation
    float eyeDist = length(worldPos - uCameraPos);
    
    // Perspective Halftone Dot Size Modulation:
    // Visible valley dots ~2.4px, crest dots swell to ~11.5px in 4K
    float scaleFactor = uViewportSize.y / 2160.0;
    float baseRadius = mix(2.4, 11.5, crestPower) * scaleFactor;
    
    // Perspective scaling: size inversely proportional to distance
    float pointDiam = (baseRadius * 2.0) * (5.5 / max(eyeDist, 1.2));
    gl_PointSize = clamp(pointDiam, 1.2, 32.0);
    
    // Elevation Color Modulation:
    // Crests: radiant clean silver-white (#F2F4F8)
    // Mid slopes: elegant neutral platinum/slate (#8A909C)
    // Valleys: subtle visible graphite (#282B32)
    vec3 valleyColor = vec3(0.20, 0.22, 0.26);
    vec3 midColor = vec3(0.55, 0.58, 0.63);
    vec3 crestColor = vec3(0.96, 0.97, 1.0);
    
    vec3 col = mix(valleyColor, midColor, smoothstep(0.10, 0.55, crestPower));
    col = mix(col, crestColor, smoothstep(0.55, 0.92, crestPower));
    
    // Opacity: valleys remain visible (0.42) while crests shine bright (1.0)
    float opacity = mix(0.42, 1.0, smoothstep(0.06, 0.85, crestPower));
    
    // Smooth exponential distance fog into background
    float fog = exp(-pow(max(0.0, eyeDist - 3.5) * 0.09, 1.8));
    fog = clamp(fog, 0.0, 1.0);
    
    vColor = col;
    vAlpha = opacity * fog;
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec3 vColor;
varying float vAlpha;

void main() {
    // Perfectly round circular anti-aliased dot
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) {
        discard;
    }
    
    // Sub-pixel antialiased boundary falloff
    float edge = smoothstep(0.5, 0.38, dist);
    
    // Premultiplied alpha output for clean compositing
    gl_FragColor = vec4(vColor, vAlpha * edge);
}
`;

export const HalftoneParticleDotWaveTerrainCanvas: React.FC<
  HalftoneParticleDotWaveTerrainCanvasProps
> = ({ cols = 160, rows = 120, loopDurationSeconds = 12.0 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cached WebGL state
  const glState = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    buffer: WebGLBuffer;
    vertexCount: number;
    locations: {
      aBasePos: number;
      uTime: WebGLUniformLocation;
      uLoopDuration: WebGLUniformLocation;
      uViewProj: WebGLUniformLocation;
      uCameraPos: WebGLUniformLocation;
      uViewportSize: WebGLUniformLocation;
    };
  } | null>(null);

  // Initialize WebGL context and static grid once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    if (!gl) return;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog));
      return;
    }

    // Build dense 3D grid: X from -9.5 to +9.5, Z from 0.8 to 22.0
    const positions = new Float32Array(cols * rows * 2);
    let idx = 0;
    const xMin = -9.5, xMax = 9.5;
    const zMin = 0.8, zMax = 22.0;

    for (let r = 0; r < rows; r++) {
      const z = zMin + (r / (rows - 1)) * (zMax - zMin);
      for (let c = 0; c < cols; c++) {
        const x = xMin + (c / (cols - 1)) * (xMax - xMin);
        positions[idx++] = x;
        positions[idx++] = z;
      }
    }

    const buf = gl.createBuffer();
    if (!buf) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    glState.current = {
      gl,
      program: prog,
      buffer: buf,
      vertexCount: cols * rows,
      locations: {
        aBasePos: gl.getAttribLocation(prog, 'aBasePos'),
        uTime: gl.getUniformLocation(prog, 'uTime')!,
        uLoopDuration: gl.getUniformLocation(prog, 'uLoopDuration')!,
        uViewProj: gl.getUniformLocation(prog, 'uViewProj')!,
        uCameraPos: gl.getUniformLocation(prog, 'uCameraPos')!,
        uViewportSize: gl.getUniformLocation(prog, 'uViewportSize')!,
      },
    };
  }, [cols, rows]);

  // Render current frame
  useEffect(() => {
    const state = glState.current;
    if (!state) return;
    const { gl, program, buffer, vertexCount, locations } = state;

    // Viewport
    gl.viewport(0, 0, width, height);

    // Clear transparent so background atmosphere gradient shows through
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Alpha blending: additive-friendly normal blending onto deep matte background
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    gl.useProgram(program);

    // Bind grid positions
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(locations.aBasePos);
    gl.vertexAttribPointer(locations.aBasePos, 2, gl.FLOAT, false, 0, 0);

    // Time calculation (seconds)
    const timeInSec = (frame % (loopDurationSeconds * fps)) / fps;

    // Camera parameters:
    // Positioned slightly above the particle plane, tilted downward at ~22 deg
    // Terrain occupies the bottom 65% of the frame, fading smoothly into dark empty upper 35% sky
    const cameraPos = [0.0, 4.6, -2.6];
    const cameraTarget = [0.0, -0.4, 9.0];
    const cameraUp = [0.0, 1.0, 0.0];

    const fovYRad = (52.0 * Math.PI) / 180.0;
    const aspect = width / height;
    const projMat = createPerspectiveMatrix(fovYRad, aspect, 0.1, 50.0);
    const viewMat = createLookAtMatrix(cameraPos, cameraTarget, cameraUp);
    const viewProjMat = multiplyMatrices(projMat, viewMat);

    // Set uniforms
    gl.uniform1f(locations.uTime, timeInSec);
    gl.uniform1f(locations.uLoopDuration, loopDurationSeconds);
    gl.uniformMatrix4fv(locations.uViewProj, false, viewProjMat);
    gl.uniform3f(locations.uCameraPos, cameraPos[0], cameraPos[1], cameraPos[2]);
    gl.uniform2f(locations.uViewportSize, width, height);

    // Draw all halftone dots
    gl.drawArrays(gl.POINTS, 0, vertexCount);
  }, [frame, width, height, fps, loopDurationSeconds]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        background: 'radial-gradient(circle at 50% 45%, #15181e 0%, #080808 72%)',
        overflow: 'hidden',
      }}
    >
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
    </div>
  );
};
