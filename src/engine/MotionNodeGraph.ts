/**
 * MotionNodeGraph - ComfyUI-Inspired Procedural DAG Architecture for Remotion Master
 * 
 * Enables node-based procedural motion evaluation:
 * Input Nodes -> Modulator/Transform Nodes -> Output Renderers
 * 
 * Designed for future Web App / UI Tools where sliders and settings can be dynamically bound.
 */

export type NodeParamType = 'slider' | 'color' | 'toggle' | 'select' | 'number';

export interface NodeParamDescriptor {
  key: string;
  label: string;
  type: NodeParamType;
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface NodeExecutionContext {
  frame: number;
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  time: number; // in seconds
}

export abstract class MotionNode<TInputs = Record<string, any>, TOutputs = Record<string, any>> {
  public id: string;
  public name: string;
  public category: 'input' | 'modifier' | 'simulation' | 'renderer' | 'output';
  public params: Record<string, any> = {};
  public paramDescriptors: NodeParamDescriptor[] = [];

  constructor(id: string, name: string, category: 'input' | 'modifier' | 'simulation' | 'renderer' | 'output') {
    this.id = id;
    this.name = name;
    this.category = category;
  }

  public setParam(key: string, value: any): this {
    this.params[key] = value;
    return this;
  }

  public getParam<T>(key: string, fallback: T): T {
    return this.params[key] !== undefined ? (this.params[key] as T) : fallback;
  }

  abstract execute(inputs: TInputs, context: NodeExecutionContext): TOutputs;
}

export interface NodeConnection {
  fromNodeId: string;
  fromOutputKey: string;
  toNodeId: string;
  toInputKey: string;
}

export class MotionNodeGraph {
  private nodes: Map<string, MotionNode> = new Map();
  private connections: NodeConnection[] = [];

  public addNode(node: MotionNode): this {
    this.nodes.set(node.id, node);
    return this;
  }

  public getNode<T extends MotionNode>(id: string): T | undefined {
    return this.nodes.get(id) as T | undefined;
  }

  public connect(fromNodeId: string, fromOutputKey: string, toNodeId: string, toInputKey: string): this {
    this.connections.push({ fromNodeId, fromOutputKey, toNodeId, toInputKey });
    return this;
  }

  public evaluate(context: NodeExecutionContext): Map<string, Record<string, any>> {
    const outputs = new Map<string, Record<string, any>>();
    
    // Evaluate in order of dependencies
    for (const [nodeId, node] of this.nodes) {
      const nodeInputs: Record<string, any> = {};
      const incoming = this.connections.filter(c => c.toNodeId === nodeId);
      for (const conn of incoming) {
        const sourceOutput = outputs.get(conn.fromNodeId);
        if (sourceOutput && sourceOutput[conn.fromOutputKey] !== undefined) {
          nodeInputs[conn.toInputKey] = sourceOutput[conn.fromOutputKey];
        }
      }

      const result = node.execute(nodeInputs, context);
      outputs.set(nodeId, result);
    }

    return outputs;
  }
}

/**
 * Built-in ComfyUI-style Nodes for Procedural Motion
 */

// 1. Audio Frequency Synthesizer Node (Generates procedural multiband voice/speech/music signal)
export class ProceduralAudioWaveformNode extends MotionNode<
  {},
  { amplitudes: number[]; peak: number }
> {
  constructor(id: string = 'audio_source') {
    super(id, 'Procedural Audio Signal', 'input');
    this.paramDescriptors = [
      { key: 'barCount', label: 'Bar Count', type: 'slider', default: 21, min: 5, max: 128, step: 1 },
      { key: 'energy', label: 'Audio Energy', type: 'slider', default: 1.0, min: 0.1, max: 3.0, step: 0.05 },
      { key: 'tempoBpm', label: 'Speech/Music Tempo (BPM)', type: 'slider', default: 110, min: 40, max: 240, step: 1 },
    ];
    this.params = { barCount: 21, energy: 1.0, tempoBpm: 110 };
  }

  execute(_inputs: {}, context: NodeExecutionContext): { amplitudes: number[]; peak: number } {
    const barCount = this.getParam('barCount', 21);
    const energy = this.getParam('energy', 1.0);
    const bpm = this.getParam('tempoBpm', 110);
    const { frame, fps } = context;
    const time = frame / fps;

    const amplitudes: number[] = new Array(barCount).fill(0);
    const beatPeriod = 60 / bpm;
    const beatPhase = (time % beatPeriod) / beatPeriod;

    // Speech rhythm cadence: sentences & syllables with natural pause gaps
    const sentenceEnv = Math.sin(time * 0.9) * 0.5 + 0.5;
    const syllablePulse = Math.sin(time * 8.5) * Math.cos(time * 4.2);
    const isPause = sentenceEnv < 0.15 && Math.sin(time * 1.8) < -0.2;

    let peak = 0;
    for (let i = 0; i < barCount; i++) {
      if (isPause) {
        amplitudes[i] = 0;
        continue;
      }

      // Center bell curve distribution
      const normCenter = (i - (barCount - 1) / 2) / ((barCount - 1) / 2);
      const bell = Math.exp(-normCenter * normCenter * 2.2);

      // Multi-harmonic synthesized voice frequencies
      const h1 = Math.sin(time * 14.0 + i * 0.45) * 0.4 + 0.5;
      const h2 = Math.sin(time * 28.0 - i * 0.8) * 0.25 + 0.3;
      const h3 = Math.cos(time * 7.2 + i * 1.2) * 0.35 + 0.4;
      const beatHit = Math.exp(-beatPhase * 4.0) * 0.35;

      let val = (h1 * 0.5 + h2 * 0.3 + h3 * 0.2 + beatHit) * bell * energy;
      val = Math.max(0, Math.min(1.0, val));
      amplitudes[i] = val;
      if (val > peak) peak = val;
    }

    return { amplitudes, peak };
  }
}

// 2. Blender F-Curve Inertia / Damping Node
export class BlenderInertiaDampingNode extends MotionNode<
  { amplitudes: number[] },
  { smoothedAmplitudes: number[] }
> {
  private prevAmplitudes: number[] = [];

  constructor(id: string = 'blender_damping') {
    super(id, 'Blender Inertia Damping', 'modifier');
    this.paramDescriptors = [
      { key: 'attack', label: 'Attack Speed', type: 'slider', default: 0.65, min: 0.1, max: 0.95, step: 0.05 },
      { key: 'decay', label: 'Decay Retention', type: 'slider', default: 0.78, min: 0.1, max: 0.98, step: 0.02 },
    ];
    this.params = { attack: 0.65, decay: 0.78 };
  }

  execute(inputs: { amplitudes?: number[] }, _context: NodeExecutionContext): { smoothedAmplitudes: number[] } {
    const raw = inputs.amplitudes || [];
    const attack = this.getParam('attack', 0.65);
    const decay = this.getParam('decay', 0.78);

    if (this.prevAmplitudes.length !== raw.length) {
      this.prevAmplitudes = [...raw];
      return { smoothedAmplitudes: raw };
    }

    const smoothed: number[] = [];
    for (let i = 0; i < raw.length; i++) {
      const target = raw[i];
      const prev = this.prevAmplitudes[i] || 0;
      let next: number;
      if (target > prev) {
        next = prev + (target - prev) * attack;
      } else {
        next = prev * decay;
      }
      smoothed.push(next);
      this.prevAmplitudes[i] = next;
    }

    return { smoothedAmplitudes: smoothed };
  }
}
