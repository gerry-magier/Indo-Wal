// ============================================
// AUTOMATIC BLOG LOADER
// ============================================
// This script automatically discovers and displays blog posts
// Just add new blog filenames to the list below!

class BlogLoader {
  constructor(containerSelector, blogFolder = '/blog/') {
    this.container = document.querySelector(containerSelector);
    this.blogFolder = blogFolder;
    this.blogs = [];
  }

  // ============================================
  // ADD YOUR BLOG POST FILENAMES HERE
  // ============================================
  getBlogPosts() {
    return [
      'timor-leste-arrival.html',
      'jayapura-papua-arrival.html',
      'dekai-korowai-papua.html',
      'agats-asmat-papua.html',
      'nabire-kaimana-whale-sharks.html',
      'raja-ampat-travel-stories.html',
      'malaria-dengue-papua.html',
      // Add more as you create them:
      // 'my-amazing-whale-encounter.html',
      // 'diving-tips-timor-leste.html',
    ];
  }

  async loadBlogMetadata(filename) {
    try {
      const response = await fetch(this.blogFolder + filename);
      if (!response.ok) {
        console.warn(`Blog post not found: ${filename}`);
        return null;
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract metadata from the blog post
      const metadataScript = doc.querySelector('script[type="application/json"][data-blog-metadata]');
      
      if (metadataScript) {
        const metadata = JSON.parse(metadataScript.textContent);
        return {
          ...metadata,
          filename: filename,
          url: this.blogFolder + filename
        };
      }
      
      // Fallback: extract data from HTML if no metadata found
      return this.extractFallbackMetadata(doc, filename);
      
    } catch (error) {
      console.error(`Error loading blog ${filename}:`, error);
      return null;
    }
  }

  extractFallbackMetadata(doc, filename) {
    const title = doc.querySelector('.blog-title, h1')?.textContent || 'Untitled Post';
    const subtitle = doc.querySelector('.blog-subtitle')?.textContent || '';
    const img = doc.querySelector('.blog-featured-image, img')?.src || '/assets/hero.jpg';
    
    // Get first paragraph for excerpt
    const paragraphs = doc.querySelectorAll('.blog-content p');
    let excerpt = '';
    for (let p of paragraphs) {
      const text = p.textContent.trim();
      if (text.length > 50) {
        // Get first 2 sentences or ~150 characters
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        excerpt = sentences.slice(0, 2).join(' ');
        if (excerpt.length > 200) {
          excerpt = excerpt.substring(0, 197) + '...';
        }
        break;
      }
    }
    
    // Try to get date from blog
    const dateEl = doc.querySelector('.blog-date');
    let date = new Date().toISOString().split('T')[0];
    if (dateEl) {
      // Try to parse date from text
      const dateText = dateEl.textContent;
      const parsedDate = new Date(dateText);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split('T')[0];
      }
    }
    
    return {
      title,
      subtitle,
      excerpt: excerpt || subtitle || 'Read more...',
      image: img,
      date: date,
      author: '',
      filename: filename,
      url: this.blogFolder + filename
    };
  }

  async loadAllBlogs() {
    const blogFiles = this.getBlogPosts();
    const loadPromises = blogFiles.map(file => this.loadBlogMetadata(file));
    const results = await Promise.all(loadPromises);
    
    // Filter out failed loads and sort by date (newest first)
    this.blogs = results
      .filter(blog => blog !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return this.blogs;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  renderBlogCard(blog) {
    return `
      <article class="blog-card">
        <a href="${blog.url}" class="blog-card-link">
          <div class="blog-card-image">
            <img src="${blog.image}" alt="${blog.title}" loading="lazy">
          </div>
          <div class="blog-card-content">
            <div class="blog-card-meta">
              <time datetime="${blog.date}">${this.formatDate(blog.date)}</time>
              ${blog.author ? `<span class="blog-card-author">by ${blog.author}</span>` : ''}
            </div>
            <h2 class="blog-card-title">${blog.title}</h2>
            ${blog.subtitle ? `<p class="blog-card-subtitle">${blog.subtitle}</p>` : ''}
            <p class="blog-card-excerpt">${blog.excerpt}</p>
            <span class="blog-card-readmore">Read more →</span>
          </div>
        </a>
      </article>
    `;
  }

  renderLoadingState() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="blog-loading">
        <div class="blog-loading-spinner"></div>
        <p>Loading blog posts...</p>
      </div>
    `;
  }

  renderEmptyState() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="blog-empty">
        <p>No blog posts found yet. Check back soon for exciting stories about blue whales!</p>
      </div>
    `;
  }

  renderError() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="blog-error">
        <p>Unable to load blog posts. Please try again later.</p>
      </div>
    `;
  }

  async render() {
    if (!this.container) {
      console.error('Blog container not found');
      return;
    }

    this.renderLoadingState();

    try {
      await this.loadAllBlogs();
      
      if (this.blogs.length === 0) {
        this.renderEmptyState();
        return;
      }

      const blogsHTML = this.blogs.map(blog => this.renderBlogCard(blog)).join('');
      this.container.innerHTML = `<div class="blog-grid">${blogsHTML}</div>`;
      
    } catch (error) {
      console.error('Error rendering blogs:', error);
      this.renderError();
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBlogLoader);
} else {
  initBlogLoader();
}

function initBlogLoader() {
  const loader = new BlogLoader('#blog-posts-container');
  loader.render();
}