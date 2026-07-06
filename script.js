/* ================================================================
   ERNEST MBARGA — PORTFOLIO  v4
   ================================================================ */
'use strict';

/* ── 1. LOADER ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
    setTimeout(() => {
        const l = document.getElementById('loader');
        if (l) l.classList.add('out');
        setTimeout(heroReveal, 200);
    }, 1200);
});

/* ── 2. CURSEUR ─────────────────────────────────────────────────── */
const cDot  = document.getElementById('cDot');
const cRing = document.getElementById('cRing');
let mx = -300, my = -300, rx = -300, ry = -300;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function tickCursor() {
    if (cDot)  { cDot.style.left  = mx + 'px'; cDot.style.top  = my + 'px'; }
    if (cRing) {
        rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
        cRing.style.left = rx + 'px'; cRing.style.top = ry + 'px';
    }
    requestAnimationFrame(tickCursor);
})();

document.querySelectorAll('a,button,input,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-on'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));
});

/* ── 3. NAVBAR ──────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('solid', window.scrollY > 50);
}, { passive: true });

/* ── 4. MENU MOBILE ─────────────────────────────────────────────── */
const burger   = document.getElementById('navBurger');
const mobMenu  = document.getElementById('mobMenu');
const mobClose = document.getElementById('mobClose');

if (burger && mobMenu) {
    burger.addEventListener('click', () => {
        mobMenu.classList.add('open'); burger.classList.add('open');
    });
    const closeMenu = () => { mobMenu.classList.remove('open'); burger.classList.remove('open'); };
    if (mobClose) mobClose.addEventListener('click', closeMenu);
    document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
}

/* ── 5. TYPED TEXT ──────────────────────────────────────────────── */
(function initTyped() {
    const el = document.getElementById('typedText');
    if (!el) return;
    const P = ['Développeur Full-Stack', 'Cybersécurité B2', 'React · Spring Boot', 'DevOps & Docker', 'Pentest & Réseaux'];
    let pi = 0, ci = 0, del = false;
    function tick() {
        el.textContent = del ? P[pi].slice(0, --ci) : P[pi].slice(0, ++ci);
        let w = del ? 50 : 85;
        if (!del && ci === P[pi].length) { w = 2000; del = true; }
        else if (del && ci === 0) { del = false; pi = (pi + 1) % P.length; w = 350; }
        setTimeout(tick, w);
    }
    setTimeout(tick, 800);
})();

/* ── 6. HERO REVEAL ─────────────────────────────────────────────── */
function heroReveal() {
    document.querySelectorAll('.hero-word').forEach((w, i) => {
        setTimeout(() => w.classList.add('out'), 60 + i * 90);
    });
    document.querySelectorAll('.h-fade').forEach((el, i) => {
        setTimeout(() => el.classList.add('h-fade--in'), 300 + i * 140);
    });
}

/* ── 7. SCROLL REVEAL ───────────────────────────────────────────── */
/* Système simple et robuste :
   - ajouter data-reveal sur les sections
   - les enfants .rv s'animent en stagger via --i CSS var          */
function initScrollReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('rv-done');
            obs.unobserve(e.target);
        });
    }, { threshold: 0.07 });

    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
}

/* ── 8. COMPTEURS HERO ──────────────────────────────────────────── */
function initCounters() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('[data-count]').forEach(n => {
                const target = +n.dataset.count;
                const dur = 1400;
                const start = performance.now();
                (function run(now) {
                    const p = Math.min((now - start) / dur, 1);
                    const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
                    n.textContent = Math.round(ease * target);
                    if (p < 1) requestAnimationFrame(run);
                })(start);
            });
            obs.unobserve(e.target);
        });
    }, { threshold: 0.5 });

    const stats = document.querySelector('.hero-stats');
    if (stats) obs.observe(stats);
}

/* ── 9. SKILL BARS ──────────────────────────────────────────────── */
function initSkillBars() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.sk-fill[data-level]').forEach(b => {
                setTimeout(() => { b.style.width = b.dataset.level + '%'; }, 150);
            });
            obs.unobserve(e.target);
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.sk-grid').forEach(g => obs.observe(g));
}

