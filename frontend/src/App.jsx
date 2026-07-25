import React, { useState, useEffect, useRef } from 'react';
import ParticlesBg from './components/ParticlesBg';


// API base URL configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Fallback data if backend is offline/database is empty
const MOCK_SKILLS = [
  { id: 1, name: 'React', category: 'frontend', icon_class: 'fa-brands fa-react', proficiency: 90 },
  { id: 2, name: 'JavaScript', category: 'frontend', icon_class: 'fa-brands fa-js-square', proficiency: 95 },
  { id: 3, name: 'HTML5', category: 'frontend', icon_class: 'fa-brands fa-html5', proficiency: 95 },
  { id: 4, name: 'CSS3', category: 'frontend', icon_class: 'fa-brands fa-css3-alt', proficiency: 90 },
  { id: 5, name: 'Python', category: 'backend', icon_class: 'fa-brands fa-python', proficiency: 90 },
  { id: 6, name: 'Node.js', category: 'backend', icon_class: 'fa-brands fa-node-js', proficiency: 80 },
  { id: 7, name: 'MySQL', category: 'backend', icon_class: 'fa-solid fa-database', proficiency: 85 },
  { id: 8, name: 'MongoDB', category: 'backend', icon_class: 'fa-solid fa-leaf', proficiency: 80 },
  { id: 9, name: 'Django', category: 'backend', icon_class: 'fa-solid fa-server', proficiency: 80 }
];

const MOCK_PROJECTS = [
  {
    id: 1,
    title: 'DevConnect Platform',
    category: 'fullstack',
    tags: 'React, NodeJS, Express, MongoDB, Socket.io',
    image_name: 'devconnect.png',
    description: 'DevConnect is an end-to-end community and real-time co-working hub targeting distributed engineering departments. The software allows developers to boot instant sandboxed compilers directly in their browsers, synchronize documents, and jump into visual canvas workflows or live audio channels directly.',
    features: 'Secure sandboxed JavaScript and Python web execution shell|Real-time collaborative text editor using operational transformation|Audio/Video calling pipelines structured via WebRTC mesh networks|Comprehensive user profiles with automated repository integration',
    live_url: 'https://github.com',
    github_url: 'https://github.com'
  },
  {
    id: 2,
    title: 'PayWise Subscription Engine',
    category: 'fullstack',
    tags: 'NextJS, FastAPI, PostgreSQL, Stripe, Redis',
    image_name: 'paywise.png',
    description: 'PayWise is a business-to-business subscription lifecycle dashboard that helps SaaS providers capture client accounts, manage invoices, configure tier permissions, and chart key growth statistics (MRR, churn, LTV) in real-time. Integrated with advanced webhook logic and stripe components.',
    features: 'Modular payment gateways handling multi-currency subscriptions and invoicing|Extensive analytical chart dashboards populated by background queue aggregate jobs|Robust secure webhooks engine processing Stripe alerts with linear-backoff retry policies|Fine-grained tenant isolation policies implemented at the database tier',
    live_url: 'https://github.com',
    github_url: 'https://github.com'
  },
  {
    id: 3,
    title: 'CryptoSphere Dashboard',
    category: 'frontend',
    tags: 'React, TailwindCSS, Chart.js, Framer Motion',
    image_name: 'cryptosphere.png',
    description: 'CryptoSphere aggregates dozens of currency tokens, tracking live candlesticks, depth graphs, and trading values. By streaming WebSocket sockets from exchange API nodes, users can set up visual watchlists, configure price alerts, and follow trading patterns without delay.',
    features: 'High-density charts render millions of price ticks cleanly with canvas-backed drawing mechanisms|Real-time network connection monitoring showing frame drop latency metrics|Client-side state filters caching complex sorting parameters in indexedDB|Responsive layout scaling down to mobile viewports with fluid layout adjustments',
    live_url: 'https://github.com',
    github_url: 'https://github.com'
  },
  {
    id: 4,
    title: 'TaskOps Worker System',
    category: 'backend',
    tags: 'Go, Redis, Docker, Prometheus',
    image_name: 'taskops.png',
    description: 'TaskOps is a highly parallel, distributed worker execution core coded in Go. It parses complex dependency structures, routes concurrent job arrays to available runner servers, and emits real-time runtime progress metrics to a centralized monitoring system.',
    features: 'Handles over 50,000 tasks per second with low memory overhead|Structured with custom directed-acyclic-graph (DAG) execution algorithms to chain nested task stages|Automatic failure recovery containing configurable exponential backoffs|Emits Prometheus-ready performance instrumentation endpoints',
    live_url: 'https://github.com',
    github_url: 'https://github.com'
  },
  {
    id: 5,
    title: 'AuraCommerce Headless Store',
    category: 'fullstack',
    tags: 'NextJS, GraphQL, Shopify Storefront, Vercel',
    image_name: 'auracommerce.png',
    description: 'AuraCommerce represents a state-of-the-art headless storefront solution. Utilizing Next.js Incremental Static Regeneration (ISR) and static rendering, product variations load in less than 300 milliseconds. Features custom cart widgets, checkout pathways, and animations.',
    features: 'Dynamic static generation (ISR) refreshing product listing inventories every 60 seconds|Custom Shopify Storefront GraphQL query structure minimizing network payload size by 65%|State management optimized with lightweight client stores to reduce layout shifts|SEO optimization scoring 100 on Google Lighthouse',
    live_url: 'https://github.com',
    github_url: 'https://github.com'
  },
  {
    id: 6,
    title: 'LogiTrack Telemetry API',
    category: 'backend',
    tags: 'FastAPI, PostGIS, Kafka, Docker',
    image_name: 'logitrack.png',
    description: 'LogiTrack is a telemetry pipeline ingestion endpoint optimized for high-volume geographical updates. Emitted by transit vehicle arrays, it maps coordinates into polygons, fires alerts when routing deviations happen, and stores spatial paths into coordinates database.',
    features: 'High-velocity endpoint designed with asyncio parsing 2,000 requests/second per container|Integrates spatial querying pipelines to perform low-latency geo-fencing polygon intersection checks|Streams incoming telemetry updates into Apache Kafka message clusters for pipeline consumers|Detailed integration test suite validating geospatial schemas against mocked maps',
    live_url: 'https://github.com',
    github_url: 'https://github.com'
  }
];

