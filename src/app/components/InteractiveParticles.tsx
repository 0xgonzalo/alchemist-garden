"use client";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 3000;
const PARTICLE_AREA = 32;

function Particles() {
  const points = useRef<THREE.Points>(null);
  const [mouse, setMouse] = useState<[number, number] | null>(null);
  // Store original positions for smooth return
  const originalPositions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * PARTICLE_AREA;
      arr[i * 3 + 1] = (Math.random() - 0.5) * PARTICLE_AREA;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return arr;
  }, []);

  // Mutable copy for animation
  const positions = useMemo(() => new Float32Array(originalPositions), [originalPositions]);

  useFrame(() => {
    if (!points.current) return;
    const posAttr = points.current.geometry.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      if (mouse) {
        const dx = x - mouse[0];
        const dy = y - mouse[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.5) {
          const angle = Math.atan2(dy, dx);
          x += Math.cos(angle) * 0.12;
          y += Math.sin(angle) * 0.12;
        } else {
          // Return to original
          x += (ox - x) * 0.04;
          y += (oy - y) * 0.04;
        }
      } else {
        // Return to original
        x += (ox - x) * 0.04;
        y += (oy - y) * 0.04;
      }
      posAttr.setX(i, x);
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  const { size, viewport } = useThree();
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    const x = (e.clientX / size.width) * viewport.width - viewport.width / 2;
    const y = -(e.clientY / size.height) * viewport.height + viewport.height / 2;
    setMouse([x, y]);
  };

  return (
    <points
      ref={points}
      onPointerMove={handlePointerMove}
      onPointerOut={() => setMouse(null)}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        color="#f0abfc"
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  );
}

export default function InteractiveParticles() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Responsive styles for overlay and buttons */}
      <style jsx>{`
        .ag-overlay {
          max-width: 100vw;
          min-width: 320px;
          padding: 2.5rem 2.5rem 2rem 2.5rem;
        }
        .ag-title {
          font-size: 4rem;
        }
        .ag-desc {
          font-size: 1rem;
          line-height: 1.8;
        }
        .ag-btn-row {
          display: flex;
          gap: 1.5rem;
        }
        .ag-btn {
          font-size: 1.25rem;
          padding: 1rem 2.5rem;
        }
        @media (max-width: 600px) {
          .ag-overlay {
            padding: 1.5rem 1rem 1.2rem 0.5rem;
            min-width: 280px;
            max-width: 98vw;
          }
          .ag-title {
            font-size: 1.5rem;
          }
          .ag-desc {
            font-size: 0.7rem;
            line-height: 1.6;
          }
          .ag-btn-row {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }
          .ag-btn {
            font-size: 1rem;
            padding: 0.85rem 1.2rem;
            width: 100%;
          }
        }
      `}</style>
      <div
        className="ag-overlay"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          background: "rgba(20, 20, 30, 0.7)",
          borderRadius: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        <h2
          className="font-persona-aura ag-title"
          style={{
            color: "#fff",
            fontWeight: 800,
            marginBottom: "1rem",
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          Want to be part of us?
        </h2>
        <p
          className="font-tan-pearl ag-desc"
          style={{
            color: "#e0e0e0",
            marginBottom: "2rem",
            textAlign: "center",
            maxWidth: "32rem",
          }}
        >
          Alchemy Garden is looking for speakers, volunteers, sponsorship and whoever that wants to collaborate with the festival
        </p>
        <div className="ag-btn-row">
          <button
            className="ag-btn"
            style={{
              background: "linear-gradient(90deg, #a855f7 0%, #f0abfc 100%)",
              color: "white",
              fontWeight: 700,
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(168, 85, 247, 0.2)",
              transition: "transform 0.15s",
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => window.open("https://t.me/gonzalo0x", "_blank", "noopener,noreferrer")}
          >
            I want to Sponsor
          </button>
          <button
            className="ag-btn"
            style={{
              background: "white",
              color: "#a855f7",
              fontWeight: 700,
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(168, 85, 247, 0.12)",
              transition: "background 0.15s, transform 0.15s",
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#f3e8ff")}
            onMouseOut={e => (e.currentTarget.style.background = "white")}
            onClick={() => window.open("https://t.me/solsiete", "_blank", "noopener,noreferrer")}
          >
            Contact Us
          </button>
        </div>
      </div>
      <Canvas orthographic camera={{ zoom: 40, position: [0, 0, 10] }} style={{ width: "100vw", height: "100vh" }}>
        <Particles />
      </Canvas>
    </div>
  );
} 