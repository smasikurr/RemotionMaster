import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface VintageCRTSignalLossBeamCollapseCanvasProps {
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

vec2 hash22(vec2 p) {
    p = fract(p * vec2(443.897, 441.423));
    p += dot(p, p.yx + 19.19);
    return fract((p.xx + p.yx) * p.xy);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float time = iFrame / 60.0;
    
    // Scanline raster line modulation
    float scanline = sin(uv.y * iResolution.y * 3.14159) * 0.18 + 0.82;
    
    vec3 col = vec3(0.0);
    
    // =========================================================
    // PHASE 1: FRAMES 0 - 150 (Analog CRT Tracking & Sync Tear)
    // =========================================================
    if (iFrame < 155.0) {
        float p1Fade = 1.0 - smoothstep(140.0, 155.0, iFrame);
        
        // Stepped horizontal tracking bands
        float bandY1 = floor(uv.y * 60.0);
        float hTear1 = step(0.68, hash12(vec2(bandY1, floor(time * 24.0))));
        float grain1 = hash12(vec2(floor(uv.x * 240.0), bandY1));
        
        // Intense tracking noise bar at bottom edge
        float bottomBar = smoothstep(0.12, 0.01, uv.y) * step(0.2, hash12(vec2(floor(uv.x * 180.0), floor(time * 30.0)))) * 1.8;
        
        // Horizontal scan sync bars in middle
        float midBar1 = smoothstep(0.04, 0.0, abs(uv.y - 0.68)) * step(0.3, hash12(vec2(floor(uv.x * 220.0), floor(time * 20.0)))) * 1.6;
        float midBar2 = smoothstep(0.03, 0.0, abs(uv.y - 0.28)) * step(0.25, hash12(vec2(floor(uv.x * 200.0), floor(time * 25.0)))) * 1.4;
        
        // Horizontal sync tear lines
        float syncLine = hTear1 * grain1 * 1.2;
        
        float signal = (syncLine + bottomBar + midBar1 + midBar2) * scanline;
        col += vec3(signal) * p1Fade;
    }
    
    // =========================================================
    // PHASE 2: FRAMES 145 - 225 (Phosphor Screen Flash Surge)
    // =========================================================
    if (iFrame >= 140.0 && iFrame < 230.0) {
        float flashIn = smoothstep(140.0, 165.0, iFrame);
        float flashOut = 1.0 - smoothstep(195.0, 225.0, iFrame);
        float flash = flashIn * flashOut;
        
        float flashNoise = hash12(vec2(floor(uv.x * 160.0), floor(uv.y * 40.0)));
        float flashStreaks = (0.75 + 0.25 * flashNoise) * scanline;
        
        col += vec3(0.96, 0.98, 1.0) * flash * flashStreaks * 1.6;
    }
    
    // =========================================================
    // PHASE 3: FRAMES 215 - 360 (Cathode Ray Tube Beam Collapse)
    // =========================================================
    if (iFrame >= 215.0) {
        float t = (iFrame - 215.0) / 145.0; // 0 to 1 over collapse phase
        
        // 1. Vertical Collapse: Razor-sharp horizontal line
        float vProg = smoothstep(0.0, 0.35, t);
        float beamHeight = mix(0.45, 0.0010, vProg);
        float beamY = exp(-pow(p.y / beamHeight, 2.0));
        
        // 2. Horizontal Contraction: Contracts inward
        float hProg = smoothstep(0.28, 0.72, t);
        float halfWidth = mix(1.8, 0.012, hProg);
        float lineX = smoothstep(halfWidth, halfWidth - 0.03, abs(p.x));
        
        // 3. Central Electron Gun Focal Spot (Elliptical Hotspot)
        vec2 dotCoord = vec2(p.x * 0.52, p.y);
        float dist = length(dotCoord);
        float dotCore = exp(-pow(dist / 0.024, 2.0)) * 4.5;
        float dotHalo = exp(-dist * 28.0) * 1.6;
        
        // Fade out of central dot at the end
        float finalFade = 1.0 - smoothstep(0.68, 0.96, t);
        
        // Combine Beam Line + Center Focal Hotspot
        float beamIntensity = (beamY * lineX * 2.8 + dotCore + dotHalo) * finalFade;
        
        vec3 phosphorColor = vec3(0.98, 0.99, 1.0) * beamIntensity;
        col += phosphorColor;
    }
    
    // Fine analog sensor grain
    float grain = (hash12(gl_FragCoord.xy + fract(time) * 17.17) - 0.5) * 0.012;
    col += grain;
    
    // Pure Black clipping & Rec.709 tone
    col = max(vec3(0.0), col);
    col = col / (col + vec3(0.60)); // Filmic knee
    
    gl_FragColor = vec4(col, 1.0);
}
`;

export const VintageCRTSignalLossBeamCollapseCanvas: React.FC<
  VintageCRTSignalLossBeamCollapseCanvasProps
> = ({ seed = 63 }) => {
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