/* ── 10. TABS COMPÉTENCES ───────────────────────────────────────── */
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const id = 'tab-' + btn.dataset.tab;
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(id);
            if (!panel) return;
            panel.classList.add('active');
            // Reset + animate bars
            panel.querySelectorAll('.sk-fill').forEach(b => { b.style.width = '0'; });
            setTimeout(() => {
                panel.querySelectorAll('.sk-fill').forEach(b => { b.style.width = b.dataset.level + '%'; });
            }, 80);
            // Stagger cards
            panel.querySelectorAll('.sk-card').forEach((c, i) => {
                c.style.setProperty('--i', i);
                c.classList.remove('rv');
                void c.offsetWidth; // reflow
                c.classList.add('rv');
            });
        });
    });
}

/* ── 11. FILTRE PROJETS ─────────────────────────────────────────── */
function initFilter() {
    document.querySelectorAll('.fil-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.fil-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            let v = 0;
            document.querySelectorAll('.proj-card').forEach(c => {
                const show = f === 'all' || c.dataset.category === f;
                c.style.display = show ? '' : 'none';
                if (show) { c.style.setProperty('--i', v++); c.classList.remove('rv'); void c.offsetWidth; c.classList.add('rv'); }
            });
        });
    });
}

/* ── 12. TILT 3D ────────────────────────────────────────────────── */
/* Rotation perspective + reflet lumineux selon position souris    */
function initTilt() {
    document.querySelectorAll('.tilt').forEach(card => {
        card.style.transformStyle = 'preserve-3d';

        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const px = ((e.clientX - r.left) / r.width  - .5) * 2;  // -1..1
            const py = ((e.clientY - r.top)  / r.height - .5) * 2;  // -1..1
            const rx = -py * 13;
            const ry =  px * 13;
            card.style.transform     = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
            card.style.boxShadow     = `${-ry*1.5}px ${rx*1.5}px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(0,212,255,.1)`;
            card.style.setProperty('--lx', (px * 50 + 50) + '%');
            card.style.setProperty('--ly', (py * 50 + 50) + '%');
            card.classList.add('tilt-on');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
            card.style.boxShadow  = '';
            card.classList.remove('tilt-on');
        });
    });
}

/* ── 13. PARALLAX HERO MULTI-COUCHES ───────────────────────────── */
/* Chaque couche bouge à une vitesse différente selon la souris    */
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // [sélecteur, facteur depth px/unité-normalised]
    const layers = [
        ['.hero-label',     26],
        ['.hero-word-wrap', 20],
        ['.hero-role',      14],
        ['.hero-p',          9],
        ['.hero-actions',    6],
        ['.hero-stats',      3],
        ['.hero-photo',     -8],  /* photo va en sens inverse = effet de profondeur */
    ];

    let tx = 0, ty = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
        tx = (e.clientX / window.innerWidth  - .5) * 2;
        ty = (e.clientY / window.innerHeight - .5) * 2;
    });

    function tick() {
        cx += (tx - cx) * 0.07;
        cy += (ty - cy) * 0.07;

        if (Math.abs(cx - tx) > 0.0005 || Math.abs(cy - ty) > 0.0005) {
            layers.forEach(([sel, depth]) => {
                const el = hero.querySelector(sel);
                if (el) el.style.transform = `translate(${cx * depth}px, ${cy * depth * .6}px)`;
            });
        }
        requestAnimationFrame(tick);
    }
    tick();
}

/* ── 14. BOUTONS MAGNÉTIQUES ────────────────────────────────────── */
function initMagnetic() {
    document.querySelectorAll('.mag').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r  = btn.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width  / 2)) * .28;
            const dy = (e.clientY - (r.top  + r.height / 2)) * .28;
            btn.style.transform    = `translate(${dx}px, ${dy}px)`;
            btn.style.transition   = 'transform .12s ease';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform  = 'translate(0,0)';
            btn.style.transition = 'transform .55s cubic-bezier(.25,.46,.45,.94)';
        });
    });
}

