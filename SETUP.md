# GitHub Pages Website Configuration

This repository contains a beautiful, responsive website for showcasing your GitHub repositories. Follow these steps to set it up:

## Quick Setup

1. **Update your GitHub username** in `script.js`:
   ```javascript
   const CONFIG = {
       username: 'sahilyousafp', // Change this to YOUR username
       excludeRepos: ['sahilyousafp_pages'], // Repos to exclude
       reposPerPage: 20,
       githubApiUrl: 'https://api.github.com'
   };
   ```

2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

3. **Customize your profile** in `index.html`:
   - Update your name and title
   - Add your social media links
   - Modify the GitHub profile URL

## Features Included

✅ Responsive design that works on all devices
✅ Automatic repository loading from GitHub API
✅ README file display in modal windows
✅ Repository search and filtering
✅ Beautiful animations and hover effects
✅ Language-specific color coding
✅ Repository statistics (stars, forks, etc.)
✅ Links to live demos for GitHub Pages repositories

## Files Overview

- `index.html` - Main page structure
- `styles.css` - All styling and animations
- `script.js` - JavaScript functionality and API calls
- `README.md` - Documentation

## Your website will be live at:
`https://your-username.github.io/repository-name`

Happy coding! 🚀
