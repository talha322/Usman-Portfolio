// Sample Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const sampleModal = document.getElementById('sampleModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalFiles = document.getElementById('modalFiles');
    const sampleCards = document.querySelectorAll('.sample-card');

    // Only initialize modal functionality if elements exist (only on service pages)
    if (sampleModal && modalClose && modalTitle && modalFiles && sampleCards.length > 0) {
        
        // Get service name from page title
        const getServiceName = () => {
            const pageTitle = document.querySelector('title').textContent;
            // Extract service name from title (e.g., "Academic Writing Services" -> "Research Papers & Essays Writing")
            const serviceMap = {
                'Academic Writing Services': 'Research Papers & Essays Writing',
                'Thesis & Dissertation Services': 'PhD Thesis & Dissertation',
                'Final Year Projects Services': 'Technical Reports & Presentations',
                'Assignment Help Services': 'Citation & Formatting Services',
                'Research Assistance Services': 'Advanced Research & Data Analysis',
                'Editing & Proofreading Services': 'Advanced Editing & AI Detection'
            };
            return serviceMap[pageTitle] || pageTitle.replace(' Services', '');
        };

        // Load files for a section
        const loadFiles = async (sectionName) => {
            const serviceName = getServiceName();
            const jsonPath = `../assets/samples/${encodeURIComponent(serviceName)}/${encodeURIComponent(sectionName)}/files.json`;
            
            try {
                const response = await fetch(jsonPath);
                if (!response.ok) {
                    throw new Error('No files found');
                }
                
                const files = await response.json();
                
                if (files.length === 0) {
                    modalFiles.innerHTML = '<div class="no-files">No files available for this section yet.</div>';
                } else {
                    const basePath = `../assets/samples/${encodeURIComponent(serviceName)}/${encodeURIComponent(sectionName)}/files`;
                    modalFiles.innerHTML = files.map(file => `
                        <div class="modal-file-item">
                            <span class="modal-file-name">${file.name}</span>
                            <a href="${basePath}/${encodeURIComponent(file.name)}" download class="modal-file-download">Download</a>
                        </div>
                    `).join('');
                }
            } catch (error) {
                modalFiles.innerHTML = '<div class="no-files">Files not found. Sample files will be added soon.</div>';
            }
        };

        // Open modal when clicking on sample card
        sampleCards.forEach(card => {
            card.addEventListener('click', () => {
                const sectionName = card.getAttribute('data-section');
                if (sectionName) {
                    modalTitle.textContent = sectionName;
                    modalFiles.innerHTML = '<div class="no-files">Loading files...</div>';
                    sampleModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    loadFiles(sectionName);
                }
            });
        });

        // Close modal
        modalClose.addEventListener('click', () => {
            sampleModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        sampleModal.addEventListener('click', (e) => {
            if (e.target === sampleModal) {
                sampleModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sampleModal.classList.contains('active')) {
                sampleModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'none';
            entry.target.offsetHeight; // Trigger reflow
            entry.target.style.animation = null;
            
            // Add fade-in class if it doesn't have animation
            if (!entry.target.style.animation) {
                entry.target.classList.add('fade-in');
            }
        }
    });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2');
animatedElements.forEach(el => observer.observe(el));

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handling (only on index.html)
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const subject = contactForm.querySelectorAll('input[type="text"]')[1].value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            // Show success message (in real implementation, you would send this to a server)
            alert('Thank you for your message! I will get back to you within 24 hours.');
            contactForm.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

// Counter Animation for Stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
};

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (!isNaN(number)) {
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Parallax effect for hero shapes
const shapes = document.querySelectorAll('.floating-shape');

window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        
        shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Typing effect for hero title (optional enhancement)
const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize all animations
    animatedElements.forEach(el => observer.observe(el));
});

// Service cards hover effect enhancement
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Portfolio items hover effect
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Testimonial cards hover effect
const testimonialCards = document.querySelectorAll('.testimonial-card');

testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});
