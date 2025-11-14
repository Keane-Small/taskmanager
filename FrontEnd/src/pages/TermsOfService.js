import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowUp, FiArrowLeft } from "react-icons/fi";
import "./LegalPages.css";

const TermsOfService = () => {
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
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: November 4, 2025</p>
        </header>

        <div className="legal-content">
          {/* Table of Contents */}
          <div className="table-of-contents">
            <h3>Table of Contents</h3>
            <ul className="toc-list">
              <li><a href="#acceptance">1. Acceptance of Terms</a></li>
              <li><a href="#description">2. Description of Service</a></li>
              <li><a href="#user-accounts">3. User Accounts and Registration</a></li>
              <li><a href="#consumer-rights">4. Consumer Rights</a></li>
              <li><a href="#acceptable-use">5. Acceptable Use Policy</a></li>
              <li><a href="#data-protection">6. Data Protection and Privacy</a></li>
              <li><a href="#intellectual-property">7. Intellectual Property Rights</a></li>
              <li><a href="#payment-terms">8. Payment Terms and Billing</a></li>
              <li><a href="#service-availability">9. Service Availability and Modifications</a></li>
              <li><a href="#limitation-liability">10. Limitation of Liability</a></li>
              <li><a href="#termination">11. Termination</a></li>
              <li><a href="#governing-law">12. Governing Law and Dispute Resolution</a></li>
              <li><a href="#contact-info">13. Contact Information</a></li>
              <li><a href="#severability">14. Severability</a></li>
              <li><a href="#entire-agreement">15. Entire Agreement</a></li>
            </ul>
          </div>

          <section className="legal-section" id="acceptance">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using TaskFlow ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service are governed by South African law, including but not limited to the Consumer Protection Act 68 of 2008, the Electronic Communications and Transactions Act 25 of 2002, and the Protection of Personal Information Act 4 of 2013.
            </p>
          </section>

          <section className="legal-section" id="description">
            <h2>2. Description of Service</h2>
            <p>
              TaskFlow is a web-based task management application that allows users to organize, track, and collaborate on projects and tasks. The Service includes features such as:
            </p>
            <ul>
              <li>Task creation, assignment, and tracking</li>
              <li>Project management and collaboration tools</li>
              <li>Team communication features</li>
              <li>File sharing and document management</li>
              <li>Progress reporting and analytics</li>
            </ul>
          </section>

          <section className="legal-section" id="user-accounts">
            <h2>3. User Accounts and Registration</h2>
            <p>
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <p>
              You must be at least 18 years old to create an account. If you are under 18, you may only use the Service with parental consent.
            </p>
          </section>

          <section className="legal-section" id="consumer-rights">
            <h2>4. Consumer Rights (Consumer Protection Act)</h2>
            <p>
              In accordance with the Consumer Protection Act 68 of 2008, you have the right to:
            </p>
            <ul>
              <li>Cancel this agreement within 7 days of subscription without reason or penalty</li>
              <li>Receive services that are of good quality and free from defects</li>
              <li>Be treated fairly and without discrimination</li>
              <li>Receive clear, comprehensive information about the Service</li>
            </ul>
            <p>
              To exercise your right of cancellation, contact us at legal@taskflow.co.za within 7 days of your subscription.
            </p>
          </section>

          <section className="legal-section" id="acceptable-use">
            <h2>5. Acceptable Use Policy</h2>
            <p>
              You agree not to use the Service to:
            </p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to other accounts or systems</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section className="legal-section" id="data-protection">
            <h2>6. Data Protection and Privacy</h2>
            <p>
              We are committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA). Our collection, use, and disclosure of personal information is governed by our Privacy Policy, which forms part of these Terms.
            </p>
            <p>
              By using the Service, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          <section className="legal-section" id="intellectual-property">
            <h2>7. Intellectual Property Rights</h2>
            <p>
              The Service and its original content, features, and functionality are owned by TaskFlow and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              You retain ownership of any content you create using the Service. By using the Service, you grant us a limited license to use, store, and display your content solely for the purpose of providing the Service.
            </p>
          </section>

          <section className="legal-section" id="payment-terms">
            <h2>8. Payment Terms and Billing</h2>
            <p>
              For paid subscriptions:
            </p>
            <ul>
              <li>Fees are charged in South African Rand (ZAR)</li>
              <li>Payment is due at the beginning of each billing cycle</li>
              <li>You may cancel your subscription at any time</li>
              <li>Refunds are provided in accordance with the Consumer Protection Act</li>
              <li>All prices include applicable VAT where required</li>
            </ul>
          </section>

          <section className="legal-section" id="service-availability">
            <h2>9. Service Availability and Modifications</h2>
            <p>
              We strive to maintain 99.9% uptime but cannot guarantee uninterrupted access to the Service. We reserve the right to:
            </p>
            <ul>
              <li>Modify or discontinue the Service with reasonable notice</li>
              <li>Perform maintenance that may temporarily affect service availability</li>
              <li>Update these Terms with 30 days' notice to users</li>
            </ul>
          </section>

          <section className="legal-section" id="limitation-liability">
            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by South African law, TaskFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses.
            </p>
            <p>
              Our total liability for any claim arising from these Terms shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.
            </p>
          </section>

          <section className="legal-section" id="termination">
            <h2>11. Termination</h2>
            <p>
              Either party may terminate this agreement at any time. Upon termination:
            </p>
            <ul>
              <li>Your access to the Service will cease immediately</li>
              <li>You may download your data for 30 days after termination</li>
              <li>We may delete your account and data after this period</li>
              <li>Any outstanding payments remain due</li>
            </ul>
          </section>

          <section className="legal-section" id="governing-law">
            <h2>12. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by South African law. Any disputes will be resolved through:
            </p>
            <ol>
              <li>Good faith negotiations between the parties</li>
              <li>Mediation if negotiations fail</li>
              <li>The South African courts if other methods fail</li>
            </ol>
            <p>
              The jurisdiction for any legal proceedings shall be the High Court of South Africa, Gauteng Division, Pretoria.
            </p>
          </section>

          <section className="legal-section" id="contact-info">
            <h2>13. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> legal@taskflow.co.za</p>
              <p><strong>Postal Address:</strong></p>
              <p>TaskFlow (Pty) Ltd<br />
              PO Box 12345<br />
              Johannesburg, 2000<br />
              South Africa</p>
            </div>
          </section>

          <section className="legal-section" id="severability">
            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the Terms will otherwise remain in full force and effect.
            </p>
          </section>

          <section className="legal-section" id="entire-agreement">
            <h2>15. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and TaskFlow regarding the use of the Service and supersede all prior agreements and understandings.
            </p>
          </section>
        </div>

        <footer className="legal-footer">
          <p>© 2025 TaskFlow (Pty) Ltd. All rights reserved.</p>
          <Link to="/privacy-policy">Privacy Policy</Link>
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

export default TermsOfService;