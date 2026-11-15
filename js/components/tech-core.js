/**
 * ERNEST MBARGA — IMMERSIVE 3D PORTFOLIO
 * js/components/tech-core.js
 * Scène 3D Compétences — Les 6 Pôles Technologiques Réels d'Ernest Mbarga
 * (Dév, Data, IA, Réseaux, Sécurité, Systèmes/Infra)
 */
import * as THREE from 'three';

export function createTechCore(gltfLoader, textures = {}) {
    const group = new THREE.Group();
    group.name = 'techCoreGroup';
    // Positionné à l'altitude de la section Compétences
    group.position.set(0, -7.0, 0);

    // Pivot central pour orchestrer la bascule entre les pôles
    const corePivot = new THREE.Group();
    group.add(corePivot);

    // Pôles :
    // 0: Dev / Code (laptop_screen.glb + UI glass panels)
    // 1: Data / Algorithms (Pillars de flux & cylindres de données)
    // 2: IA (ai_core_sphere.glb + Réseau Neuronal procédural)
    // 3: Réseaux (Topologie Cisco OSPF / Hubs / VPN)
    // 4: Sécurité Informatique (shield.glb + Dôme géodésique / Radar de pentest)
    // 5: Systèmes & Infra (cluster_node.glb + sys_gears.glb)

    const poles = {
        frontend: new THREE.Group(),
        backend: new THREE.Group(),
        data: new THREE.Group(),
        ai: new THREE.Group(),
        networking: new THREE.Group(),
        security: new THREE.Group(),
        devops: new THREE.Group(),
        tools: new THREE.Group()
    };

    Object.values(poles).forEach(p => corePivot.add(p));

    /* ────────────────────────────────────────────────────────────
       PÔLE 1 : DÉVELOPPEMENT (Frontend & Backend)
       ──────────────────────────────────────────────────────────── */
    // Laptop Screen 3D + Floating UI Cards
    let laptopModel = null;
    if (gltfLoader) {
        gltfLoader.load(
            'public/assets/immersive/3d/development/laptop_screen.glb',
            (gltf) => {
                laptopModel = gltf.scene;
                laptopModel.scale.setScalar(0.48);
                laptopModel.position.set(0, -0.4, 0);
                laptopModel.rotation.set(0.15, -0.4, 0);

                laptopModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        if (textures.metalRoughness) child.material.roughnessMap = textures.metalRoughness;
                        child.material.metalness = 0.9;
                        child.material.roughness = 0.2;
                    }
                });
                poles.frontend.add(laptopModel);
            },
            undefined,
            () => {
                // Fallback procedural workstation
                const box = new THREE.Mesh(
                    new THREE.BoxGeometry(1.6, 0.05, 1.1),
                    new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9, roughness: 0.2 })
                );
                box.position.set(0, -0.4, 0);
                poles.frontend.add(box);
            }
        );
    }

    // Écrans flottants de code / interface (React / Spring Boot)
    const codePlaneGeo = new THREE.PlaneGeometry(0.85, 0.55);
    const codePlaneMat = new THREE.MeshStandardMaterial({
        color: 0x0e1726,
        transparent: true,
        opacity: 0.75,
        roughness: 0.15,
        metalness: 0.2,
        side: THREE.DoubleSide
    });
    const codeCard1 = new THREE.Mesh(codePlaneGeo, codePlaneMat);
    codeCard1.position.set(1.4, 0.6, 0.4);
    codeCard1.rotation.set(-0.1, -0.3, 0);
    poles.frontend.add(codeCard1);

    const codeCard2 = new THREE.Mesh(codePlaneGeo, codePlaneMat);
    codeCard2.position.set(-1.4, 0.7, 0.2);
    codeCard2.rotation.set(0.1, 0.35, 0);
    poles.frontend.add(codeCard2);

    /* ────────────────────────────────────────────────────────────
       PÔLE 2 : INTELLIGENCE ARTIFICIELLE & DATA
       ──────────────────────────────────────────────────────────── */
    // Sphère IA (Asset A-02 / 3D-AI-01)
    let aiSphere = null;
    if (gltfLoader) {
        gltfLoader.load(
            'public/assets/immersive/3d/ai/ai_core_sphere.glb',
            (gltf) => {
                aiSphere = gltf.scene;
                aiSphere.scale.setScalar(0.72);
                aiSphere.position.set(0, 0, 0);
                aiSphere.traverse((child) => {
                    if (child.isMesh) {
                        child.material.metalness = 0.85;
                        child.material.roughness = 0.22;
                    }
                });
                poles.ai.add(aiSphere);
            },
            undefined,
            () => {
                // Fallback procedural AI Core
                const geo = new THREE.IcosahedronGeometry(0.85, 2);
                const mat = new THREE.MeshStandardMaterial({
                    color: 0x6d28d9,
                    emissive: 0x3b0764,
                    wireframe: true
                });
                aiSphere = new THREE.Mesh(geo, mat);
                poles.ai.add(aiSphere);
            }
        );
    }

    // Réseau Neuronal Procédural : Nœuds synaptiques et axones
    const neuralNodeCount = 28;
    const neuralPositions = [];
    const neuralGroup = new THREE.Group();
    const nodeSphereGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const nodeSphereMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });

    for (let i = 0; i < neuralNodeCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / neuralNodeCount);
        const theta = Math.sqrt(neuralNodeCount * Math.PI) * phi;
        const radius = 1.35 + (Math.random() - 0.5) * 0.4;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        neuralPositions.push(new THREE.Vector3(x, y, z));
        const nodeMesh = new THREE.Mesh(nodeSphereGeo, nodeSphereMat);
        nodeMesh.position.set(x, y, z);
        neuralGroup.add(nodeMesh);
    }

    // Lignes synaptiques reliant les nœuds proches
    const synapseLines = [];
    for (let i = 0; i < neuralNodeCount; i++) {
        for (let j = i + 1; j < neuralNodeCount; j++) {
            if (neuralPositions[i].distanceTo(neuralPositions[j]) < 1.1) {
                synapseLines.push(neuralPositions[i].x, neuralPositions[i].y, neuralPositions[i].z);
                synapseLines.push(neuralPositions[j].x, neuralPositions[j].y, neuralPositions[j].z);
            }
        }
    }
    const synapseGeo = new THREE.BufferGeometry();
    synapseGeo.setAttribute('position', new THREE.Float32BufferAttribute(synapseLines, 3));
    const synapseMat = new THREE.LineBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const synapses = new THREE.LineSegments(synapseGeo, synapseMat);
    neuralGroup.add(synapses);
    poles.ai.add(neuralGroup);

    /* ────────────────────────────────────────────────────────────
       PÔLE 3 : SÉCURITÉ INFORMATIQUE & PENTEST
       ──────────────────────────────────────────────────────────── */
    // Bouclier Cryptographique (Asset A-01 / 3D-CYBER-01)
    let shieldModel = null;
    if (gltfLoader) {
        gltfLoader.load(
            'public/assets/immersive/3d/cybersecurity/shield.glb',
            (gltf) => {
                shieldModel = gltf.scene;
                shieldModel.scale.setScalar(0.78);
                shieldModel.position.set(0, 0, 0);
                shieldModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.material.metalness = 0.95;
                        child.material.roughness = 0.2;
                    }
                });
                poles.security.add(shieldModel);
            },
            undefined,
            () => {
                // Fallback procedural Cyber Core
                const geo = new THREE.OctahedronGeometry(0.9, 0);
                const mat = new THREE.MeshStandardMaterial({ color: 0x00d4ff, metalness: 0.9, wireframe: true });
                shieldModel = new THREE.Mesh(geo, mat);
                poles.security.add(shieldModel);
            }
        );
    }

    // Dôme géodésique transparent et scanner de vulnérabilité rotatif
    const radarGeo = new THREE.RingGeometry(1.2, 1.25, 48);
    const radarMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const radarRing = new THREE.Mesh(radarGeo, radarMat);
    radarRing.rotation.x = Math.PI / 2;
    poles.security.add(radarRing);

    /* ────────────────────────────────────────────────────────────
       PÔLE 4 : RÉSEAUX & TOPOLOGIE CISCO (OSPF, VPN IPsec, CCNA3)
       ──────────────────────────────────────────────────────────── */
    const netGroup = new THREE.Group();
    // 3 Hubs de commutation / routeurs
    const hubGeo = new THREE.BoxGeometry(0.35, 0.2, 0.35);
    const hubMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        metalness: 0.85,
        roughness: 0.25
    });

    const hubs = [];
    const hubCoords = [
        [-1.2, -0.3, 0],
        [1.2, -0.3, 0],
        [0, 0.8, -0.5]
    ];
    hubCoords.forEach(pos => {
        const hub = new THREE.Mesh(hubGeo, hubMat);
        hub.position.set(pos[0], pos[1], pos[2]);
        netGroup.add(hub);
        hubs.push(hub);
    });

    // Câbles de topologie en transit
    const netLineGeo = new THREE.BufferGeometry();
    const netLinePts = [
        hubCoords[0][0], hubCoords[0][1], hubCoords[0][2], hubCoords[1][0], hubCoords[1][1], hubCoords[1][2],
        hubCoords[1][0], hubCoords[1][1], hubCoords[1][2], hubCoords[2][0], hubCoords[2][1], hubCoords[2][2],
        hubCoords[2][0], hubCoords[2][1], hubCoords[2][2], hubCoords[0][0], hubCoords[0][1], hubCoords[0][2]
    ];
    netLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(netLinePts, 3));
    const netLineMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.6 });
    netGroup.add(new THREE.LineSegments(netLineGeo, netLineMat));

    // Paquets de données en transit rapide (photon packets)
    const packetGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    const packetMesh = new THREE.Mesh(packetGeo, packetMat);
    netGroup.add(packetMesh);

    poles.networking.add(netGroup);

    /* ────────────────────────────────────────────────────────────
       PÔLE 5 : SYSTÈMES & DEVOPS (Docker Swarm & Ansible)
       ──────────────────────────────────────────────────────────── */
    // Cluster Node (Asset 3D-INFRA-01) & Gears (Asset 3D-INFRA-02)
    let clusterNode = null;
    let sysGears = null;
    if (gltfLoader) {
        gltfLoader.load(
            'public/assets/immersive/3d/infrastructure/cluster_node.glb',
            (gltf) => {
                clusterNode = gltf.scene;
                clusterNode.scale.setScalar(0.55);
                clusterNode.position.set(-0.8, 0.2, 0);
                poles.devops.add(clusterNode);
            },
            undefined,
            () => {}
        );

        gltfLoader.load(
            'public/assets/immersive/3d/infrastructure/sys_gears.glb',
            (gltf) => {
                sysGears = gltf.scene;
                sysGears.scale.setScalar(0.4);
                sysGears.position.set(0.8, -0.2, 0);
                poles.devops.add(sysGears);
            },
            undefined,
            () => {}
        );
    }

    // Réplication de conteneurs Docker (Swarm Grid)
    const containerGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
    const containerMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.8,
        roughness: 0.3
    });
    const swarmGroup = new THREE.Group();
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            const c = new THREE.Mesh(containerGeo, containerMat);
            c.position.set(x * 0.45, y * 0.45, -0.3);
            swarmGroup.add(c);
        }
    }
    poles.devops.add(swarmGroup);

    /* ────────────────────────────────────────────────────────────
       GESTION DES CIBLES & VISIBILITÉ DES PÔLES
       ──────────────────────────────────────────────────────────── */
    let targetRotationY = 0;
    let currentRotationY = 0;
    let activePoleKey = 'frontend';

    // Positions relatives des pôles dans l'espace
    poles.frontend.position.set(0, 0, 0);
    poles.backend.position.set(0, 0, 0);
    poles.ai.position.set(2.4, 0, -1.8);
    poles.security.position.set(-2.4, 0, -1.8);
    poles.networking.position.set(0, 1.8, -2.4);
    poles.devops.position.set(0, -1.8, -2.4);

    function setActiveDomain(domain) {
        activePoleKey = domain;
        switch (domain) {
            case 'frontend':
            case 'backend':
                targetRotationY = 0;
                break;
            case 'ai':
            case 'data':
                targetRotationY = -0.55;
                break;
            case 'security':
                targetRotationY = 0.55;
                break;
            case 'devops':
                targetRotationY = Math.PI * 0.35;
                break;
            case 'tools':
            default:
                targetRotationY = -Math.PI * 0.35;
                break;
        }
    }

    let clock = 0;
    function update(delta, scrollProgress, pointer = { x: 0, y: 0 }) {
        clock += delta;

        // Rotation fluide vers le pôle actif
        currentRotationY += (targetRotationY - currentRotationY) * 0.06;
        corePivot.rotation.y = currentRotationY + pointer.x * 0.2;
        corePivot.rotation.x = pointer.y * 0.15;

        // Animations des sous-systèmes
        if (laptopModel) {
            laptopModel.rotation.y = -0.4 + Math.sin(clock * 0.8) * 0.08;
            laptopModel.position.y = -0.4 + Math.sin(clock * 1.2) * 0.05;
        }

        if (aiSphere) {
            aiSphere.rotation.y += delta * 0.35;
            aiSphere.rotation.x += delta * 0.2;
        }
        neuralGroup.rotation.y += delta * 0.18;
        neuralGroup.rotation.z += delta * 0.08;

        if (shieldModel) {
            shieldModel.rotation.y = Math.sin(clock * 0.9) * 0.25;
            shieldModel.position.y = Math.sin(clock * 1.4) * 0.08;
        }
        radarRing.rotation.z += delta * 0.8;

        // Animation du paquet de données réseau
        const netT = (clock * 1.5) % 3;
        const idx = Math.floor(netT);
        const frac = netT - idx;
        const pA = hubCoords[idx];
        const pB = hubCoords[(idx + 1) % 3];
        packetMesh.position.set(
            pA[0] + (pB[0] - pA[0]) * frac,
            pA[1] + (pB[1] - pA[1]) * frac,
            pA[2] + (pB[2] - pA[2]) * frac
        );

        if (sysGears) {
            sysGears.rotation.z += delta * 0.6;
        }
        if (clusterNode) {
            clusterNode.rotation.y += delta * 0.4;
            clusterNode.rotation.x += delta * 0.2;
        }
    }

    return {
        group,
        update,
        setActiveDomain
    };
}
