// Premium Soda Website with Advanced 3D Effects
let brandScenes = {};
let mouseX = 0;
let mouseY = 0;

// Track mouse movement for parallax
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Utility: Shade color
function shadeColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Create ultra-realistic can with condensation
function createRealisticCan(bodyColor, brandName, labelColor) {
    const canGroup = new THREE.Group();
    
    // Canvas for 4K texture
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Premium gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    const colorHex = `#${bodyColor.toString(16).padStart(6, '0')}`;
    gradient.addColorStop(0, shadeColor(colorHex, 25));
    gradient.addColorStop(0.3, shadeColor(colorHex, 10));
    gradient.addColorStop(0.5, colorHex);
    gradient.addColorStop(0.7, shadeColor(colorHex, -5));
    gradient.addColorStop(1, shadeColor(colorHex, -25));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Metallic texture
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i < 2000; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
    
    // Subtle shine effect
    const shineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    shineGradient.addColorStop(0, 'rgba(255,255,255,0)');
    shineGradient.addColorStop(0.3, 'rgba(255,255,255,0.08)');
    shineGradient.addColorStop(0.5, 'rgba(255,255,255,0.15)');
    shineGradient.addColorStop(0.7, 'rgba(255,255,255,0.08)');
    shineGradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shineGradient;
    ctx.fillRect(canvas.width * 0.2, 0, canvas.width * 0.3, canvas.height);
    
    // Brand logo - large, bold, and properly spelled (flip horizontally for correct reading on can)
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.fillStyle = labelColor;
    ctx.font = 'bold 500px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 12;
    
    // Add stroke for better visibility on dark cans
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 3;
    ctx.strokeText(brandName, canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText(brandName, canvas.width / 2, canvas.height / 2 - 100);
    ctx.restore();
    
    // Tagline with proper font (flip horizontally)
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.font = 'italic bold 220px Georgia, serif';
    ctx.fillStyle = labelColor;
    ctx.globalAlpha = 0.95;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 12;
    ctx.fillText(brandName, canvas.width / 2, canvas.height / 2 + 280);
    ctx.restore();
    
    // Nutrition panel (flip horizontally)
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'transparent';
    ctx.fillText('NUTRITION FACTS', canvas.width - 140, canvas.height - 460);
    ctx.font = '36px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText('Serving: 330ml', canvas.width - 140, canvas.height - 410);
    ctx.fillText('Calories: 140', canvas.width - 140, canvas.height - 365);
    ctx.fillText('Sugar: 39g', canvas.width - 140, canvas.height - 320);
    
    // Volume info
    ctx.font = 'bold 52px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText('330ml ℮', canvas.width - 140, canvas.height - 220);
    ctx.font = '32px Arial';
    ctx.fillText('BEST SERVED COLD', canvas.width - 140, canvas.height - 160);
    ctx.restore();
    
    // Barcode (flip horizontally)
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    const barcodeX = 850;
    for (let i = 0; i < 65; i++) {
        const width = (i % 5 === 0) ? 14 : 7;
        ctx.fillRect(barcodeX + i * 12, canvas.height - 480, width, 180);
    }
    ctx.font = '34px monospace';
    ctx.fillText('5 449000 054227', barcodeX + 80, canvas.height - 270);
    ctx.restore();
    
    // Recycling icon (flip horizontally)
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.font = '55px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'left';
    ctx.fillText('♻', 130, canvas.height - 220);
    ctx.font = '28px Arial';
    ctx.fillText('RECYCLE', 180, canvas.height - 220);
    ctx.restore();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    texture.anisotropy = 16;
    texture.encoding = THREE.sRGBEncoding;
    
    // Can geometry
    const canRadius = 3.3;
    const canHeight = 11.5;
    
    // Main body with premium darker material
    const bodyGeometry = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 256);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.78,
        roughness: 0.25,
        envMapIntensity: 1.8,
        emissive: bodyColor,
        emissiveIntensity: 0.08,
        clearcoat: 0.7,
        clearcoatRoughness: 0.18
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    canGroup.add(body);
    
    // Top rim - dark metallic
    const topGeometry = new THREE.CylinderGeometry(canRadius * 0.88, canRadius, 0.7, 256);
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.96,
        roughness: 0.08,
        envMapIntensity: 3.0,
        clearcoat: 0.9
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = canHeight / 2 + 0.35;
    top.castShadow = true;
    canGroup.add(top);
    
    // Pull tab
    const tabGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.18, 64);
    const tab = new THREE.Mesh(tabGeometry, topMaterial);
    tab.position.y = canHeight / 2 + 0.8;
    tab.castShadow = true;
    canGroup.add(tab);
    
    // Ring pull
    const ringGeometry = new THREE.TorusGeometry(0.5, 0.1, 24, 64);
    const ring = new THREE.Mesh(ringGeometry, topMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = canHeight / 2 + 0.8;
    ring.castShadow = true;
    canGroup.add(ring);
    
    // Bottom rim
    const bottom = new THREE.Mesh(topGeometry, topMaterial);
    bottom.position.y = -(canHeight / 2 + 0.35);
    bottom.castShadow = true;
    canGroup.add(bottom);
    
    // Add condensation droplets
    addCondensation(canGroup, canRadius, canHeight);
    
    return canGroup;
}

