/**
 * 3D Artist Room Component - Immersive virtual space for creators
 * Features: Three.js 3D environment, portfolio on walls, interactive tip jar, ambient music
 */

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Html, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { MNEE_CONFIG, generatePaymentLink } from '../../lib/mnee';

// Room theme configurations
const ROOM_THEMES = {
  neon_city: {
    name: 'Neon City',
    wallColor: '#1a0f2e',
    floorColor: '#0f0820',
    lightColor: '#ff00ff',
    accentColor: '#00ffff',
    ambientIntensity: 0.3
  },
  zen_garden: {
    name: 'Zen Garden',
    wallColor: '#f5f5dc',
    floorColor: '#d4d4aa',
    lightColor: '#ffffff',
    accentColor: '#8b4513',
    ambientIntensity: 0.7
  },
  retro_arcade: {
    name: 'Retro Arcade',
    wallColor: '#1a1a2e',
    floorColor: '#16213e',
    lightColor: '#ff6b6b',
    accentColor: '#ffd93d',
    ambientIntensity: 0.4
  }
};

interface WallArtProps {
  position: [number, number, number];
  rotation: [number, number, number];
  imageUrl?: string;
  title: string;
  price?: number;
  onClick: () => void;
}

// Wall Art Component - Displays portfolio pieces on walls
function WallArt({ position, rotation, title, price, onClick }: WallArtProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2.4, 1.8, 0.1]} />
        <meshStandardMaterial color="#8b4513" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Artwork placeholder */}
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color={hovered ? '#9333ea' : '#6b21a8'} />
      </mesh>

      {/* Info Label (appears on hover) */}
      {hovered && (
        <Html position={[0, -1.2, 0]} center>
          <div className="bg-black/80 px-4 py-2 rounded-lg text-white text-center min-w-[150px]">
            <div className="font-semibold">{title}</div>
            {price && <div className="text-yellow-400 text-sm">{price} MNEE</div>}
          </div>
        </Html>
      )}
    </group>
  );
}

interface TipJarProps {
  position: [number, number, number];
  onTip: () => void;
}

// Interactive Tip Jar - Floating in the room
function TipJar({ position, onTip }: TipJarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.1;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onTip}
    >
      <cylinderGeometry args={[0.3, 0.4, 0.6, 32]} />
      <meshStandardMaterial 
        color={hovered ? '#fbbf24' : '#f59e0b'}
        emissive={hovered ? '#fbbf24' : '#000000'}
        emissiveIntensity={hovered ? 0.5 : 0}
        metalness={0.6}
        roughness={0.3}
      />
      
      {hovered && (
        <Html position={[0, 0.8, 0]} center>
          <div className="bg-yellow-500 px-4 py-2 rounded-lg text-gray-900 font-semibold whitespace-nowrap shadow-lg">
            Tip Creator with MNEE
          </div>
        </Html>
      )}
    </mesh>
  );
}

interface RoomSceneProps {
  theme: string;
  portfolio: Array<{ id: string; title: string; url?: string; isPremium?: boolean; price?: number }>;
  creatorName: string;
  onArtClick: (art: any) => void;
  onTipClick: () => void;
}

