/**
 * ERNEST MBARGA — IMMERSIVE 3D PORTFOLIO
 * js/components/contact-stage.js
 * Scène 3D Contact — La Convergence Cinématique & L'Horizon Silencieux
 */
import * as THREE from 'three';

export function createContactStage() {
    const group = new THREE.Group();
    group.name = 'contactStageGroup';
    // Altitude de la section Contact
    group.position.set(0, -15.0, 0);

    // 1. Phare d'horizon sphérique doux (The Horizon Beacon)
    const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });
    const beacon = new THREE.Mesh(sphereGeo, sphereMat);
    beacon.position.set(0, 0.4, -4.5);
    group.add(beacon);

    // 2. Halo extérieur diffus
    const haloGeo = new THREE.RingGeometry(0.6, 2.2, 48);
    const haloMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 0.4, -4.4);
    group.add(halo);

    // 3. Lignes de convergence géométriques
    const lineGeo = new THREE.BufferGeometry();
    const linePts = [];
    for (let i = -10; i <= 10; i += 2) {
        linePts.push(i * 1.2, -1.8, 4);
        linePts.push(i * 0.15, 0.4, -4.4);
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const convergeLines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(convergeLines);

    let clock = 0;
    function update(delta, scrollProgress, pointer = { x: 0, y: 0 }) {
        clock += delta;
        // Respiration lumineuse douce
        const pulse = Math.sin(clock * 1.5) * 0.08;
        beacon.scale.setScalar(1 + pulse);
        halo.scale.setScalar(1 + pulse * 1.2);
        beacon.position.x = pointer.x * 0.15;
    }

    return {
        group,
        update
    };
}
