import React, { useEffect } from 'react';

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  // Split tags and features if they are strings (from database)
  const tags = typeof project.tags === 'string' 
    ? project.tags.split(',').map(t => t.trim()) 
    : (project.tags || []);

  const features = typeof project.features === 'string' 
    ? project.features.split('|').map(f => f.trim()) 
    : (project.features || []);

  // Standard images
  const imageUrl = project.image_url || `assets/${project.image_name}`;

  return (
    <div className="modal-overlay active" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div 
          className="modal-hero" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="modal-body">
          <div className="modal-tags">
            {tags.map((tag, i) => (
              <span key={i} className="modal-tag">{tag}</span>
            ))}
          </div>
          <h3 className="modal-title">{project.title}</h3>
          <p className="modal-description">{project.description}</p>
          
          {features.length > 0 && (
            <div className="modal-features">
              <h4>Key Features & Achievements</h4>
              <ul>
                {features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="modal-actions">
            {project.live_url && (
              <a href={project.live_url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                Visit Live Site <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                View Code Repository <i className="fa-brands fa-github"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