function App() {
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  // Navigation & layout states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Project & Skill states (populated from API with fallback)
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Typewriter effect variables
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Contact Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Typewriter references
  const roles = [
    'Full Stack Developer',
    'Python & Flask Dev',
    'React Developer',
    'Aspiring Software Engineer'
  ];

  // Set html theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch projects and skills
  useEffect(() => {
    const fetchData = async () => {
      let loadedSkills = false;
      let loadedProjects = false;
      
      try {
        const skillsResponse = await fetch(`${API_BASE}/skills`);
        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          if (skillsData.length > 0) {
            setSkills(skillsData);
            loadedSkills = true;
          }
        }
      } catch (err) {
        console.warn('API /skills call failed, using offline fallback. details:', err.message);
      }

      try {
        const projectsResponse = await fetch(`${API_BASE}/projects`);
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          if (projectsData.length > 0) {
            setProjects(projectsData);
            loadedProjects = true;
          }
        }
      } catch (err) {
        console.warn('API /projects call failed, using offline fallback. details:', err.message);
      }

      if (!loadedSkills) setSkills(MOCK_SKILLS);
      if (!loadedProjects) setProjects(MOCK_PROJECTS);
    };

    fetchData();
  }, []);

  // Typewriter Effect logic
  useEffect(() => {
    let timer;
    const currentRole = roles[typewriterIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypewriterText(currentRole.substring(0, typewriterText.length - 1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypewriterText(currentRole.substring(0, typewriterText.length + 1));
      }, 100);
    }

    if (!isDeleting && typewriterText === currentRole) {
      timer = setTimeout(() => setIsDeleting(true), 2000); // pause at complete word
    } else if (isDeleting && typewriterText === '') {
      setIsDeleting(false);
      setTypewriterIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, typewriterIndex]);

  // Scrollspy & Scroll indicator logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      
      // Header shadow & top button state
      setIsScrolled(scrollY > 50);
      setShowScrollTop(scrollY > 500);

      // Section highlighters
      const sections = document.querySelectorAll('section');
      let currentActive = 'hero';
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120; // account for headers
        if (scrollY >= sectionTop) {
          currentActive = section.getAttribute('id');
        }
      });
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toast notifier triggers
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Form submission handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formSubject.trim() || !formMessage.trim()) {
      triggerToast('Please fill in all details before submitting.', 'error');
      return;
    }

    setFormSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          subject: formSubject,
          message: formMessage
        })
      });

      if (response.ok) {
        triggerToast(`Thank you, ${formName}! Your message has been sent successfully.`);
        // Reset inputs
        setFormName('');
        setFormEmail('');
        setFormSubject('');
        setFormMessage('');
      } else {
        throw new Error('API server returned an error state.');
      }
    } catch (err) {
      console.warn('Form post to API failed, falling back to local simulation. details:', err.message);
      // Fallback local simulation
      setTimeout(() => {
        triggerToast(`Thank you, ${formName}! Message sent (Local simulation Mode).`);
        setFormName('');
        setFormEmail('');
        setFormSubject('');
        setFormMessage('');
      }, 1500);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle dark/light theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Filter project grid list
  const filteredProjects = projects.filter((project) => {
    if (filteredCategory === 'all') return true;
    return project.category === filteredCategory;
  });

  return (
    <>
      {/* Background Particle layer */}
      <ParticlesBg />

      {/* Nav Header */}
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="container nav-container">
          <a href="#hero" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <span className="gradient-text">AI </span><span>full stack</span>
          </a>
          
          <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            {['hero', 'about', 'services', 'experience', 'contact'].map((sect) => (
              <a
                key={sect}
                href={`#${sect}`}
                className={`nav-link ${activeSection === sect ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {sect.charAt(0).toUpperCase() + sect.slice(1)}
              </a>
            ))}
          </nav>
          
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme mode">
              <i className="fa-solid fa-sun"></i>
              <i className="fa-solid fa-moon"></i>
            </button>
            <a href="#contact" className="btn btn-primary d-none-mobile">Let's Talk</a>
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation drawer"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero section">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="hero-greeting">Hello everyone, I'm</p>
            <h1 className="hero-name">Sai Pravardhan Reddy Estati</h1>
            <h2 className="hero-title">
              <span>I'm a </span>
              <span className="gradient-text">{typewriterText}</span>
              <span className="typewriter-cursor"></span>
            </h2>
            <p className="hero-description">
              An enthusiastic full stack developer focused on building interactive user interfaces with React and robust backend applications with Python/Django and Node.js.
            </p>
            <div className="hero-ctas">
              <a href="#contact" className="btn btn-primary">Let's Talk <i className="fa-solid fa-arrow-right"></i></a>
              <a href="#about" className="btn btn-secondary">About Me</a>
            </div>
            <div className="hero-socials">
              <span>Find me on</span>
              <a href="https://github.com/mrpanda0518" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="GitHub">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/sai-pravardhan-reddy-estati-8abb6b303?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="https://www.instagram.com/_sai_pravardhan_18?igsh=MXFocm9sdjZ6OHdmMw==" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="visual-sphere"></div>
            <div className="visual-card visual-card-1">
              <i className="fa-solid fa-code"></i>
              <div className="visual-card-text">
                <h4>Backend Dev</h4>
                <p>Node / Python / Go</p>
              </div>
            </div>
            <div className="visual-card visual-card-2">
              <i className="fa-solid fa-layer-group"></i>
              <div className="visual-card-text">
                <h4>Frontend Design</h4>
                <p>React / Next.js</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Skills Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-title">
            <span className="section-subtitle">About My Work</span>
            <h2>Professional Journey & Skills</h2>
          </div>
          
          <div className="about-grid">
            <div className="about-text">
              <h3>Building robust web applications from database schemas to interactive interfaces.</h3>
              <p>
                I am an aspiring full-stack software engineer eager to build modern web systems. I thrive at the intersection of logical backend infrastructure and fluid frontend design.
              </p>
              <p>
                My approach is centered on writing clean, self-documenting code, ensuring fast load times, and integrating automation into every step of the development cycle. I enjoy optimizing databases, building clean REST/GraphQL APIs, and composing responsive user experiences.
              </p>
              
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-number">Fresher</div>
                  <div className="stat-label">Status</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">3</div>
                  <div className="stat-label">Projects Completed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Commitment</div>
                </div>
              </div>
            </div>
            
            <div className="skills-container">
              {['frontend', 'backend'].map((cat) => (
                <div className="skills-card" key={cat}>
                  <h3>
                    <i className={
                      cat === 'frontend' ? 'fa-solid fa-laptop-code' : 'fa-solid fa-server'
                    }></i>{' '}
                    {cat.charAt(0).toUpperCase() + cat.slice(1)} Engineering
                  </h3>
                  <div className="skills-list">
                    {skills
                      .filter((s) => s.category === cat)
                      .map((skill) => (
                        <span className="skill-badge" key={skill.id}>
                          <i className={skill.icon_class}></i> {skill.name}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="container">
          <div className="section-title">
            <span className="section-subtitle">Core Capabilities</span>
            <h2>My Areas of Expertise</h2>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-desktop"></i>
              </div>
              <h3>Frontend Architecture</h3>
              <p>
                Building responsive, accessible, and interactive user interfaces using React.js. Focused on modular component layouts, fast load speeds, and fluid transitions.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-server"></i>
              </div>
              <h3>Backend API Design</h3>
              <p>
                Developing backend business logic using Python/Django and Node.js. Exposing RESTful API endpoints, routing server layers, and managing session integrations.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-database"></i>
              </div>
              <h3>Database Engineering</h3>
              <p>
                Designing relational schemas in MySQL and unstructured collections in MongoDB. Writing clean data queries, mapping relationships, and indexing keys for optimal speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="section">
        <div className="container">
          <div className="section-title">
            <span className="section-subtitle">My Experience</span>
            <h2>Career Timeline</h2>
          </div>
          
          <div className="timeline-container">
            <div className="timeline-item left">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="timeline-date">2023 - 2027</span>
                <h3>B.Tech in Computer Science & Engineering</h3>
                <div className="timeline-subtitle">Ramireddy Subbarami Reddy Engineering College</div>
                <ul className="timeline-details">
                  <li>Currently in the final year of study, maintaining an excellent academic standing (Graduating in 2027).</li>
                  <li>Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Web Technologies.</li>
                  <li>Active lead contributor to the college software development club and local coding hackathons.</li>
                </ul>
              </div>
            </div>
            
            <div className="timeline-item right">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="timeline-date">2025 - Present</span>
                <h3>Full Stack Web Developer Intern</h3>
                <div className="timeline-subtitle">Thiranex</div>
                <ul className="timeline-details">
                  <li>Building responsive user components in React and styling systems with vanilla CSS.</li>
                  <li>Assisting in designing clean backend API endpoints in Python & Flask integrated with MySQL.</li>
                  <li>Participating in sprint plannings and implementing features under guidance from senior mentors.</li>
                </ul>
              </div>
            </div>
            
            <div className="timeline-item left">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="timeline-date">2024 - 2025</span>
                <h3>Self-Led Learning & Web Projects</h3>
                <div className="timeline-subtitle">Personal Projects Showcase</div>
                <ul className="timeline-details">
                  <li>Completed training modules on advanced JavaScript, Python coding guidelines, and database querying.</li>
                  <li>Successfully created, local-tested, and deployed 3 full-stack applications in Git environments.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <div className="section-title">
            <span className="section-subtitle">Reach Out</span>
            <h2>Get In Touch</h2>
          </div>
          
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-info-title">
                <h3>Let's talk about your next project.</h3>
                <p>Have an open job role, contract proposal, or general question? Drop me a line and let's start the dialogue.</p>
              </div>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="contact-text">
                    <h4>Email</h4>
                    <p><a href="mailto:saipravardhan99@gmail.com">saipravardhan99@gmail.com</a></p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="contact-text">
                    <h4>Location</h4>
                    <p>Gogula Palli, Allur Mandal, Gogulapalle, Andhra Pradesh 524315</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-map-mock">
                <div className="map-gradient"></div>
                <i className="fa-solid fa-location-pin map-marker"></i>
                <div className="map-location-tag">Sai's Coordinates</div>
              </div>
            </div>
            
            <div className="contact-form-wrapper">
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="form-name" className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    id="form-name" 
                    name="name"
                    autoComplete="name"
                    className="form-input" 
                    required 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="form-email" className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    id="form-email" 
                    name="email"
                    autoComplete="email"
                    className="form-input" 
                    required 
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="form-subject" className="form-label">Subject</label>
                  <input 
                    type="text" 
                    id="form-subject" 
                    name="subject"
                    autoComplete="off"
                    className="form-input" 
                    required 
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="form-message" className="form-label">Your Message</label>
                  <textarea 
                    id="form-message" 
                    name="message"
                    autoComplete="off"
                    className="form-input" 
                    required 
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                  ></textarea>
                </div>
                
                <button className="btn btn-primary" type="submit" disabled={formSubmitting}>
                  {formSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                    </>
                  ) : (
                    <>
                      Send Message <i className="fa-solid fa-paper-plane"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container footer-content">
          <div className="footer-logo">
            <span className="gradient-text">AI </span><span>full stack</span>
          </div>
          
          <div className="footer-nav">
            {['hero', 'about', 'services', 'experience', 'contact'].map((sect) => (
              <a key={sect} href={`#${sect}`} className="footer-nav-link">
                {sect.charAt(0).toUpperCase() + sect.slice(1)}
              </a>
            ))}
          </div>
          
          <div className="footer-socials">
            <a href="https://github.com/mrpanda0518" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="GitHub">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/sai-pravardhan-reddy-estati-8abb6b303?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="https://www.instagram.com/_sai_pravardhan_18?igsh=MXFocm9sdjZ6OHdmMw==" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
          
          <p className="footer-copyright">
            &copy; <span>{new Date().getFullYear()}</span> Sai Pravardhan Reddy Estati. All rights reserved. Created with React & Flask.
          </p>
        </div>
      </footer>



      {/* Scroll to top button */}
      <div 
        className={`scroll-top ${showScrollTop ? 'show' : ''}`} 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top of the page"
      >
        <i className="fa-solid fa-arrow-up"></i>
      </div>

      {/* Custom Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} show`}>
            <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
