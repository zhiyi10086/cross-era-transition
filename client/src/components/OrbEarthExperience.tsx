/**
 * 时代褶皱设计规范：第五幕以真实三维地球、金色自治节点与缓慢后撤的镜头收束叙事。
 * 本组件只服务于“过渡已完成”之后，不使用CSS缩放模拟地球，也不复用旧占位元素。
 */
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { BufferGeometry, Float32BufferAttribute, TextureLoader, type Group, SRGBColorSpace, Vector3 } from "three";

const ORB_ASSETS = {
  day: "/manus-storage/orb-earth-day_358de436.jpg",
  night: "/manus-storage/orb-earth-night_c66c2250.jpg",
  topology: "/manus-storage/orb-earth-topology_9bd46d8b.png",
  water: "/manus-storage/orb-earth-water_84fe939e.png",
  ambience: "/manus-storage/orb-space-ambience_bec68d9a.mp3",
};

function hashUnit(index: number, salt: number) {
  const value = Math.sin(index * 91.731 + salt * 14.27) * 43758.5453;
  return value - Math.floor(value);
}

function sphericalPoint(index: number, radius: number) {
  const y = hashUnit(index, 1) * 2 - 1;
  const theta = hashUnit(index, 2) * Math.PI * 2;
  const r = Math.sqrt(1 - y * y);
  return new Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius);
}

function createNetwork() {
  const nodes = Array.from({ length: 214 }, (_, index) => sphericalPoint(index, 2.27));
  const pointArray = new Float32Array(nodes.flatMap(point => point.toArray()));
  const lineArray: number[] = [];
  nodes.forEach((point, index) => {
    for (let offset = 1; offset <= 3; offset += 1) {
      const candidate = nodes[(index * 11 + offset * 17) % nodes.length];
      if (point.distanceTo(candidate) < 1.3) lineArray.push(...point.toArray(), ...candidate.toArray());
    }
  });
  return { pointArray, lineArray: new Float32Array(lineArray) };
}

function EarthSystem({ submitted }: { submitted: boolean }) {
  const groupRef = useRef<Group>(null);
  const startResolveAt = useRef<number | null>(null);
  const { camera, pointer } = useThree();
  const [day, night, topology, water] = useLoader(TextureLoader, [ORB_ASSETS.day, ORB_ASSETS.night, ORB_ASSETS.topology, ORB_ASSETS.water]);
  const network = useMemo(createNetwork, []);
  const pointsGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(network.pointArray, 3));
    return geometry;
  }, [network]);
  const linesGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(network.lineArray, 3));
    return geometry;
  }, [network]);

  useEffect(() => {
    [day, night, topology, water].forEach(texture => { texture.colorSpace = SRGBColorSpace; texture.needsUpdate = true; });
  }, [day, night, topology, water]);

  useEffect(() => { if (submitted && startResolveAt.current === null) startResolveAt.current = performance.now() / 1000; }, [submitted]);

  useFrame(({ clock }, delta) => {
    const now = clock.elapsedTime;
    const resolveElapsed = startResolveAt.current === null ? 0 : Math.max(0, now - startResolveAt.current);
    const resolve = Math.min(1, resolveElapsed / 16);
    const eased = resolve * resolve * (3 - 2 * resolve);
    const targetDistance = submitted ? 8.7 + (84 - 8.7) * eased : 4.9 + Math.sin(now * 0.09) * 0.16;
    camera.position.z += (targetDistance - camera.position.z) * Math.min(1, delta * 1.4);
    camera.position.x += ((submitted ? 0 : pointer.x * 0.5) - camera.position.x) * Math.min(1, delta * 0.7);
    camera.position.y += ((submitted ? 0.1 : pointer.y * 0.32) - camera.position.y) * Math.min(1, delta * 0.7);
    camera.lookAt(0, 0, 0);
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (submitted ? 0.035 : 0.075);
      groupRef.current.rotation.z = Math.sin(now * 0.17) * 0.045;
      groupRef.current.scale.setScalar(0.56 + Math.sin(now * 1.1) * 0.0045);
    }
  });

  return <group ref={groupRef}>
    <ambientLight intensity={0.36} color="#7fa8ff" />
    <directionalLight position={[5, 3, 6]} intensity={2.1} color="#efffff" />
    <pointLight position={[-5, -2, 4]} intensity={4.8} color="#d6a943" distance={18} />
    <mesh>
      <sphereGeometry args={[2.1, 96, 96]} />
      <meshStandardMaterial map={day} emissiveMap={night} emissive="#071326" emissiveIntensity={0.52} roughnessMap={topology} normalMap={water} normalScale={[0.22, 0.22]} roughness={0.76} metalness={0.05} />
    </mesh>
    <mesh scale={1.035}>
      <sphereGeometry args={[2.1, 80, 80]} />
      <meshBasicMaterial color="#2bcae7" transparent opacity={0.08} side={2} />
    </mesh>
    <mesh scale={1.088}>
      <sphereGeometry args={[2.1, 80, 80]} />
      <meshBasicMaterial color="#79f0e7" transparent opacity={0.045} side={1} />
    </mesh>
    <lineSegments geometry={linesGeometry}><lineBasicMaterial color="#d8a83e" transparent opacity={0.43} /></lineSegments>
    <points geometry={pointsGeometry}><pointsMaterial color="#ffd260" size={0.047} sizeAttenuation transparent opacity={0.96} /></points>
  </group>;
}