// Room Scene Component
function RoomScene({ theme, portfolio, creatorName, onArtClick, onTipClick }: RoomSceneProps) {
  const roomTheme = ROOM_THEMES[theme as keyof typeof ROOM_THEMES] || ROOM_THEMES.neon_city;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={roomTheme.ambientIntensity} />
      <pointLight position={[0, 3, 0]} intensity={1} color={roomTheme.lightColor} />
      <spotLight 
        position={[5, 5, 5]} 
        angle={0.3} 
        penumbra={1} 
        intensity={0.5}
        castShadow
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={roomTheme.floorColor} roughness={0.8} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <boxGeometry args={[12, 5, 0.1]} />
        <meshStandardMaterial color={roomTheme.wallColor} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-6, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshStandardMaterial color={roomTheme.wallColor} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[6, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshStandardMaterial color={roomTheme.wallColor} />
      </mesh>

      {/* Portfolio Artworks on Walls */}
      {portfolio && portfolio.slice(0, 6).map((art, index) => {
        const positions: [number, number, number][] = [
          [-3, 2.5, -4.9], [0, 2.5, -4.9], [3, 2.5, -4.9],
          [-5.9, 2.5, -2], [-5.9, 2.5, 0], [-5.9, 2.5, 2]
        ];
        
        const rotations: [number, number, number][] = [
          [0, 0, 0], [0, 0, 0], [0, 0, 0],
          [0, Math.PI / 2, 0], [0, Math.PI / 2, 0], [0, Math.PI / 2, 0]
        ];

        return (
          <WallArt
            key={art.id}
            position={positions[index]}
            rotation={rotations[index]}
            imageUrl={art.url}
            title={art.title}
            price={art.isPremium ? art.price : undefined}
            onClick={() => onArtClick(art)}
          />
        );
      })}

      {/* Interactive Tip Jar */}
      <TipJar position={[0, 1.5, 2]} onTip={onTipClick} />

      {/* Creator Name Sign */}
      <Text
        position={[0, 4, -4.8]}
        fontSize={0.5}
        color={roomTheme.accentColor}
        anchorX="center"
        anchorY="middle"
      >
        {creatorName}'s Studio
      </Text>

      {/* Decorative Floating Orbs */}
      <mesh position={[-4, 3, -2]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color={roomTheme.accentColor}
          emissive={roomTheme.accentColor}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      <mesh position={[4, 2.5, -3]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color={roomTheme.lightColor}
          emissive={roomTheme.lightColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Environment */}
      <Environment preset="city" />
    </>
  );
}

interface Creator {
  id: string;
  displayName: string;
  walletAddress?: string;
  roomTheme?: string;
  portfolio?: Array<{ id: string; title: string; url?: string; isPremium?: boolean; price?: number }>;
  ambientMusic?: string;
}

interface ArtistRoom3DProps {
  creator: Creator;
  onBack?: () => void;
}

// Main Artist Room Component
export default function ArtistRoom3D({ creator, onBack }: ArtistRoom3DProps) {
  const [selectedArt, setSelectedArt] = useState<any>(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('5');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (creator.ambientMusic && audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, [creator.ambientMusic]);

  const handleArtClick = (art: any) => {
    setSelectedArt(art);
    if (art.isPremium) {
      alert(`This artwork costs ${art.price} MNEE. Purchase to unlock!`);
    }
  };

  const handleTipClick = () => {
    setShowTipModal(true);
  };

  const sendTip = () => {
    if (creator.walletAddress) {
      const paymentUrl = generatePaymentLink(creator.walletAddress, tipAmount);
      window.open(paymentUrl, '_blank');
      setShowTipModal(false);
    } else {
      alert('Creator wallet address not configured');
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-black">
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 60 }}
          shadows
        >
          <Suspense fallback={null}>
            <RoomScene
              theme={creator.roomTheme || 'neon_city'}
              portfolio={creator.portfolio || []}
              creatorName={creator.displayName}
              onArtClick={handleArtClick}
              onTipClick={handleTipClick}
            />
          </Suspense>
          <OrbitControls 
            enablePan={false}
            minDistance={3}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Instruction Banner */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 px-6 py-3 rounded-xl backdrop-blur-sm pointer-events-auto">
          <p className="text-white text-sm">
            Click and drag to look around | Scroll to zoom | Click art to view | Click tip jar to support
          </p>
        </div>

        {/* Music Player */}
        {creator.ambientMusic && (
          <div className="absolute top-4 right-4 pointer-events-auto">
            <audio ref={audioRef} src={creator.ambientMusic} loop />
            <button 
              onClick={toggleMusic} 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-all"
            >
              {isPlaying ? 'Pause Music' : 'Play Ambient Music'}
            </button>
          </div>
        )}

        {/* Exit Room Button */}
        <button 
          onClick={onBack || (() => window.history.back())}
          className="absolute top-4 left-4 px-4 py-2 bg-black/70 border-2 border-white rounded-lg text-white font-semibold backdrop-blur-sm hover:bg-white/10 transition-all pointer-events-auto"
        >
          Exit Room
        </button>
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowTipModal(false)}>
          <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Support {creator.displayName}</h2>
            <p className="text-gray-600 mb-6">Send MNEE tokens directly to their wallet</p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1, 5, 10, 25].map(amount => (
                <button
                  key={amount}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    tipAmount === amount.toString()
                      ? 'bg-purple-100 border-2 border-purple-500 text-purple-700'
                      : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
                  }`}
                  onClick={() => setTipAmount(amount.toString())}
                >
                  {amount} MNEE
                </button>
              ))}
            </div>

            <input
              type="number"
              min="0.1"
              step="0.1"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-lg mb-4"
              placeholder="Custom amount"
            />

            <button 
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all mb-2"
              onClick={sendTip}
            >
              Send {tipAmount} MNEE Tip
            </button>

            <button 
              className="w-full py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              onClick={() => setShowTipModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { ArtistRoom3D, ROOM_THEMES };
