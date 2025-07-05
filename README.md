# Sahil Yousaf - Dark Portfolio

A stunning, modern dark-themed portfolio website built with violet-900 as the primary color. Features a professional design inspired by contemporary portfolio layouts with smooth animations and responsive design.

## ✨ Design Features

- 🌙 **Dark Theme**: Modern dark design with violet-900 (#581c87) as the primary color
- 🎨 **Professional Layout**: Clean, portfolio-style design with hero section, about, skills, and projects
- 📸 **Profile Integration**: Automatically loads your GitHub profile picture and bio
- 🖼️ **Image Visualization**: Displays images from README files with lightbox gallery
- 🎯 **Smart Icons**: Dynamic project icons based on language and project type
- ⚡ **Smooth Animations**: Typing animations, parallax effects, and smooth scrolling
- 📱 **Mobile Responsive**: Perfectly optimized for all device sizes
- 🔍 **Enhanced Search**: Advanced filtering and search capabilities

## 🎨 **Color Scheme**

- **Primary**: Violet-900 (#581c87) - Main brand color
- **Accent**: Amber-500 (#f59e0b) - Highlights and CTAs  
- **Background**: Dark navy (#0f0f23) - Main background
- **Cards**: Dark slate (#1a1a2e) - Card backgrounds
- **Text**: Various shades of white and gray for optimal contrast

## 🏗️ **Website Sections**

### **1. Hero Section**
- Animated typing effect for name
- Professional profile picture with glowing effect
- Call-to-action button with hover animations
- Parallax background effects

### **2. About Section**
- Automatically loads bio from your `sahilyousafp/README.md`
- Professional profile image with purple glow
- Download CV button (customizable)
- Clean typography and spacing

### **3. Skills Section**
- Animated skill percentages on scroll
- Technology icons with hover effects
- Experience counter with large numbers
- Grid layout with purple accents

### **4. Services Section**
- 6 service cards with icons
- Hover effects with subtle background gradients
- Professional service descriptions
- Responsive grid layout

### **5. Projects Section**
- GitHub repositories with enhanced cards
- Preview images from README files
- Smart project icons based on technology
- Modal popups for README content with image gallery

### **6. Contact Section**
- Contact form with dark styling
- Contact information cards
- Social media links
- Professional contact methods

## Live Demo

Visit the live website: [https://sahilyousafp.github.io/sahilyousafp_pages](https://sahilyousafp.github.io/sahilyousafp_pages)

## 🚀 **Quick Setup**

1. **Update Configuration** in `script.js`:
   ```javascript
   const CONFIG = {
       username: 'sahilyousafp', // Change to YOUR GitHub username
       excludeRepos: ['sahilyousafp_pages'],
       reposPerPage: 20,
       githubApiUrl: 'https://api.github.com'
   };
   ```

2. **Create Your Profile README** (if not already created):
   - Create a repository with the same name as your username
   - Add a README.md file with your bio
   - This will automatically load in the About section

3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, Folder: / (root)

4. **Customize Personal Information**:
   - Update social media links in `index.html`
   - Modify contact information in the Contact section
   - Add your actual phone number and email

## 🎯 **Customization Options**

### **Colors**
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #581c87; /* Change to your preferred color */
    --accent-color: #f59e0b;   /* Change accent color */
    --bg-dark: #0f0f23;        /* Background color */
}
```

### **Content**
- **Hero Section**: Update name, title, and location in `index.html`
- **Services**: Modify the 6 service cards with your offerings
- **Skills**: Update skill percentages and technologies
- **Contact**: Add your real contact information

### **Profile Picture**
The website automatically uses your GitHub profile picture:
- `https://github.com/sahilyousafp.png`
- Update your GitHub profile picture to change it on the website

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
