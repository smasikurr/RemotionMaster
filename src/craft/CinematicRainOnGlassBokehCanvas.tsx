import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface CinematicRainOnGlassBokehCanvasProps {
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

// Bokeh Disc with natural spherical aberration, chromatic edge, and soft glow halo
vec3 renderBokehDisc(vec2 uv, vec2 center, float radius, vec3 color, float brightness) {
    vec2 delta = uv - center;
    float dist = length(delta);
    float normDist = dist / radius;
    
    // Outer halo
    float halo = exp(-normDist * 1.8) * 0.35;
    
    if (normDist > 1.08) {
        return color * halo * brightness;
    }
    
    // Chromatic edge fringe
    float rEdge = smoothstep(1.03, 0.82, dist / (radius * 1.03));
    float gEdge = smoothstep(1.00, 0.80, dist / radius);
    float bEdge = smoothstep(0.97, 0.77, dist / (radius * 0.97));
    
    // Intense incandescent center core + lens perimeter ring
    float core = exp(-normDist * normDist * 3.2) * 1.8;
    float ring = smoothstep(0.70, 0.98, normDist) * 0.55;
    
    vec3 disc = vec3(rEdge, gEdge, bEdge) * (core + ring + 0.45);
    return (disc + halo) * color * brightness;
}

// Background Night City Street Bokeh & Wet Reflections
vec3 getCityBokehBackground(vec2 uv, float time) {
    // Night sky gradient with deep warm undertones
    vec3 bg = mix(vec3(0.008, 0.010, 0.016), vec3(0.020, 0.014, 0.010), uv.y + 0.5);
    
    // Wet surface downward reflection wash (lower half)
    float wetFloor = smoothstep(0.08, -0.45, uv.y);
    
    vec3 lights = vec3(0.0);
    
    // 1. Dominant Top Amber Streetlight (High at y = 0.28, x = -0.04)
    vec2 amberPos = vec2(-0.04, 0.28);
    float amberR = 0.13;
    vec3 amberCol = vec3(1.0, 0.72, 0.24);
    lights += renderBokehDisc(uv, amberPos, amberR, amberCol, 4.2);
    // Subtle secondary lens flare crescent above main light
    vec2 cresPos = amberPos + vec2(-0.02, 0.12);
    float cresD = length(uv - cresPos);
    if (cresD < 0.06 && length(uv - (cresPos + vec2(0.0, 0.025))) > 0.04) {
        lights += amberCol * 2.2 * smoothstep(0.06, 0.04, cresD);
    }

    // 2. Cyan Headlight (upper right at x = 0.32, y = 0.18)
    vec2 cyanPos1 = vec2(0.32, 0.18);
    lights += renderBokehDisc(uv, cyanPos1, 0.065, vec3(0.40, 0.88, 1.0), 3.5);
    
    // 3. Warm Tungsten / Golden Mid-Ground Lights
    lights += renderBokehDisc(uv, vec2(-0.18, 0.06), 0.085, vec3(1.0, 0.58, 0.14), 2.8);
    lights += renderBokehDisc(uv, vec2(0.12, 0.04), 0.085, vec3(0.96, 0.90, 0.82), 2.2);
    
    // 4. Distant Amber / Golden traffic points
    lights += renderBokehDisc(uv, vec2(-0.52, 0.09), 0.055, vec3(1.0, 0.68, 0.20), 1.8);
    lights += renderBokehDisc(uv, vec2(0.62, 0.07), 0.06, vec3(1.0, 0.78, 0.32), 1.9);
    lights += renderBokehDisc(uv, vec2(-0.72, 0.04), 0.045, vec3(0.9, 0.8, 0.7), 1.4);

    // 5. Dynamic Moving Traffic (Red Taillights & Blue Headlights)
    // Red taillight 1 (drifting softly)
    float redX1 = -0.25 + 0.03 * sin(time * 0.4);
    float redY1 = -0.06 + 0.01 * cos(time * 0.5);
    lights += renderBokehDisc(uv, vec2(redX1, redY1), 0.08, vec3(1.0, 0.12, 0.03), 3.0);
    
    // Red taillight 2 (sliding left across street)
    float redX2 = mod(0.70 - time * 0.045, 1.6) - 0.8;
    lights += renderBokehDisc(uv, vec2(redX2, -0.09), 0.06, vec3(0.95, 0.06, 0.02), 2.4);
    
    // Cyan headlight passing on far left
    float blueX = -0.42 + 0.02 * sin(time * 0.3);
    lights += renderBokehDisc(uv, vec2(blueX, -0.03), 0.075, vec3(0.45, 0.90, 1.0), 3.2);

    // 6. Vertical Wet Street / Dashboard Reflection Streaks
    float streakAmber = exp(-pow((uv.x - amberPos.x) / 0.08, 2.0)) * smoothstep(amberPos.y, -0.5, uv.y) * 0.55;
    float streakCyan = exp(-pow((uv.x - cyanPos1.x) / 0.05, 2.0)) * smoothstep(cyanPos1.y, -0.5, uv.y) * 0.40;
    float streakTungsten = exp(-pow((uv.x - 0.12) / 0.06, 2.0)) * smoothstep(0.04, -0.5, uv.y) * 0.35;
    float streakAmber2 = exp(-pow((uv.x + 0.18) / 0.06, 2.0)) * smoothstep(0.06, -0.5, uv.y) * 0.42;
    float streakRed = exp(-pow((uv.x - redX1) / 0.05, 2.0)) * smoothstep(-0.06, -0.5, uv.y) * 0.45;
    float streakBlue = exp(-pow((uv.x - blueX) / 0.06, 2.0)) * smoothstep(-0.03, -0.5, uv.y) * 0.40;

    vec3 wetStreaks = amberCol * streakAmber + 
                      vec3(0.40, 0.88, 1.0) * streakCyan + 
                      vec3(0.96, 0.90, 0.82) * streakTungsten + 
                      vec3(1.0, 0.58, 0.14) * streakAmber2 + 
                      vec3(1.0, 0.12, 0.03) * streakRed +
                      vec3(0.45, 0.90, 1.0) * streakBlue;
                      
    lights += wetStreaks * wetFloor * 0.95;

    return bg + lights;
}

// Organic Raindrop layer generator
// Returns vec4(normal.xy, dropZ, edgeFactor)
vec4 getRainLayer(vec2 uv, float scale, float time, float dripRate) {
    vec2 p = uv * scale;
    vec2 id = floor(p);
    vec2 gv = fract(p) - 0.5;
    
    vec2 h = hash22(id);
    
    // Skip some cells for natural sparse distribution
    if (h.x < 0.25) return vec4(0.0);
    
    // Droplet position jitter inside cell
    vec2 center = (h - 0.5) * 0.65;
    
    // Slow downward drip for select heavy drops
    if (h.x > 0.86) {
        float dripProgress = fract(time * dripRate + h.y * 3.0);
        center.y -= dripProgress * 0.9;
    }
    
    vec2 delta = gv - center;
    float angle = atan(delta.y, delta.x);
    
    // Organic boundary wobble (surface tension variations)
    float wobble = 1.0 + 0.15 * sin(angle * 3.0 + h.x * 6.28) + 0.08 * cos(angle * 5.0 + h.y * 6.28);
    float dist = length(delta) / wobble;
    
    // Droplet radius based on cell hash
    float r = mix(0.10, 0.34, h.y);
    
    if (dist < r) {
        float normDist = dist / r;
        float z = sqrt(max(0.0, 1.0 - normDist * normDist));
        vec2 norm2D = (delta / (r * wobble));
        float edge = smoothstep(0.68, 1.0, normDist);
        return vec4(norm2D, z, edge);
    }
    
    return vec4(0.0);
}

// Dense Micro-Mist Condensation Layer (Foggy glass stippling)
float getMicroMist(vec2 uv) {
    vec2 p = uv * 140.0;
    vec2 id = floor(p);
    float h = hash12(id);
    if (h > 0.88) {
        vec2 gv = fract(p) - 0.5;
        return smoothstep(0.4, 0.1, length(gv));
    }
    return 0.0;
}

void main() {
    // Coordinate system: center = (0,0), y in [-0.5, 0.5]
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float time = iFrame / 60.0;
    
    // Combine multi-scale organic raindrop layers
    vec4 rainLarge = getRainLayer(uv + vec2(0.12, -0.05), 14.0, time, 0.06);
    vec4 rainMed   = getRainLayer(uv + vec2(0.38, 0.19), 32.0, time, 0.03);
    vec4 rainSmall = getRainLayer(uv + vec2(0.72, 0.54), 68.0, time, 0.015);
    
    // Fine condensation micro-mist
    float microMist = getMicroMist(uv);
    
    // Pick the most prominent droplet normal
    vec2 dropNormal = vec2(0.0);
    float dropZ = 0.0;
    float dropEdge = 0.0;
    float isDrop = 0.0;
    
    if (rainLarge.z > 0.0) {
        dropNormal = rainLarge.xy;
        dropZ = rainLarge.z;
        dropEdge = rainLarge.w;
        isDrop = 1.0;
    } else if (rainMed.z > 0.0) {
        dropNormal = rainMed.xy;
        dropZ = rainMed.z;
        dropEdge = rainMed.w;
        isDrop = 1.0;
    } else if (rainSmall.z > 0.0) {
        dropNormal = rainSmall.xy * 0.75;
        dropZ = rainSmall.z;
        dropEdge = rainSmall.w;
        isDrop = 1.0;
    }
    
    // Optical Refraction: Displace background coordinates based on droplet surface normal
    vec2 sampleUv = uv;
    if (isDrop > 0.5) {
        sampleUv -= dropNormal * 0.18; // Lens refraction bending
    }
    
    // Sample City Bokeh Background
    vec3 col = getCityBokehBackground(sampleUv, time);
    
    // Droplet Shading & Specular Highlights
    if (isDrop > 0.5) {
        // Dark meniscus shadow ring around droplet perimeter
        col *= mix(1.0, 0.22, dropEdge);
        
        // Specular glint from top amber streetlight
        vec2 lightDir = normalize(vec2(-0.04, 0.28) - uv);
        float spec = max(0.0, dot(dropNormal, lightDir));
        float glint = pow(spec, 16.0) * 3.2;
        col += vec3(1.0, 0.94, 0.86) * glint;
        
        // Secondary soft ambient glint
        float ambGlint = pow(max(0.0, dot(dropNormal, vec2(0.35, 0.75))), 7.0) * 0.9;
        col += vec3(0.85, 0.92, 1.0) * ambGlint;
    }
    
    // Micro-mist glints where background is bright
    if (microMist > 0.0) {
        vec3 bgLum = getCityBokehBackground(uv, time);
        float lum = dot(bgLum, vec3(0.299, 0.587, 0.114));
        col += microMist * (bgLum * 0.8 + vec3(0.4, 0.4, 0.45) * lum);
    }
    
    // Cinematic Vignette
    float vig = 1.0 - smoothstep(0.45, 1.15, length(uv));
    col *= mix(0.72, 1.0, vig);
    
    // Film grain
    float grain = (hash12(gl_FragCoord.xy + fract(time) * 97.53) - 0.5) * 0.022;
    col += grain;
    
    // Rec.709 Tone Mapping & Black Level Calibration
    col = max(vec3(0.0), col);
    col = col / (col + vec3(0.80)); // Smooth filmic knee
    col = pow(col, vec3(0.94));     // Rec.709 gamma
    
    gl_FragColor = vec4(col, 1.0);
}
`;

export const CinematicRainOnGlassBokehCanvas: React.FC<CinematicRainOnGlassBokehCanvasProps> = ({
  seed = 42,
}) => {
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

    // Helper to create and compile shader
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
