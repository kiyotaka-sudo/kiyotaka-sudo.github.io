/**
 * ERNEST MBARGA — IMMERSIVE 3D PORTFOLIO
 * js/shaders/particle-system.js
 * Nuage de particules photoniques ("Digital Core Particles")
 */
import * as THREE from 'three';

export function createParticleSystem(isMobile = false) {
    const group = new THREE.Group();
    group.name = 'particleSystemGroup';

    const count = isMobile ? 180 : 520;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);

    // Palettes : Electric Cyan (#00d4ff), Cobalt Blue (#2563eb), Subtle Quantum Violet (#8b5cf6), Pure White
    const palette = [
        new THREE.Color(0x00d4ff),
        new THREE.Color(0x2563eb),
        new THREE.Color(0x8b5cf6),
        new THREE.Color(0xe0f2fe)
    ];

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Dispersion en volume étendu suivant l'axe vertical du parcours (Y de 5 à -20)
        positions[i3] = (Math.random() - 0.5) * 24;
        positions[i3 + 1] = 5 - Math.random() * 25;
        positions[i3 + 2] = (Math.random() - 0.5) * 16 - 2;

        const col = palette[Math.floor(Math.random() * palette.length)];
        colors[i3] = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;

        scales[i] = Math.random() * 0.08 + 0.03;
        speeds[i] = Math.random() * 0.4 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Texture de particule photonique générée procéduralement
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(0, 212, 255, 0.8)');
    grad.addColorStop(0.65, 'rgba(37, 99, 235, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size: isMobile ? 0.35 : 0.45,
        map: texture,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);

    let clock = 0;
    function update(delta, pointer = { x: 0, y: 0 }) {
        clock += delta;
        const posAttr = geometry.attributes.position;
        const arr = posAttr.array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Dérive verticale douce
            arr[i3 + 1] += speeds[i] * delta * 0.4;
            // Oscillations latérales sinus/cosinus
            arr[i3] += Math.sin(clock * speeds[i] + i) * 0.005;
            arr[i3 + 2] += Math.cos(clock * speeds[i] + i) * 0.005;

            // Bouclage en hauteur
            if (arr[i3 + 1] > 6) {
                arr[i3 + 1] = -20;
            }
        }
        posAttr.needsUpdate = true;

        // Réaction à la souris
        group.rotation.y = pointer.x * 0.05;
        group.rotation.x = -pointer.y * 0.05;
    }

    return {
        group,
        update
    };
}
