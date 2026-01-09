// Soda Website with 3D Cans - Working Version
let brandScenes = {};

// Utility function to shade colors
function shadeColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Create photorealistic can
function createCan(bodyColor, metalColor, brandName, labelColor) {
    const canGroup = new THREE.Group();
    canGroup.castShadow = true;
    canGroup.receiveShadow = true;
    
    // Create 4K label texture
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    const colorHex = `#${bodyColor.toString(16).padStart(6, '0')}`;
    gradient.addColorStop(0, shadeColor(colorHex, 15));
    gradient.addColorStop(0.4, colorHex);
    gradient.addColorStop(0.6, colorHex);
    gradient.addColorStop(1, shadeColor(colorHex, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add texture
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    for (let i = 0; i < 1000; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
    
    // Brand logo
    ctx.save();
    ctx.fillStyle = labelColor;
    ctx.font = 'bold 420px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;
    ctx.fillText(brandName, canvas.width / 2, canvas.height / 2 - 80);
    ctx.restore();
    
    // Tagline
    ctx.font = 'italic 180px Georgia';
    ctx.fillStyle = labelColor;
    ctx.globalAlpha = 0.9;
    ctx.fillText(brandName, canvas.width / 2, canvas.height / 2 + 220);
    ctx.globalAlpha = 1;
    
    // Nutrition facts
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('NUTRITION FACTS', 120, canvas.height - 420);
    ctx.font = '34px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Serving: 330ml', 120, canvas.height - 370);
    ctx.fillText('Calories: 140', 120, canvas.height - 325);
    
    // Volume
    ctx.font = 'bold 46px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('330ml ℮', 120, canvas.height - 200);
    
    // Barcode
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    const barcodeX = canvas.width - 800;
    for (let i = 0; i < 60; i++) {
        const width = (i % 5 === 0) ? 12 : 6;
        ctx.fillRect(barcodeX + i * 11, canvas.height - 450, width, 160);
    }
    
    // Recycling icon
    ctx.font = '50px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('♻', canvas.width - 120, canvas.height - 200);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    texture.anisotropy = 16;
    texture.encoding = THREE.sRGBEncoding;
    
    // Can dimensions
    const canRadius = 3.3;
    const canHeight = 11.5;
    
    // Can body
    const bodyGeometry = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 256);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.75,
        roughness: 0.28,
        envMapIntensity: 1.5,
        emissive: bodyColor,
        emissiveIntensity: 0.12,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    canGroup.add(body);
    
    // Top rim
    const topGeometry = new THREE.CylinderGeometry(canRadius * 0.90, canRadius, 0.6, 256);
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        metalness: 0.95,
        roughness: 0.12,
        envMapIntensity: 2.5
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = canHeight / 2 + 0.3;
    top.castShadow = true;
    canGroup.add(top);
    
    // Bottom
    const bottom = new THREE.Mesh(topGeometry, topMaterial);
    bottom.position.y = -(canHeight / 2 + 0.25);
    bottom.castShadow = true;
    canGroup.add(bottom);
    
    return canGroup;
}

// Initialize brand cans for each section
function initBrandCans() {
    const brands = [
        { id: 'coca-cola', color: 0xdc143c, name: 'Coca-Cola', labelColor: '#ffffff', accentColor: 0xff1a1a },
        { id: 'sprite', color: 0x00cc66, name: 'Sprite', labelColor: '#ffff00', accentColor: 0x00ff88 },
        { id: 'redbull', color: 0x0055ff, name: 'Red Bull', labelColor: '#ffd700', accentColor: 0xffd700 },
        { id: 'fanta', color: 0xff8800, name: 'Fanta', labelColor: '#ffffff', accentColor: 0xff9900 },
        { id: 'pepsi', color: 0x0066ff, name: 'Pepsi', labelColor: '#ff0000', accentColor: 0x0088ff }
    ];
    
    brands.forEach(brand => {
        const container = document.querySelector(`[data-brand="${brand.id}"]`);
        if (!container) {
            console.warn(`Container not found for brand: ${brand.id}`);
            return;
        }
        
        // Create scene
        const scene = new THREE.Scene();
        scene.background = null;
        
        // Camera
        const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 1000);
        camera.position.set(0, 2, 25);
        
        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(700, 700);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.physicallyCorrectLights = true;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.4;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        
        // Environment
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0xffffff);
        const envLight = new THREE.AmbientLight(0xffffff, 1);
        envScene.add(envLight);
        scene.environment = pmremGenerator.fromScene(envScene).texture;
        
        // Lighting
        const keyLight = new THREE.SpotLight(0xffffff, 5.5, 50, Math.PI / 7, 0.25);
        keyLight.position.set(-12, 18, 12);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        scene.add(keyLight);
        
        const rimLight = new THREE.DirectionalLight(0xffffff, 3.5);
        rimLight.position.set(10, 6, -12);
        scene.add(rimLight);
        
        const fillLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(fillLight);
        
        const accentLight = new THREE.PointLight(brand.accentColor, 2.0, 30);
        accentLight.position.set(14, 6, 10);
        scene.add(accentLight);
        
        const frontFill = new THREE.DirectionalLight(0xffffff, 1.5);
        frontFill.position.set(0, 5, 15);
        scene.add(frontFill);
        
        // Ground shadow
        const groundGeo = new THREE.PlaneGeometry(40, 40);
        const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -7;
        ground.receiveShadow = true;
        scene.add(ground);
        
        // Create can
        const can = createCan(brand.color, 0x8b1a1a, brand.name, brand.labelColor);
        can.rotation.y = 0.3;
        scene.add(can);
        
        // Store scene data
        brandScenes[brand.id] = { scene, camera, renderer, can };
        
        console.log(`Initialized 3D can for: ${brand.name}`);
    });
    
    // Start animation
    animateBrandCans();
}

// Animate all brand cans
function animateBrandCans() {
    requestAnimationFrame(animateBrandCans);
    
    const time = Date.now() * 0.001;
    
    Object.values(brandScenes).forEach(({ scene, camera, renderer, can }) => {
        // Slow rotation
        can.rotation.y += 0.008;
        can.rotation.x = Math.sin(time * 0.2) * 0.08;
        
        // Subtle float
        can.position.y = Math.sin(time * 0.35) * 0.06;
        
        // Natural tilt
        can.rotation.z = Math.cos(time * 0.15) * 0.015;
        
        renderer.render(scene, camera);
    });
}

// Smooth scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.brand-section').forEach(section => {
        observer.observe(section);
    });
}

// Brand button interactions
function setupBrandButtons() {
    const buttons = document.querySelectorAll('.brand-cta');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const brandSection = this.closest('.brand-section');
            const brandTitle = brandSection.querySelector('.brand-title');
            const brandName = brandTitle ? brandTitle.textContent.trim() : 'Product';
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = '✓ Added!';
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.transform = '';
            }, 2000);
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🥤 Initializing Soda Website...');
    initBrandCans();
    setupScrollAnimations();
    setupBrandButtons();
    setupSmoothScroll();
    console.log('✅ Website loaded successfully!');
});

// Parallax effect on scroll
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
            ticking = false;
        });
        ticking = true;
    }
});

console.log('🥤 Soda Website Script Loaded');
