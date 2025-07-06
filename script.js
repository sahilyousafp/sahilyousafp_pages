// Configuration
const CONFIG = {
    username: 'sahilyousafp', // Change this to your GitHub username
    excludeRepos: ['sahilyousafp_pages'], // Repositories to exclude from display
    reposPerPage: 20,
    githubApiUrl: 'https://api.github.com'
};

// Language colors mapping
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'Shell': '#89e051',
    'Vue': '#2c3e50',
    'React': '#61dafb'
};

// Project icons mapping based on repository names and languages
const PROJECT_ICONS = {
    // By language
    'JavaScript': 'fab fa-js-square',
    'TypeScript': 'fab fa-js-square',
    'Python': 'fab fa-python',
    'Java': 'fab fa-java',
    'HTML': 'fab fa-html5',
    'CSS': 'fab fa-css3-alt',
    'PHP': 'fab fa-php',
    'Ruby': 'fas fa-gem',
    'Go': 'fas fa-code',
    'Rust': 'fas fa-cog',
    'Swift': 'fab fa-swift',
    'Kotlin': 'fab fa-android',
    'Dart': 'fas fa-mobile-alt',
    'Shell': 'fas fa-terminal',
    'Vue': 'fab fa-vuejs',
    'React': 'fab fa-react',
    // By project type/name patterns
    'api': 'fas fa-server',
    'bot': 'fas fa-robot',
    'chat': 'fas fa-comments',
    'game': 'fas fa-gamepad',
    'web': 'fas fa-globe',
    'mobile': 'fas fa-mobile-alt',
    'desktop': 'fas fa-desktop',
    'cli': 'fas fa-terminal',
    'tool': 'fas fa-wrench',
    'library': 'fas fa-book',
    'framework': 'fas fa-cubes',
    'template': 'fas fa-file-code',
    'portfolio': 'fas fa-user',
    'blog': 'fas fa-blog',
    'ecommerce': 'fas fa-shopping-cart',
    'dashboard': 'fas fa-chart-line',
    'admin': 'fas fa-users-cog',
    'auth': 'fas fa-lock',
    'database': 'fas fa-database',
    'ml': 'fas fa-brain',
    'ai': 'fas fa-robot',
    'data': 'fas fa-chart-bar',
    'scraper': 'fas fa-spider',
    'parser': 'fas fa-code-branch',
    'config': 'fas fa-cog',
    'docker': 'fab fa-docker',
    'kubernetes': 'fas fa-dharmachakra',
    'terraform': 'fas fa-cloud',
    'aws': 'fab fa-aws',
    'azure': 'fab fa-microsoft',
    'gcp': 'fab fa-google',
    'default': 'fas fa-folder-open'
};

// State management
let repositories = [];
let isLoading = false;
let currentRepository = null;

// DOM elements
const repositoriesGrid = document.getElementById('repositories-grid');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const modal = document.getElementById('repository-modal');
const modalTitle = document.getElementById('modal-title');
const repoLink = document.getElementById('repo-link');
const demoLink = document.getElementById('demo-link');
const readmeDisplay = document.getElementById('readme-display');
const closeModalBtn = document.getElementById('close-modal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadRepositories();
    setupEventListeners();
    initializeEnhancedFeatures();
});

// Event listeners
function setupEventListeners() {
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Setup chat button
function setupChatButton() {
    const chatButton = document.querySelector('.chat-button');
    if (chatButton) {
        chatButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const mailtoLink = `mailto:${EMAIL_CONFIG.recipientEmail}?subject=${encodeURIComponent('Let\'s Chat - Portfolio Inquiry')}&body=${encodeURIComponent(
                'Hi Sahil,\n\nI visited your portfolio and would like to discuss a potential project/opportunity.\n\nBest regards,'
            )}`;
            
            try {
                window.open(mailtoLink);
                showNotification('📧 Opening email to start our conversation!', 'info');
            } catch (error) {
                console.error('Chat button mailto failed:', error);
                showNotification('❌ Please email me directly at ' + EMAIL_CONFIG.recipientEmail, 'error');
            }
        });
    }
}

