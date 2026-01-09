// Three.js Scene Setup for Ultra-Premium Coca-Cola Commercial
let heroScene, heroCamera, heroRenderer, heroCan;
let collectionScene, collectionCamera, collectionRenderer;
let collectionCans = [];
let envMap;
let mouseX = 0, mouseY = 0;
let targetRotationY = 0, targetRotationX = 0;
let animationTime = 0;
let isHovering = false;
let scrollY = 0;

// Initialize Hero Can (Black Edition Coca-Cola)
function initHeroCan() {
    const container = document.getElementById('hero-can-container');
    if (!container) return;
    
    // Scene setup
    heroScene = new THREE.Scene();
    heroScene.background = null; // Transparent
    
    // Camera - 65mm lens for cinematic product photography
    heroCamera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 1000);
    heroCamera.position.set(0, 2, 20);
    
    // Renderer
    heroRenderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance",
        precision: "highp"
    });
    heroRenderer.setSize(container.clientWidth, container.clientHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    heroRenderer.setClearColor(0x000000, 0);
    heroRenderer.physicallyCorrectLights = true;
    heroRenderer.outputEncoding = THREE.sRGBEncoding;
    heroRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    heroRenderer.toneMappingExposure = 1.4;
    heroRenderer.shadowMap.enabled = true;
    heroRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(heroRenderer.domElement);
    
    // Environment and lighting
    createEnvironmentMap(heroScene, heroRenderer);
    setupHeroLighting(heroScene);
    
    // Create Black Edition Coca-Cola Can
    heroCan = createBlackEditionCan();
    heroScene.add(heroCan);
    
    // Mouse interaction
    container.addEventListener('mousemove', onHeroMouseMove);
    container.addEventListener('mouseenter', () => isHovering = true);
    container.addEventListener('mouseleave', () => isHovering = false);
    
    // Window resize
    window.addEventListener('resize', () => {
        heroCamera.aspect = container.clientWidth / container.clientHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animateHero();
}

// Create HDR Environment Map
function createEnvironmentMap(scene, renderer) {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x1a1a1a);
    
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(1, 1, 1);
    envScene.add(light1);
    
    const light2 = new THREE.AmbientLight(0xffffff, 0.4);
    envScene.add(light2);
    
    envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;
}

// Low-Key Dramatic Studio Lighting for Hero Can
function setupHeroLighting(scene) {
    // Key light - Soft vertical highlight streak from top-left
    const keyLight = new THREE.SpotLight(0xffffff, 4.5, 50, Math.PI / 9, 0.4);
    keyLight.position.set(-10, 20, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);
    
    // Strong rim light for silhouette separation
    const rimLight = new THREE.DirectionalLight(0xe8f0ff, 3.5);
    rimLight.position.set(12, 5, -12);
    scene.add(rimLight);
    
    // Minimal fill light (controlled shadows)
    const fillLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(fillLight);
    
    // Red accent for Coca-Cola branding
    const redAccent = new THREE.PointLight(0xdc143c, 0.8, 25);
    redAccent.position.set(-8, 2, 10);
    scene.add(redAccent);
    
    // Secondary rim for depth
    const rimLight2 = new THREE.DirectionalLight(0xffd0d0, 1.2);
    rimLight2.position.set(-10, 3, -8);
    scene.add(rimLight2);
    
    // Ground shadow plane
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -8;
    ground.receiveShadow = true;
    scene.add(ground);
}

// Create Ultra-Realistic Black Edition Coca-Cola Can
function createBlackEditionCan() {
    const canGroup = new THREE.Group();
    canGroup.castShadow = true;
    canGroup.receiveShadow = true;
    
    const canRadius = 3.3;
    const canHeight = 11.5;
    
    // Create 4K label texture - Black Edition with Red/White branding
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Black matte background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(0.4, '#0d0d0d');
    gradient.addColorStop(0.6, '#0a0a0a');
    gradient.addColorStop(1, '#050505');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Subtle texture for realism
    ctx.fillStyle = 'rgba(255,255,255,0.015)';
    for (let i = 0; i < 1200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }
    
    // Coca-Cola Script Logo (large, center, red)
    ctx.save();
    ctx.fillStyle = '#dc143c';
    ctx.font = 'italic bold 420px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(220, 20, 60, 0.6)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillText('Coca-Cola', canvas.width / 2, canvas.height / 2 - 100);
    ctx.restore();
    
    // "Black Edition" in white
    ctx.save();
    ctx.font = 'bold 140px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = '8px';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText('BLACK EDITION', canvas.width / 2, canvas.height / 2 + 280);
    ctx.restore();
    
    // Nutritional panel (white text, left side)
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('NUTRITION FACTS', 120, canvas.height - 450);
    ctx.font = '36px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Serving Size: 330ml', 120, canvas.height - 390);
    ctx.fillText('Calories: 140', 120, canvas.height - 340);
    ctx.fillText('Total Carbs: 39g', 120, canvas.height - 290);
    ctx.fillText('Sugars: 39g', 120, canvas.height - 240);
    
    // Volume info
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText('330ml ℮', 120, canvas.height - 170);
    ctx.font = '32px Arial';
    ctx.fillText('BEST SERVED ICE COLD', 120, canvas.height - 120);
    
    // Barcode (right side)
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    const barcodeX = canvas.width - 850;
    const barcodeY = canvas.height - 480;
    for (let i = 0; i < 65; i++) {
        const width = (i % 5 === 0 || i % 7 === 0) ? 14 : 7;
        ctx.fillRect(barcodeX + i * 12, barcodeY, width, 180);
    }
    ctx.font = '36px monospace';
    ctx.fillText('5 449000 054227', barcodeX + 80, barcodeY + 220);
    
    // Recycling icon
    ctx.font = 'bold 60px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.textAlign = 'right';
    ctx.fillText('♻', canvas.width - 120, canvas.height - 180);
    ctx.font = '28px Arial';
    ctx.fillText('RECYCLABLE', canvas.width - 180, canvas.height - 180);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    texture.anisotropy = heroRenderer.capabilities.getMaxAnisotropy();
    texture.encoding = THREE.sRGBEncoding;
    
    // Can body - Black matte-to-gloss finish
    const bodyGeometry = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 256);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.75,
        roughness: 0.35,
        envMapIntensity: 1.5,
        emissive: 0x0a0a0a,
        emissiveIntensity: 0.1,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    canGroup.add(body);
    
    // Top rim - Dark aluminum
    const topGeometry = new THREE.CylinderGeometry(canRadius * 0.90, canRadius, 0.6, 256);
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.95,
        roughness: 0.12,
        envMapIntensity: 2.2,
        clearcoat: 0.7,
        clearcoatRoughness: 0.1
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = canHeight / 2 + 0.3;
    top.castShadow = true;
    canGroup.add(top);
    
    // Pull tab assembly
    const tabGroup = new THREE.Group();
    const tabGeometry = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 128);
    const tabMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        metalness: 0.92,
        roughness: 0.15,
        envMapIntensity: 2.0
    });
    const tab = new THREE.Mesh(tabGeometry, tabMaterial);
    tab.castShadow = true;
    
    const ringGeometry = new THREE.TorusGeometry(0.45, 0.08, 24, 64);
    const ring = new THREE.Mesh(ringGeometry, tabMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    
    const rivetGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 32);
    const rivet = new THREE.Mesh(rivetGeometry, tabMaterial);
    rivet.position.y = 0.08;
    
    tabGroup.add(tab);
    tabGroup.add(ring);
    tabGroup.add(rivet);
    tabGroup.position.y = canHeight / 2 + 0.65;
    canGroup.add(tabGroup);
    
    // Bottom rim
    const bottomGeometry = new THREE.CylinderGeometry(canRadius * 1.02, canRadius, 0.5, 256);
    const bottom = new THREE.Mesh(bottomGeometry, topMaterial);
    bottom.position.y = -(canHeight / 2 + 0.25);
    bottom.castShadow = true;
    canGroup.add(bottom);
    
    // Condensation droplets
    addCondensation(canGroup, 0x0a0a0a);
    
    return canGroup;
}

