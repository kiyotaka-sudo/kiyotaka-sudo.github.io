/**
 * ERNEST MBARGA — IMMERSIVE 3D PORTFOLIO
 * js/components/project-screens.js
 * Scène 3D Projets — Hangar Numérique & Écrans Flottants en Perspective
 */
import * as THREE from 'three';

export function createProjectScreens(textures = {}) {
    const group = new THREE.Group();
    group.name = 'projectScreensGroup';
    // Altitude de la section Projets
    group.position.set(0, -11.2, 0);

    // Métadonnées des 10 projets réels d'Ernest Mbarga
    const projectDefs = [
        { id: 'cityshare', name: 'CityShare', cat: 'mobile', color: 0x00d4ff },
        { id: 'keycbet', name: 'KeyceBet', cat: 'mobile', color: 0x3b82f6 },
        { id: 'optimum', name: 'Optimum Video', cat: 'backend', color: 0x8b5cf6 },
        { id: 'swarm-wp', name: 'Swarm WordPress', cat: 'devops', color: 0x06b6d4 },
        { id: 'swarm-odoo', name: 'Swarm Odoo 16', cat: 'devops', color: 0x10b981 },
        { id: 'techlink', name: 'TECHLINK S.A.', cat: 'security', color: 0x0284c7 },
        { id: 'cybersec', name: 'Cybersec Lab', cat: 'security', color: 0xf59e0b },
        { id: 'keycegen', name: 'Keyce Generator', cat: 'desktop', color: 0x6366f1 },
        { id: 'greenit', name: 'Green IT Platform', cat: 'mobile', color: 0x10b981 },
        { id: 'php-mvc', name: 'Framework PHP', cat: 'backend', color: 0xec4899 }
    ];

    const screenMeshes = [];
    const screenGeo = new THREE.PlaneGeometry(1.5, 0.95);
    const frameGeo = new THREE.BoxGeometry(1.56, 1.01, 0.04);
    const frameMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.25
    });

    projectDefs.forEach((proj, i) => {
        const station = new THREE.Group();
        station.name = `project_station_${proj.id}`;

        // Cadre biseauté en titane sombre
        const frame = new THREE.Mesh(frameGeo, frameMat);
        station.add(frame);

        // Écran en verre dépoli avec bordure luminescente
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 320;
        const ctx = canvas.getContext('2d');
        
        // Fond sombre technique
        ctx.fillStyle = '#080d1a';
        ctx.fillRect(0, 0, 512, 320);

        // Grille technique HUD
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.12)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 512; x += 32) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 320); ctx.stroke();
        }
        for (let y = 0; y <= 320; y += 32) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
        }

        // Coins cartésiens
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2.5;
        // TL
        ctx.beginPath(); ctx.moveTo(16, 36); ctx.lineTo(16, 16); ctx.lineTo(36, 16); ctx.stroke();
        // TR
        ctx.beginPath(); ctx.moveTo(496, 36); ctx.lineTo(496, 16); ctx.lineTo(476, 16); ctx.stroke();
        // BL
        ctx.beginPath(); ctx.moveTo(16, 284); ctx.lineTo(16, 304); ctx.lineTo(36, 304); ctx.stroke();
        // BR
        ctx.beginPath(); ctx.moveTo(496, 284); ctx.lineTo(496, 304); ctx.lineTo(476, 304); ctx.stroke();

        // Titre du projet
        ctx.font = 'bold 24px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#f0eee7';
        ctx.fillText(proj.name.toUpperCase(), 32, 60);

        // Catégorie
        ctx.font = '14px "Inter", sans-serif';
        ctx.fillStyle = '#00d4ff';
        ctx.fillText(`SYS // ${proj.cat.toUpperCase()} CORE`, 32, 88);

        // Ligne de statut
        ctx.fillStyle = 'rgba(240, 238, 231, 0.6)';
        ctx.fillText('STATUS: OPERATIONAL & SECURED', 32, 260);

        const screenTexture = new THREE.CanvasTexture(canvas);
        const screenMat = new THREE.MeshStandardMaterial({
            map: screenTexture,
            roughness: 0.18,
            metalness: 0.25,
            emissive: new THREE.Color(proj.color),
            emissiveIntensity: 0.15
        });

        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.z = 0.025;
        station.add(screen);

        // Disposition le long d'un arc spatial en perspective
        const col = i % 2;
        const row = Math.floor(i / 2);
        const xPos = col === 0 ? -1.8 : 1.8;
        const yPos = 1.6 - row * 0.9;
        const zPos = -Math.abs(xPos) * 0.4 - row * 0.2;

        station.position.set(xPos, yPos, zPos);
        station.rotation.y = col === 0 ? 0.28 : -0.28;
        station.userData = {
            baseX: xPos,
            baseY: yPos,
            baseZ: zPos,
            baseRotY: col === 0 ? 0.28 : -0.28,
            category: proj.cat
        };

        group.add(station);
        screenMeshes.push(station);
    });

    let focusedIndex = -1;

    function focusProject(index) {
        focusedIndex = index;
    }

    function filterCategory(category) {
        screenMeshes.forEach((mesh) => {
            const match = category === 'all' || mesh.userData.category === category;
            mesh.visible = match;
        });
    }

    let clock = 0;
    function update(delta, scrollProgress, pointer = { x: 0, y: 0 }) {
        clock += delta;

        screenMeshes.forEach((station, idx) => {
            if (!station.visible) return;

            const u = station.userData;
            if (idx === focusedIndex) {
                // Écran sélectionné : glisse vers l'observateur et s'oriente face à la caméra
                station.position.z += (u.baseZ + 0.65 - station.position.z) * 0.1;
                station.rotation.y += (0 - station.rotation.y) * 0.1;
                station.position.y += (u.baseY + 0.15 - station.position.y) * 0.1;
            } else {
                // Flottement organique subtil
                const floatOffset = Math.sin(clock * 1.2 + idx * 0.8) * 0.04;
                station.position.z += (u.baseZ - station.position.z) * 0.08;
                station.position.y += (u.baseY + floatOffset - station.position.y) * 0.08;
                station.rotation.y += (u.baseRotY - station.rotation.y) * 0.08;
            }
        });

        // Parallaxe global du hangar
        group.rotation.y = pointer.x * 0.12;
        group.position.x = pointer.x * 0.2;
    }

    return {
        group,
        update,
        focusProject,
        filterCategory
    };
}
