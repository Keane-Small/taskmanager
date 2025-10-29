import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { FiCheckCircle, FiUsers, FiTrello, FiZap, FiShield, FiBarChart2, FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send to a backend
    console.log('Contact form submitted:', contactForm);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <FiCheckCircle className="logo-icon" />
            <span className="logo-text">TaskFlow</span>
          </div>
          <nav className="nav-links">
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
          </nav>
          <div className="auth-buttons">
            <button className="btn-login" onClick={() => navigate('/login')}>
              Log In
            </button>
            <button className="btn-signup" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Organize Your Work,
            <br />
            <span className="hero-highlight">Amplify Your Team</span>
          </h1>
          <p className="hero-subtitle">
            The modern task management platform that helps teams stay aligned, 
            productive, and focused on what matters most.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Start Free Trial
            </button>
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
          <p className="hero-note">
            ✓ No credit card required  •  ✓ Free 30-day trial  •  ✓ Cancel anytime
          </p>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-header">
              <div className="card-dot"></div>
              <div className="card-dot"></div>
              <div className="card-dot"></div>
            </div>
            <div className="card-content">
              <div className="task-item">
                <FiCheckCircle className="task-icon completed" />
                <span>Design homepage</span>
              </div>
              <div className="task-item">
                <FiCheckCircle className="task-icon completed" />
                <span>Review pull requests</span>
              </div>
              <div className="task-item">
                <div className="task-icon pending"></div>
                <span>Team standup</span>
              </div>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-header">
              <span className="card-title">Sprint Progress</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">12 of 18 tasks completed</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title">Everything you need to succeed</h2>
          <p className="section-subtitle">
            Powerful features designed for teams of all sizes
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">
              <FiTrello />
            </div>
            <h3>Flexible Boards</h3>
            <p>Organize tasks with customizable Kanban boards that adapt to your workflow.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">
              <FiUsers />
            </div>
            <h3>Team Collaboration</h3>
            <p>Work together seamlessly with real-time updates and team discussions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">
              <FiZap />
            </div>
            <h3>Lightning Fast</h3>
            <p>Built for speed with instant updates and smooth performance.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">
              <FiShield />
            </div>
            <h3>Secure & Private</h3>
            <p>Enterprise-grade security to keep your data safe and protected.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">
              <FiBarChart2 />
            </div>
            <h3>Insightful Reports</h3>
            <p>Track progress with detailed analytics and performance metrics.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">
              <FiCheckCircle />
            </div>
            <h3>Task Automation</h3>
            <p>Automate repetitive tasks and focus on what really matters.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">About TaskFlow</h2>
            <p className="about-description">
              TaskFlow was built with one goal in mind: to help teams work smarter, not harder. 
              We believe that task management shouldn't be complicated or overwhelming.
            </p>
            <p className="about-description">
              Our platform combines the best practices from agile methodologies with an intuitive 
              interface that anyone can master in minutes. Whether you're a startup or an enterprise, 
              TaskFlow scales with your needs.
            </p>
            <div className="about-stats">
              <div className="stat-item">
                <h3 className="stat-number">10K+</h3>
                <p className="stat-label">Active Teams</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">500K+</h3>
                <p className="stat-label">Tasks Completed</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">98%</h3>
                <p className="stat-label">Satisfaction Rate</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="about-visual">
              <div className="visual-element element-1"></div>
              <div className="visual-element element-2"></div>
              <div className="visual-element element-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="section-title">Get in Touch</h2>
            <p className="contact-description">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="contact-details">
              <div className="contact-detail-item">
                <FiMail className="contact-icon" />
                <div>
                  <h4>Email</h4>
                  <p>support@taskflow.com</p>
                </div>
              </div>
              <div className="contact-detail-item">
                <FiPhone className="contact-icon" />
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-detail-item">
                <FiMapPin className="contact-icon" />
                <div>
                  <h4>Office</h4>
                  <p>123 Business Ave, Suite 100<br />San Francisco, CA 94102</p>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleContactSubmit}>
              {formSubmitted && (
                <div className="success-message">
                  ✓ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  placeholder="John Doe"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Your Email</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  placeholder="john@example.com"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  placeholder="Tell us how we can help you..."
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-contact-submit">
                <FiSend />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to transform your workflow?</h2>
          <p className="cta-subtitle">
            Join thousands of teams already using TaskFlow to get more done.
          </p>
          <button className="btn-cta" onClick={() => navigate('/signup')}>
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <FiCheckCircle className="logo-icon" />
            <span className="logo-text">TaskFlow</span>
          </div>
          <p className="footer-text">
            © 2025 TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