// Add realistic condensation
function addCondensation(canGroup, baseColor) {
    const canRadius = 3.3;
    const canHeight = 11.5;
    
    const dropletSizes = [
        { size: 0.09, count: 20, opacity: 0.9 },
        { size: 0.06, count: 35, opacity: 0.8 },
        { size: 0.03, count: 55, opacity: 0.7 },
        { size: 0.015, count: 70, opacity: 0.6 }
    ];
    
    dropletSizes.forEach(({ size, count, opacity }) => {
        const dropletGeometry = new THREE.SphereGeometry(size, 32, 32);
        const dropletMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd5e8f5,
            metalness: 0.0,
            roughness: 0.01,
            transparent: true,
            opacity: opacity,
            envMapIntensity: 5.0,
            transmission: 0.98,
            thickness: size * 2.5,
            ior: 1.33,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03
        });
        
        for (let i = 0; i < count; i++) {
            const droplet = new THREE.Mesh(dropletGeometry, dropletMaterial);
            const angle = Math.random() * Math.PI * 2;
            const heightBias = Math.pow(Math.random(), 1.8);
            const height = (heightBias - 0.5) * canHeight * 0.88;
            const radius = canRadius + 0.04;
            
            droplet.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            const sizeVariation = 0.75 + Math.random() * 0.5;
            droplet.scale.set(sizeVariation, sizeVariation * 1.4, sizeVariation);
            droplet.castShadow = true;
            
            canGroup.add(droplet);
        }
    });
}