// Load repositories from GitHub API
async function loadRepositories() {
    if (isLoading) return;
    
    isLoading = true;
    showLoading();
    
    try {
        // First, try to fetch pinned repositories using GraphQL API
        const pinnedRepos = await fetchPinnedRepositories();
        
        if (pinnedRepos && pinnedRepos.length > 0) {
            repositories = pinnedRepos.filter(repo => 
                !CONFIG.excludeRepos.includes(repo.name)
            );
        } else {
            // Fallback: fetch all repositories and show the most starred/recent ones
            const response = await fetch(`${CONFIG.githubApiUrl}/users/${CONFIG.username}/repos?sort=updated&per_page=${CONFIG.reposPerPage}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const repos = await response.json();
            
            // Filter and sort by stars as a proxy for "featured" repositories
            repositories = repos
                .filter(repo => !CONFIG.excludeRepos.includes(repo.name))
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 6); // Show top 6 repositories
        }
        
        hideLoading();
        renderRepositories();
        
    } catch (error) {
        console.error('Error loading repositories:', error);
        hideLoading();
        showError();
    } finally {
        isLoading = false;
    }
}

// Fetch pinned repositories using GitHub GraphQL API
async function fetchPinnedRepositories() {
    try {
        // GitHub GraphQL query to get pinned repositories
        const query = `
            query {
                user(login: "${CONFIG.username}") {
                    pinnedItems(first: 6, types: REPOSITORY) {
                        nodes {
                            ... on Repository {
                                name
                                description
                                url
                                stargazerCount
                                forkCount
                                primaryLanguage {
                                    name
                                }
                                updatedAt
                                isPrivate
                            }
                        }
                    }
                }
            }
        `;
        
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            throw new Error('GraphQL query failed');
        }
        
        const data = await response.json();
        
        if (data.errors) {
            throw new Error('GraphQL errors: ' + JSON.stringify(data.errors));
        }
        
        // Convert GraphQL response to match REST API format
        const pinnedRepos = data.data?.user?.pinnedItems?.nodes?.map(repo => ({
            name: repo.name,
            description: repo.description,
            html_url: repo.url,
            stargazers_count: repo.stargazerCount,
            forks_count: repo.forkCount,
            language: repo.primaryLanguage?.name,
            updated_at: repo.updatedAt,
            private: repo.isPrivate
        })).filter(repo => !repo.private) || [];
        
        return pinnedRepos;
        
    } catch (error) {
        console.log('Could not fetch pinned repositories:', error.message);
        return null; // Fallback to regular repository fetching
    }
}

// Render repositories in the grid
async function renderRepositories() {
    if (repositories.length === 0) {
        repositoriesGrid.innerHTML = `
            <div class="no-repositories">
                <i class="fas fa-thumbtack"></i>
                <h3>No Pinned Projects Found</h3>
                <p>Pin some repositories on GitHub to showcase your featured projects here!</p>
                <a href="https://github.com/${CONFIG.username}" target="_blank" class="pin-repos-link">
                    <i class="fab fa-github"></i> Go to GitHub Profile
                </a>
            </div>
        `;
        return;
    }
    
    // Initial render without preview images
    repositoriesGrid.innerHTML = repositories.map(repo => createRepositoryCard(repo)).join('');
    
    // Add click listeners to repository cards
    document.querySelectorAll('.repository-card').forEach(card => {
        card.addEventListener('click', function() {
            const repoName = this.dataset.repoName;
            const repository = repositories.find(repo => repo.name === repoName);
            if (repository) {
                openRepositoryModal(repository);
            }
        });
    });
    
    // Load preview images asynchronously for better performance
    loadRepositoryPreviews();
}

// Load repository preview images
async function loadRepositoryPreviews() {
    const cards = document.querySelectorAll('.repository-card');
    const promises = Array.from(cards).map(async (card, index) => {
        const repoName = card.dataset.repoName;
        const repository = repositories.find(repo => repo.name === repoName);
        if (repository) {
            const previewImage = await getRepositoryPreviewImage(repository);
            if (previewImage) {
                addPreviewImageToCard(card, previewImage, repository.name);
            }
        }
    });
    
    // Process in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < promises.length; i += batchSize) {
        const batch = promises.slice(i, i + batchSize);
        await Promise.all(batch);
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Add preview image to repository card
function addPreviewImageToCard(card, imageSrc, repoName) {
    const header = card.querySelector('.repository-header');
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = `${repoName} preview`;
    img.className = 'repository-preview';
    img.loading = 'lazy';
    
    img.onload = function() {
        card.classList.add('has-preview');
        card.insertBefore(img, header);
    };
    
    img.onerror = function() {
        // Image failed to load, don't add it
        img.remove();
    };
}

// Create repository card HTML
function createRepositoryCard(repo) {
    const languageColor = LANGUAGE_COLORS[repo.language] || '#666';
    const description = repo.description || 'No description available';
    const lastUpdated = new Date(repo.updated_at).toLocaleDateString();
    const projectIcon = getProjectIcon(repo);
    const languageClass = repo.language ? repo.language.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    
    return `
        <div class="repository-card" data-repo-name="${repo.name}">
            <div class="repository-header">
                <div class="repository-icon ${languageClass}">
                    <i class="${projectIcon}"></i>
                </div>
                <h3 class="repository-title">${repo.name}</h3>
            </div>
            <p class="repository-description">${description}</p>
            <div class="repository-meta">
                ${repo.language ? `
                    <span>
                        <div class="language-dot" style="background-color: ${languageColor}"></div>
                        ${repo.language}
                    </span>
                ` : ''}
                <span>
                    <i class="fas fa-star"></i>
                    ${formatNumber(repo.stargazers_count)}
                </span>
                <span>
                    <i class="fas fa-code-branch"></i>
                    ${formatNumber(repo.forks_count)}
                </span>
                <span>
                    <i class="fas fa-calendar"></i>
                    ${lastUpdated}
                </span>
            </div>
        </div>
    `;
}

// Get appropriate icon for project
function getProjectIcon(repo) {
    const repoName = repo.name.toLowerCase();
    const language = repo.language;
    const description = (repo.description || '').toLowerCase();
    
    // Check by language first
    if (language && PROJECT_ICONS[language]) {
        return PROJECT_ICONS[language];
    }
    
    // Check by repository name patterns
    for (const [pattern, icon] of Object.entries(PROJECT_ICONS)) {
        if (pattern === 'default') continue;
        if (repoName.includes(pattern) || description.includes(pattern)) {
            return icon;
        }
    }
    
    // Default icon
    return PROJECT_ICONS.default;
}

// Open repository modal
async function openRepositoryModal(repository) {
    modalTitle.textContent = repository.name;
    repoLink.href = repository.html_url;
    
    // Check if there's a demo link (GitHub Pages)
    if (repository.has_pages) {
        demoLink.href = `https://${CONFIG.username}.github.io/${repository.name}`;
        demoLink.style.display = 'inline-flex';
    } else {
        demoLink.style.display = 'none';
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Load README
    await loadReadme(repository);
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    readmeDisplay.innerHTML = `
        <div class="readme-loading">
            <div class="spinner"></div>
            <p>Loading README...</p>
        </div>
    `;
}

// Load README content
async function loadReadme(repository) {
    currentRepository = repository; // Set current repository for image path resolution
    
    readmeDisplay.innerHTML = `
        <div class="readme-loading">
            <div class="spinner"></div>
            <p>Loading README...</p>
        </div>
    `;
    
    try {
        // Try to fetch README.md
        const response = await fetch(`${CONFIG.githubApiUrl}/repos/${CONFIG.username}/${repository.name}/readme`);
        
        if (!response.ok) {
            throw new Error('README not found');
        }
        
        const readmeData = await response.json();
        const readmeContent = atob(readmeData.content);
        
        // Convert markdown to HTML (basic conversion)
        const htmlContent = convertMarkdownToHtml(readmeContent);
        readmeDisplay.innerHTML = htmlContent;
        
        // Add image lightbox functionality
        addImageLightbox();
        
    } catch (error) {
        console.error('Error loading README:', error);
        readmeDisplay.innerHTML = `
            <div class="no-readme">
                <i class="fas fa-file-alt"></i>
                <h4>No README found</h4>
                <p>This repository doesn't have a README file.</p>
                <a href="${repository.html_url}" target="_blank" class="btn btn-primary">
                    <i class="fab fa-github"></i>
                    View Repository
                </a>
            </div>
        `;
    }
}

// Basic Markdown to HTML converter with image support
function convertMarkdownToHtml(markdown) {
    let html = markdown;
    
    // Images - handle both relative and absolute URLs
    html = html.replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, (match, alt, src) => {
        // If it's a relative path, convert to GitHub raw URL
        if (!src.startsWith('http') && !src.startsWith('data:')) {
            src = `https://raw.githubusercontent.com/${CONFIG.username}/${currentRepository.name}/main/${src}`;
        }
        return `<div class="readme-image-container">
                    <img src="${src}" alt="${alt}" class="readme-image" loading="lazy" onerror="this.style.display='none';">
                    ${alt ? `<p class="readme-image-caption">${alt}</p>` : ''}
                </div>`;
    });
    
    // Headers
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Code blocks with language support
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>');
    html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]*)`/gim, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Tables (basic support)
    html = html.replace(/\|(.+)\|/gm, (match, content) => {
        const cells = content.split('|').map(cell => cell.trim());
        const cellTags = cells.map(cell => `<td>${cell}</td>`).join('');
        return `<tr>${cellTags}</tr>`;
    });
    
    // Wrap table rows in table tags
    html = html.replace(/(<tr>.*<\/tr>)/gs, '<table class="readme-table">$1</table>');
    
    // Line breaks
    html = html.replace(/\n/gim, '<br>');
    
    // Lists (improved)
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    // Wrap consecutive list items in ul/ol tags
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr>');
    html = html.replace(/^\*\*\*$/gim, '<hr>');
    
    // Badges (GitHub style)
    html = html.replace(/\[!\[([^\]]*)\]\(([^\)]*)\)\]\(([^\)]*)\)/gim, 
        '<a href="$3" target="_blank" rel="noopener noreferrer"><img src="$2" alt="$1" class="readme-badge"></a>');
    
    return html;
}

// Show loading state
function showLoading() {
    loadingElement.style.display = 'block';
    errorMessage.style.display = 'none';
    repositoriesGrid.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    loadingElement.style.display = 'none';
    repositoriesGrid.style.display = 'grid';
}

// Show error message
function showError() {
    errorMessage.style.display = 'block';
    loadingElement.style.display = 'none';
    repositoriesGrid.style.display = 'none';
}

// Utility function to format numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Search functionality (bonus feature)
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredRepos = repositories.filter(repo =>
                repo.name.toLowerCase().includes(searchTerm) ||
                (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
                (repo.language && repo.language.toLowerCase().includes(searchTerm))
            );
            
            const originalRepos = repositories;
            repositories = filteredRepos;
            renderRepositories();
            repositories = originalRepos;
        });
    }
}

// Add smooth scrolling for better UX
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Image lightbox functionality
function addImageLightbox() {
    const images = document.querySelectorAll('.readme-image');
    images.forEach(img => {
        img.addEventListener('click', function() {
            openImageLightbox(this.src, this.alt);
        });
        img.style.cursor = 'pointer';
        img.title = 'Click to view full size';
    });
}

// Open image in lightbox
function openImageLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <div class="lightbox-header">
                <span class="lightbox-title">${alt || 'Image'}</span>
                <button class="lightbox-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="lightbox-image-container">
                <img src="${src}" alt="${alt}" class="lightbox-image">
            </div>
            <div class="lightbox-actions">
                <a href="${src}" download class="btn btn-secondary">
                    <i class="fas fa-download"></i> Download
                </a>
                <a href="${src}" target="_blank" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i> Open in New Tab
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox events
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    function closeLightbox() {
        document.body.removeChild(lightbox);
        document.body.style.overflow = 'auto';
    }
}

// Enhanced search functionality with image preview
function setupEnhancedSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredRepos = repositories.filter(repo =>
                repo.name.toLowerCase().includes(searchTerm) ||
                (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
                (repo.language && repo.language.toLowerCase().includes(searchTerm)) ||
                (repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(searchTerm)))
            );
            
            const originalRepos = repositories;
            repositories = filteredRepos;
            renderRepositories();
            repositories = originalRepos;
        });
    }
}

// Extract and display repository preview image from README
async function getRepositoryPreviewImage(repository) {
    try {
        const response = await fetch(`${CONFIG.githubApiUrl}/repos/${CONFIG.username}/${repository.name}/readme`);
        if (!response.ok) return null;
        
        const readmeData = await response.json();
        const readmeContent = atob(readmeData.content);
        
        // Look for first image in README
        const imageMatch = readmeContent.match(/!\[([^\]]*)\]\(([^\)]*)\)/);
        if (imageMatch) {
            let imageSrc = imageMatch[2];
            // Convert relative paths to GitHub raw URLs
            if (!imageSrc.startsWith('http') && !imageSrc.startsWith('data:')) {
                imageSrc = `https://raw.githubusercontent.com/${CONFIG.username}/${repository.name}/main/${imageSrc}`;
            }
            return imageSrc;
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Load user bio from GitHub profile README
async function loadUserBio() {
    const bioContent = document.getElementById('bio-content');
    
    try {
        // Fetch the user's profile README
        const response = await fetch(`${CONFIG.githubApiUrl}/repos/${CONFIG.username}/${CONFIG.username}/readme`);
        
        if (!response.ok) {
            throw new Error('Profile README not found');
        }
        
        const readmeData = await response.json();
        const readmeContent = atob(readmeData.content);
        
        // Convert markdown to HTML and extract bio section
        const htmlContent = convertMarkdownToHtml(readmeContent);
        bioContent.innerHTML = htmlContent;
        
    } catch (error) {
        console.error('Error loading bio:', error);
        bioContent.innerHTML = `
            <p>Passionate software developer and researcher from Pakistan, dedicated to creating innovative solutions and contributing to the tech community. With expertise in web development, data analysis, and emerging technologies, I strive to build applications that make a difference.</p>
            <p>Currently focused on full-stack development, machine learning, and open-source contributions. Always eager to learn new technologies and collaborate on exciting projects.</p>
        `;
    }
}

