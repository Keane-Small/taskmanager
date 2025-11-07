import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import {
  FiCheckCircle,
  FiUsers,
  FiTrello,
  FiZap,
  FiShield,
  FiBarChart2,
} from "react-icons/fi";
import AuthModal from "../components/AuthModal";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className={`landing-page ${showAuthModal ? 'modal-open' : ''}`}>
        {/* Navigation Header */}
        <header className="landing-header">
          <div className="header-content">
            <div className="logo">
              <FiCheckCircle className="logo-icon" />
              <span className="logo-text">TaskFlow</span>
            </div>
            <nav className="nav-links">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("features");
                }}
              >
                Features
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("about");
                }}
              >
                About
              </a>
            </nav>
            <div className="auth-buttons">
              <button
                className="btn-login"
                onClick={() => openAuthModal("login")}
              >
                Log In
              </button>
              <button
                className="btn-signup"
                onClick={() => openAuthModal("signup")}
              >
               Sign Up
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
            <button
              className="btn-primary"
              onClick={() => openAuthModal("signup")}
            >
             Sign Up Now
            </button>
            <button
              className="btn-secondary"
              onClick={() => openAuthModal("login")}
            >
              Sign Login
            </button>
          </div>
          <p className="hero-note">
            ✓ No credit card required • ✓ Free to use 
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
            <p>
              Organize tasks with customizable Kanban boards that adapt to your
              workflow.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">
              <FiUsers />
            </div>
            <h3>Team Collaboration</h3>
            <p>
              Work together seamlessly with real-time updates and team
              discussions.
            </p>
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
            <p>
              Enterprise-grade security to keep your data safe and protected.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">
              <FiBarChart2 />
            </div>
            <h3>Insightful Reports</h3>
            <p>
              Track progress with detailed analytics and performance metrics.
            </p>
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
              TaskFlow was built with one goal in mind: to help teams work
              smarter, not harder. We believe that task management shouldn't be
              complicated or overwhelming.
            </p>
            <p className="about-description">
              Our platform combines the best practices from agile methodologies
              with an intuitive interface that anyone can master in minutes.
              Whether you're a startup or an enterprise, TaskFlow scales with
              your needs.
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to transform your workflow?</h2>
          <p className="cta-subtitle">
            Join thousands of teams already using TaskFlow to get more done.
          </p>
          <button className="btn-cta" onClick={() => openAuthModal("signup")}>
            Sign Up Now
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
          <div className="footer-links">
            <Link to="/terms-of-service">Terms of Service</Link>
            <span className="footer-separator">•</span>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
          <p className="footer-text">© 2025 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
    
    {/* AuthModal rendered outside the blurred content */}
    <AuthModal
      isOpen={showAuthModal}
      onClose={closeAuthModal}
      initialMode={authMode}
    />
  </>
  );
};

export default LandingPage;