/* ── 15. CHAMPS FLOTTANTS ───────────────────────────────────────── */
/* Label monte au focus / rempli                                   */
function initFloatingLabels() {
    document.querySelectorAll('.ff-wrap').forEach(wrap => {
        const input = wrap.querySelector('input, textarea');
        if (!input) return;
        const check = () => wrap.classList.toggle('has-val', input.value.trim() !== '');
        input.addEventListener('focus', () => wrap.classList.add('focused'));
        input.addEventListener('blur',  () => { wrap.classList.remove('focused'); check(); });
        input.addEventListener('input', check);
    });
}

/* ── 16. FORMULAIRE ─────────────────────────────────────────────── */
function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn  = form.querySelector('.cf-submit');
        const orig = btn.innerHTML;
        btn.innerHTML = 'Message envoyé ✓';
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        btn.disabled = true;
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; form.reset(); form.querySelectorAll('.ff-wrap').forEach(w => w.classList.remove('has-val')); }, 3500);
    });
}

/* ── 17. SMOOTH SCROLL ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
});

/* ── 18. WATER WebGL ────────────────────────────────────────────── */
(function initWater() {
    const canvas = document.getElementById('waterCanvas');
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) { canvas.style.display = 'none'; return; }

    const VS = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0,1);}`;
    const FS = `
precision mediump float;
varying vec2 uv;
uniform float t;
uniform vec2 mouse;
uniform vec2 res;

float h(vec2 p){p=fract(p*vec2(443.9,397.3));p+=dot(p,p+19.2);return fract(p.x*p.y);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*n(p);p=m*p;a*=.5;}return v;}

