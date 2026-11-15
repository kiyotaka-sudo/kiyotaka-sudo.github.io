/**
 * ERNEST MBARGA — IMMERSIVE 3D PORTFOLIO
 * js/shaders/grid-shader.js
 * Grille de perspective 3D procédurale ("Horizon Grid")
 */
import * as THREE from 'three';

export function createPerspectiveGrid() {
    const group = new THREE.Group();
    group.name = 'perspectiveGridGroup';

    // Grille filaire principale au sol
    const size = 60;
    const divisions = 48;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x00d4ff, 0x1d3557);
    gridHelper.position.y = -2.2;
    gridHelper.position.z = -10;
    
    // Matériau avec transparence et atténuation de profondeur
    if (gridHelper.material) {
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.22;
        gridHelper.material.blending = THREE.AdditiveBlending;
        gridHelper.material.depthWrite = false;
    }
    group.add(gridHelper);

    // Seconde grille supérieure réfléchissante en hauteur (plafond technologique)
    const ceilGrid = new THREE.GridHelper(size, divisions, 0x3b82f6, 0x0f172a);
    ceilGrid.position.y = 8.5;
    ceilGrid.position.z = -10;
    if (ceilGrid.material) {
        ceilGrid.material.transparent = true;
        ceilGrid.material.opacity = 0.12;
        ceilGrid.material.blending = THREE.AdditiveBlending;
        ceilGrid.material.depthWrite = false;
    }
    group.add(ceilGrid);

    // Lignes de guidage d'horizon (axes de fuite)
    const lineGeo = new THREE.BufferGeometry();
    const lineVertices = [];
    for (let i = -16; i <= 16; i += 4) {
        lineVertices.push(i * 1.5, -2.18, 15);
        lineVertices.push(i * 3.5, -2.18, -45);
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
    });
    const horizonLines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(horizonLines);

    let time = 0;
    function update(delta, scrollProgress) {
        time += delta;
        // Légère ondulation en accord avec le défilement
        gridHelper.position.z = -10 + (scrollProgress * 4) % (size / divisions);
        ceilGrid.position.z = -10 + (scrollProgress * 3) % (size / divisions);
        
        // Pulsation lumineuse subtile
        if (gridHelper.material) {
            gridHelper.material.opacity = 0.18 + Math.sin(time * 1.2) * 0.06;
        }
    }

    return {
        group,
        update
    };
}
