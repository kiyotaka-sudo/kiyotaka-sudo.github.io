// Données des compétences
const skillsData = {
    html: {
        name: "HTML5",
        description: "HTML5 (HyperText Markup Language 5) est la dernière version principale du langage de balisage utilisé pour structurer et présenter le contenu web. Il introduit de nouveaux éléments sémantiques et des API pour des applications web complexes.",
        clicks: 0
    },
    css: {
        name: "CSS3",
        description: "CSS3 (Cascading Style Sheets) permet de styliser le contenu HTML. Avec CSS3, vous pouvez créer des designs responsives, des animations et des transitions fluides sans JavaScript. Il introduit des modules comme Flexbox et Grid pour des mises en page avancées.",
        clicks: 0
    },
    js: {
        name: "JavaScript",
        description: "JavaScript est un langage de programmation qui permet de créer du contenu mis à jour dynamiquement, animer des images, contrôler le multimédia et tout ce qui concerne l'interactivité sur les pages web. ES6+ a introduit des fonctionnalités modernes comme les classes, les promesses et les modules.",
        clicks: 0
    },
    git: {
        name: "Git",
        description: "Git est un système de contrôle de version distribué qui permet de suivre les modifications du code source pendant le développement. Il facilite la collaboration entre développeurs et le retour à des versions antérieures si nécessaire.",
        clicks: 0
    },
    responsive: {
        name: "Responsive Design",
        description: "Le Responsive Design est une approche de conception web qui permet aux sites de s'adapter à différentes tailles d'écran et dispositifs (ordinateurs, tablettes, smartphones) en utilisant des media queries, des grilles flexibles et des images adaptatives.",
        clicks: 0
    }
};

// Éléments DOM
const skillButtons = document.querySelectorAll('.skill-btn');
const skillDescription = document.getElementById('skill-description');
const skillStatsList = document.getElementById('skill-stats-list');

// Charger les clics depuis localStorage
function loadClicks() {
    for (const skill in skillsData) {
        const savedClicks = localStorage.getItem(`skill_${skill}_clicks`);
        if (savedClicks) {
            skillsData[skill].clicks = parseInt(savedClicks);
        }
    }
    updateStats();
}

// Sauvegarder les clics dans localStorage
function saveClicks(skill) {
    localStorage.setItem(`skill_${skill}_clicks`, skillsData[skill].clicks.toString());
}

// Mettre à jour les statistiques affichées
function updateStats() {
    skillStatsList.innerHTML = '';
    for (const skill in skillsData) {
        const li = document.createElement('li');
        li.textContent = `${skillsData[skill].name} (${skillsData[skill].clicks} clic${skillsData[skill].clicks !== 1 ? 's' : ''})`;
        skillStatsList.appendChild(li);
    }
}

// Afficher la description d'une compétence
function showSkillDescription(skill) {
    skillDescription.style.display = 'block';
    skillDescription.innerHTML = `
        <h3>${skillsData[skill].name}</h3>
        <p>${skillsData[skill].description}</p>
    `;
    
    // Animation d'apparition
    skillDescription.style.animation = 'fadeIn 0.5s ease';
    setTimeout(() => {
        skillDescription.style.animation = '';
    }, 500);
}

// Gérer les clics sur les boutons de compétences
skillButtons.forEach(button => {
    button.addEventListener('click', () => {
        const skill = button.dataset.skill;
        skillsData[skill].clicks++;
        saveClicks(skill);
        showSkillDescription(skill);
        updateStats();
    });
});

// Initialiser la page
document.addEventListener('DOMContentLoaded', () => {
    loadClicks();
    
    // Ajouter une animation CSS dynamiquement
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});