"use client";

import { PresetSelector } from "./customization/preset-selector";
import { EffectControls } from "./customization/effect-controls";
import { AudioControls } from "./customization/audio-controls";
import { WaveVisualizer } from "./customization/waveform-display";
import { motion } from "framer-motion";

const panelVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function CustomizationPanel() {
  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={panelVariants}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={panelVariants}
      >
        <motion.div 
          className="space-y-4 gap-6"
          variants={itemVariants}
        >
          <PresetSelector />
          <AudioControls />
        </motion.div>
        <motion.div variants={itemVariants}>
          <EffectControls />
        </motion.div>
        <motion.div variants={itemVariants}>
          <WaveVisualizer />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}