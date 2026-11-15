/**
 * ERNEST MBARGA — IMMERSIVE 3D PORTFOLIO
 * js/scene-manager.js
 * Gestionnaire d'Environnement 3D, Éclairages Cinématiques PBR & Scènes
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import { createPerspectiveGrid } from './shaders/grid-shader.js';
import { createParticleSystem } from './shaders/particle-system.js';
import { createHeroStage } from './components/hero-stage.js';
import { createAboutStage } from './components/about-stage.js';
import { createTechCore } from './components/tech-core.js';
import { createProjectScreens } from './components/project-screens.js';
import { createContactStage } from './components/contact-stage.js';

export function createSceneManager(renderer, isMobile = false) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050606, 0.042);

    // Initialisation des loaders
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    gltfLoader.setDRACOLoader(dracoLoader);

    const textureLoader = new THREE.TextureLoader();

    // 1. Éclairage cinématique de studio sombre (Section 9.2 du Storyboard)
    // Lumière directionnelle principale (Specular key)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 8, 6);
    scene.add(keyLight);

    // Lumière d'ambiance très douce pour préserver le noir spatial
    const ambientLight = new THREE.AmbientLight(0x0f172a, 0.65);
    scene.add(ambientLight);

    // Fill light cyan électrique à gauche
    const cyanLight = new THREE.PointLight(0x00d4ff, 3.2, 18);
    cyanLight.position.set(-6, 0, 3);
    scene.add(cyanLight);

    // Rim light cobalt / violet à droite
    const violetLight = new THREE.PointLight(0x7c3aed, 2.8, 18);
    violetLight.position.set(6, -4, 2);
    scene.add(violetLight);

    // 2. Chargement de l'environnement HDRI (Asset ENV-HDRI-01)
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
        'public/assets/immersive/environments/hdri/blue_photo_studio_1k.hdr',
        (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
        },
        undefined,
        (err) => {
            console.warn('HDRI environment fallback:', err);
        }
    );

    // 3. Chargement des textures PBR (Métal, Verre dépoli)
    const textures = {
        metalRoughness: textureLoader.load('public/assets/immersive/textures/metal/metal_roughness_1k.jpg'),
        metalNormal: textureLoader.load('public/assets/immersive/textures/metal/metal_normal_1k.jpg'),
        glassNormal: textureLoader.load('public/assets/immersive/textures/glass/glass_frosted_normal.jpg')
    };

    // 4. Instanciation des composants 3D
    const grid = createPerspectiveGrid();
    scene.add(grid.group);

    const particles = createParticleSystem(isMobile);
    scene.add(particles.group);

    const heroStage = createHeroStage();
    scene.add(heroStage.group);

    const aboutStage = createAboutStage(gltfLoader, textures);
    scene.add(aboutStage.group);

    const techCore = createTechCore(gltfLoader, textures);
    scene.add(techCore.group);

    const projectScreens = createProjectScreens(textures);
    scene.add(projectScreens.group);

    const contactStage = createContactStage();
    scene.add(contactStage.group);

    function update(delta, scrollProgress, pointer) {
        grid.update(delta, scrollProgress);
        particles.update(delta, pointer);
        heroStage.update(delta, scrollProgress, pointer);
        aboutStage.update(delta, scrollProgress, pointer);
        techCore.update(delta, scrollProgress, pointer);
        projectScreens.update(delta, scrollProgress, pointer);
        contactStage.update(delta, scrollProgress, pointer);

        // Déplacement vertical des lumières pour suivre la progression du visiteur
        const currentY = -scrollProgress * 15;
        cyanLight.position.y = currentY + 1.5;
        violetLight.position.y = currentY - 1.5;
        keyLight.position.y = currentY + 7;
    }

    return {
        scene,
        update,
        setActiveDomain: (domain) => techCore.setActiveDomain(domain),
        focusProject: (idx) => projectScreens.focusProject(idx),
        filterCategory: (cat) => projectScreens.filterCategory(cat)
    };
}