// Mouse movement interaction
function onHeroMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

// Animate Hero Can with unique rotation (pause to highlight logo)
function animateHero() {
    requestAnimationFrame(animateHero);
    
    animationTime += 0.01;
    
    if (heroCan) {
        // Unique rotation: Y-axis primary + X-axis tilt with PAUSES to highlight logo
        // Creates organic motion with moments of stillness
        const rotationCycle = Math.sin(animationTime * 0.15) * 0.5 + 0.5; // 0 to 1
        const pauseFactor = Math.pow(rotationCycle, 3); // Cubic easing creates pauses
        
        // Smooth Y-axis rotation with pauses
        targetRotationY += 0.008 * pauseFactor;
        
        // Gentle X-axis tilt
        targetRotationX = Math.sin(animationTime * 0.2) * 0.1;
        
        // Apply with easing
        heroCan.rotation.y += (targetRotationY - heroCan.rotation.y) * 0.05;
        heroCan.rotation.x += (targetRotationX - heroCan.rotation.x) * 0.05;
        
        // Subtle Z-axis tilt for natural inertia
        heroCan.rotation.z = Math.sin(animationTime * 0.18) * 0.02;
        
        // Minimal floating (2-3mm range)
        heroCan.position.y = Math.sin(animationTime * 0.3) * 0.04;
        
        // Mouse hover interaction - slightly faster rotation
        if (isHovering) {
            heroCan.rotation.y += mouseX * 0.002;
            heroCan.rotation.x += mouseY * 0.001;
        }
        
        // Scroll parallax effect
        const parallaxY = scrollY * 0.0015;
        heroCamera.position.y = 2 + parallaxY;
    }
    
    heroRenderer.render(heroScene, heroCamera);
}