void main(){
    float ar=res.x/res.y;
    vec2 st=uv;

    /* Déplacement surface */
    float tt=t*.3;
    vec2 d=vec2(fbm(st*3.+vec2(tt*.7,tt*.5))*.02, fbm(st*3.+vec2(tt*.5+3.7,tt*.6))*.02);

    /* Ripple souris */
    vec2 mp=vec2(mouse.x,1.-mouse.y);
    vec2 dm=(st-mp)*vec2(ar,1.);
    float rd=length(dm);
    float rpl=sin(rd*38.-t*7.)*.014*smoothstep(.6,.0,rd)*smoothstep(.0,.06,rd);
    d+=normalize(dm+.001)*rpl;
    vec2 dst=st+d;

    /* Couleurs eau sombre */
    vec3 deep=vec3(.008,.016,.05);
    vec3 mid =vec3(.015,.06,.18);
    vec3 hi  =vec3(.0,.5,.8);

    float depth=smoothstep(0.,1.,dst.y+fbm(dst*4.+tt*.4)*.12);
    vec3 col=mix(deep,mid,depth);

    /* Caustics */
    float c=pow(fbm(dst*7.+tt*.9)*fbm(dst*10.-tt*.5+2.),2.)*0.2;
    col+=hi*c;

    /* Spéculaire souris */
    col+=vec3(.3,.75,1.)*.15*smoothstep(.5,.0,rd);

    /* Vignette */
    float v=1.-smoothstep(.3,1.2,length((uv-.5)*vec2(ar,1.)*.85));
    col*=v*.9+.1;

    gl_FragColor=vec4(col,1.);
}`;

    function mkShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s); return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, 't');
    const uM = gl.getUniformLocation(prog, 'mouse');
    const uR = gl.getUniformLocation(prog, 'res');

    let tmx = .5, tmy = .5, gmx = .5, gmy = .5;
    document.addEventListener('mousemove', e => { tmx = e.clientX / window.innerWidth; tmy = e.clientY / window.innerHeight; });

    function resize() {
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0,0,w,h); }
    }
    window.addEventListener('resize', resize, { passive: true }); resize();

    (function frame(ts) {
        gmx += (tmx - gmx) * .04; gmy += (tmy - gmy) * .04;
        gl.uniform1f(uT, (ts || 0) * .001);
        gl.uniform2f(uM, gmx, gmy);
        gl.uniform2f(uR, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(frame);
    })();
})();

/* ── TOGGLE THÈME ───────────────────────────────────────────────── */
function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const saved = localStorage.getItem('em-theme');
    if (saved === 'light') document.body.classList.add('light');
    btn.addEventListener('click', () => {
        document.body.classList.toggle('light');
        localStorage.setItem('em-theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });
}

/* ── TRADUCTION FR ↔ EN ──────────────────────────────────────────── */
const TRANSLATIONS = {
    fr: {
        'nav-about':'À propos','nav-skills':'Compétences','nav-projects':'Projets','nav-contact':'Contact',
        'hero-badge':'Disponible pour des projets & stages',
        'hero-p':'Étudiant en <strong>Cybersécurité B2</strong> à KEYCE Academy Yaoundé. Full-Stack · DevOps · Réseaux · Offensif : je construis des solutions qui tiennent la route.',
        'btn-projects':'Voir mes projets','btn-contact':'Me contacter','btn-cv':'Télécharger CV',
        'stat-projects':'Projets','stat-domains':'Domaines','stat-exp':"Ans d'exp.",
        'sec-about':'À propos','about-h':'Bonjour, je suis Ernest.',
        'about-p1':'Étudiant en <strong>Cybersécurité (B2)</strong> à KEYCE Informatique Yaoundé, je construis des solutions digitales complètes : du frontend au backend, infrastructure cloud et sécurité offensive.',
        'about-p2':"Mes projets couvrent des apps mobiles React Native, des APIs Spring Boot, du Docker Swarm, des labs d'attaque Kali Linux et des topologies réseau Cisco. J'aime la complexité et je livre des résultats.",
        'fact-school':'KEYCE Informatique','fact-school-sub':'Cybersécurité · B2',
        'fact-loc':'Yaoundé, Cameroun','fact-loc-sub':'Disponible à distance',
        'fact-dev':'Full-Stack Dev','fact-dev-sub':'React · Spring Boot',
        'fact-ops':'DevOps & Cloud','fact-ops-sub':'Docker · Ansible · VMware',
        'btn-about':'Voir mes projets',
        'sec-skills':'Compétences','skills-h':'Mon stack technique',
        'sec-projects':'Projets','projects-h':'Mes réalisations',
        'filter-all':'Tous','filter-mobile':'Mobile & Web','filter-backend':'Backend & API',
        'filter-devops':'DevOps','filter-security':'Cybersécurité','filter-desktop':'Desktop',
        'btn-more':'Voir tous les projets sur GitHub',
        'sec-contact':'Contact','contact-h':'Travaillons ensemble',
        'contact-intro':"Vous avez un projet, une opportunité de stage ou simplement envie d'échanger ? Je suis ouvert à toute discussion.",
        'cv-contact':'Télécharger mon CV',
        'label-name':'Nom','label-email':'Email','label-subject':'Sujet','label-message':'Message',
        'btn-send':'Envoyer','form-note':'Je réponds généralement sous 24h.',
        'footer-copy':'© 2025 Mbarga Ernest · Yaoundé, Cameroun · Conçu & développé avec soin.',
        'badge-done':'Complété','badge-wip':'En cours',
        'scroll-hint':'Scroll'
    },
    en: {
        'nav-about':'About','nav-skills':'Skills','nav-projects':'Projects','nav-contact':'Contact',
        'hero-badge':'Available for projects & internships',
        'hero-p':'<strong>Cybersecurity B2</strong> student at KEYCE Academy Yaoundé. Full-Stack · DevOps · Networks · Offensive: I build solutions that hold up.',
        'btn-projects':'View my projects','btn-contact':'Contact me','btn-cv':'Download CV',
        'stat-projects':'Projects','stat-domains':'Domains','stat-exp':'Years exp.',
        'sec-about':'About','about-h':'Hello, I am Ernest.',
        'about-p1':'<strong>Cybersecurity (B2)</strong> student at KEYCE Informatique Yaoundé, I build complete digital solutions — from frontend to backend, cloud infrastructure and offensive security.',
        'about-p2':'My projects cover React Native mobile apps, Spring Boot APIs, Docker Swarm, Kali Linux attack labs and Cisco network topologies. I love complexity and I deliver results.',
        'fact-school':'KEYCE Informatique','fact-school-sub':'Cybersecurity · B2',
        'fact-loc':'Yaoundé, Cameroon','fact-loc-sub':'Available remotely',
        'fact-dev':'Full-Stack Dev','fact-dev-sub':'React · Spring Boot',
        'fact-ops':'DevOps & Cloud','fact-ops-sub':'Docker · Ansible · VMware',
        'btn-about':'View my projects',
        'sec-skills':'Skills','skills-h':'My tech stack',
        'sec-projects':'Projects','projects-h':'My work',
        'filter-all':'All','filter-mobile':'Mobile & Web','filter-backend':'Backend & API',
        'filter-devops':'DevOps','filter-security':'Cybersecurity','filter-desktop':'Desktop',
        'btn-more':'View all projects on GitHub',
        'sec-contact':'Contact','contact-h':"Let's work together",
        'contact-intro':"Got a project, an internship opportunity or simply want to chat? I'm open to any discussion.",
        'cv-contact':'Download my CV',
        'label-name':'Name','label-email':'Email','label-subject':'Subject','label-message':'Message',
        'btn-send':'Send','form-note':'I usually reply within 24h.',
        'footer-copy':'© 2025 Mbarga Ernest · Yaoundé, Cameroon · Designed & built with care.',
        'badge-done':'Completed','badge-wip':'In progress',
        'scroll-hint':'Scroll'
    }
};

function initTranslation() {
    const btn = document.getElementById('langToggle');
    const lbl = document.getElementById('langLabel');
    if (!btn) return;
    let lang = localStorage.getItem('em-lang') || 'fr';
    applyLang(lang);

    btn.addEventListener('click', () => {
        lang = lang === 'fr' ? 'en' : 'fr';
        localStorage.setItem('em-lang', lang);
        applyLang(lang);
    });

    function applyLang(l) {
        const t = TRANSLATIONS[l];
        if (lbl) { lbl.textContent = l === 'fr' ? 'EN' : 'FR'; }
        btn.classList.toggle('active', l === 'en');
        document.documentElement.lang = l;

        document.querySelectorAll('[data-key]').forEach(el => {
            const k = el.dataset.key;
            if (t[k] !== undefined) el.innerHTML = t[k];
        });

        // Placeholders des champs
        const fields = {name:'placeholder-name',email:'placeholder-email',subject:'placeholder-subject',message:'placeholder-message'};
        const placeholders = {
            fr:{name:'Votre nom',email:'vous@email.com',subject:'Proposition de projet...',message:'Décrivez votre projet...'},
            en:{name:'Your name',email:'you@email.com',subject:'Project proposal...',message:'Describe your project...'}
        };
        Object.entries(fields).forEach(([name]) => {
            const inp = document.querySelector(`[name="${name}"]`);
            if (inp) inp.placeholder = placeholders[l][name];
        });

        document.title = l === 'en'
            ? 'Ernest Mbarga — Developer & Cybersecurity'
            : 'Ernest Mbarga — Développeur & Cybersécurité';
    }
}

/* ── INIT ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initSkillBars();
    initTabs();
    initFilter();
    initTilt();
    initMagnetic();
    initHeroParallax();
    initFloatingLabels();
    initForm();
    initThemeToggle();
    initTranslation();

    /* Init première tab */
    setTimeout(() => {
        const panel = document.querySelector('.tab-panel.active');
        if (panel) panel.querySelectorAll('.sk-fill').forEach(b => { b.style.width = b.dataset.level + '%'; });
        document.querySelector('.tab-panel.active')?.querySelectorAll('.sk-card').forEach((c, i) => {
            c.style.setProperty('--i', i); c.classList.add('rv');
        });
    }, 600);
});
