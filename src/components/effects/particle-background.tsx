"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ParticleBackground({ 
  baseColor = "#df2531", 
  secondaryColor = "#991b22" 
}: { 
  baseColor?: string;
  secondaryColor?: string;
} = {}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.001);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      // Removed high-performance as it can cause WebGL context creation failure on some Android devices
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); // Fix for undefined devicePixelRatio
    mountRef.current.appendChild(renderer.domElement);

    // Particles setup
    const particleCount = 1500; // Increased to maintain density over larger area
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color1 = new THREE.Color(baseColor);
    const color2 = new THREE.Color(secondaryColor);
    const color3 = new THREE.Color("#ffffff"); // White

    for (let i = 0; i < particleCount; i++) {
      // Spread particles in a wide volume to prevent empty edges during panning
      positions[i * 3] = (Math.random() - 0.5) * 350; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 350; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150; // z

      // Mix colors
      const mixedColor = color1.clone();
      const rand = Math.random();
      if (rand > 0.6) mixedColor.lerp(color2, Math.random());
      else if (rand > 0.3) mixedColor.lerp(color3, Math.random());

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for soft glowing particles
    const material = new THREE.ShaderMaterial({
      precision: "mediump", // Fix: Android devices often do not support highp in fragment shaders
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec3 pos = position;
          // Subtle organic wobble
          pos.y += sin(time * 0.5 + position.x * 0.1) * 2.0;
          pos.x += cos(time * 0.3 + position.y * 0.1) * 2.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = max(1.0, size * (300.0 / -mvPosition.z)); // Prevent invisible particles < 1px
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Circular particle with soft edge
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float strength = 1.0 - (dist * 2.0);
          strength = pow(strength, 1.5); // Smoother falloff
          
          gl_FragColor = vec4(vColor, strength * 0.6); // Adjust global opacity
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.015; // Reduced from 0.05 to limit camera pan range
      mouseY = (event.clientY - windowHalfY) * 0.015;
    };

    document.addEventListener("mousemove", onDocumentMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      material.uniforms.time.value = time;

      // Framerate-independent smooth camera movement (works identically at 60fps or 144fps+)
      targetX = mouseX;
      targetY = mouseY;
      
      const lerpFactor = 1 - Math.exp(-2.0 * delta); // Adjusts easing continuously over delta time
      camera.position.x += (targetX - camera.position.x) * lerpFactor;
      camera.position.y += (-targetY - camera.position.y) * lerpFactor;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    render();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
