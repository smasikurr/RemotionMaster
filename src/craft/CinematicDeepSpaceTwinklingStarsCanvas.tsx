import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface CinematicDeepSpaceTwinklingStarsCanvasProps {
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
vec2 hash22(vec2 p) {
    p = fract(p * vec2(443.897, 441.423));
    p += dot(p, p.yx + 19.19);
    return fract((p.xx + p.yx) * p.xy);
}

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

// Prominent 4-Point Anamorphic Optical Diffraction Star Spike with Chromatic Dispersion
vec3 renderHeroStar(vec2 uv, vec2 center, float size, vec3 color, float twinkle, float spikeLength) {
    vec2 d = uv - center;
    float dist = length(d);
    
    // Intense incandescent white-hot core
    float core = exp(-dist * dist * 3200.0 / (size * size)) * 3.5;
    float halo = exp(-dist * 28.0 / size) * 0.75;
    
    float ax = abs(d.x);
    float ay = abs(d.y);
    
    // Horizontal thin elongated anamorphic diffraction spike (with chromatic dispersion)
    float rayH_R = exp(-ay * 260.0 / size) * exp(-(abs(d.x + 0.003)) * (4.2 / spikeLength));
    float rayH_G = exp(-ay * 260.0 / size) * exp(-ax * (4.2 / spikeLength));
    float rayH_B = exp(-ay * 260.0 / size) * exp(-(abs(d.x - 0.003)) * (4.2 / spikeLength));
    vec3 rayH = vec3(rayH_R, rayH_G, rayH_B) * 1.8;
    
    // Vertical thin diffraction spike
    float rayV = exp(-ax * 260.0 / size) * exp(-ay * (6.5 / spikeLength)) * 1.5;
    
    // Diagonal subtle 8-point glint rays
    vec2 rotD = vec2(d.x + d.y, d.x - d.y) * 0.7071;
    float rayDiag = (exp(-abs(rotD.y) * 320.0 / size) * exp(-abs(rotD.x) * 22.0) +
                     exp(-abs(rotD.x) * 320.0 / size) * exp(-abs(rotD.y) * 22.0)) * 0.28;
                     
    vec3 starColor = (core * vec3(1.0) + (halo + rayV + rayDiag) * color + rayH * mix(color, vec3(1.0), 0.5)) * twinkle;
    return starColor;
}

// Hero Star Grid Layer
vec3 getHeroStarLayer(vec2 uv, float scale, float time) {
    vec2 p = uv * scale;
    vec2 id = floor(p);
    vec2 gv = fract(p) - 0.5;
    
    vec2 h = hash22(id);
    
    // Only ~22% of cells have a hero star
    if (h.y < 0.78) return vec3(0.0);
    
    vec2 center = (h - 0.5) * 0.78;
    
    // Twinkle frequency & organic breathing
    float freq = mix(0.9, 2.6, h.x);
    float phase = h.y * 6.28;
    float twinkle = 0.35 + 1.15 * pow(sin(time * freq + phase) * 0.5 + 0.5, 2.8);
    
    // Stellar spectral classification colors:
    // O/B: Cool electric blue-white (9000K)
    // A/F: Pure white diamond (6500K)
    // G/K: Warm golden incandescent (4500K)
    // M: Deep amber orange (3000K)
    vec3 col = vec3(1.0);
    if (h.x < 0.25) {
        col = vec3(1.0, 0.76, 0.44); // Warm amber / orange giant
    } else if (h.x < 0.58) {
        col = vec3(1.0, 0.98, 0.96); // Pure diamond white
    } else if (h.x < 0.84) {
        col = vec3(0.70, 0.88, 1.0);  // Cyan blue supergiant
    } else {
        col = vec3(1.0, 0.88, 0.68); // Golden star
    }
    
    float size = mix(0.85, 1.45, h.x * h.y);
    float spikeLength = mix(1.1, 2.4, h.x);
    
    return renderHeroStar(gv, center, size, col, twinkle, spikeLength);
}

// Sparse Background Pinprick Stars
vec3 getSparseBackgroundStars(vec2 uv, float scale, float time) {
    vec2 p = uv * scale;
    vec2 id = floor(p);
    vec2 gv = fract(p) - 0.5;
    
    vec2 h = hash22(id);
    
    // Very sparse: only 12% of cells have a pinprick star
    if (h.y < 0.88) return vec3(0.0);
    
    vec2 center = (h - 0.5) * 0.85;
    float dist = length(gv - center);
    
    float freq = mix(1.0, 3.8, h.x);
    float twinkle = 0.25 + 0.75 * pow(sin(time * freq + h.y * 6.28) * 0.5 + 0.5, 2.0);
    
    vec3 col = (h.x > 0.5) ? vec3(0.78, 0.90, 1.0) : vec3(1.0, 0.88, 0.70);
    float pinprick = exp(-dist * dist * 380.0) * twinkle * mix(0.25, 0.85, h.x);
    
    return col * pinprick;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float time = iFrame / 60.0;
    
    // Slow deep space pan/drift
    vec2 drift = vec2(time * 0.005, time * 0.0018);
    vec2 st = uv + drift;
    
    vec3 spaceColor = vec3(0.0); // Pure black deep space (#000000)
    
    // 1. Sparse background pinpricks
    spaceColor += getSparseBackgroundStars(st + vec2(0.15, 0.38), 35.0, time * 0.85);
    spaceColor += getSparseBackgroundStars(st + vec2(0.62, 0.71), 55.0, time * 1.15);
    
    // 2. Mid-distance glistening stars
    spaceColor += getHeroStarLayer(st + vec2(0.42, 0.18), 12.0, time * 0.95);
    
    // 3. Foreground Hero 4-Point Anamorphic Starlight Sparkles
    spaceColor += getHeroStarLayer(st + vec2(0.85, 0.54), 7.5, time * 1.05);
    
    // Subtle sensor noise to ensure smooth 10-bit gradients
    float grain = (hash12(gl_FragCoord.xy + fract(time) * 31.41) - 0.5) * 0.010;
    spaceColor += grain;
    
    // Pure Black Clipping & Rec.709 Tone Mapping
    spaceColor = max(vec3(0.0), spaceColor);
    
    gl_FragColor = vec4(spaceColor, 1.0);
}
`;

export const CinematicDeepSpaceTwinklingStarsCanvas: React.FC<
  CinematicDeepSpaceTwinklingStarsCanvasProps
> = ({ seed = 62 }) => {
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
