/**
 * ERNEST MBARGA — IMMERSIVE 3D PORTFOLIO
 * js/components/about-stage.js
 * Scène 3D À Propos — La Matrice d'Identité & Coordonnées Géospatiales
 */
import * as THREE from 'three';

export function createAboutStage(gltfLoader, textures = {}) {
    const group = new THREE.Group();
    group.name = 'aboutStageGroup';
    // Positionné à l'altitude de la section À Propos
    group.position.set(0, -3.2, 0);

    // 1. Panneau holographique géométrique & anneau de coordonnées (Yaoundé: 3.8480° N, 11.5021° E)
    const ringGroup = new THREE.Group();
    ringGroup.position.set(-1.8, 0, -1.0);
    
    // Anneau géospatial
    const geoRing = new THREE.RingGeometry(1.4, 1.45, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(geoRing, ringMat);
    ringGroup.add(ringMesh);

    // Repères cartésiens [X, Y, Z]
    const bracketGeo = new THREE.BufferGeometry();
    const bPts = [
        -1.6, 1.2, 0,  -1.2, 1.2, 0,
        -1.6, 1.2, 0,  -1.6, 0.8, 0,
        1.6, 1.2, 0,   1.2, 1.2, 0,
        1.6, 1.2, 0,   1.6, 0.8, 0,
        -1.6, -1.2, 0, -1.2, -1.2, 0,
        -1.6, -1.2, 0, -1.6, -0.8, 0,
        1.6, -1.2, 0,  1.2, -1.2, 0,
        1.6, -1.2, 0,  1.6, -0.8, 0
    ];
    bracketGeo.setAttribute('position', new THREE.Float32BufferAttribute(bPts, 3));
    const bracketMat = new THREE.LineBasicMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.5
    });
    const brackets = new THREE.LineSegments(bracketGeo, bracketMat);
    ringGroup.add(brackets);

    group.add(ringGroup);

    // 2. Chargement du modèle 3D de structure carbone (Asset A-06 / 3D-ABS-01)
    let carbonStructure = null;
    if (gltfLoader) {
        gltfLoader.load(
            'public/assets/immersive/3d/abstract/carbon_structure.glb',
            (gltf) => {
                carbonStructure = gltf.scene;
                carbonStructure.scale.setScalar(0.75);
                carbonStructure.position.set(-2.6, -0.4, -0.8);
                carbonStructure.rotation.set(0.3, 0.4, 0.2);

                // Application des matériaux haute fidélité
                carbonStructure.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (textures.metalRoughness) {
                            child.material.roughnessMap = textures.metalRoughness;
                        }
                        if (textures.metalNormal) {
                            child.material.normalMap = textures.metalNormal;
                        }
                        child.material.metalness = 0.85;
                        child.material.roughness = 0.25;
                        child.material.needsUpdate = true;
                    }
                });

                group.add(carbonStructure);
            },
            undefined,
            (err) => {
                console.warn('Fallback carbon structure procedural:', err);
                // Fallback géométrie procédurale de haute précision si nécessaire
                const torusKnot = new THREE.Mesh(
                    new THREE.TorusKnotGeometry(0.65, 0.18, 96, 16),
                    new THREE.MeshStandardMaterial({
                        color: 0x1e293b,
                        metalness: 0.9,
                        roughness: 0.2,
                        wireframe: false
                    })
                );
                torusKnot.position.set(-2.6, -0.4, -0.8);
                group.add(torusKnot);
                carbonStructure = torusKnot;
            }
        );
    }

    // 3. Faisceaux de scanning verticaux discrets
    const beamGeo = new THREE.CylinderGeometry(0.015, 0.015, 6, 8);
    const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    const scanBeam = new THREE.Mesh(beamGeo, beamMat);
    scanBeam.position.set(2.4, 0, -2);
    group.add(scanBeam);

    let time = 0;
    function update(delta, scrollProgress, pointer = { x: 0, y: 0 }) {
        time += delta;

        // Rotation orbitale douce
        ringGroup.rotation.z = time * 0.15;
        ringGroup.rotation.x = Math.sin(time * 0.4) * 0.08;
        ringGroup.rotation.y = Math.cos(time * 0.5) * 0.08;

        if (carbonStructure) {
            carbonStructure.rotation.y += delta * 0.25;
            carbonStructure.rotation.x += delta * 0.15;
            carbonStructure.position.y = -0.4 + Math.sin(time * 0.8) * 0.1;
        }

        // Parallaxe au curseur
        group.position.x = pointer.x * 0.25;
    }

    return {
        group,
        update
    };
}
