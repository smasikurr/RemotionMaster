import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface VolumetricWhiteSmokeCloudBurstCanvasProps {
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

// Fast hash
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// 2D Value Noise with cubic Hermite interpolation
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

// 5-Octave Fractal Brownian Motion with rotation matrix
const mat2 mRot = mat2(0.80, 0.60, -0.60, 0.80);
float fbm(vec2 p) {
    float f = 0.0;
    f += 0.5000 * noise(p); p = mRot * p * 2.02;
    f += 0.2500 * noise(p); p = mRot * p * 2.03;
    f += 0.1250 * noise(p); p = mRot * p * 2.01;
    f += 0.0625 * noise(p); p = mRot * p * 2.04;
    f += 0.0312 * noise(p);
    return f;
}

void main() {
    vec2 uvPix = gl_FragCoord.xy;
    float t = iFrame / 60.0;
    
    // Dynamic Cloud Explosion & Dissipation
    // Expansion: rapid at t = 0 -> 2.5s, then plateaus
    float expansion = 1.0 - exp(-t * 1.35);
    float maxRadius = 0.27 * expansion;
    
    // Dissipation fade: stays 1.0 through t = 6.0s, then decays smoothly to 0 at t = 12.0s
    float fade = 1.0;
    if (t > 6.0) {
        fade = clamp(1.0 - (t - 6.0) / 5.8, 0.0, 1.0);
    }
    
    // Slow buoyancy upward drift
    vec2 center = vec2(0.5, 0.50 - 0.025 * (t / 12.0));
    
    // Centered aspect-corrected coordinates
    vec2 uv = (uvPix - center * iResolution.xy) / iResolution.y;
    
    // Elliptical cloud profile (1.40x horizontal width)
    vec2 ellipUV = vec2(uv.x / 1.40, uv.y);
    float dist = length(ellipUV);
    
    // Strict bounding check for 100% solid pitch black (#000000) background
    if (dist > maxRadius * 1.65 || fade <= 0.001) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    // Domain Warped Fractal Turbulence for Cumulus Cauliflower Lobes
    vec2 p = uv * 5.2;
    float timeWarp = t * 0.12;
    
    vec2 q = vec2(fbm(p + vec2(0.0, timeWarp) + uSeed),
                  fbm(p + vec2(5.2, -timeWarp * 0.8) + uSeed * 1.3));
                  
    vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + timeWarp * 0.5),
                  fbm(p + 3.0 * q + vec2(8.3, 2.8) - timeWarp * 0.6));
                  
    float smoke_turb = fbm(p + 3.0 * r);
    
    // Multi-scale cumulus cauliflower lobe boundary displacement
    float lobeDisplacement = (smoke_turb - 0.42) * 1.25;
    float radiusWithTurb = maxRadius * (0.80 + lobeDisplacement);
    
    // Core is solid dense white, falling off towards the turbulent perimeter
    float density = clamp((radiusWithTurb - dist) / (maxRadius * 0.48), 0.0, 1.0);
    density = density * density * (3.0 - 2.0 * density);
    
    // Subtle internal billow folds and crevice shadows
    density *= (0.75 + 0.35 * smoke_turb);
    density = clamp(density, 0.0, 1.0);
    density *= fade;
    
    // Directional 3D Self-Shadowing (Top-left key light)
    float eps = 0.008;
    float d_dx = fbm(p + vec2(eps, 0.0) + 3.0 * r);
    float d_dy = fbm(p + vec2(0.0, eps) + 3.0 * r);
    vec2 grad = vec2(d_dx - smoke_turb, d_dy - smoke_turb) / eps;
    vec3 normal = normalize(vec3(-grad * 0.45, 1.0));
    vec3 lightDir = normalize(vec3(0.25, 0.80, 0.53));
    float diff = clamp(dot(normal, lightDir), 0.0, 1.0);
    float shade = 0.75 + 0.25 * diff;
    
    // Core Brightness Boost: Dense center becomes pure solid white (#FFFFFF)
    float core = smoothstep(0.35, 0.78, density);
    vec3 col = mix(vec3(shade), vec3(1.0), core);
    
    // Smooth boundary cutoff for 100% pure black (#000000)
    float edgeMask = smoothstep(radiusWithTurb + 0.06, radiusWithTurb, dist);
    vec3 finalRGB = col * density * edgeMask;
    
    // Clean Rec.709 pure black output
    gl_FragColor = vec4(finalRGB, 1.0);
}
`;

export const VolumetricWhiteSmokeCloudBurstCanvas: React.FC<VolumetricWhiteSmokeCloudBurstCanvasProps> = ({
  seed = 55,
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
