/* ================================================================
   ERNEST MBARGA — PORTFOLIO
   Lenis smooth scroll + GSAP ScrollTrigger
   Thème DIMENSIO × BETA_motors
   ================================================================ */
'use strict';

/* ── 1. LENIS smooth scroll ─────────────────────────────────── */
let lenis;
function initLenis() {
    lenis = new Lenis({
        duration: 1.25,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.8,
    });

    /* Connecter Lenis à GSAP ticker pour la synchro */
    if (typeof gsap !== 'undefined') {
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
        /* Connecter ScrollTrigger à Lenis */
        lenis.on('scroll', ScrollTrigger.update);
    } else {
        /* Fallback RAF si GSAP pas chargé */
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -80, duration: 1.4 });
            }
        });
    });
}

/* ── 2. LOADER ──────────────────────────────────────────────── */
window.addEventListener('load', () => {
    setTimeout(() => {
        const l = document.getElementById('loader');
        if (l) l.classList.add('out');
        setTimeout(heroReveal, 150);
    }, 1000);
});

/* ── 3. NAVBAR ──────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('solid', window.scrollY > 60);
}, { passive: true });

/* Active nav link */
function setActiveNav() {
    const y = window.scrollY + 160;
    document.querySelectorAll('section[id]').forEach(s => {
        const lnk = document.querySelector(`.nav-link[href="#${s.id}"]`);
        if (lnk) lnk.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
    });
}
window.addEventListener('scroll', setActiveNav, { passive: true });

/* ── 4. MENU MOBILE ─────────────────────────────────────────── */
const burger   = document.getElementById('navBurger');
const mobMenu  = document.getElementById('mobMenu');
const mobClose = document.getElementById('mobClose');
if (burger && mobMenu) {
    burger.addEventListener('click', () => { mobMenu.classList.add('open'); burger.classList.add('open'); });
    const close = () => { mobMenu.classList.remove('open'); burger.classList.remove('open'); };
    if (mobClose) mobClose.addEventListener('click', close);
    document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', close));
}

/* ── 5. TYPED TEXT ──────────────────────────────────────────── */
(function initTyped() {
    const el = document.getElementById('typedText');
    if (!el) return;
    const P = ['Développeur Full-Stack', 'Cybersécurité B2', 'React · Spring Boot', 'DevOps & Docker', 'Pentest & Réseaux'];
    let pi = 0, ci = 0, del = false;
    function tick() {
        el.textContent = del ? P[pi].slice(0, --ci) : P[pi].slice(0, ++ci);
        let w = del ? 50 : 85;
        if (!del && ci === P[pi].length) { w = 2200; del = true; }
        else if (del && ci === 0) { del = false; pi = (pi + 1) % P.length; w = 350; }
        setTimeout(tick, w);
    }
    setTimeout(tick, 800);
})();

/* ── 6. HERO REVEAL ─────────────────────────────────────────── */
function heroReveal() {
    document.querySelectorAll('.hero .h-fade').forEach((el, i) => {
        setTimeout(() => el.classList.add('h-fade--in'), i * 120);
    });
    const word = document.querySelector('.hero-bg-word');
    if (word) {
        setTimeout(() => {
            word.style.opacity = '1';
            word.style.transform = 'translate(-50%, -50%) translateY(0)';
        }, 80);
    }
}

/* ── 7. WATER CANVAS WebGL ──────────────────────────────────── */
(function initWater() {
    const canvas = document.getElementById('waterCanvas');
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha:false, antialias:false });
    if (!gl) { canvas.style.display='none'; return; }

    const VS = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0,1);}`;
    const FS = `
