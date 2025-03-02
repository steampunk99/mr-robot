"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Text, Environment, PerspectiveCamera } from "@react-three/drei"
import { Vector3 } from "three"
import { motion } from "framer-motion-3d"
import { MotionConfig } from "framer-motion"

function FloatingShape({ position, color, shape = "cube", scale = 1 }) {
  const meshRef = useRef(null)
  const { viewport } = useThree()

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.x = (position[0] * viewport.width) / 100
      meshRef.current.position.y = (position[1] * viewport.height) / 100
    }
  }, [viewport, position])

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={4}>
      <motion.mesh
        ref={meshRef}
        scale={scale}
        animate={{
          z: [0, 1, 0],
          rotateX: [0, Math.PI * 2],
          rotateY: [0, Math.PI * 2],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {shape === "cube" && <boxGeometry />}
        {shape === "sphere" && <sphereGeometry args={[0.7, 32, 32]} />}
        {shape === "torus" && <torusGeometry args={[0.7, 0.3, 16, 32]} />}
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} transparent opacity={0.7} />
      </motion.mesh>
    </Float>
  )
}

function Scene() {
  const camera = useRef()
  const { viewport } = useThree()

  useFrame(({ clock }) => {
    if (camera.current) {
      camera.current.position.x = Math.sin(clock.getElapsedTime() * 0.2) * 2
      camera.current.position.y = Math.cos(clock.getElapsedTime() * 0.2) * 2
      camera.current.lookAt(new Vector3(0, 0, 0))
    }
  })

  const shapes = [
    { position: [-20, 10, -5], color: "#ff0066", shape: "cube", scale: 1.2 },
    { position: [20, -15, -2], color: "#00ffff", shape: "sphere", scale: 1 },
    { position: [-15, -20, -8], color: "#ffff00", shape: "torus", scale: 0.8 },
    { position: [15, 20, -4], color: "#ff00ff", shape: "cube", scale: 0.9 },
    { position: [0, 0, -6], color: "#00ff66", shape: "sphere", scale: 1.1 },
  ]

  return (
    <MotionConfig transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}>
      <PerspectiveCamera ref={camera} makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}

      <motion.group
        initial={{ scale: 0, rotateX: 0 }}
        animate={{ scale: 1, rotateX: Math.PI * 2 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <Text
          font="/fonts/Geist_Bold.json"
          fontSize={viewport.width * 0.04}
          position={[0, 0, 0]}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={viewport.width * 0.8}
          lineHeight={1.2}
          letterSpacing={0.05}
        >
          LUKWIYA
        </Text>
      </motion.group>

      <Environment preset="night" />
    </MotionConfig>
  )
}

export default function HeroSceneSimple() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas style={{ background: 'transparent' }}>
        <Scene />
      </Canvas>
    </div>
  )
}