// Initialize Premium Collection
function initCollection() {
    const container = document.getElementById('collection-container');
    if (!container) return;
    
    collectionScene = new THREE.Scene();
    collectionScene.background = null;
    
    collectionCamera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
    collectionCamera.position.set(0, 2, 35);
    
    collectionRenderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance",
        precision: "highp"
    });
    collectionRenderer.setSize(container.clientWidth, container.clientHeight);
    collectionRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    collectionRenderer.setClearColor(0x000000, 0);
    collectionRenderer.physicallyCorrectLights = true;
    collectionRenderer.outputEncoding = THREE.sRGBEncoding;
    collectionRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    collectionRenderer.toneMappingExposure = 1.3;
    collectionRenderer.shadowMap.enabled = true;
    collectionRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(collectionRenderer.domElement);
    
    createEnvironmentMap(collectionScene, collectionRenderer);
    setupCollectionLighting(collectionScene);
    createCollectionCans();
    
    window.addEventListener('resize', () => {
        collectionCamera.aspect = container.clientWidth / container.clientHeight;
        collectionCamera.updateProjectionMatrix();
        collectionRenderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animateCollection();
}

// Collection lighting
function setupCollectionLighting(scene) {
    const keyLight = new THREE.SpotLight(0xffffff, 3.5, 60, Math.PI / 8, 0.35);
    keyLight.position.set(-15, 22, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);
    
    const rimLight = new THREE.DirectionalLight(0xe8f4ff, 2.5);
    rimLight.position.set(12, 8, -15);
    scene.add(rimLight);
    
    const fillLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(fillLight);
    
    const accentRim = new THREE.DirectionalLight(0xffd0d0, 1.0);
    accentRim.position.set(-10, 4, -12);
    scene.add(accentRim);
    
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -8;
    ground.receiveShadow = true;
    scene.add(ground);
}

// Create collection of premium dark cans
function createCollectionCans() {
    const canConfigs = [
        { color: 0x0a0a0a, name: 'Black', label: '#dc143c', x: -12 },
        { color: 0x1a0a0a, name: 'Cherry', label: '#ff3366', x: -6 },
        { color: 0x0a0a1a, name: 'Midnight', label: '#6699ff', x: 0 },
        { color: 0x0a1a0a, name: 'Forest', label: '#33ff99', x: 6 },
        { color: 0x1a1a0a, name: 'Gold', label: '#ffcc33', x: 12 }
    ];
    
    canConfigs.forEach((config, index) => {
        const can = createPremiumCan(config.color, config.name, config.label);
        can.position.set(config.x, 0, 0);
        can.userData = {
            baseY: 0,
            floatOffset: index * Math.PI / 2.5
        };
        collectionCans.push(can);
        collectionScene.add(can);
    });
}

// Create premium dark edition cans
function createPremiumCan(bodyColor, name, labelColor) {
    const canGroup = new THREE.Group();
    canGroup.castShadow = true;
    canGroup.receiveShadow = true;
    
    const canRadius = 2.8;
    const canHeight = 9.5;
    
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    const colorHex = `#${bodyColor.toString(16).padStart(6, '0')}`;
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = labelColor;
    ctx.font = 'italic bold 280px Georgia';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 15;
    ctx.fillText('Coca-Cola', canvas.width / 2, canvas.height / 2);
    
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(name.toUpperCase(), canvas.width / 2, canvas.height / 2 + 200);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    
    const bodyGeometry = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 256);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.8,
        roughness: 0.3,
        envMapIntensity: 1.6,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    canGroup.add(body);
    
    // Top and bottom
    const topGeometry = new THREE.CylinderGeometry(canRadius * 0.9, canRadius, 0.5, 128);
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.95,
        roughness: 0.12,
        envMapIntensity: 2.0
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = canHeight / 2 + 0.25;
    top.castShadow = true;
    canGroup.add(top);
    
    const bottom = new THREE.Mesh(topGeometry, topMaterial);
    bottom.position.y = -(canHeight / 2 + 0.25);
    bottom.castShadow = true;
    canGroup.add(bottom);
    
    return canGroup;
}

// Animate collection cans (synchronized rotation with floating)
function animateCollection() {
    requestAnimationFrame(animateCollection);
    
    const time = Date.now() * 0.001;
    
    collectionCans.forEach(can => {
        if (can.userData) {
            // Synchronized slow rotation
            can.rotation.y += 0.0012;
            can.rotation.x = Math.sin(time * 0.18 + can.userData.floatOffset) * 0.05;
            
            // Soft floating
            const float = Math.sin(time * 0.25 + can.userData.floatOffset) * 0.08;
            can.position.y = can.userData.baseY + float;
            
            // Subtle tilt
            can.rotation.z = Math.cos(time * 0.15 + can.userData.floatOffset) * 0.01;
        }
    });
    
    // Scroll parallax for collection camera
    collectionCamera.position.y = 2 + scrollY * 0.001;
    
    collectionRenderer.render(collectionScene, collectionCamera);
}

// Scroll tracking for parallax
window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initHeroCan();
    initCollection();
});

// Remove old code
console.log('🥤 Premium Coca-Cola Website Loaded - Official Brand Experience 🥤');
