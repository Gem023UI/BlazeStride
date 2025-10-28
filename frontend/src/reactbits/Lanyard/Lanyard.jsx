/* eslint-disable react/no-unknown-property */
'use client';
import React from 'react';
import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { getUserById } from '../../api/users';

// replace with your own imports, see the usage snippet for details
import cardGLB from './card.glb';
import lanyard from '../../assets/banner.png';

import * as THREE from 'three';
import './Lanyard.css';

class LanyardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lanyard error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="lanyard-wrapper" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '400px',
          color: '#999'
        }}>
          <p>3D Preview unavailable</p>
        </div>
      );
    }

    return this.props.children;
  }
}

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 12, transparent = true }) {
  return (
    <LanyardErrorBoundary>
      <div className="lanyard-wrapper">
        <Canvas
          camera={{ position: position, fov: fov }}
          gl={{ alpha: true, premultipliedAlpha: false }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color(0x000000), 0);
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}>
          <ambientLight intensity={Math.PI} />
          <Physics gravity={gravity}>
            <Suspense fallback={null}>
              <Band />
            </Suspense>
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]} />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]} />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]} />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]} />
          </Environment>
        </Canvas>
      </div>
    </LanyardErrorBoundary>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0 }) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyard);
  const [curve] = useState(() =>
    new THREE.CatmullRomCurve3(
      [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
    ));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const [isSmall, setIsSmall] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const [profileTexture, setProfileTexture] = useState(null);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.8]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.8]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.8]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const data = await getUserById(userId);

        if (data?.user?.useravatar || data?.user?.profilePicture) {
          const avatarUrl = data.user.useravatar || data.user.profilePicture;
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(
            avatarUrl,
            (loadedTexture) => {
              // ROTATION (in radians)
              loadedTexture.rotation = Math.PI; // 180 degrees
              // Try: 0, Math.PI/2 (90°), Math.PI (180°), Math.PI*1.5 (270°)
              
              // CENTER POINT for rotation and scaling (0-1 range)
              loadedTexture.center.set(0.5, 0.5); // Center of texture
              // Try: (0, 0) top-left, (1, 1) bottom-right, (0.5, 0.5) center
              
              // OFFSET - shifts the texture position (negative to positive)
              loadedTexture.offset.set(0.45, -0.2);
              // Try: (0.1, 0) shift right, (-0.1, 0) shift left
              // Try: (0, 0.1) shift up, (0, -0.1) shift down
              
              // REPEAT/SCALE - stretches or shrinks the texture
              loadedTexture.repeat.set(-1.9, 1.5); // (width scale, height scale)
              // Try: (1.5, 1.5) zoom out, (0.8, 0.8) zoom in
              // Try: (1, -1) to flip vertically, (-1, 1) to flip horizontally
              
              // WRAPPING MODE
              loadedTexture.wrapS = THREE.ClampToEdgeWrapping; // horizontal wrap
              loadedTexture.wrapT = THREE.ClampToEdgeWrapping; // vertical wrap
              // Options: THREE.ClampToEdgeWrapping, THREE.RepeatWrapping, THREE.MirroredRepeatWrapping
              
              // FILTERS
              loadedTexture.minFilter = THREE.LinearFilter;
              loadedTexture.magFilter = THREE.LinearFilter;
              
              loadedTexture.needsUpdate = true;
              setProfileTexture(loadedTexture);
            },
            undefined,
            (error) => {
              console.error("Error loading profile picture:", error);
            }
          );
        }
      } catch (error) {
        console.error("Failed to load profile picture from DB:", error);
      }
    };

    loadProfilePicture();

    const handleProfileUpdate = () => {
      loadProfilePicture();
    };

    window.addEventListener('profilePictureUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profilePictureUpdated', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={e => (
              e.target.setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))
              )
            )}>
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={profileTexture || materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
                side={THREE.FrontSide}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isSmall ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1} />
      </mesh>
    </>
  );
}