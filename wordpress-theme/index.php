<?php
/**
 * Main template – Single-page theme.
 *
 * @package ISF_Learning_Hub
 */

get_header();
?>

<!-- Hero -->
<section class="hero" id="home">
    <div class="container">
        <h1>Join, Learn, Share, and Grow Together</h1>
        <p>Your gateway to educational opportunities from around the world. Find scholarships, internships, courses, and more – all in one place.</p>
        <div class="hero-buttons">
            <a href="#scholarships" class="btn btn-secondary">Explore Scholarships →</a>
            <a href="#courses" class="btn btn-outline">Browse Free Courses</a>
        </div>
    </div>
</section>

<!-- Stats -->
<section class="stats">
    <div class="container">
        <div class="stats-grid">
            <div>
                <div class="stat-icon">🏆</div>
                <div class="stat-value">500+</div>
                <div class="stat-label">Scholarships</div>
            </div>
            <div>
                <div class="stat-icon">💼</div>
                <div class="stat-value">200+</div>
                <div class="stat-label">Internships</div>
            </div>
            <div>
                <div class="stat-icon">📚</div>
                <div class="stat-value">1000+</div>
                <div class="stat-label">Free Courses</div>
            </div>
            <div>
                <div class="stat-icon">👥</div>
                <div class="stat-value">50K+</div>
                <div class="stat-label">Students Helped</div>
            </div>
        </div>
    </div>
</section>

<!-- Features -->
<section class="features" id="scholarships">
    <div class="container">
        <div class="section-header">
            <h2>Discover Opportunities</h2>
            <p>We curate the best educational opportunities to help you achieve your goals.</p>
        </div>
        <div class="features-grid">
            <a href="#scholarships" class="feature-card">
                <div class="feature-icon icon-scholarship">🎓</div>
                <h3>Scholarships</h3>
                <p>Find international and local scholarships to fund your education dreams.</p>
            </a>
            <a href="#internships" class="feature-card" id="internships">
                <div class="feature-icon icon-internship">💼</div>
                <h3>Internships</h3>
                <p>Discover internship opportunities to kickstart your career.</p>
            </a>
            <a href="#" class="feature-card">
                <div class="feature-icon icon-jobs">🏢</div>
                <h3>Jobs</h3>
                <p>Find job opportunities from companies and organizations worldwide.</p>
            </a>
            <a href="#" class="feature-card">
                <div class="feature-icon icon-webinar">🎥</div>
                <h3>Webinars &amp; Seminars</h3>
                <p>Join free webinars and seminars from industry experts.</p>
            </a>
            <a href="#courses" class="feature-card" id="courses">
                <div class="feature-icon icon-courses">📖</div>
                <h3>Free Courses</h3>
                <p>Access certified courses from top universities worldwide.</p>
            </a>
        </div>
    </div>
</section>

<!-- Latest Opportunities -->
<section class="job-posts" id="latest">
    <div class="container">
        <div class="section-header">
            <h2>Latest Opportunities</h2>
            <p>Don't miss these recently posted scholarships, internships, and more.</p>
        </div>
        <div class="job-posts-grid">
            <div class="job-post">
                <span class="job-badge badge-scholarship">Scholarship</span>
                <h3>Scholarship in Turkey 2026</h3>
                <div class="job-meta">
                    <span>🌍 Turkey</span>
                    <span>📅 Deadline: 30 April 2026</span>
                </div>
                <p>Fully funded scholarship opportunity for international students to study in Turkey.</p>
                <a href="#" class="btn btn-primary">Apply Now →</a>
            </div>
            <!-- Add more .job-post cards here -->
        </div>
    </div>
</section>

<!-- Mission -->
<section class="mission" id="about">
    <div class="container">
        <div class="mission-grid">
            <div>
                <h2>Our Mission</h2>
                <p class="intro">ISF Learning Hub is dedicated to democratizing access to education. We believe every student deserves the opportunity to learn and grow, regardless of their background.</p>
                <div class="mission-item">
                    <div class="mission-item-icon">🌍</div>
                    <div>
                        <h4>Global Reach</h4>
                        <p>Access opportunities from universities and organizations worldwide.</p>
                    </div>
                </div>
                <div class="mission-item">
                    <div class="mission-item-icon">📈</div>
                    <div>
                        <h4>Career Growth</h4>
                        <p>Build skills and experience through internships and courses.</p>
                    </div>
                </div>
                <div class="mission-item">
                    <div class="mission-item-icon">🤝</div>
                    <div>
                        <h4>Community Support</h4>
                        <p>Join a network of learners helping each other succeed.</p>
                    </div>
                </div>
            </div>
            <div class="mission-visual">
                <div>
                    <div style="font-size:4rem;margin-bottom:1rem">🎓</div>
                    <p>Education for Everyone</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Newsletter -->
<section class="newsletter" id="contact">
    <div class="container">
        <h2>Stay Updated</h2>
        <p>Get the latest scholarships and opportunities delivered to your inbox.</p>
        <form class="newsletter-form" method="post" action="#">
            <input type="email" name="email" placeholder="Enter your email address" required />
            <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
    </div>
</section>

<!-- CTA -->
<section class="cta">
    <div class="container">
        <div class="cta-box">
            <h2>Ready to Start Your Journey?</h2>
            <p>Explore thousands of educational opportunities and take the first step towards your future.</p>
            <div class="cta-buttons">
                <a href="#scholarships" class="btn btn-secondary">Find Scholarships</a>
                <a href="#contact" class="btn btn-outline">Contact Us</a>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
