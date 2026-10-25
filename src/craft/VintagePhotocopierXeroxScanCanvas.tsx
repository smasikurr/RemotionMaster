import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface VintagePhotocopierXeroxScanCanvasProps {
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

// Pseudo random generator
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float hash1(float n) {
    return fract(sin(n) * 43758.5453123);
}

// 1D Perlin / value noise for vertical streaks
float noise1D(float x) {
    float i = floor(x);
    float f = fract(x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash1(i), hash1(i + 1.0), u);
}

// 2D value noise for dirty glass / paper cloudiness
float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    
    // Stepped stop-motion Xerox cadence: updates every 3 frames (~20 fps)
    float stepFrame = floor(iFrame / 3.0) + uSeed;
    
    // 1. Base paper tone
    float base = 0.385; // ~98 / 255
    
    // 2. Primary moving scanner beam (wandering around center x ~ 0.42 to 0.54)
    float beamOffset = (hash1(stepFrame * 17.13) - 0.5) * 0.09;
    float beamCenter = 0.45 + beamOffset;
    float beamSigma = 0.20;
    float beamDist = (uv.x - beamCenter) / beamSigma;
    float beamLight = exp(-0.5 * beamDist * beamDist) * 0.30;
    base += beamLight;
    
    // 3. Dark roller shadow band on the right (x ~ 0.77)
    float darkCenter = 0.77 + (hash1(stepFrame * 3.7) - 0.5) * 0.02;
    float darkDist = (uv.x - darkCenter) / 0.13;
    float darkBand = exp(-0.5 * darkDist * darkDist) * 0.16;
    base -= darkBand;
    
    // Left edge falloff
    float leftDist = uv.x / 0.16;
    float leftFalloff = exp(-0.5 * leftDist * leftDist) * 0.12;
    base -= leftFalloff;
    
    // 4. Roller Streaks (drum lines running vertically)
    float streakSeed = stepFrame * 103.1;
    float streaks = 0.0;
    streaks += (noise1D(uv.x * 25.0 + streakSeed) - 0.5) * 0.09;
    streaks += (noise1D(uv.x * 120.0 + streakSeed * 2.1) - 0.5) * 0.065;
    streaks += (noise1D(uv.x * 450.0 + streakSeed * 4.3) - 0.5) * 0.045;
    // Micro drum lines
    streaks += (hash1(floor(uv.x * iResolution.x / 3.0) + streakSeed) - 0.5) * 0.035;
    base += streaks;
    
    // 5. Low-frequency paper cloudiness / dirty glass mottling
    vec2 cloudCoord = vec2(uv.x * 6.0, uv.y * 2.0);
    float clouds = (noise2D(cloudCoord + vec2(stepFrame * 1.5, stepFrame * 0.8)) - 0.5) * 0.085;
    clouds += (noise2D(cloudCoord * 2.5 + vec2(stepFrame * 0.7, -stepFrame * 1.2)) - 0.5) * 0.045;
    base += clouds;
    
    // 6. High-frequency analog paper grain dither
    float grain = (hash(gl_FragCoord.xy + vec2(stepFrame * 37.19, stepFrame * 83.11)) - 0.5) * 0.080;
    base += grain;
    
    // 7. Random toner dust spots
    vec2 speckGrid = floor(gl_FragCoord.xy / 6.0);
    float speckRnd = hash(speckGrid + vec2(stepFrame * 19.3, 71.5));
    if (speckRnd > 0.9985) {
        vec2 speckCenter = (speckGrid + 0.5) * 6.0;
        float d = length(gl_FragCoord.xy - speckCenter);
        if (d < 2.5) {
            base -= (1.0 - d / 2.5) * 0.35;
        }
    }
    
    base = clamp(base, 0.0, 1.0);
    
    // Rec.709 neutral greyscale
    gl_FragColor = vec4(vec3(base), 1.0);
}
`;

export const VintagePhotocopierXeroxScanCanvas: React.FC<VintagePhotocopierXeroxScanCanvasProps> = ({
  seed = 54,
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
      antialias: false,
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