// Add realistic water droplets
function addCondensation(canGroup, radius, height) {
    const dropletGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const dropletMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaccff,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.7,
        envMapIntensity: 2.0
    });
    
    // Add random droplets
    for (let i = 0; i < 80; i++) {
        const droplet = new THREE.Mesh(dropletGeometry, dropletMaterial);
        const angle = Math.random() * Math.PI * 2;
        const heightPos = (Math.random() - 0.5) * height * 0.8;
        const radiusOffset = radius + 0.05;
        
        droplet.position.x = Math.cos(angle) * radiusOffset;
        droplet.position.z = Math.sin(angle) * radiusOffset;
        droplet.position.y = heightPos;
        
        droplet.scale.set(
            Math.random() * 0.5 + 0.5,
            Math.random() * 1.5 + 0.8,
            Math.random() * 0.5 + 0.5
        );
        
        canGroup.add(droplet);
    }
}

// Create curved platform/shelf
function createCurvedPlatform(scene, color) {
    const curve = new THREE.EllipseCurve(
        0, 0,
        18, 18,
        0, 2 * Math.PI,
        false,
        0
    );
    
    const points = curve.getPoints(100);
    const geometry = new THREE.LatheGeometry(
        points.map(p => new THREE.Vector2(p.x, 0)),
        64
    );
    
    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.7,
        roughness: 0.3,
        envMapIntensity: 1.5
    });
    
    const platform = new THREE.Mesh(geometry, material);
    platform.rotation.x = -Math.PI / 2;
    platform.position.y = -6.5;
    platform.scale.set(0.8, 0.8, 0.15);
    platform.receiveShadow = true;
    platform.castShadow = true;
    scene.add(platform);
}

