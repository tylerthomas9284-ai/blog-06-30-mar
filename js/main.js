const includes = {
  header: `
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="index.html">Trendy Tales</a>
        <button class="menu-toggle" aria-label="Toggle menu">Menu</button>
        <nav class="site-nav">
          <a href="index.html">Home</a>
          <a href="blog.html">Blog</a>
          <a href="about.html">About Us</a>
          <a href="contact.html">Contact Us</a>
          <a href="faq.html">FAQ</a>
        </nav>
      </div>
    </header>
  `,
  footer: `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a class="brand footer-brand" href="index.html">Trendy Tales</a>
          <p>Smart, readable stories for modern readers in the United States.</p>
          <p><a href="mailto:info@trendytales.site">info@trendytales.site</a></p>
        </div>
        <div>
          <h4>Pages</h4>
          <a href="about.html">About Us</a>
          <a href="contact.html">Contact Us</a>
          <a href="faq.html">FAQ</a>
          <a href="blog.html">Blog</a>
        </div>
        <div>
          <h4>Categories</h4>
          <a href="news.html">News</a>
          <a href="personal-finance.html">Personal Finance</a>
          <a href="living-abroad.html">Living Abroad</a>
          <a href="travel.html">Travel</a>
          <a href="business.html">Business</a>
        </div>
        <div>
          <h4>Legal</h4>
          <a href="privacy.html">Privacy Policy</a>
          <a href="terms.html">Terms &amp; Conditions</a>
          <a href="disclaimer.html">Disclaimer</a>
          <a href="cookies.html">Cookie Policy</a>
        </div>
      </div>
    </footer>
  `
};

