/**
 * ERNEST MBARGA — IMMERSIVE 3D PORTFOLIO
 * js/webgl-app.js
 * Point d'entrée principal de l'expérience WebGL 3D
 */
import * as THREE from 'three';
import { createCameraRig } from './camera-rig.js';
import { createSceneManager } from './scene-manager.js';

class WebGLApp {
    constructor() {
        this.canvas = document.getElementById('webglCanvas');
        if (!this.canvas) {
            console.error('[WebGLApp] Canvas #webglCanvas introuvable dans le DOM.');
            return;
        }

        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        this.isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;

        this.pointer = { x: 0, y: 0, tx: 0, ty: 0 };
        this.scrollProgress = 0;
        this.lastTime = performance.now();

        this.initRenderer();
        this.initCamera();
        this.initScene();
        this.bindEvents();
        this.bindDOMHooks();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        console.log('[WebGLApp] Expérience 3D immersive Ernest Mbarga initialisée.');
    }

    initRenderer() {
        this.dpr = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.15 : 1.75);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: !this.isMobile,
            alpha: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.dpr);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    initCamera() {
        this.cameraRig = createCameraRig(this.isMobile ? 60 : (this.isTablet ? 52 : 45));
    }

    initScene() {
        this.sceneManager = createSceneManager(this.renderer, this.isMobile);
    }

    bindEvents() {
        // Redimensionnement
        window.addEventListener('resize', () => {
            this.isMobile = window.matchMedia('(max-width: 768px)').matches;
            this.isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
            this.dpr = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.15 : 1.75);

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(this.dpr);
            this.cameraRig.resize(window.innerWidth, window.innerHeight, this.isMobile, this.isTablet);
        }, { passive: true });

        // Mouvement de la souris
        window.addEventListener('pointermove', (e) => {
            this.pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
            this.pointer.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        // Progression du défilement
        const onScroll = () => {
            const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
            this.scrollProgress = window.scrollY / max;
            this.cameraRig.setScrollProgress(this.scrollProgress);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // Récupération en cas de perte de contexte GPU
        this.canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('[WebGLApp] Contexte WebGL perdu.');
        }, false);

        this.canvas.addEventListener('webglcontextrestored', () => {
            console.info('[WebGLApp] Contexte WebGL restauré.');
            this.initRenderer();
            this.initScene();
        }, false);
    }

    bindDOMHooks() {
        // Synchronisation des onglets de compétences
        document.querySelectorAll('.tab-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                if (tab && this.sceneManager) {
                    this.sceneManager.setActiveDomain(tab);
                }
            });
        });

        // Synchronisation des cartes de projets au survol
        document.querySelectorAll('.proj-card').forEach((card, idx) => {
            card.addEventListener('mouseenter', () => {
                if (this.sceneManager) this.sceneManager.focusProject(idx);
            });
            card.addEventListener('mouseleave', () => {
                if (this.sceneManager) this.sceneManager.focusProject(-1);
            });
        });

        // Synchronisation des filtres de projets
        document.querySelectorAll('.fil-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                if (filter && this.sceneManager) {
                    this.sceneManager.filterCategory(filter);
                }
            });
        });
    }

    animate(now) {
        requestAnimationFrame(this.animate);

        const delta = Math.min((now - this.lastTime) * 0.001, 0.05);
        this.lastTime = now;

        // Amortissement du pointeur
        this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.08;
        this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.08;

        const p = this.reducedMotion ? { x: 0, y: 0 } : this.pointer;

        this.cameraRig.update(delta, p);
        this.sceneManager.update(delta, this.scrollProgress, p);

        this.renderer.render(this.sceneManager.scene, this.cameraRig.camera);
    }
}

// Initialisation dès que le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.webglApp = new WebGLApp();
    });
} else {
    window.webglApp = new WebGLApp();
}
