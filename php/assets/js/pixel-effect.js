/**
 * Pixel Image Effect with GSAP and Three.js
 * Creates a pixelated reveal/hover effect on images
 */

class PixelImageEffect {
    constructor() {
        this.images = [];
        this.init();
    }

    init() {
        // Wait for DOM and libraries to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Find all images with pixel-effect class or in specific containers
        const imageElements = document.querySelectorAll('.pixel-effect, .about-grid img, .card img, .book-cover-img, .hero-image');
        
        imageElements.forEach((img, index) => {
            if (img.complete) {
                this.createPixelEffect(img, index);
            } else {
                img.addEventListener('load', () => this.createPixelEffect(img, index));
            }
        });
    }

    createPixelEffect(img, index) {
        // Skip if already processed
        if (img.dataset.pixelProcessed) return;
        img.dataset.pixelProcessed = 'true';

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'pixel-effect-wrapper';
        wrapper.style.cssText = `
            position: relative;
            overflow: hidden;
            display: inline-block;
            width: ${img.offsetWidth}px;
            height: ${img.offsetHeight}px;
        `;

        // Wrap the image
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        // Create canvas overlay
        const canvas = document.createElement('canvas');
        canvas.className = 'pixel-canvas';
        canvas.width = img.offsetWidth;
        canvas.height = img.offsetHeight;
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        wrapper.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // Store reference
        this.images.push({
            img,
            canvas,
            ctx,
            wrapper,
            pixelSize: 1
        });

        // Add hover effect
        this.addHoverEffect(wrapper, img, canvas, ctx);
        
        // Add scroll reveal effect
        this.addScrollReveal(wrapper, img, canvas, ctx, index);
    }

    addHoverEffect(wrapper, img, canvas, ctx) {
        let animating = false;

        wrapper.addEventListener('mouseenter', () => {
            if (animating) return;
            animating = true;
            canvas.style.opacity = '1';
            
            // Pixelate on hover
            this.animatePixelation(img, canvas, ctx, 1, 20, 300, () => {
                // Then de-pixelate
                this.animatePixelation(img, canvas, ctx, 20, 1, 500, () => {
                    canvas.style.opacity = '0';
                    animating = false;
                });
            });
        });
    }

    addScrollReveal(wrapper, img, canvas, ctx, index) {
        // Initial state - pixelated
        const initialPixelSize = 30;
        this.drawPixelated(img, canvas, ctx, initialPixelSize);
        canvas.style.opacity = '1';
        img.style.opacity = '0';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Delay based on index for staggered effect
                    setTimeout(() => {
                        this.animatePixelation(img, canvas, ctx, initialPixelSize, 1, 800, () => {
                            canvas.style.opacity = '0';
                            img.style.opacity = '1';
                        });
                    }, index * 100);
                    observer.unobserve(wrapper);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(wrapper);
    }

    drawPixelated(img, canvas, ctx, pixelSize) {
        const w = canvas.width;
        const h = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, w, h);

        if (pixelSize <= 1) {
            ctx.drawImage(img, 0, 0, w, h);
            return;
        }

        // Draw small version
        const smallW = Math.ceil(w / pixelSize);
        const smallH = Math.ceil(h / pixelSize);

        // Create offscreen canvas for pixelation
        const offscreen = document.createElement('canvas');
        offscreen.width = smallW;
        offscreen.height = smallH;
        const offCtx = offscreen.getContext('2d');

        // Disable image smoothing for pixelated look
        offCtx.imageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        // Draw small
        offCtx.drawImage(img, 0, 0, smallW, smallH);

        // Draw scaled up (pixelated)
        ctx.drawImage(offscreen, 0, 0, smallW, smallH, 0, 0, w, h);
    }

    animatePixelation(img, canvas, ctx, fromPixel, toPixel, duration, callback) {
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);

            // Calculate current pixel size
            const currentPixel = fromPixel + (toPixel - fromPixel) * eased;

            this.drawPixelated(img, canvas, ctx, Math.max(1, Math.round(currentPixel)));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        };

        requestAnimationFrame(animate);
    }
}

// Three.js Pixel Displacement Effect for hero image
class ThreePixelEffect {
    constructor(container, imageSrc) {
        this.container = container;
        this.imageSrc = imageSrc;
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.z = 1;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Load texture
        const loader = new THREE.TextureLoader();
        loader.load(this.imageSrc, (texture) => {
            this.createMesh(texture);
            this.addEventListeners();
            this.animate();
        });
    }

    createMesh(texture) {
        // Vertex shader
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        // Fragment shader with pixelation effect
        const fragmentShader = `
            uniform sampler2D uTexture;
            uniform float uPixelSize;
            uniform vec2 uMouse;
            uniform float uTime;
            varying vec2 vUv;

            void main() {
                vec2 uv = vUv;
                
                // Calculate distance from mouse
                float dist = distance(uv, uMouse);
                
                // Dynamic pixel size based on mouse proximity
                float pixelSize = uPixelSize + (1.0 - smoothstep(0.0, 0.3, dist)) * 0.05;
                
                // Pixelate
                vec2 pixelatedUV = floor(uv / pixelSize) * pixelSize;
                
                // Add slight displacement near mouse
                vec2 displacement = (uMouse - uv) * (1.0 - smoothstep(0.0, 0.2, dist)) * 0.02;
                
                vec4 color = texture2D(uTexture, pixelatedUV + displacement);
                
                gl_FragColor = color;
            }
        `;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uPixelSize: { value: 0.001 },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uTime: { value: 0 }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }

    addEventListeners() {
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) / rect.width;
            this.mouse.y = 1 - (e.clientY - rect.top) / rect.height;
        });

        this.container.addEventListener('mouseenter', () => {
            gsap.to(this.material.uniforms.uPixelSize, {
                value: 0.02,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        this.container.addEventListener('mouseleave', () => {
            gsap.to(this.material.uniforms.uPixelSize, {
                value: 0.001,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        window.addEventListener('resize', () => {
            this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth mouse follow
        this.material.uniforms.uMouse.value.x += (this.mouse.x - this.material.uniforms.uMouse.value.x) * 0.1;
        this.material.uniforms.uMouse.value.y += (this.mouse.y - this.material.uniforms.uMouse.value.y) * 0.1;
        this.material.uniforms.uTime.value += 0.01;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize pixel effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas-based pixel effect for all images
    new PixelImageEffect();

    // Initialize Three.js effect for hero image if Three.js is available
    if (typeof THREE !== 'undefined' && typeof gsap !== 'undefined') {
        const heroContainer = document.querySelector('.hero-image-container');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroContainer && heroImage) {
            // Hide original image and use Three.js version
            // new ThreePixelEffect(heroContainer, heroImage.src);
        }
    }
});

// GSAP ScrollTrigger pixel effect
function initGSAPPixelEffects() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Animate images on scroll with pixel effect simulation using CSS filters
    gsap.utils.toArray('.card img, .about-grid img').forEach((img, i) => {
        gsap.fromTo(img, 
            {
                filter: 'blur(10px) contrast(1.5)',
                scale: 1.1,
                opacity: 0
            },
            {
                filter: 'blur(0px) contrast(1)',
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: img,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                delay: i * 0.1
            }
        );
    });
}

// Initialize GSAP effects if available
if (typeof gsap !== 'undefined') {
    initGSAPPixelEffects();
}