// Smooth navigation functionality
function setupSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Add click listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Animate skill percentages on scroll
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percentage = entry.target.querySelector('.skill-percentage');
                if (percentage && !percentage.classList.contains('animated')) {
                    percentage.classList.add('animated');
                    animateCounter(percentage);
                }
            }
        });
    }, { threshold: 0.5 });
    
    skillItems.forEach(item => observer.observe(item));
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '%';
    }, 30);
}

// Email configuration - Replace these with your actual EmailJS credentials
const EMAIL_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
    serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
    templateId: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
    recipientEmail: 'sahil.yousaf@students.iaac.net'
};

// Contact form submission
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Initialize EmailJS if credentials are provided
    if (EMAIL_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        try {
            emailjs.init(EMAIL_CONFIG.publicKey);
        } catch (error) {
            console.warn('EmailJS initialization failed:', error);
        }
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Validate form data
        const formData = {
            from_name: this.from_name.value.trim(),
            from_email: this.from_email.value.trim(),
            subject: this.subject.value.trim(),
            message: this.message.value.trim()
        };
        
        // Basic validation
        if (!formData.from_name || !formData.from_email || !formData.subject || !formData.message) {
            showNotification('❌ Please fill in all fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.from_email)) {
            showNotification('❌ Please enter a valid email address.', 'error');
            return;
        }
        
        // Update button to show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Add recipient email to form data
        formData.to_email = EMAIL_CONFIG.recipientEmail;
        
        // Try to send email using EmailJS
        if (EMAIL_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
            emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, formData)
                .then(() => {
                    showNotification('✅ Message sent successfully! I will get back to you soon.', 'success');
                    this.reset();
                })
                .catch((error) => {
                    console.error('EmailJS failed:', error);
                    fallbackToMailto(formData);
                })
                .finally(() => {
                    resetSubmitButton(submitBtn, originalText);
                });
        } else {
            // Fallback to mailto if EmailJS is not configured
            fallbackToMailto(formData);
            resetSubmitButton(submitBtn, originalText);
        }
    });
}

// Fallback function to open default email client
function fallbackToMailto(formData) {
    const mailtoLink = `mailto:${EMAIL_CONFIG.recipientEmail}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `From: ${formData.from_name} (${formData.from_email})\n\nMessage:\n${formData.message}\n\n---\nSent from Portfolio Contact Form`
    )}`;
    
    try {
        window.open(mailtoLink);
        showNotification('📧 Opening your default email client...', 'info');
    } catch (error) {
        console.error('Mailto fallback failed:', error);
        showNotification('❌ Unable to send email. Please contact directly at ' + EMAIL_CONFIG.recipientEmail, 'error');
    }
}

// Reset submit button to original state
function resetSubmitButton(submitBtn, originalText) {
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification && notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add parallax effect to hero section
function setupParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Add typing animation to hero title
function setupTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid #f59e0b';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Initialize enhanced features
function initializeEnhancedFeatures() {
    loadUserBio();
    setupSmoothNavigation();
    animateSkillBars();
    setupContactForm();
    setupParallaxEffect();
    setupTypingAnimation();
    setupChatButton();
}