// Initialize Premium Collection
function initCollection() {
    const container = document.getElementById('collection-container');
    if (!container) {
        console.warn('Collection container not found');
        return;
    }
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x000000, 0.012);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 35);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
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
    const envLight = new THREE.AmbientLight(0xffffff, 1.0);
    envScene.add(envLight);
    scene.environment = pmremGenerator.fromScene(envScene).texture;
    
    // Lighting
    const keyLight = new THREE.SpotLight(0xffffff, 5.5, 70, Math.PI / 6, 0.25);
    keyLight.position.set(-18, 25, 15);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 4.0);
    rimLight.position.set(15, 10, -12);
    scene.add(rimLight);
    
    const fillLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(fillLight);
    
    const frontLight = new THREE.DirectionalLight(0xffffff, 2.5);
    frontLight.position.set(0, 8, 20);
    scene.add(frontLight);
    
    // Create collection cans with darker colors and proper positioning
    const collectionCans = [
        { color: 0x8b0000, name: 'Coca-Cola', labelColor: '#ffffff', x: -12, z: 2 },
        { color: 0x008844, name: 'Sprite', labelColor: '#ffff00', x: -6, z: -1 },
        { color: 0x003399, name: 'Red Bull', labelColor: '#ffd700', x: 0, z: 1 },
        { color: 0xaa6600, name: 'Fanta', labelColor: '#ffffff', x: 6, z: -0.5 },
        { color: 0x004499, name: 'Pepsi', labelColor: '#ff0000', x: 12, z: 0.5 }
    ];
    
    const cans = [];
    collectionCans.forEach((config, index) => {
        const can = createRealisticCan(config.color, config.name, config.labelColor);
        can.position.set(config.x, -1, config.z);
        can.rotation.y = 0.3 + (Math.random() - 0.5) * 0.2;
        can.userData = {
            baseY: -1,
            floatOffset: index * Math.PI / 2.5
        };
        scene.add(can);
        cans.push(can);
    });
    
    // Add platforms
    collectionCans.forEach(config => {
        const platformGeometry = new THREE.CylinderGeometry(4, 4.5, 0.5, 64);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.3,
            envMapIntensity: 1.5
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(config.x, -6.5, config.z);
        platform.receiveShadow = true;
        platform.castShadow = true;
        scene.add(platform);
    });
    
    // Window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Smooth animation with optimized performance
    let animationFrameId;
    function animateCollection() {
        animationFrameId = requestAnimationFrame(animateCollection);
        
        const time = Date.now() * 0.001;
        
        cans.forEach((can) => {
            // Smooth rotation
            can.rotation.y += 0.004;
            can.rotation.x = Math.sin(time * 0.18 + can.userData.floatOffset) * 0.05;
            
            // Gentle float
            can.position.y = can.userData.baseY + Math.sin(time * 0.3 + can.userData.floatOffset) * 0.08;
            
            // Subtle tilt
            can.rotation.z = Math.cos(time * 0.13 + can.userData.floatOffset) * 0.015;
        });
        
        // Slow camera movement for cinematic effect
        camera.position.x = Math.sin(time * 0.08) * 2.5;
        camera.position.y = 5 + Math.cos(time * 0.12) * 1.2;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    animateCollection();
    
    // Pause animation when not visible for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            } else if (entry.isIntersecting) {
                animateCollection();
            }
        });
    });
    observer.observe(container);
    console.log('✓ Premium Collection loaded');
}

// Initialize all brand cans
function initBrandCans() {
    const brands = [
        { 
            id: 'coca-cola', 
            color: 0x8b0000, 
            name: 'Coca-Cola', 
            labelColor: '#ffffff', 
            accentColor: 0xaa0000,
            platformColor: 0x550000
        },
        { 
            id: 'sprite', 
            color: 0x008844, 
            name: 'Sprite', 
            labelColor: '#ffff00', 
            accentColor: 0x00aa55,
            platformColor: 0x004422
        },
        { 
            id: 'redbull', 
            color: 0x003399, 
            name: 'Red Bull', 
            labelColor: '#ffd700', 
            accentColor: 0x0044bb,
            platformColor: 0x001a55
        },
        { 
            id: 'fanta', 
            color: 0xaa6600, 
            name: 'Fanta', 
            labelColor: '#ffffff', 
            accentColor: 0xcc7700,
            platformColor: 0x774400
        },
        { 
            id: 'pepsi', 
            color: 0x004499, 
            name: 'Pepsi', 
            labelColor: '#ff0000', 
            accentColor: 0x0055cc,
            platformColor: 0x002255
        }
    ];
    
    brands.forEach(brand => {
        const container = document.querySelector(`[data-brand="${brand.id}"]`);
        if (!container) {
            console.warn(`Container not found: ${brand.id}`);
            return;
        }
        
        // Scene setup - transparent for brand section backgrounds
        const scene = new THREE.Scene();
        scene.background = null;
        scene.fog = null;
        
        // Camera with better positioning to show full can
        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 1000);
        camera.position.set(0, 1, 26);
        camera.lookAt(0, 0, 0);
        
        // Renderer with premium settings
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
        renderer.toneMappingExposure = 1.5;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        
        // Environment map
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0xffffff);
        const envLight = new THREE.AmbientLight(0xffffff, 1.2);
        envScene.add(envLight);
        scene.environment = pmremGenerator.fromScene(envScene).texture;
        
        // Premium lighting setup
        const keyLight = new THREE.SpotLight(0xffffff, 6.5, 60, Math.PI / 6, 0.2);
        keyLight.position.set(-14, 22, 14);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 1;
        keyLight.shadow.camera.far = 60;
        scene.add(keyLight);
        
        const rimLight = new THREE.DirectionalLight(0xffffff, 4.5);
        rimLight.position.set(12, 8, -14);
        scene.add(rimLight);
        
        const fillLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(fillLight);
        
        const accentLight = new THREE.PointLight(brand.accentColor, 3.5, 35);
        accentLight.position.set(16, 8, 12);
        scene.add(accentLight);
        
        const frontLight = new THREE.DirectionalLight(0xffffff, 2.0);
        frontLight.position.set(0, 6, 18);
        scene.add(frontLight);
        
        const backLight = new THREE.PointLight(brand.accentColor, 2.0, 40);
        backLight.position.set(0, 10, -15);
        scene.add(backLight);
        
        // Curved platform
        createCurvedPlatform(scene, brand.platformColor);
        
        // Create can - positioned to show full height including bottom
        const can = createRealisticCan(brand.color, brand.name, brand.labelColor);
        can.position.y = 0;
        can.rotation.y = 0.3;
        scene.add(can);
        
        // Store scene data
        brandScenes[brand.id] = { scene, camera, renderer, can, brand };
        
        console.log(`✓ ${brand.name} loaded`);
    });
    
    animateBrandCans();
}