function StarDust() {
  const positions = useMemo(() => {
    const values: number[] = [];
    for (let index = 0; index < 900; index += 1) {
      const point = sphericalPoint(index + 400, 28 + hashUnit(index, 4) * 35);
      values.push(...point.toArray());
    }
    return new Float32Array(values);
  }, []);
  const geometry = useMemo(() => {
    const result = new BufferGeometry();
    result.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return result;
  }, [positions]);
  return <points geometry={geometry}><pointsMaterial color="#d6eaff" size={0.085} sizeAttenuation transparent opacity={0.74} /></points>;
}

export function OrbEarthExperience({ soundEnabled }: { soundEnabled: boolean }) {
  const [creation, setCreation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ambienceEnabled, setAmbienceEnabled] = useState(true);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = ambienceRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    if (soundEnabled && ambienceEnabled) void audio.play().catch(() => undefined);
    else audio.pause();
  }, [ambienceEnabled, soundEnabled]);

  useEffect(() => {
    const unlock = () => {
      const audio = ambienceRef.current;
      if (audio && soundEnabled && ambienceEnabled) void audio.play().catch(() => undefined);
    };
    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => { window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); };
  }, [ambienceEnabled, soundEnabled]);

  return <div className="orb-earth-experience" aria-label="去中心化地球共建体验">
    <audio ref={ambienceRef} src={ORB_ASSETS.ambience} loop preload="metadata" />
    <Canvas className="orb-earth-canvas" dpr={[1, 1.75]} camera={{ position: [0, 0, 4.9], fov: 42 }} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}><StarDust /><EarthSystem submitted={submitted} /></Suspense>
    </Canvas>
    <button className="orb-sound-toggle" type="button" onClick={() => setAmbienceEnabled(value => !value)} aria-label={ambienceEnabled ? "关闭环境音" : "开启环境音"} aria-pressed={ambienceEnabled}>{ambienceEnabled ? "◌" : "○"}</button>
    <div className={`orb-earth-overlay ${submitted ? "is-submitted" : ""}`}>
      <p className="orb-earth-caption">「但新世界的内容 · 等待你来填充」</p>
      {!submitted ? <form className="orb-creation-form" onSubmit={event => { event.preventDefault(); if (creation.trim()) setSubmitted(true); }}>
        <input id="creation" value={creation} onChange={event => setCreation(event.target.value)} placeholder="你想在新世界中创造什么？" aria-label="你想在新世界中创造什么？" />
        <button type="submit" aria-label="记录你的创想">↗</button>
      </form> : <div className="orb-recorded"><span>已记录 · 共建者 #ORBT</span><strong>{creation}</strong><small>已写入这颗星球的连接网络</small></div>}
    </div>
  </div>;
}
