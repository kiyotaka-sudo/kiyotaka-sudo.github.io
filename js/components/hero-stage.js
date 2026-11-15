/**
 * ERNEST MBARGA — IMMERSIVE 3D PORTFOLIO
 * js/components/hero-stage.js
 * Scène 3D du Hero — Le Portail Spatial & L'Initialisation
 */
import * as THREE from 'three';

export function createHeroStage() {
    const group = new THREE.Group();
    group.name = 'heroStageGroup';
    group.position.set(0, 0, 0);

    // 1. Halo volumétrique central (Cyan / Bleu nuit)
    const haloGeo = new THREE.RingGeometry(1.6, 3.8, 64);
    const haloMat = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(0x00d4ff) },
            uColorB: { value: new THREE.Color(0x1d4ed8) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            varying vec2 vUv;
            void main() {
                float dist = length(vUv - 0.5) * 2.0;
                float glow = smoothstep(1.0, 0.2, dist) * smoothstep(0.0, 0.4, dist);
                vec3 col = mix(uColorA, uColorB, sin(uTime * 0.8 + dist * 3.14) * 0.5 + 0.5);
                gl_FragColor = vec4(col, glow * 0.28);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(0, 0.2, -1.8);
    group.add(haloMesh);

    // 2. Anneaux orbitaux concentriques fins ("The Digital Portal Rings")
    const ringMat = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });

    const innerRingGeo = new THREE.BufferGeometry();
    const ringPts = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        ringPts.push(Math.cos(theta) * 2.4, Math.sin(theta) * 2.4, 0);
    }
    innerRingGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringPts, 3));
    const innerRing = new THREE.Line(innerRingGeo, ringMat);
    innerRing.position.set(0, 0.2, -1.5);
    group.add(innerRing);

    const outerRingGeo = new THREE.BufferGeometry();
    const outerRingPts = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        outerRingPts.push(Math.cos(theta) * 3.6, Math.sin(theta) * 3.6, 0);
    }
    outerRingGeo.setAttribute('position', new THREE.Float32BufferAttribute(outerRingPts, 3));
    const outerRing = new THREE.Line(outerRingGeo, new THREE.LineBasicMaterial({
        color: 0x2563eb,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
    }));
    outerRing.position.set(0, 0.2, -1.9);
    group.add(outerRing);

    // 3. Marqueurs et données géométriques flottantes (HUD Spatial)
    const markerGroup = new THREE.Group();
    markerGroup.position.set(0, 0.2, -1.2);
    const boxGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.6 });
    for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const marker = new THREE.Mesh(boxGeo, boxMat);
        marker.position.set(Math.cos(ang) * 2.8, Math.sin(ang) * 2.8, (Math.random() - 0.5) * 0.4);
        markerGroup.add(marker);
    }
    group.add(markerGroup);

    // 4. Lumière dynamique centrale
    const heroLight = new THREE.PointLight(0x00d4ff, 1.8, 12);
    heroLight.position.set(0, 0.5, 1.2);
    group.add(heroLight);

    let time = 0;
    function update(delta, scrollProgress, pointer = { x: 0, y: 0 }) {
        time += delta;

        // Mise à jour shader halo
        haloMat.uniforms.uTime.value = time;

        // Rotations inverses élégantes des anneaux
        innerRing.rotation.z = time * 0.12;
        outerRing.rotation.z = -time * 0.08;
        markerGroup.rotation.z = time * 0.05;

        // Effet de parallaxe au curseur
        group.position.x = pointer.x * 0.35;
        group.position.y = pointer.y * 0.25;

        // Animation au scroll : plongée et dissolution lors de la transition vers À Propos
        if (scrollProgress < 0.25) {
            const p = scrollProgress / 0.25;
            group.position.z = -p * 3.5;
            group.scale.setScalar(1 + p * 0.3);
            haloMesh.material.opacity = (1 - p * 1.2);
        } else {
            // Hors champ
            haloMesh.material.opacity = 0;
        }
    }

    return {
        group,
        update
    };
}