const categoryLinks = {
  "News": "news.html",
  "Personal Finance": "personal-finance.html",
  "Living Abroad": "living-abroad.html",
  "Travel": "travel.html",
  "Business": "business.html"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function setupIncludes() {
  $$("[data-include]").forEach((node) => {
    node.innerHTML = includes[node.dataset.include] || "";
  });
}

function setupMenu() {
  const toggle = $(".menu-toggle");
  const nav = $(".site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

function createCard(post) {
  return `
    <article class="card">
      <img src="${post.image}" alt="${post.title}" loading="lazy">
      <div class="card-body">
        <div class="post-meta"><span>${post.category}</span><span>${post.readTime}</span></div>
        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
      </div>
    </article>
  `;
}

function createFeature(post) {
  return `
    <article class="feature-card">
      <img src="${post.image}" alt="${post.title}" loading="lazy">
      <div class="feature-body">
        <p class="eyebrow">${post.category}</p>
        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
        <div class="post-meta"><span>${post.date}</span><span>${post.readTime}</span></div>
      </div>
    </article>
  `;
}

function createListItem(post) {
  return `
    <article class="post-item">
      <img src="${post.image}" alt="${post.title}" loading="lazy">
      <div class="post-item-body">
        <div class="post-meta"><span>${post.category}</span><span>${post.date}</span><span>${post.readTime}</span></div>
        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
      </div>
    </article>
  `;
}

function createCompactItem(post) {
  return `
    <article class="compact-post">
      <img src="${post.image}" alt="${post.title}" loading="lazy">
      <div>
        <div class="post-meta"><span>${post.date}</span><span>${post.readTime}</span></div>
        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
      </div>
    </article>
  `;
}

function renderHome() {
  const featured = window.blogPosts.filter((post) => post.featured).slice(0, 3);
  const latest = [...window.blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const heroPost = latest[0];
  const sidebarLead = latest[1];
  $("#hero-feature").innerHTML = `
    <p class="eyebrow">Editor pick</p>
    <img src="${sidebarLead.image}" alt="${sidebarLead.title}" loading="lazy" style="border-radius:18px;height:220px;object-fit:cover;margin-bottom:1rem;">
    <h3><a href="post.html?slug=${sidebarLead.slug}">${sidebarLead.title}</a></h3>
    <p>${sidebarLead.excerpt}</p>
    <div class="post-meta"><span>${sidebarLead.category}</span><span>${sidebarLead.readTime}</span></div>
  `;
  $("#featured-posts").innerHTML = featured.map(createFeature).join("");
  const sections = Object.entries(categoryLinks).map(([name, href]) => {
    const posts = latest.filter((post) => post.category === name).slice(0, 4);
    return `
      <section class="home-category-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">${name}</p>
            <h2>${name}</h2>
          </div>
          <a href="${href}" class="text-link">See all</a>
        </div>
        <div class="home-category-grid">
          ${posts.map(createCompactItem).join("")}
        </div>
      </section>
    `;
  }).join("");
  $("#home-category-sections").innerHTML = `
    <section class="home-category-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Latest posts</p>
          <h2>Latest from Trendy Tales</h2>
        </div>
        <a href="post.html?slug=${heroPost.slug}" class="text-link">Read lead story</a>
      </div>
      <div class="home-category-grid">
        ${latest.slice(0, 4).map(createCompactItem).join("")}
      </div>
    </section>
    ${sections}
  `;
}

function renderBlog() {
  const grid = $("#blog-grid");
  const filter = $("#category-filter");
  let query = new URLSearchParams(window.location.search).get("search") || "";
  const input = $('.search-form input[name="query"]');
  if (input) input.value = query;

  const update = () => {
    const category = filter.value;
    const filtered = window.blogPosts.filter((post) => {
      const matchesCategory = category === "all" || post.category === category;
      const haystack = `${post.title} ${post.excerpt} ${post.keywords}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    });
    grid.innerHTML = filtered.map(createCard).join("") || "<p>No posts matched your search.</p>";
  };

  filter.addEventListener("change", update);
  $$("[data-search-form]").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    query = new FormData(form).get("query").trim();
    update();
  }));
  update();
}

function renderCategory() {
  const pageCategory = document.body.dataset.category;
  $("#category-grid").innerHTML = window.blogPosts
    .filter((post) => post.category === pageCategory)
    .map(createCard)
    .join("");
}

function updateMeta(post) {
  document.title = post.metaTitle;
  document.querySelector('meta[name="description"]').setAttribute("content", post.metaDescription);
  document.querySelector('meta[name="keywords"]').setAttribute("content", post.keywords);
  $("#meta-og-title").setAttribute("content", post.metaTitle);
  $("#meta-og-description").setAttribute("content", post.metaDescription);
  $("#meta-og-image").setAttribute("content", post.image);
  $("#canonical-link").setAttribute("href", `https://trendytales.site/post.html?slug=${post.slug}`);
  let schema = document.getElementById("article-schema");
  if (!schema) {
    schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.id = "article-schema";
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Trendy Tales" },
    mainEntityOfPage: `https://trendytales.site/post.html?slug=${post.slug}`
  });
}

function renderComments(post) {
  const form = $("#comment-form");
  const list = $("#comment-list");
  const key = `trendytales-comments-${post.slug}`;
  const comments = JSON.parse(localStorage.getItem(key) || "[]");

  const paint = () => {
    list.innerHTML = comments.length
      ? comments.map((item) => `<div class="comment-item"><strong>${item.name}</strong><p>${item.comment}</p><span>${item.date}</span></div>`).join("")
      : "<p>No comments yet. Start the conversation.</p>";
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    comments.unshift({
      name: data.get("name").trim(),
      comment: data.get("comment").trim(),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    });
    localStorage.setItem(key, JSON.stringify(comments));
    form.reset();
    paint();
  });

  paint();
}

function renderPost() {
  const slug = new URLSearchParams(window.location.search).get("slug");
  const post = window.blogPosts.find((entry) => entry.slug === slug) || window.blogPosts[0];
  updateMeta(post);
  $("#post-shell").innerHTML = `
    <header class="article-header">
      <p class="eyebrow">${post.category}</p>
      <h1>${post.title}</h1>
      <p class="article-intro">${post.excerpt}</p>
      <div class="post-meta"><span>${post.author}</span><span>${post.date}</span><span>${post.readTime}</span></div>
      <img class="article-cover" src="${post.image}" alt="${post.title}">
      <div class="article-content">${post.content}</div>
    </header>
  `;
  const related = window.blogPosts.filter((item) => item.category === post.category && item.slug !== post.slug).slice(0, 3);
  $("#related-posts").innerHTML = `<h3>Related reads</h3>${related.map((item) => `<p><a href="post.html?slug=${item.slug}">${item.title}</a></p>`).join("")}<p><a class="text-link" href="${categoryLinks[post.category]}">More in ${post.category}</a></p>`;
  renderComments(post);
}

function setupForms() {
  $$("[data-newsletter-form]").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(form).get("email").trim();
    localStorage.setItem("trendytales-newsletter-email", email);
    form.reset();
    alert("Thanks for subscribing to Trendy Tales.");
  }));

  const contactForm = $("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(contactForm).entries());
      const messages = JSON.parse(localStorage.getItem("trendytales-contact-messages") || "[]");
      messages.unshift({ ...payload, date: new Date().toISOString() });
      localStorage.setItem("trendytales-contact-messages", JSON.stringify(messages));
      contactForm.reset();
      alert("Your message has been saved. You can connect this form to info@trendytales.site in production.");
    });
  }

  $$("[data-search-form]").forEach((form) => {
    if (document.body.dataset.page === "blog") return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = new FormData(form).get("query").trim();
      window.location.href = `blog.html?search=${encodeURIComponent(query)}`;
    });
  });
}

function init() {
  setupIncludes();
  setupMenu();
  setupForms();

  switch (document.body.dataset.page) {
    case "home":
      renderHome();
      break;
    case "blog":
      renderBlog();
      break;
    case "category":
      renderCategory();
      break;
    case "post":
      renderPost();
      break;
    default:
      break;
  }
}

document.addEventListener("DOMContentLoaded", init);