// Smooth animation with mouse parallax and scroll effects
let brandAnimationActive = true;

function animateBrandCans() {
    if (!brandAnimationActive) return;
    requestAnimationFrame(animateBrandCans);
    
    const time = Date.now() * 0.001;
    
    Object.values(brandScenes).forEach(({ scene, camera, renderer, can, brand }) => {
        // Smooth rotation with easing
        can.rotation.y += 0.005;
        can.rotation.x = Math.sin(time * 0.16) * 0.08 + mouseY * 0.04;
        
        // Gentle floating animation - keeping can centered
        can.position.y = Math.sin(time * 0.35) * 0.07;
        
        // Natural tilt with mouse interaction
        can.rotation.z = Math.cos(time * 0.14) * 0.018 + mouseX * 0.025;
        
        // Smooth mouse parallax on camera - centered view
        const targetX = mouseX * 1.5;
        const targetY = 1 + mouseY * 1.0;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    });
}

// Pause animations when page is hidden for better performance
document.addEventListener('visibilitychange', () => {
    brandAnimationActive = !document.hidden;
    if (brandAnimationActive) {
        animateBrandCans();
    }
});

// Scroll-triggered animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -150px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.transform = 'scale(1)';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.brand-section').forEach(section => {
        section.style.transform = 'scale(0.95)';
        section.style.opacity = '0.3';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(section);
    });
}

// Brand button interactions
function setupBrandButtons() {
    const buttons = document.querySelectorAll('.brand-cta');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.closest('.brand-section');
            const title = section.querySelector('.brand-title');
            const brandName = title ? title.textContent.trim() : 'Product';
            
            // Particle burst effect
            createParticleBurst(this);
            
            // Button feedback
            const originalText = this.textContent;
            this.textContent = '✓ Added!';
            this.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.transform = '';
            }, 2000);
        });
    });
}

// Particle burst effect
function createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
        `;
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 15;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let startTime = Date.now();
        function animateParticle() {
            const elapsed = (Date.now() - startTime) / 1000;
            const x = rect.left + rect.width / 2 + vx * elapsed;
            const y = rect.top + rect.height / 2 + vy * elapsed + (elapsed * elapsed * 500);
            const opacity = Math.max(0, 1 - elapsed * 2);
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        animateParticle();
    }
}

// Hero parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 - scrolled / 2000})`;
        hero.style.opacity = 1 - (scrolled / 800);
    }
});

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    console.log('🥤 Loading Premium Soda Website...');
    initCollection();
    initBrandCans();
    setupScrollAnimations();
    setupBrandButtons();
    console.log('✅ Premium website ready!');
});
