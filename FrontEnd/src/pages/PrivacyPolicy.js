import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowUp, FiArrowLeft } from "react-icons/fi";
import "./LegalPages.css";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleGoBack = () => {
    // Go back to previous page, or home if no history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <button onClick={handleGoBack} className="back-link">← Back to Previous Page</button>
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: November 4, 2025</p>
        </header>

        <div className="legal-content">
          {/* Table of Contents */}
          <div className="table-of-contents">
            <h3>Table of Contents</h3>
            <ul className="toc-list">
              <li><a href="#introduction">1. Introduction</a></li>
              <li><a href="#information-responsibility">2. Information Responsibility</a></li>
              <li><a href="#information-collection">3. Information We Collect</a></li>
              <li><a href="#collection-methods">4. How We Collect Information</a></li>
              <li><a href="#lawful-basis">5. Lawful Basis for Processing</a></li>
              <li><a href="#information-usage">6. How We Use Your Information</a></li>
              <li><a href="#information-sharing">7. Information Sharing and Disclosure</a></li>
              <li><a href="#data-storage">8. Data Storage and Security</a></li>
              <li><a href="#your-rights">9. Your Rights Under POPIA</a></li>
              <li><a href="#cookies">10. Cookies and Tracking Technologies</a></li>
              <li><a href="#marketing">11. Marketing Communications</a></li>
              <li><a href="#children-privacy">12. Children's Privacy</a></li>
              <li><a href="#data-breach">13. Data Breach Notification</a></li>
              <li><a href="#third-party">14. Third-Party Integrations</a></li>
              <li><a href="#policy-updates">15. Updates to This Privacy Policy</a></li>
              <li><a href="#complaints">16. Complaints and Disputes</a></li>
              <li><a href="#contact">17. Contact Information</a></li>
            </ul>
          </div>

          <section className="legal-section" id="introduction">
            <h2>1. Introduction</h2>
            <p>
              TaskFlow (Pty) Ltd ("we", "our", or "us") is committed to protecting your privacy and personal information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) and other applicable South African privacy laws.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our task management service ("TaskFlow" or "the Service").
            </p>
          </section>

          <section className="legal-section" id="information-responsibility">
            <h2>2. Information Responsibility</h2>
            <p>
              TaskFlow (Pty) Ltd is the responsible party for the processing of your personal information under POPIA. Our details are:
            </p>
            <div className="contact-info">
              <p><strong>Company:</strong> TaskFlow (Pty) Ltd</p>
              <p><strong>Registration Number:</strong> 2025/123456/07</p>
              <p><strong>Information Officer:</strong> Privacy Officer</p>
              <p><strong>Email:</strong> privacy@taskflow.co.za</p>
              <p><strong>Postal Address:</strong></p>
              <p>TaskFlow (Pty) Ltd<br />
              PO Box 12345<br />
              Johannesburg, 2000<br />
              South Africa</p>
            </div>
          </section>

          <section className="legal-section" id="information-collection">
            <h2>3. Information We Collect</h2>
            
            <h3>3.1 Personal Information</h3>
            <p>We collect the following types of personal information:</p>
            <ul>
              <li><strong>Identity Information:</strong> Name, surname, email address, phone number</li>
              <li><strong>Account Information:</strong> Username, password (encrypted), profile picture</li>
              <li><strong>Professional Information:</strong> Job title, company name, department</li>
              <li><strong>Communication Data:</strong> Messages, comments, and collaboration content</li>
              <li><strong>Usage Data:</strong> Log data, IP address, browser type, device information</li>
              <li><strong>Location Data:</strong> General location based on IP address (if enabled)</li>
            </ul>

            <h3>3.2 Task and Project Data</h3>
            <ul>
              <li>Tasks, projects, and associated metadata</li>
              <li>Files and documents uploaded to the platform</li>
              <li>Time tracking and productivity data</li>
              <li>Team collaboration and communication records</li>
            </ul>

            <h3>3.3 Technical Information</h3>
            <ul>
              <li>Device and browser information</li>
              <li>Session data and cookies</li>
              <li>Performance and error logs</li>
              <li>Feature usage analytics</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. How We Collect Information</h2>
            <p>We collect information through:</p>
            <ul>
              <li><strong>Direct Provision:</strong> When you register, create content, or contact us</li>
              <li><strong>Automatic Collection:</strong> Through cookies, logs, and analytics tools</li>
              <li><strong>Third-Party Integration:</strong> When you connect external services (with your consent)</li>
              <li><strong>Team Members:</strong> When colleagues add you to projects or teams</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Lawful Basis for Processing</h2>
            <p>We process your personal information based on the following lawful grounds under POPIA:</p>
            <ul>
              <li><strong>Consent:</strong> For marketing communications and optional features</li>
              <li><strong>Contractual Necessity:</strong> To provide the TaskFlow service as agreed</li>
              <li><strong>Legitimate Interest:</strong> For service improvement, security, and support</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            
            <h3>6.1 Service Provision</h3>
            <ul>
              <li>Create and manage your account</li>
              <li>Provide task management and collaboration features</li>
              <li>Enable team communication and file sharing</li>
              <li>Process payments and billing</li>
            </ul>

            <h3>6.2 Service Improvement</h3>
            <ul>
              <li>Analyze usage patterns to improve functionality</li>
              <li>Develop new features and services</li>
              <li>Conduct research and analytics</li>
              <li>Personalize your user experience</li>
            </ul>

            <h3>6.3 Communication</h3>
            <ul>
              <li>Send service-related notifications</li>
              <li>Provide customer support</li>
              <li>Send marketing communications (with consent)</li>
              <li>Notify you of important updates or changes</li>
            </ul>

            <h3>6.4 Security and Legal Compliance</h3>
            <ul>
              <li>Detect and prevent fraud or security breaches</li>
              <li>Enforce our Terms of Service</li>
              <li>Comply with legal obligations</li>
              <li>Protect the rights and safety of users</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Information Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>

            <h3>7.1 With Your Consent</h3>
            <p>We will share your information with third parties when you explicitly consent to such sharing.</p>

            <h3>7.2 Service Providers</h3>
            <p>We may share information with trusted service providers who assist us in operating our service, including:</p>
            <ul>
              <li>Cloud hosting and infrastructure providers</li>
              <li>Payment processing companies</li>
              <li>Email and communication service providers</li>
              <li>Analytics and performance monitoring tools</li>
            </ul>

            <h3>7.3 Team Members</h3>
            <p>Information related to shared projects and tasks is visible to relevant team members as necessary for collaboration.</p>

            <h3>7.4 Legal Requirements</h3>
            <p>We may disclose information when required by law, legal process, or to protect our rights and safety.</p>

            <h3>7.5 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</p>
          </section>

          <section className="legal-section">
            <h2>8. Data Storage and Security</h2>
            
            <h3>8.1 Data Location</h3>
            <p>Your data is primarily stored on secure servers located in South Africa. Some data may be processed by service providers located outside South Africa, in which case we ensure adequate protection through:</p>
            <ul>
              <li>Adequacy decisions by the Information Regulator</li>
              <li>Standard contractual clauses</li>
              <li>Binding corporate rules</li>
              <li>Your explicit consent</li>
            </ul>

            <h3>8.2 Security Measures</h3>
            <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
              <li>Incident response and breach notification procedures</li>
            </ul>

            <h3>8.3 Data Retention</h3>
            <p>We retain your personal information for as long as necessary to:</p>
            <ul>
              <li>Provide the service to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p>Account data is typically retained for 2 years after account closure, unless you request earlier deletion.</p>
          </section>

          <section className="legal-section" id="your-rights">
            <h2>9. Your Rights Under POPIA</h2>
            <p>You have the following rights regarding your personal information:</p>

            <h3>9.1 Right of Access</h3>
            <p>You can request confirmation of whether we process your personal information and access to that information.</p>

            <h3>9.2 Right to Correction</h3>
            <p>You can request correction of inaccurate or incomplete personal information.</p>

            <h3>9.3 Right to Deletion</h3>
            <p>You can request deletion of your personal information in certain circumstances.</p>

            <h3>9.4 Right to Object</h3>
            <p>You can object to the processing of your personal information for direct marketing or other purposes.</p>

            <h3>9.5 Right to Data Portability</h3>
            <p>You can request your personal information in a structured, commonly used format.</p>

            <h3>9.6 Right to Restrict Processing</h3>
            <p>You can request restriction of processing in certain circumstances.</p>

            <h3>9.7 Right to Withdraw Consent</h3>
            <p>Where processing is based on consent, you can withdraw that consent at any time.</p>

            <p><strong>To exercise these rights, contact us at privacy@taskflow.co.za</strong></p>
          </section>

          <section className="legal-section">
            <h2>10. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Authenticate and secure your account</li>
              <li>Analyze usage patterns and improve our service</li>
              <li>Provide personalized content and features</li>
            </ul>
            <p>You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect service functionality.</p>
          </section>

          <section className="legal-section">
            <h2>11. Marketing Communications</h2>
            <p>We may send you marketing communications about our services if:</p>
            <ul>
              <li>You have consented to receive such communications</li>
              <li>You are an existing customer and the communications relate to similar services</li>
            </ul>
            <p>You can unsubscribe from marketing communications at any time by:</p>
            <ul>
              <li>Clicking the unsubscribe link in emails</li>
              <li>Updating your account preferences</li>
              <li>Contacting us directly</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>12. Children's Privacy</h2>
            <p>TaskFlow is not intended for use by children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will delete it immediately.</p>
            <p>Users aged 13-17 must have parental consent to use our service.</p>
          </section>

          <section className="legal-section">
            <h2>13. Data Breach Notification</h2>
            <p>In the event of a data breach that poses a risk to your rights and freedoms, we will:</p>
            <ul>
              <li>Notify the Information Regulator within 72 hours</li>
              <li>Inform affected users without undue delay</li>
              <li>Provide details about the nature of the breach</li>
              <li>Explain the likely consequences and measures taken</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>14. Third-Party Integrations</h2>
            <p>TaskFlow may integrate with third-party services (such as Google Drive, Microsoft Office, or Slack). When you choose to use these integrations:</p>
            <ul>
              <li>You will be asked for explicit consent</li>
              <li>The third party's privacy policy will also apply</li>
              <li>You can disconnect integrations at any time</li>
              <li>We will only access information necessary for the integration</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>15. Updates to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. When we do:</p>
            <ul>
              <li>We will post the updated version on our website</li>
              <li>We will notify you of significant changes via email or in-app notification</li>
              <li>The updated policy will include the effective date</li>
              <li>Your continued use constitutes acceptance of the updated policy</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>16. Complaints and Disputes</h2>
            <p>If you have concerns about our privacy practices:</p>
            <ol>
              <li>Contact our Privacy Officer at privacy@taskflow.co.za</li>
              <li>We will investigate and respond within 30 days</li>
              <li>If unsatisfied, you may lodge a complaint with the Information Regulator of South Africa</li>
            </ol>
            <div className="contact-info">
              <p><strong>Information Regulator South Africa:</strong></p>
              <p>Website: www.inforegulator.org.za<br />
              Email: complaints.IR@justice.gov.za<br />
              Phone: +27 (0)12 406 4818</p>
            </div>
          </section>

          <section className="legal-section" id="contact">
            <h2>17. Contact Information</h2>
            <p>For any privacy-related questions or to exercise your rights, contact us:</p>
            <div className="contact-info">
              <p><strong>Privacy Officer</strong><br />
              TaskFlow (Pty) Ltd<br />
              Email: privacy@taskflow.co.za<br />
              Phone: +27 (0)11 123 4567<br />
              Postal Address:<br />
              PO Box 12345<br />
              Johannesburg, 2000<br />
              South Africa</p>
            </div>
          </section>
        </div>

        <footer className="legal-footer">
          <p>© 2025 TaskFlow (Pty) Ltd. All rights reserved.</p>
          <Link to="/terms-of-service">Terms of Service</Link>
        </footer>
      </div>

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <button 
          onClick={handleGoBack} 
          className="floating-btn back-btn"
          title="Go Back to Previous Page"
        >
          <FiArrowLeft />
        </button>
        {showBackToTop && (
          <button 
            onClick={scrollToTop} 
            className="floating-btn top-btn"
            title="Back to Top"
          >
            <FiArrowUp />
          </button>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;