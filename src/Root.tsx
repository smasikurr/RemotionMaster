import React from "react";
import { Composition, Folder } from "remotion";

// 1. Master Commercial 4K Presets
import { CyberpunkSciFiHud4K } from "./presets/CyberpunkSciFiHud4K";
import { LuxuryGoldenParticleWaves4K } from "./presets/LuxuryGoldenParticleWaves4K";
import { AnimeEnergyBursts4K } from "./presets/AnimeEnergyBursts4K";
import { RetroGlitchCrtVhs4K } from "./presets/RetroGlitchCrtVhs4K";
import { FloatingModernLaptop4K } from "./presets/FloatingModernLaptop4K";
import { DynamicCircularAudioVisualizer4K } from "./presets/DynamicCircularAudioVisualizer4K";
import { LiquidInkSpreadLumaMatte4K } from "./presets/LiquidInkSpreadLumaMatte4K";
import { CorporatePlexusDataNetwork4K } from "./presets/CorporatePlexusDataNetwork4K";
import { MegaSaleBannerConfetti4K } from "./presets/MegaSaleBannerConfetti4K";
import { AmbientOpticalLensFlares4K } from "./presets/AmbientOpticalLensFlares4K";
import { VintageFilmBurnOpticalLeak4K } from "./presets/VintageFilmBurnOpticalLeak4K";
import { GeometricHalftoneDotGridWave4K } from "./presets/GeometricHalftoneDotGridWave4K";

// 2. Select AE Scene Samples from 201+ Library
import { BackgroundAurora } from "./scenes/BackgroundAnimations/BackgroundAurora";
import { LiquidFluidWave } from "./scenes/LiquidAnimations/LiquidFluidWave";
import { TextNeon } from "./scenes/TextAnimations/TextNeon";
import { ShapeMandala } from "./scenes/ShapeAnimations/ShapeMandala";

// 3. Advanced Developer, Vector & Math Scenes (OpenMontage, Motion Canvas & Manim Synthesized)
import { SyntheticTerminalScene } from "./scenes/DemoAnimations/SyntheticTerminalScene";
import { MathCoordinatePlane } from "./scenes/ShapeAnimations/MathCoordinatePlane";
import { CodeSyntaxMorpher } from "./scenes/TextAnimations/CodeSyntaxMorpher";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 4K UHD Microstock Commercial Presets Folder */}
      <Folder name="4K-Commercial-Presets">
        <Composition
          id="CyberpunkSciFiHud4K"
          component={CyberpunkSciFiHud4K}
          durationInFrames={600}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="LuxuryGoldenParticleWaves4K"
          component={LuxuryGoldenParticleWaves4K}
          durationInFrames={600}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="AnimeEnergyBursts4K"
          component={AnimeEnergyBursts4K}
          durationInFrames={600}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="RetroGlitchCrtVhs4K"
          component={RetroGlitchCrtVhs4K}
          durationInFrames={600}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="FloatingModernLaptop4K"
          component={FloatingModernLaptop4K}
          durationInFrames={600}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="DynamicCircularAudioVisualizer4K"
          component={DynamicCircularAudioVisualizer4K}
          durationInFrames={600}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="LiquidInkSpreadLumaMatte4K"
          component={LiquidInkSpreadLumaMatte4K}
          durationInFrames={480}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="CorporatePlexusDataNetwork4K"
          component={CorporatePlexusDataNetwork4K}
          durationInFrames={600}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="MegaSaleBannerConfetti4K"
          component={MegaSaleBannerConfetti4K}
          durationInFrames={480}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="AmbientOpticalLensFlares4K"
          component={AmbientOpticalLensFlares4K}
          durationInFrames={600}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="VintageFilmBurnOpticalLeak4K"
          component={VintageFilmBurnOpticalLeak4K}
          durationInFrames={720}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="GeometricHalftoneDotGridWave4K"
          component={GeometricHalftoneDotGridWave4K}
          durationInFrames={720}
          fps={60}
          width={3840}
          height={2160}
        />
      </Folder>

      {/* 201+ AE Scene Demos Folder */}
      <Folder name="AE-Scene-Library-Samples">
        <Composition
          id="BackgroundAuroraDemo"
          component={BackgroundAurora}
          durationInFrames={300}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="LiquidFluidWaveDemo"
          component={LiquidFluidWave}
          durationInFrames={300}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="TextNeonDemo"
          component={TextNeon}
          durationInFrames={240}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="ShapeMandalaDemo"
          component={ShapeMandala}
          durationInFrames={300}
          fps={60}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* Developer, Vector & Mathematical Scenes */}
      <Folder name="Developer-Math-Vector-Scenes">
        <Composition
          id="SyntheticTerminalSceneDemo"
          component={SyntheticTerminalScene}
          durationInFrames={600}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="MathCoordinatePlaneDemo"
          component={MathCoordinatePlane}
          durationInFrames={600}
          fps={60}
          width={3840}
          height={2160}
        />
        <Composition
          id="CodeSyntaxMorpherDemo"
          component={CodeSyntaxMorpher}
          durationInFrames={480}
          fps={60}
          width={3840}
          height={2160}
        />
      </Folder>
    </>
  );
};
