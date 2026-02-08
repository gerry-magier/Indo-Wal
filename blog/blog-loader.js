// ============================================
// BLOG LOADER (DE/EN) - Copy/Paste Version
// ============================================
// - EN posts: /blog/<file>.html
// - DE posts: /de/blog/<file>.html
// Auto-detects language by URL prefix (/de/)
// Builds links + fetch paths correctly from ANY /de/ page (e.g. /de/register)

class BlogLoader {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);

    this.isDE = window.location.pathname.startsWith('/de/');
    this.blogFolder = options.blogFolder
      ? this.normalizeFolder(options.blogFolder)
      : (this.isDE ? '/de/blog/' : '/blog/');

    this.locale = options.locale || (this.isDE ? 'de-DE' : 'en-US');

    this.text = this.isDE
      ? {
          loading: 'Blogbeiträge werden geladen...',
          empty: 'Noch keine Blogbeiträge gefunden. Schau bald wieder vorbei!',
          error: 'Blogbeiträge konnten nicht geladen werden. Bitte später erneut versuchen.',
          readMore: 'Weiterlesen →',
          by: 'von'
        }
      : {
          loading: 'Loading blog posts...',
          empty: 'No blog posts found yet. Check back soon!',
          error: 'Unable to load blog posts. Please try again later.',
          readMore: 'Read more →',
          by: 'by'
        };

    this.blogs = [];
  }

  // Ensure leading slash + exactly one trailing slash
  normalizeFolder(folder) {
    folder = String(folder || '');
    if (!folder.startsWith('/')) folder = '/' + folder;
    folder = folder.replace(/\/+$/, '');
    return folder + '/';
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
    ];
  }

  // Always build the canonical URL for the current language
  buildPostUrl(filename) {
    const clean = String(filename || '').replace(/^\/+/, '');
    return this.blogFolder + clean;
  }

  async loadBlogMetadata(filename) {
    const url = this.buildPostUrl(filename);

    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) {
        console.warn(`Blog post not found (${response.status}): ${url}`);
        return null;
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Preferred: JSON metadata
      const metadataScript = doc.querySelector(
        'script[type="application/json"][data-blog-metadata]'
      );

      if (metadataScript) {
        let metadata = null;
        try {
          metadata = JSON.parse(metadataScript.textContent);
        } catch (e) {
          console.warn(`Invalid JSON metadata in ${url}`, e);
        }

        if (metadata) {
          return {
            ...metadata,
            filename,
            url // IMPORTANT: keep DE/EN URL here
          };
        }
      }

      // Fallback: extract from HTML
      return this.extractFallbackMetadata(doc, filename, url);
    } catch (error) {
      console.error(`Error loading blog ${url}:`, error);
      return null;
    }
  }

  extractFallbackMetadata(doc, filename, url) {
    const title =
      doc.querySelector('.blog-title, h1')?.textContent?.trim() ||
      'Untitled Post';

    const subtitle =
      doc.querySelector('.blog-subtitle')?.textContent?.trim() || '';

    // image
    const imgEl = doc.querySelector('.blog-featured-image, img');
    let image = imgEl?.getAttribute('src') || '/assets/hero.jpg';
    if (image && !image.startsWith('http') && !image.startsWith('/')) {
      image = '/' + image;
    }

    // excerpt
    const paragraphs = doc.querySelectorAll('.blog-content p, p');
    let excerpt = '';
    for (const p of paragraphs) {
      const text = (p.textContent || '').trim();
      if (text.length > 50) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        excerpt = sentences.slice(0, 2).join(' ').trim();
        if (excerpt.length > 200) excerpt = excerpt.substring(0, 197) + '...';
        break;
      }
    }

    // date
    let date = new Date().toISOString().split('T')[0];
    const dateEl = doc.querySelector('.blog-date, time[datetime]');
    if (dateEl) {
      const dtAttr = dateEl.getAttribute?.('datetime');
      const dateText = (dtAttr || dateEl.textContent || '').trim();
      const parsedDate = new Date(dateText);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split('T')[0];
      }
    }

    return {
      title,
      subtitle,
      excerpt: excerpt || subtitle || (this.isDE ? 'Weiterlesen...' : 'Read more...'),
      image,
      date,
      author: '',
      filename,
      url
    };
  }

  async loadAllBlogs() {
    const blogFiles = this.getBlogPosts();
    const results = await Promise.all(blogFiles.map((f) => this.loadBlogMetadata(f)));

    this.blogs = results
      .filter((b) => b !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return this.blogs;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(this.locale, options);
  }

  escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  renderBlogCard(blog) {
    // IMPORTANT: build link from filename + current language folder (never fall back to EN)
    const postUrl = this.buildPostUrl(blog.filename);

    return `
      <article class="blog-card">
        <a href="${postUrl}" class="blog-card-link">
          <div class="blog-card-image">
            <img src="${blog.image}" alt="${this.escapeHtml(blog.title)}" loading="lazy">
          </div>
          <div class="blog-card-content">
            <div class="blog-card-meta">
              <time datetime="${blog.date}">${this.formatDate(blog.date)}</time>
              ${blog.author ? `<span class="blog-card-author">${this.text.by} ${this.escapeHtml(blog.author)}</span>` : ''}
            </div>
            <h2 class="blog-card-title">${this.escapeHtml(blog.title)}</h2>
            ${blog.subtitle ? `<p class="blog-card-subtitle">${this.escapeHtml(blog.subtitle)}</p>` : ''}
            <p class="blog-card-excerpt">${this.escapeHtml(blog.excerpt)}</p>
            <span class="blog-card-readmore">${this.text.readMore}</span>
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
        <p>${this.text.loading}</p>
      </div>
    `;
  }

  renderEmptyState() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="blog-empty">
        <p>${this.text.empty}</p>
      </div>
    `;
  }

  renderError() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="blog-error">
        <p>${this.text.error}</p>
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

      const html = this.blogs.map((b) => this.renderBlogCard(b)).join('');
      this.container.innerHTML = `<div class="blog-grid">${html}</div>`;
    } catch (error) {
      console.error('Error rendering blogs:', error);
      this.renderError();
    }
  }
}

// Init
function initBlogLoader() {
  const loader = new BlogLoader('#blog-posts-container');
  loader.render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBlogLoader);
} else {
  initBlogLoader();
}
