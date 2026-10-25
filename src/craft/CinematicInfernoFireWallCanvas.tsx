import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface CinematicInfernoFireWallCanvasProps {
  seed?: number;
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
uniform float iFrame;
uniform float uSeed;

// 2D Hash function
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// 2D Value Noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 5-Octave Turbulent Fire Fractal Brownian Motion
const mat2 mRot = mat2(0.80, 0.60, -0.60, 0.80);
float fireFbm(vec2 p) {
    float f = 0.0;
    f += 0.5000 * noise(p); p = mRot * p * 2.02;
    f += 0.2500 * noise(p); p = mRot * p * 2.03;
    f += 0.1250 * noise(p); p = mRot * p * 2.01;
    f += 0.0625 * noise(p); p = mRot * p * 2.04;
    f += 0.0312 * noise(p);
    return f;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iFrame / 60.0; // 0 to 6.0 seconds
    
    // Left-to-right fire wall wipe timing:
    // 0.0 - 1.8s: Leading edge sweeps from x = -0.2 to x = 1.15
    // 1.8 - 4.2s: Full-screen roaring inferno coverage
    // 4.2 - 6.0s: Trailing edge sweeps from x = -0.1 to x = 1.25 clearing to black
    float leadProgress = clamp(t / 1.8, 0.0, 1.0);
    float leadX = -0.20 + leadProgress * 1.35;
    
    float trailProgress = clamp((t - 4.0) / 1.8, 0.0, 1.0);
    float trailX = -0.20 + trailProgress * 1.45;
    
    // Horizontal Flame Envelope
    float leadMask = smoothstep(leadX - 0.25, leadX + 0.15, uv.x);
    // Invert: we want fire on the LEFT of the leading edge
    float fireCoverage = (1.0 - leadMask);
    
    // Clear out behind the trailing edge
    float trailMask = smoothstep(trailX - 0.20, trailX + 0.15, uv.x);
    fireCoverage *= trailMask;
    
    if (fireCoverage <= 0.001) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    // Upward buoyancy advection + high-frequency turbulent swirling
    vec2 fireCoord = vec2(uv.x * 7.4, uv.y * 4.8);
    float upwardSpeed = t * 3.4;
    
    // Multi-tier domain warping for roaring flame tongues
    vec2 q = vec2(fireFbm(fireCoord + vec2(0.0, upwardSpeed) + uSeed),
                  fireFbm(fireCoord + vec2(4.3, upwardSpeed * 0.9) + uSeed * 1.5));
                  
    vec2 r = vec2(fireFbm(fireCoord + 2.8 * q + vec2(1.7, upwardSpeed * 1.2)),
                  fireFbm(fireCoord + 2.8 * q + vec2(8.3, upwardSpeed * 0.8)));
                  
    float flameNoise = fireFbm(fireCoord + 3.2 * r + vec2(0.0, upwardSpeed * 1.4));
    
    // Vertical flame falloff
    float verticalShape = 1.15 - 0.25 * uv.y;
    
    // High-contrast flame tongue dynamics: dark crevices between roaring tongues
    float fireIntensity = pow(flameNoise, 2.2) * 2.9 * verticalShape * fireCoverage;
    fireIntensity = clamp(fireIntensity, 0.0, 1.8);
    
    // Thermal Blackbody Color Palette:
    // Deep Ember Red: rgb(180, 20, 0)
    // Molten Orange: rgb(255, 120, 0)
    // Incandescent Golden Yellow: rgb(255, 210, 30)
    // White-Hot Heat Core: rgb(255, 255, 240)
    vec3 col = vec3(0.0);
    if (fireIntensity > 0.05) {
        // Red base
        col = mix(vec3(0.18, 0.02, 0.0), vec3(0.85, 0.14, 0.0), smoothstep(0.05, 0.35, fireIntensity));
        // Deep Orange tier
        col = mix(col, vec3(1.0, 0.42, 0.02), smoothstep(0.35, 0.65, fireIntensity));
        // Rich Golden Amber tier
        col = mix(col, vec3(1.0, 0.72, 0.08), smoothstep(0.65, 1.05, fireIntensity));
        // White-hot heat core
        col = mix(col, vec3(1.0, 0.95, 0.75), smoothstep(1.05, 1.50, fireIntensity));
    }
    
    // Soft outer falloff to guarantee 100% black outside
    float edgeCutoff = smoothstep(0.05, 0.15, fireIntensity);
    vec3 finalRGB = col * edgeCutoff;
    
    gl_FragColor = vec4(finalRGB, 1.0);
}
`;

export const CinematicInfernoFireWallCanvas: React.FC<CinematicInfernoFireWallCanvasProps> = ({
  seed = 57,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const locsRef = useRef<{
    resolution: WebGLUniformLocation | null;
    frame: WebGLUniformLocation | null;
    seed: WebGLUniformLocation | null;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true,
      antialias: true,
      depth: false,
    });
    if (!gl) return;
    glRef.current = gl;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    programRef.current = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    locsRef.current = {
      resolution: gl.getUniformLocation(prog, 'iResolution'),
      frame: gl.getUniformLocation(prog, 'iFrame'),
      seed: gl.getUniformLocation(prog, 'uSeed'),
    };
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const prog = programRef.current;
    const locs = locsRef.current;
    if (!gl || !prog || !locs) return;

    gl.viewport(0, 0, width, height);
    gl.useProgram(prog);

    if (locs.resolution) gl.uniform2f(locs.resolution, width, height);
    if (locs.frame) gl.uniform1f(locs.frame, frame);
    if (locs.seed) gl.uniform1f(locs.seed, seed);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [frame, width, height, seed]);

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