precision mediump float;
varying vec2 uv; uniform float t; uniform vec2 mouse; uniform vec2 res;
float h(vec2 p){p=fract(p*vec2(443.9,397.3));p+=dot(p,p+19.2);return fract(p.x*p.y);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<4;i++){v+=a*n(p);p=m*p;a*=.5;}return v;}
void main(){
    float ar=res.x/res.y; vec2 st=uv;
    float tt=t*.25;
    vec2 d=vec2(fbm(st*2.8+vec2(tt*.6,tt*.4))*.015,fbm(st*2.8+vec2(tt*.4+3.,tt*.5))*.015);
    vec2 mp=vec2(mouse.x,1.-mouse.y);
    vec2 dm=(st-mp)*vec2(ar,1.); float rd=length(dm);
    float rpl=sin(rd*32.-t*6.)*.012*smoothstep(.55,.0,rd)*smoothstep(.0,.05,rd);
    d+=normalize(dm+.001)*rpl;
    vec2 dst=st+d;
    /* Palette DIMENSIO : quasi-noir avec accent vert-gris très subtil */
    vec3 deep=vec3(.02,.024,.024);
    vec3 mid=vec3(.04,.055,.05);
    vec3 hi=vec3(.65,.72,.69);
    float depth=smoothstep(.0,1.,dst.y+fbm(dst*3.+tt*.3)*.1);
    vec3 col=mix(deep,mid,depth);
    float c=pow(fbm(dst*5.+tt*.7)*fbm(dst*8.-tt*.4+2.),2.)*0.14;
    col+=hi*c;
    col+=vec3(.5,.62,.58)*.12*smoothstep(.5,.0,rd);
    float v=1.-smoothstep(.3,1.2,length((uv-.5)*vec2(ar,1.)*.85));
    col*=v*.9+.1;
    gl_FragColor=vec4(col,1.);
}`;
    function mk(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
    const prog=gl.createProgram();
    gl.attachShader(prog,mk(gl.VERTEX_SHADER,VS));
    gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const ap=gl.getAttribLocation(prog,'p'); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
    const uT=gl.getUniformLocation(prog,'t'),uM=gl.getUniformLocation(prog,'mouse'),uR=gl.getUniformLocation(prog,'res');
    let tx=.5,ty=.5,gx=.5,gy=.5;
    document.addEventListener('mousemove',e=>{tx=e.clientX/window.innerWidth;ty=e.clientY/window.innerHeight;});
    function resize(){canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;gl.viewport(0,0,canvas.width,canvas.height);}
    window.addEventListener('resize',resize,{passive:true}); resize();
    (function frame(ts){
        gx+=(tx-gx)*.04; gy+=(ty-gy)*.04;
        gl.uniform1f(uT,(ts||0)*.001); gl.uniform2f(uM,gx,gy); gl.uniform2f(uR,canvas.width,canvas.height);
        gl.drawArrays(gl.TRIANGLES,0,6); requestAnimationFrame(frame);
    })();
})();

/* ── 8. GSAP SCROLL ANIMATIONS ──────────────────────────────── */
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* Chaque section panel entre avec un fadeUp */
    gsap.utils.toArray('[data-reveal]').forEach(section => {
        /* Titre clip-path */
        gsap.utils.toArray('.rv-clip', section).forEach((el, i) => {
            gsap.from(el, {
                clipPath:'polygon(0 105%,100% 105%,100% 105%,0 105%)',
                opacity:0, duration:.9, delay:i*.1,
                ease:'power3.out',
                scrollTrigger:{ trigger:section, start:'top 82%', once:true }
            });
        });

        /* Items fadeUp */
        gsap.utils.toArray('.rv', section).forEach((el, i) => {
            gsap.from(el, {
                y:32, opacity:0, duration:.75,
                delay: parseFloat(getComputedStyle(el).getPropertyValue('--i') || 0) * .07,
                ease:'power3.out',
                scrollTrigger:{ trigger:section, start:'top 80%', once:true }
            });
        });

        /* Slides */
        gsap.utils.toArray('.rv-slide-left', section).forEach(el => {
            gsap.from(el, { x:-44, opacity:0, duration:.85, ease:'power3.out',
                scrollTrigger:{ trigger:section, start:'top 78%', once:true }});
        });
        gsap.utils.toArray('.rv-slide-right', section).forEach(el => {
            gsap.from(el, { x:44, opacity:0, duration:.85, ease:'power3.out',
                scrollTrigger:{ trigger:section, start:'top 78%', once:true }});
        });

        /* Marquer comme revealed pour CSS fallback aussi */
        ScrollTrigger.create({
            trigger:section, start:'top 82%', once:true,
            onEnter:() => section.classList.add('rv-done')
        });
    });

    /* Parallax photo about */
    const photo = document.querySelector('.photo-wrap');
    if (photo) {
        gsap.to(photo, {
            yPercent:-8,
            ease:'none',
            scrollTrigger:{ trigger:'.s-about', start:'top bottom', end:'bottom top', scrub:true }
        });
    }

    /* Progress rail */
    const fill = document.querySelector('.progress-track-fill');
    if (fill) {
        gsap.to(fill, {
            scaleY:1, ease:'none',
            scrollTrigger:{ trigger:'body', start:'top top', end:'bottom bottom', scrub:true }
        });
    }

    /* Titre hero PORTFOLIO — parallax vertical au scroll */
    const bgWord = document.querySelector('.hero-bg-word');
    if (bgWord) {
        gsap.to(bgWord, {
            yPercent:-18,
            ease:'none',
            scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
        });
    }

    /* Photo hero — monte plus vite que le fond */
    const heroPic = document.querySelector('.hero-photo-center');
    if (heroPic) {
        gsap.to(heroPic, {
            yPercent:-12,
            ease:'none',
            scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
        });
    }

    /* Skill bars */
    document.querySelectorAll('.sk-fill[data-level]').forEach(bar => {
        ScrollTrigger.create({
            trigger:bar, start:'top 85%', once:true,
            onEnter:() => { bar.style.width = bar.dataset.level + '%'; }
        });
    });

    /* Compteurs */
    document.querySelectorAll('[data-count]').forEach(num => {
        ScrollTrigger.create({
            trigger:num, start:'top 85%', once:true,
            onEnter:() => {
                const target = +num.dataset.count, dur = 1400;
                const start = performance.now();
                (function run(now){
                    const p = Math.min((now-start)/dur,1);
                    num.textContent = Math.round((1-Math.pow(1-p,3))*target);
                    if(p<1) requestAnimationFrame(run);
                })(start);
            }
        });
    });
}

/* ── 9. SCROLL REVEAL FALLBACK (sans GSAP) ──────────────────── */
function initRevealFallback() {
    /* Active body.ready pour que les transitions CSS s'activent */
    requestAnimationFrame(() => document.body.classList.add('ready'));

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('rv-done');
            obs.unobserve(e.target);
        });
    }, { threshold: 0.06, rootMargin:'0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));

    /* Stagger delay sur les grilles */
    document.querySelectorAll('.sk-card, .proj-card, .fact-card, .ci-item').forEach((el, i) => {
        el.style.setProperty('--i', (i % 6).toString());
    });

    /* Skill bars sans GSAP */
    const barObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.sk-fill').forEach(b => {
                setTimeout(() => { b.style.width = b.dataset.level + '%'; }, 200);
            });
            barObs.unobserve(e.target);
        });
    }, { threshold:.1 });
    document.querySelectorAll('.sk-grid').forEach(g => barObs.observe(g));

    /* Compteurs */
    const cntObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('[data-count]').forEach(num => {
                const target = +num.dataset.count, dur = 1400;
                const start = performance.now();
                (function run(now){
                    const p = Math.min((now-start)/dur,1);
                    num.textContent = Math.round((1-Math.pow(1-p,3))*target);
                    if(p<1) requestAnimationFrame(run);
                })(start);
            });
            cntObs.unobserve(e.target);
        });
    }, { threshold:.5 });
    const stats = document.querySelector('.hero-stats-bar');
    if (stats) cntObs.observe(stats);
}

/* ── 10. HERO PARALLAX souris ───────────────────────────────── */
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const layers = [
        ['.hero-top-left',   16],
        ['.hero-role-tag',   12],
        ['.hero-actions',     8],
        ['.hero-right-icons',-8],
        ['.hero-stats-bar',   4],
    ];
    let tx=0,ty=0,cx=0,cy=0;
    document.addEventListener('mousemove',e=>{
        tx=(e.clientX/window.innerWidth -.5)*2;
        ty=(e.clientY/window.innerHeight-.5)*2;
    });
    (function tick(){
        cx+=(tx-cx)*.07; cy+=(ty-cy)*.07;
        if(Math.abs(cx-tx)>.0005||Math.abs(cy-ty)>.0005){
            layers.forEach(([sel,d])=>{
                const el=hero.querySelector(sel);
                if(el) el.style.transform=`translate(${cx*d}px,${cy*d*.6}px)`;
            });
        }
        requestAnimationFrame(tick);
    })();
}

/* ── 11. TILT 3D ────────────────────────────────────────────── */
function initTilt() {
    document.querySelectorAll('.tilt').forEach(card => {
        card.style.transformStyle='preserve-3d';
        card.addEventListener('mousemove', e => {
            const r=card.getBoundingClientRect();
            const px=((e.clientX-r.left)/r.width-.5)*2;
            const py=((e.clientY-r.top)/r.height-.5)*2;
            const MAX=10;
            card.style.transform=`perspective(900px) rotateX(${-py*MAX}deg) rotateY(${px*MAX}deg) scale3d(1.02,1.02,1.02)`;
            card.style.boxShadow=`${-px*MAX}px ${-py*MAX*1.2}px 36px rgba(0,0,0,.45)`;
            card.style.setProperty('--lx',(px*50+50)+'%');
            card.style.setProperty('--ly',(py*50+50)+'%');
            card.classList.add('tilt-on');
        });
        card.addEventListener('mouseleave',()=>{
            card.style.transform='perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
            card.style.boxShadow='';
            card.classList.remove('tilt-on');
        });
    });
}

/* ── 12. TABS ───────────────────────────────────────────────── */
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            const id='tab-'+btn.dataset.tab;
            document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
            const panel=document.getElementById(id);
            if(!panel) return;
            panel.classList.add('active');
            panel.querySelectorAll('.sk-fill').forEach(b=>{b.style.width='0';});
            setTimeout(()=>panel.querySelectorAll('.sk-fill').forEach(b=>{b.style.width=b.dataset.level+'%';}),80);
            panel.querySelectorAll('.sk-card').forEach((c,i)=>{c.style.setProperty('--i',i); c.classList.remove('rv'); void c.offsetWidth; c.classList.add('rv');});
        });
    });
    /* Init première tab */
    window.addEventListener('load',()=>{
        document.querySelectorAll('.tab-panel.active .sk-fill').forEach(b=>{setTimeout(()=>{b.style.width=b.dataset.level+'%';},600);});
    });
}

/* ── 13. FILTRES PROJETS ────────────────────────────────────── */
function initFilter() {
    document.querySelectorAll('.fil-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.fil-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            const f=btn.dataset.filter; let v=0;
            document.querySelectorAll('.proj-card').forEach(c=>{
                const show=f==='all'||c.dataset.category===f;
                c.style.display=show?'':'none';
                if(show){c.style.setProperty('--i',v++); c.classList.remove('rv'); void c.offsetWidth; c.classList.add('rv');}
            });
        });
    });
}

/* ── 14. CHAMPS FLOTTANTS ───────────────────────────────────── */
function initFloatingLabels() {
    document.querySelectorAll('.ff-wrap').forEach(wrap => {
        const input=wrap.querySelector('input,textarea');
        if(!input) return;
        const check=()=>wrap.classList.toggle('has-val',input.value.trim()!=='');
        input.addEventListener('focus',()=>wrap.classList.add('focused'));
        input.addEventListener('blur', ()=>{wrap.classList.remove('focused');check();});
        input.addEventListener('input',check);
    });
}

/* ── 15. FORMULAIRE ─────────────────────────────────────────── */
function initForm() {
    const form=document.getElementById('contactForm');
    if(!form) return;
    form.addEventListener('submit',e=>{
        e.preventDefault();
        const btn=form.querySelector('.cf-submit');
        const orig=btn.innerHTML;
        btn.innerHTML='Message envoyé ✓';
        btn.style.background='rgba(166,184,178,.15)';
        btn.disabled=true;
        setTimeout(()=>{btn.innerHTML=orig;btn.style.background='';btn.disabled=false;form.reset();},3500);
    });
}

/* ── 16. TRADUCTION FR ↔ EN ─────────────────────────────────── */
const TRANS = {
    fr:{
        'nav-about':'À propos','nav-skills':'Compétences','nav-projects':'Projets','nav-contact':'Contact',
        'hero-badge':'Disponible pour des projets & stages',
        'hero-p':'Étudiant en <strong>Cybersécurité B2</strong> à KEYCE Informatique Yaoundé. Full-Stack · DevOps · Réseaux · Offensif : je construis des solutions qui tiennent la route.',
        'btn-projects':'Voir mes projets','btn-contact':'Me contacter','btn-cv':'Télécharger CV',
        'stat-projects':'Projets','stat-domains':'Domaines','stat-exp':"Ans d'exp.",
        'sec-about':'À propos','about-h':'Bonjour, je suis Ernest.',
        'about-p1':'Étudiant en <strong>Cybersécurité (B2)</strong> à KEYCE Informatique Yaoundé, je construis des solutions digitales complètes : du frontend au backend, infrastructure cloud et sécurité offensive.',
        'about-p2':"Mes projets couvrent des apps mobiles React Native, des APIs Spring Boot, du Docker Swarm, des labs d'attaque Kali Linux et des topologies réseau Cisco. J'aime la complexité et je livre des résultats.",
        'fact-school':'KEYCE Informatique','fact-school-sub':'Cybersécurité · B2','fact-loc':'Yaoundé, Cameroun','fact-loc-sub':'Disponible à distance','fact-dev':'Full-Stack Dev','fact-dev-sub':'React · Spring Boot','fact-ops':'DevOps & Cloud','fact-ops-sub':'Docker · Ansible · VMware',
        'btn-about':'Voir mes projets','sec-skills':'Compétences','skills-h':'Mon stack technique',
        'sec-projects':'Projets','projects-h':'Mes réalisations',
        'filter-all':'Tous','filter-mobile':'Mobile & Web','filter-backend':'Backend & API','filter-devops':'DevOps','filter-security':'Cybersécurité','filter-desktop':'Desktop',
        'btn-more':'Voir tous les projets sur GitHub',
        'proj-cityshare-desc':'Application mobile de covoiturage et livraison collaborative. Paiement Mobile Money MTN/Orange, temps réel WebSockets, géolocalisation OpenStreetMap.',
        'proj-keycbet-desc':'Plateforme de paris sportifs pour le marché camerounais. Architecture microservices Docker, JWT, cotes dynamiques WebSockets en temps réel.',
        'proj-optimum-desc':'Plateforme de streaming style Netflix. API REST documentée OpenAPI 3.1, auth JWT, gestion des abonnements et des contenus vidéo.',
        'proj-swarm-wp-desc':'Infrastructure web hautement disponible avec réplication MySQL. Load balancing Nginx, clustering multi-nœuds, déploiement zero-downtime.',
        'proj-swarm-odoo-desc':"Déploiement multi-nœuds d'Odoo 16 ERP. Orchestration Ansible, VPN ZeroTier, PostgreSQL haute disponibilité.",
        'proj-techlink-desc':"Topologie réseau multi-sites d'entreprise. Routage OSPF, HSRP, ACL, NAT/PAT et tunnel VPN IPsec sécurisé.",
        'proj-cybersec-desc':"Lab virtuel isolé de simulation d'attaques : Nmap, Metasploit, SET, Wireshark et remédiation.",
        'proj-keycegen-desc':'CLI + GUI générant un SDK client et un boilerplate backend depuis une spec OpenAPI 3.',
        'proj-greenit-desc':"Plateforme Green IT avec IA. Calcul d'empreinte écologique, visualisations Recharts, Claude API.",
        'proj-php-desc':'Mini-framework PHP inspiré de Laravel. Routing dynamique, ORM maison, PSR-4.',
        'sec-contact':'Contact','contact-h':'Travaillons ensemble',
        'contact-intro':"Vous avez un projet, une opportunité de stage ou simplement envie d'échanger ? Je suis ouvert à toute discussion.",
        'cv-contact':'Télécharger mon CV',
        'label-name':'Nom','label-email':'Email','label-subject':'Sujet','label-message':'Message',
        'btn-send':'Envoyer','form-note':'Je réponds généralement sous 24h.',
        'footer-copy':'© 2025 Mbarga Ernest · Yaoundé, Cameroun · Conçu & développé avec soin.',
        'badge-done':'Complété','badge-wip':'En cours','scroll-hint':'Scroll'
    },
    en:{
        'nav-about':'About','nav-skills':'Skills','nav-projects':'Projects','nav-contact':'Contact',
        'hero-badge':'Available for projects & internships',
        'hero-p':'<strong>Cybersecurity B2</strong> student at KEYCE Informatique Yaoundé. Full-Stack · DevOps · Networks · Offensive: I build solutions that hold up.',
        'btn-projects':'View my projects','btn-contact':'Contact me','btn-cv':'Download CV',
        'stat-projects':'Projects','stat-domains':'Domains','stat-exp':'Years exp.',
        'sec-about':'About','about-h':'Hello, I am Ernest.',
        'about-p1':'<strong>Cybersecurity (B2)</strong> student at KEYCE Informatique Yaoundé, I build complete digital solutions — from frontend to backend, cloud infrastructure and offensive security.',
        'about-p2':'My projects cover React Native mobile apps, Spring Boot APIs, Docker Swarm, Kali Linux attack labs and Cisco network topologies. I love complexity and I deliver results.',
        'fact-school':'KEYCE Informatique','fact-school-sub':'Cybersecurity · B2','fact-loc':'Yaoundé, Cameroon','fact-loc-sub':'Available remotely','fact-dev':'Full-Stack Dev','fact-dev-sub':'React · Spring Boot','fact-ops':'DevOps & Cloud','fact-ops-sub':'Docker · Ansible · VMware',
        'btn-about':'View my projects','sec-skills':'Skills','skills-h':'My tech stack',
        'sec-projects':'Projects','projects-h':'My work',
        'filter-all':'All','filter-mobile':'Mobile & Web','filter-backend':'Backend & API','filter-devops':'DevOps','filter-security':'Cybersecurity','filter-desktop':'Desktop',
        'btn-more':'View all projects on GitHub',
        'proj-cityshare-desc':'Mobile ride-sharing and delivery app for Cameroon. MTN/Orange Mobile Money, real-time WebSockets, OpenStreetMap.',
        'proj-keycbet-desc':'Sports betting platform for Cameroon. Docker microservices, JWT auth, real-time WebSockets odds.',
        'proj-optimum-desc':'Netflix-style streaming platform. OpenAPI 3.1, JWT auth, subscription & content management.',
        'proj-swarm-wp-desc':'Highly available web infrastructure. MySQL replication, Nginx load balancing, zero-downtime.',
        'proj-swarm-odoo-desc':'Multi-node Odoo 16 ERP deployment. Ansible, ZeroTier VPN, high-availability PostgreSQL.',
        'proj-techlink-desc':'Multi-site enterprise network. OSPF, HSRP, ACL, NAT/PAT, IPsec VPN.',
        'proj-cybersec-desc':'Isolated attack simulation lab: Nmap, Metasploit, SET, Wireshark and remediation.',
        'proj-keycegen-desc':'CLI + GUI generating client SDK and backend boilerplate from OpenAPI 3 spec.',
        'proj-greenit-desc':'Green IT platform with AI. Ecological footprint, Recharts, Claude API recommendations.',
        'proj-php-desc':'PHP mini-framework inspired by Laravel. Dynamic routing, custom ORM, PSR-4.',
        'sec-contact':'Contact','contact-h':"Let's work together",
        'contact-intro':"Got a project, an internship or simply want to chat? I'm open to any discussion.",
        'cv-contact':'Download my CV',
        'label-name':'Name','label-email':'Email','label-subject':'Subject','label-message':'Message',
        'btn-send':'Send','form-note':'I usually reply within 24h.',
        'footer-copy':'© 2025 Mbarga Ernest · Yaoundé, Cameroon · Designed & built with care.',
        'badge-done':'Completed','badge-wip':'In progress','scroll-hint':'Scroll'
    }
};

function initTranslation() {
    const btn=document.getElementById('langToggle'), lbl=document.getElementById('langLabel');
    if(!btn) return;
    let lang=localStorage.getItem('em-lang')||'fr';
    apply(lang);
    btn.addEventListener('click',()=>{ lang=lang==='fr'?'en':'fr'; localStorage.setItem('em-lang',lang); apply(lang); });
    function apply(l){
        const t=TRANS[l];
        if(lbl) lbl.textContent=l==='fr'?'EN':'FR';
        btn.classList.toggle('active',l==='en');
        document.documentElement.lang=l;
        document.querySelectorAll('[data-key]').forEach(el=>{ if(t[el.dataset.key]!==undefined) el.innerHTML=t[el.dataset.key]; });
        document.querySelectorAll('.badge-done').forEach(b=>b.textContent=t['badge-done']);
        document.querySelectorAll('.badge-wip').forEach(b=>b.textContent=t['badge-wip']);
        const ph={fr:{name:'Votre nom',email:'vous@email.com',subject:'Proposition de projet...',message:'Décrivez votre projet...'},en:{name:'Your name',email:'you@email.com',subject:'Project proposal...',message:'Describe your project...'}};
        ['name','email','subject','message'].forEach(n=>{ const inp=document.querySelector(`[name="${n}"]`); if(inp) inp.placeholder=ph[l][n]; });
        document.title=l==='en'?'Ernest Mbarga — Developer & Cybersecurity':'Ernest Mbarga — Développeur & Cybersécurité';
    }
}

/* ── INIT ALL ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initRevealFallback(); /* CSS fallback immédiat */
    initHeroParallax();
    initTilt();
    initTabs();
    initFilter();
    initFloatingLabels();
    initForm();
    initTranslation();

    /* GSAP après chargement CDN (async) */
    if (typeof gsap !== 'undefined') {
        initGSAP();
    } else {
        window.addEventListener('load', () => {
            if (typeof gsap !== 'undefined') initGSAP();
        });
    }

    /* Première tab bars */
    setTimeout(()=>{
        document.querySelectorAll('.tab-panel.active .sk-fill').forEach(b=>{ b.style.width=b.dataset.level+'%'; });
        document.querySelectorAll('.tab-panel.active .sk-card').forEach((c,i)=>{ c.style.setProperty('--i',i); c.classList.add('rv'); });
    }, 700);
});
