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

// Load repositories from GitHub API
async function loadRepositories() {
    if (isLoading) return;
    
    isLoading = true;
    showLoading();
    
    try {
        const response = await fetch(`${CONFIG.githubApiUrl}/users/${CONFIG.username}/repos?sort=updated&per_page=${CONFIG.reposPerPage}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Filter out excluded repositories and forks if desired
        repositories = repos.filter(repo => 
            !CONFIG.excludeRepos.includes(repo.name)
        );
        
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

// Render repositories in the grid
async function renderRepositories() {
    if (repositories.length === 0) {
        repositoriesGrid.innerHTML = `
            <div class="no-repositories">
                <i class="fas fa-code-branch"></i>
                <h3>No repositories found</h3>
                <p>Check back later for new projects!</p>
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

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    setupEnhancedSearch();
    addSmoothScrolling();
});
