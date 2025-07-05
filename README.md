# Sahil Yousaf - GitHub Portfolio

A beautiful, responsive GitHub Pages website that showcases your repositories with their README files and provides easy navigation to your projects.

## Features

- 🎨 **Modern Design**: Clean, responsive design with beautiful gradients and animations
- 📱 **Mobile Friendly**: Fully responsive layout that works on all devices
- 🔗 **Repository Links**: Direct links to GitHub repositories and live demos
- 📖 **README Display**: Shows README content in a beautiful modal interface
- 🖼️ **Image Visualization**: Displays images from README files with lightbox gallery
- 🎯 **Smart Icons**: Dynamic project icons based on language and project type
- ⚡ **Fast Loading**: Optimized for quick loading and smooth user experience
- 🔍 **Enhanced Search**: Intuitive search with filtering capabilities
- 🎪 **Image Gallery**: Click on any README image to view in full-screen lightbox
- 📊 **Repository Previews**: Shows preview images from repository README files

## Live Demo

Visit the live website: [https://sahilyousafp.github.io/sahilyousafp_pages](https://sahilyousafp.github.io/sahilyousafp_pages)

## Setup Instructions

1. **Fork or Clone this repository**
   ```bash
   git clone https://github.com/sahilyousafp/sahilyousafp_pages.git
   cd sahilyousafp_pages
   ```

2. **Customize the website**
   - Open `script.js`
   - Change the `username` in the CONFIG object to your GitHub username:
   ```javascript
   const CONFIG = {
       username: 'your-github-username', // Change this to your username
       excludeRepos: ['sahilyousafp_pages'], // Add repos you want to exclude
       reposPerPage: 20,
       githubApiUrl: 'https://api.github.com'
   };
   ```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access your website**
   - Your website will be available at: `https://your-username.github.io/repository-name`

## Customization Options

### Personal Information
Edit the `index.html` file to customize:
- Name and title in the header
- Profile links
- Contact information

### Styling
Modify `styles.css` to change:
- Color scheme (update the gradient colors)
- Fonts and typography
- Layout and spacing
- Animation effects

### Repository Filtering
In `script.js`, you can:
- Exclude specific repositories from display
- Change the number of repositories shown
- Modify sorting criteria

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript ES6+**: Interactive functionality and async image loading
- **GitHub API**: Repository data fetching
- **Font Awesome**: Dynamic project icons based on language and content
- **Google Fonts**: Typography
- **Image Processing**: Automatic README image extraction and lightbox gallery
- **Responsive Design**: Mobile-first approach with progressive enhancement

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for the GitHub community

## Advanced Features

- **Smart Project Icons**: Icons automatically change based on:
  - Programming language (JavaScript, Python, Java, etc.)
  - Project type (API, bot, game, web app, etc.)
  - Repository name patterns

- **Image Visualization**: 
  - Automatic detection of images in README files
  - Repository preview images on cards
  - Full-screen lightbox gallery for README images
  - Download and open image options
  - Responsive image handling

- **Enhanced README Display**:
  - Improved markdown parsing
  - Syntax highlighting for code blocks
  - Table support with hover effects
  - Badge recognition and styling
  - Image gallery integration
