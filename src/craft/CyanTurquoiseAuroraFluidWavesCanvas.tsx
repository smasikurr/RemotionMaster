import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface CyanTurquoiseAuroraFluidWavesCanvasProps {
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

// 1D and 2D Hash
float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

// 2D Value Noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    float a = hash12(i + vec2(0.0, 0.0));
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 3-Octave Smooth Wave fBm
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.55;
    mat2 rot = mat2(0.85, 0.52, -0.52, 0.85);
    for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p = rot * p * 2.05;
        a *= 0.48;
    }
    return v;
}

void main() {
    // Aspect-ratio normalized coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float time = iFrame / 60.0;
    
    // Anamorphic horizontal stretch (mimicking optical anamorphic lens blur on fluid)
    vec2 p = vec2(uv.x * 0.55, uv.y * 1.5);
    
    // Multi-scale slow horizontal drift and vertical undulation
    float tSlow = time * 0.28;
    
    // Low frequency 2D organic warp for fluid blob thickness modulation
    float fluidNoise = fbm(vec2(p.x * 0.8 + tSlow * 0.35, p.y * 1.2 - tSlow * 0.2));
    float fluidNoise2 = fbm(vec2(p.x * 1.1 - tSlow * 0.25, p.y * 0.9 + tSlow * 0.15));
    
    // Wave ribbon coordinates with organic thickness & displacement
    float w1 = sin(p.x * 1.5 + tSlow * 1.3 + cos(p.y * 1.8 + tSlow) * 1.1 + fluidNoise * 1.4);
    float w2 = cos(p.x * 1.9 - tSlow * 1.1 + sin(p.y * 1.5 - tSlow * 0.7) * 1.3 - fluidNoise2 * 1.2);
    float w3 = sin(p.x * 1.0 + tSlow * 0.8 + w1 * 0.6);
    
    // Upper ribbon band (around y = +0.22)
    float upperY = 0.22 + w1 * 0.16 + w3 * 0.09;
    float distUpper = abs(p.y - upperY);
    float upperWidth = 22.0 - fluidNoise * 12.0; // Dynamic thickness
    float upperBand = exp(-distUpper * distUpper * max(8.0, upperWidth)) * smoothstep(-1.1, 0.7, sin(p.x * 1.2 + tSlow));
    
    // Main lower ribbon band (around y = -0.18)
    float lowerY = -0.18 + w2 * 0.20 - w1 * 0.12;
    float distLower = abs(p.y - lowerY);
    float lowerWidth = 16.0 - fluidNoise2 * 10.0;
    float lowerBand = exp(-distLower * distLower * max(6.0, lowerWidth)) * (0.85 + 0.40 * cos(p.x * 0.9 - tSlow * 1.2));
    
    // Organic soft dark cloud masking that carves out the dark grey voids
    float darkVoid = smoothstep(0.2, 0.85, fbm(vec2(p.x * 0.9 + tSlow * 0.3, p.y * 1.5 + fluidNoise * 0.5)));
    
    // Core intense cyan glow
    float core = (upperBand * 1.3 + lowerBand * 1.8) * (1.2 - 0.65 * darkVoid);
    float softGlow = (exp(-distUpper * 6.0) * 0.4 + exp(-distLower * 4.5) * 0.6) * (1.1 - 0.5 * darkVoid);
    
    // Color Palette matching reference:
    // Dark Charcoal Slate Base (#1c1e22)
    vec3 baseBg = vec3(0.11, 0.12, 0.135);
    
    // Deep Teal Shadow Tone (#004c5c)
    vec3 deepTeal = vec3(0.0, 0.30, 0.36);
    // Rich Turquoise Body (#00b8c8)
    vec3 midTurq = vec3(0.0, 0.72, 0.78);
    // Brilliant Neon Cyan Core (#00f6ff)
    vec3 hotCyan = vec3(0.0, 0.96, 1.0);
    // Ultra Hot White-Cyan highlight
    vec3 coreWhite = vec3(0.55, 1.0, 1.0);
    
    // Blend from background to glowing fluid ribbons
    vec3 col = baseBg;
    col += deepTeal * softGlow * 1.4;
    col = mix(col, midTurq, smoothstep(0.2, 0.9, core));
    col = mix(col, hotCyan, smoothstep(0.9, 1.8, core));
    col = mix(col, coreWhite, smoothstep(1.8, 2.8, core));
    
    // 4K Film grain to eliminate 8-bit banding on dark gradients
    float grain = (hash12(gl_FragCoord.xy + fract(time) * 31.73) - 0.5) * 0.009;
    col += grain;
    
    // Broadcast tone mapping
    col = clamp(col, 0.0, 1.0);
    
    gl_FragColor = vec4(col, 1.0);
}
`;

export const CyanTurquoiseAuroraFluidWavesCanvas: React.FC<
  CyanTurquoiseAuroraFluidWavesCanvasProps
> = ({ seed = 64 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);

    const quad = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'iResolution');
    const uFrame = gl.getUniformLocation(prog, 'iFrame');
    const uSeedLoc = gl.getUniformLocation(prog, 'uSeed');

    gl.viewport(0, 0, width, height);
    gl.uniform2f(uRes, width, height);
    gl.uniform1f(uFrame, frame);
    gl.uniform1f(uSeedLoc, seed);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    return () => {
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
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
