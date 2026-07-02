import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type MinionPhase = 'entering' | 'resting' | 'running';

const RUN_RETARGET_MS = 1200;
const ARRIVE_EPS = 4;

function randomScreenTarget(marginX: number, marginY: number) {
  const maxX = Math.max(20, window.innerWidth / 2 - marginX);
  const maxY = Math.max(20, window.innerHeight / 2 - marginY);
  return new THREE.Vector3((Math.random() * 2 - 1) * maxX, (Math.random() * 2 - 1) * maxY, 0);
}

function Minion({ phase, onEntered }: { phase: MinionPhase; onEntered: () => void }) {
  const group = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);
  const enteredRef = useRef(false);

  const restingSpot = useMemo(
    () => new THREE.Vector3(0, -window.innerHeight / 2 + 170, 0),
    [],
  );
  const startSpot = useMemo(
    () => new THREE.Vector3(window.innerWidth / 2 + 160, -window.innerHeight / 2 + 170, 0),
    [],
  );

  const target = useRef(startSpot.clone());
  const current = useRef(startSpot.clone());

  useEffect(() => {
    if (phase === 'entering') {
      current.current.copy(startSpot);
      target.current.copy(restingSpot);
      enteredRef.current = false;
    } else if (phase === 'resting') {
      target.current.copy(restingSpot);
    }
  }, [phase, restingSpot, startSpot]);

  useEffect(() => {
    if (phase !== 'running') return;
    target.current.copy(randomScreenTarget(90, 140));
    const id = window.setInterval(() => {
      target.current.copy(randomScreenTarget(90, 140));
    }, RUN_RETARGET_MS);
    return () => window.clearInterval(id);
  }, [phase]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const lerpSpeed = phase === 'running' ? 3.2 : 2.4;
    current.current.lerp(target.current, Math.min(1, delta * lerpSpeed));
    group.current.position.copy(current.current);

    const dx = target.current.x - current.current.x;
    const moving = Math.hypot(dx, target.current.y - current.current.y) > ARRIVE_EPS;

    if (phase === 'entering') {
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, delta * 4);
      if (!moving && !enteredRef.current) {
        enteredRef.current = true;
        onEntered();
      }
    }

    if (dx !== 0) {
      const facing = dx < 0 ? 1 : -1;
      group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, facing, delta * 6);
    }

    const swing = moving ? Math.sin(state.clock.elapsedTime * 12) * 0.6 : 0;
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
  });

  return (
    <group ref={group} position={startSpot}>
      {/* body */}
      <mesh position={[0, 15, 0]} castShadow>
        <capsuleGeometry args={[42, 55, 6, 16]} />
        <meshStandardMaterial color="#ffd11a" />
      </mesh>

      {/* overalls */}
      <mesh position={[0, -22, 20]}>
        <boxGeometry args={[78, 46, 30]} />
        <meshStandardMaterial color="#2f6fd6" />
      </mesh>
      <mesh position={[0, -18, 36]}>
        <boxGeometry args={[20, 14, 4]} />
        <meshStandardMaterial color="#1e4fa3" />
      </mesh>

      {/* goggle band */}
      <mesh position={[0, 32, 32]}>
        <boxGeometry args={[92, 16, 10]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* eye */}
      <mesh position={[6, 32, 42]}>
        <sphereGeometry args={[22, 24, 24]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[14, 28, 60]}>
        <sphereGeometry args={[9, 16, 16]} />
        <meshStandardMaterial color="#3b2211" />
      </mesh>

      {/* mouth */}
      <mesh position={[-6, -2, 44]} rotation={[0, 0, -0.3]}>
        <torusGeometry args={[14, 3.5, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#7a3d00" />
      </mesh>

      {/* hair strands */}
      {[-14, 0, 14].map((hx, i) => (
        <mesh
          key={i}
          position={[hx, 68, 10]}
          rotation={[0, 0, THREE.MathUtils.degToRad(hx * 1.2)]}
        >
          <cylinderGeometry args={[2, 2, 20, 6]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      ))}

      {/* helmet, tilted for a funny look */}
      <group position={[6, 66, 10]} rotation={[0, 0, THREE.MathUtils.degToRad(-20)]}>
        <mesh position={[0, 10, 0]}>
          <sphereGeometry args={[38, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial color="#ff8a00" />
        </mesh>
        <mesh position={[0, -4, 0]}>
          <cylinderGeometry args={[42, 42, 8, 24]} />
          <meshStandardMaterial color="#cc4d00" />
        </mesh>
      </group>

      {/* arms */}
      <mesh position={[-46, -10, 10]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[9, 30, 4, 8]} />
        <meshStandardMaterial color="#ffd11a" />
      </mesh>
      <mesh position={[46, -10, 10]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[9, 30, 4, 8]} />
        <meshStandardMaterial color="#ffd11a" />
      </mesh>

      {/* legs */}
      <mesh ref={leftLeg} position={[-18, -58, 10]}>
        <boxGeometry args={[16, 32, 16]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh ref={rightLeg} position={[18, -58, 10]}>
        <boxGeometry args={[16, 32, 16]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  );
}

export default function MinionScene({
  phase,
  onEntered,
}: {
  phase: MinionPhase;
  onEntered: () => void;
}) {
  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 500], near: 0.1, far: 2000 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[100, 200, 300]} intensity={0.8} />
        <Minion phase={phase} onEntered={onEntered} />
      </Canvas>
    </div>
  );
}
