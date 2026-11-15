/**
 * ERNEST MBARGA — IMMERSIVE 3D PORTFOLIO
 * js/camera-rig.js
 * Contrôleur de Caméra Cinématique & Trajectoire Spatiale Continue
 */
import * as THREE from 'three';

export function createCameraRig(fov = 45) {
    const camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        0.1,
        100.0
    );

    // Points de contrôle de la spline (Section 6 du Storyboard)
    const curvePoints = [
        new THREE.Vector3(0.0, 0.0, 4.5),       // Point 0 (Hero)
        new THREE.Vector3(0.2, -3.2, 3.4),      // Point 1 (About)
        new THREE.Vector3(-0.15, -7.0, 3.8),    // Point 2 (Skills)
        new THREE.Vector3(0.15, -11.2, 4.2),    // Point 3 (Projects)
        new THREE.Vector3(0.0, -15.0, 3.2)      // Point 4 (Contact)
    ];

    const targetPoints = [
        new THREE.Vector3(0.0, 0.0, 0.0),
        new THREE.Vector3(0.0, -3.2, 0.0),
        new THREE.Vector3(0.0, -7.0, 0.0),
        new THREE.Vector3(0.0, -11.2, 0.0),
        new THREE.Vector3(0.0, -15.0, 0.0)
    ];

    const cameraCurve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.25);
    const targetCurve = new THREE.CatmullRomCurve3(targetPoints, false, 'catmullrom', 0.25);

    const currentPos = new THREE.Vector3().copy(curvePoints[0]);
    const currentLook = new THREE.Vector3().copy(targetPoints[0]);
    const desiredPos = new THREE.Vector3();
    const desiredLook = new THREE.Vector3();

    camera.position.copy(currentPos);
    camera.lookAt(currentLook);

    let currentScrollProgress = 0;
    let targetScrollProgress = 0;

    function setScrollProgress(progress) {
        targetScrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
    }

    function update(delta, pointer = { x: 0, y: 0 }) {
        // Amortissement exponentiel du défilement
        currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.065;

        // Échantillonnage de la spline
        cameraCurve.getPointAt(currentScrollProgress, desiredPos);
        targetCurve.getPointAt(currentScrollProgress, desiredLook);

        // Ajout du décalage de parallaxe du pointeur (limité à +/- 2.5° max)
        const parallaxX = pointer.x * 0.35;
        const parallaxY = pointer.y * 0.22;

        desiredPos.x += parallaxX;
        desiredPos.y += parallaxY;

        // Lissage de position
        currentPos.lerp(desiredPos, 0.075);
        currentLook.lerp(desiredLook, 0.075);

        camera.position.copy(currentPos);
        camera.lookAt(currentLook);
    }

    function resize(width, height, isMobile, isTablet) {
        camera.aspect = width / height;
        if (isMobile) {
            camera.fov = 60;
        } else if (isTablet) {
            camera.fov = 52;
        } else {
            camera.fov = 45;
        }
        camera.updateProjectionMatrix();
    }

    return {
        camera,
        update,
        setScrollProgress,
        resize
    };
}
