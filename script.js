// Three.js Scene Setup for photorealistic rendering
let heroScene, heroCamera, heroRenderer, heroCan;
let collectionScene, collectionCamera, collectionRenderer;
let collectionCans = [];
let brandScenes = {};
let envMap;

// Mouse tracking for interactive can rotation
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

// Track mouse movement for interactive effects
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Initialize Hero Can
function initHeroCan() {
    const container = document.getElementById('hero-can-container');
    if (!container) return;
    
    heroScene = new THREE.Scene();
    heroScene.background = null;
    heroScene.fog = new THREE.Fog(0x000000, 20, 50);
    heroCamera = new THREE.PerspectiveCamera(
        28,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    heroCamera.position.set(0, 2, 25);
    
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
    
    // Studio lighting
    const keyLight = new THREE.SpotLight(0xffffff, 5.0, 50, Math.PI / 8, 0.3);
    keyLight.position.set(-12, 18, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    heroScene.add(keyLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.5);
    rimLight.position.set(10, 6, -12);
    heroScene.add(rimLight);
    
    const fillLight = new THREE.AmbientLight(0xffffff, 0.6);
    heroScene.add(fillLight);
    
    // Environment
    const pmremGenerator = new THREE.PMREMGenerator(heroRenderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0xffffff);
    const envLight = new THREE.AmbientLight(0xffffff, 1);
    envScene.add(envLight);
    heroScene.environment = pmremGenerator.fromScene(envScene).texture;
    
    // Create hero can
    heroCan = createCan(0xdc143c, 0x8b1a1a, 'Coca-Cola', '#ffffff');
    heroCan.rotation.y = 0.3;
    heroScene.add(heroCan);
    
    // Window resize
    window.addEventListener('resize', () => {
        heroCamera.aspect = container.clientWidth / container.clientHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animateHero();
}

// Animate hero can with enhanced smooth floating motion
function animateHero() {
    if (!heroCan || !heroRenderer || !heroScene || !heroCamera) return;
    
    requestAnimationFrame(animateHero);
    
    const time = Date.now() * 0.001;
    
    // Smooth continuous rotation with subtle speed variation
    heroCan.rotation.y += 0.008 + Math.sin(time * 0.5) * 0.002;
    
    // Mouse-interactive rotation (lerp for smooth following)
    targetRotationX = mouseY * 0.3;
    targetRotationY = mouseX * 0.3;
    
    // Multi-axis organic tilting with mouse interaction
    heroCan.rotation.x += (targetRotationX + Math.sin(time * 0.3) * 0.1 - heroCan.rotation.x) * 0.05;
    heroCan.rotation.z += (targetRotationY * 0.5 + Math.cos(time * 0.4) * 0.06 - heroCan.rotation.z) * 0.05;
    
    // Enhanced vertical floating with multiple wave frequencies
    heroCan.position.y = Math.sin(time * 0.5) * 0.08 + Math.cos(time * 0.3) * 0.04;
    
    // Subtle horizontal drift for more dynamic motion
    heroCan.position.x = Math.sin(time * 0.25) * 0.03 + mouseX * 0.1;
    
    // Scale pulsing for breathing effect
    const scaleVariation = 1 + Math.sin(time * 0.7) * 0.02;
    heroCan.scale.set(scaleVariation, scaleVariation, scaleVariation);
    
    heroRenderer.render(heroScene, heroCamera);
}

// Initialize Premium Collection Showcase
function initCollection() {
    const container = document.getElementById('collection-container');
    if (!container) return;
    
    collectionScene = new THREE.Scene();
    collectionScene.background = null;
    
    const aspect = container.clientWidth / container.clientHeight;
    collectionCamera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    collectionCamera.position.set(0, 3, 35);
    collectionCamera.lookAt(0, 0, 0);
    
    collectionRenderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    collectionRenderer.setSize(container.clientWidth, container.clientHeight);
    collectionRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    collectionRenderer.setClearColor(0x000000, 0);
    collectionRenderer.physicallyCorrectLights = true;
    collectionRenderer.outputEncoding = THREE.sRGBEncoding;
    collectionRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    collectionRenderer.toneMappingExposure = 1.3;
    container.appendChild(collectionRenderer.domElement);
    
    // Lighting setup
    const keyLight = new THREE.SpotLight(0xffffff, 4.5, 60, Math.PI / 8, 0.3);
    keyLight.position.set(-15, 20, 15);
    keyLight.castShadow = true;
    collectionScene.add(keyLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    rimLight.position.set(12, 8, -10);
    collectionScene.add(rimLight);
    
    const fillLight = new THREE.AmbientLight(0xffffff, 0.7);
    collectionScene.add(fillLight);
    
    const accentLight = new THREE.PointLight(0xdc143c, 2.5, 50);
    accentLight.position.set(0, 10, 20);
    collectionScene.add(accentLight);
    
    // Environment
    const pmremGenerator = new THREE.PMREMGenerator(collectionRenderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0xffffff);
    const envLight = new THREE.AmbientLight(0xffffff, 1);
    envScene.add(envLight);
    collectionScene.environment = pmremGenerator.fromScene(envScene).texture;
    
    // Create cans for collection - circular arrangement
    const canConfigs = [
        { color: 0xb31b1b, metalColor: 0x6b0000, name: 'Coca-Cola', labelColor: '#ffffff', angle: 0 },
        { color: 0x0d8a3a, metalColor: 0x085c26, name: 'Sprite', labelColor: '#ffff00', angle: Math.PI * 0.4 },
        { color: 0x152d6b, metalColor: 0x9a9a9a, name: 'Red Bull', labelColor: '#ffd700', angle: Math.PI * 0.8 },
        { color: 0xd87000, metalColor: 0xa05500, name: 'Fanta', labelColor: '#ffffff', angle: Math.PI * 1.2 },
        { color: 0x003d7a, metalColor: 0x001f3d, name: 'Pepsi', labelColor: '#ffffff', angle: Math.PI * 1.6 }
    ];
    
    const orbitRadius = 14;
    
    canConfigs.forEach((config, index) => {
        const can = createCan(config.color, config.metalColor, config.name, config.labelColor);
        const x = Math.cos(config.angle) * orbitRadius;
        const z = Math.sin(config.angle) * orbitRadius;
        can.position.set(x, 0, z);
        can.rotation.y = -config.angle + Math.PI / 2;
        can.userData = { 
            baseY: 0,
            baseAngle: config.angle,
            orbitRadius: orbitRadius,
            rotationSpeed: 0.002,
            floatOffset: index * Math.PI * 0.4,
            floatSpeed: 0.5 + Math.random() * 0.3
        };
        collectionScene.add(can);
        collectionCans.push(can);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        collectionCamera.aspect = width / height;
        collectionCamera.updateProjectionMatrix();
        collectionRenderer.setSize(width, height);
    });
    
    animateCollection();
}

// Animate collection cans
function animateCollection() {
    if (!collectionRenderer || !collectionScene || !collectionCamera) return;
    
    requestAnimationFrame(animateCollection);
    
    const time = Date.now() * 0.001;
    
    collectionCans.forEach((can, index) => {
        if (!can) return;
        
        // Circular orbit animation
        const orbitSpeed = 0.15;
        const currentAngle = can.userData.baseAngle + time * orbitSpeed;
        const x = Math.cos(currentAngle) * can.userData.orbitRadius;
        const z = Math.sin(currentAngle) * can.userData.orbitRadius;
        
        // Wave-like vertical motion
        const waveY = Math.sin(time * can.userData.floatSpeed + can.userData.floatOffset) * 1.5;
        const waveY2 = Math.cos(time * 0.3 + index) * 0.5;
        
        can.position.x = x;
        can.position.y = can.userData.baseY + waveY + waveY2;
        can.position.z = z;
        
        // Rotate can to face center and add spin
        can.rotation.y = -currentAngle + Math.PI / 2 + time * can.userData.rotationSpeed;
        
        // Dynamic tilt based on position in orbit
        can.rotation.x = Math.sin(currentAngle + time * 0.4) * 0.15;
        can.rotation.z = Math.cos(currentAngle + time * 0.3) * 0.1;
        
        // Scale pulse for emphasis
        const scale = 1 + Math.sin(time * 0.8 + can.userData.floatOffset) * 0.05;
        can.scale.set(scale, scale, scale);
    });
    
    // Camera subtle movement for dynamic feel
    collectionCamera.position.x = Math.sin(time * 0.1) * 2;
    collectionCamera.position.y = 3 + Math.cos(time * 0.15) * 1;
    collectionCamera.lookAt(0, 0, 0);
    
    collectionRenderer.render(collectionScene, collectionCamera);
}

// Create HDR-like environment map
function createEnvironmentMap() {
    const pmremGenerator = new THREE.PMREMGenerator(showcaseRenderer);
    
    // Create a simple environment scene
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0xffffff);
    
    // Add lights to environment
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1);
    envScene.add(light1);
    
    const light2 = new THREE.AmbientLight(0xffffff, 0.5);
    envScene.add(light2);
    
    envMap = pmremGenerator.fromScene(envScene).texture;
    showcaseScene.environment = envMap;
}

// Low-key dramatic studio lighting for premium dark look
function setupStudioLighting() {
    // Key light (narrow softbox from top-left) - creates dramatic highlight streak
    const keyLight = new THREE.SpotLight(0xfff8f0, 3.5, 60, Math.PI / 8, 0.3);
    keyLight.position.set(-15, 22, 12);
    keyLight.castShadow = true;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 100;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    showcaseScene.add(keyLight);
    
    // Strong rim light for silhouette separation (essential for dark backgrounds)
    const rimLight = new THREE.DirectionalLight(0xe8f4ff, 2.8);
    rimLight.position.set(12, 8, -15);
    showcaseScene.add(rimLight);
    
    // Minimal fill light (controlled shadows, no crushed blacks)
    const fillLight = new THREE.AmbientLight(0xffffff, 0.35);
    showcaseScene.add(fillLight);
    
    // Accent rim from opposite side for metallic edge definition
    const accentRim = new THREE.DirectionalLight(0xd4af37, 1.2);
    accentRim.position.set(-10, 4, -12);
    showcaseScene.add(accentRim);
    
    // Subtle top highlight for aluminum reflectivity
    const topLight = new THREE.PointLight(0xffffff, 0.8, 40);
    topLight.position.set(0, 25, 0);
    showcaseScene.add(topLight);
    
    // Ground plane for natural shadows
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.15 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    ground.receiveShadow = true;
    showcaseScene.add(ground);
}

// Create showcase cans
function createShowcaseCans() {
    const canConfigs = [
        { color: 0x4a0a0a, name: 'Coca-Cola', labelColor: '#f5f5f5' },      // Deep cherry red
        { color: 0x0d3a25, name: 'Sprite', labelColor: '#f5f5f5' },          // Deep emerald green
        { color: 0x0a1540, name: 'Red Bull', labelColor: '#d4af37' },        // Midnight blue
        { color: 0x3a2010, name: 'Fanta', labelColor: '#f5f5f5' },           // Deep burnt orange
        { color: 0x0a1530, name: 'Pepsi', labelColor: '#f5f5f5' },           // Deep navy
    ];
    
    const positions = [
        [-6, 0, 0],
        [-2, 1.5, 2],
        [2, -1, -1],
        [6, 0.5, 1],
        [0, -2, 3]
    ];
    
    canConfigs.forEach((config, index) => {
        const can = createCan(config.color, 0xdddddd, config.name, config.labelColor);
        can.position.set(...positions[index]);
        can.rotation.z = (Math.random() - 0.5) * 0.1;
        can.userData = {
            baseY: positions[index][1],
            floatOffset: Math.random() * Math.PI * 2
        };
        showcaseScene.add(can);
    });
}

// Create ultra-photorealistic 330ml aluminum can with exact real-world dimensions
function createCan(bodyColor, metalColor, brandName, labelColor) {
    const canGroup = new THREE.Group();
    canGroup.castShadow = true;
    canGroup.receiveShadow = true;
    
    // Create 4K label texture for ultra-high detail
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Professional gradient background matching real can lacquer finish
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    const colorHex = `#${bodyColor.toString(16).padStart(6, '0')}`;
    gradient.addColorStop(0, shadeColor(colorHex, 15));
    gradient.addColorStop(0.35, shadeColor(colorHex, 5));
    gradient.addColorStop(0.65, colorHex);
    gradient.addColorStop(1, shadeColor(colorHex, -10));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Subtle texture for aluminum surface imperfections
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    for (let i = 0; i < 800; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }
    
    // Main brand logo - authentic commercial typography
    ctx.save();
    ctx.fillStyle = labelColor || '#ffffff';
    ctx.font = 'bold 520px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Add strong outline for better readability
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = 18;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.strokeText(brandName, canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText(brandName, canvas.width / 2, canvas.height / 2 - 100);
    ctx.restore();
    
    // Brand tagline in script style
    ctx.save();
    ctx.font = 'italic bold 380px Georgia, serif';
    ctx.fillStyle = labelColor;
    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 12;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 15;
    ctx.strokeText(brandName, canvas.width / 2, canvas.height / 2 + 300);
    ctx.fillText(brandName, canvas.width / 2, canvas.height / 2 + 300);
    ctx.restore();
    
    // Authentic nutritional facts panel
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 3;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'left';
    ctx.strokeText('NUTRITION FACTS', 100, canvas.height - 380);
    ctx.fillText('NUTRITION FACTS', 100, canvas.height - 380);
    ctx.font = '38px Arial';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.strokeText('Serving Size: 330ml', 100, canvas.height - 330);
    ctx.fillText('Serving Size: 330ml', 100, canvas.height - 330);
    ctx.strokeText('Calories: 140', 100, canvas.height - 290);
    ctx.fillText('Calories: 140', 100, canvas.height - 290);
    ctx.strokeText('Total Carbs: 39g', 100, canvas.height - 250);
    ctx.fillText('Total Carbs: 39g', 100, canvas.height - 250);
    ctx.strokeText('Sugars: 39g', 100, canvas.height - 210);
    ctx.fillText('Sugars: 39g', 100, canvas.height - 210);
    
    // Volume and quality information
    ctx.font = 'bold 52px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 3;
    ctx.strokeText('330ml ℮', 100, canvas.height - 150);
    ctx.fillText('330ml ℮', 100, canvas.height - 150);
    ctx.font = 'bold 32px Arial';
    ctx.lineWidth = 2;
    ctx.strokeText('PREMIUM QUALITY • BEST SERVED CHILLED', 100, canvas.height - 100);
    ctx.fillText('PREMIUM QUALITY • BEST SERVED CHILLED', 100, canvas.height - 100);
    
    // Realistic barcode with proper spacing
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    const barcodeX = canvas.width - 800;
    const barcodeY = canvas.height - 420;
    for (let i = 0; i < 60; i++) {
        const width = (i % 5 === 0 || i % 7 === 0) ? 12 : 6;
        ctx.fillRect(barcodeX + i * 11, barcodeY, width, 160);
    }
    ctx.font = '32px monospace';
    ctx.fillText('5 449000 054227', barcodeX + 50, barcodeY + 190);
    
    // Recycling and quality icons
    ctx.font = 'bold 45px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.textAlign = 'right';
    ctx.fillText('♻', canvas.width - 100, canvas.height - 150);
    ctx.font = '24px Arial';
    ctx.fillText('RECYCLABLE', canvas.width - 140, canvas.height - 150);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = 1;
    texture.anisotropy = 16;
    texture.encoding = THREE.sRGBEncoding;
    
    // Real-world 330ml can dimensions: 115mm height, 66mm diameter
    // Scale: 1 unit = 1cm, so radius = 3.3cm, height = 11.5cm
    const canRadius = 3.3;
    const canHeight = 11.5;
    
    // Can body - vibrant matte-to-gloss premium finish with enhanced color
    const bodyGeometry = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 256);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.85,
        roughness: 0.22,
        envMapIntensity: 2.0,
        emissive: bodyColor,
        emissiveIntensity: 0.25,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
        color: new THREE.Color(bodyColor).multiplyScalar(1.3)
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    canGroup.add(body);
    
    // Top rim - dark aluminum with controlled gloss
    const topGeometry = new THREE.CylinderGeometry(canRadius * 0.90, canRadius, 0.6, 256);
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        metalness: 0.95,
        roughness: 0.15,
        envMapIntensity: 2.0,
        clearcoat: 0.6,
        clearcoatRoughness: 0.12
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = canHeight / 2 + 0.3;
    top.castShadow = true;
    canGroup.add(top);
    
    // Pull tab assembly with rivet detail
    const tabGroup = new THREE.Group();
    
    // Tab base (opening mechanism)
    const tabGeometry = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 128);
    const tabMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a4a4a,
        metalness: 0.92,
        roughness: 0.18,
        envMapIntensity: 1.8
    });
    const tab = new THREE.Mesh(tabGeometry, tabMaterial);
    tab.castShadow = true;
    
    // Pull ring
    const ringGeometry = new THREE.TorusGeometry(0.45, 0.08, 24, 64);
    const ring = new THREE.Mesh(ringGeometry, tabMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    
    // Rivet detail (center attachment point)
    const rivetGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 32);
    const rivet = new THREE.Mesh(rivetGeometry, tabMaterial);
    rivet.position.y = 0.08;
    
    tabGroup.add(tab);
    tabGroup.add(ring);
    tabGroup.add(rivet);
    tabGroup.position.y = canHeight / 2 + 0.65;
    canGroup.add(tabGroup);
    
    // Bottom rim with dome profile
    const bottomGeometry = new THREE.CylinderGeometry(canRadius * 1.02, canRadius, 0.5, 256);
    const bottom = new THREE.Mesh(bottomGeometry, topMaterial);
    bottom.position.y = -(canHeight / 2 + 0.25);
    bottom.castShadow = true;
    canGroup.add(bottom);
    
    // Condensation droplets
    addCondensation(canGroup, bodyColor);
    
    return canGroup;
}

// Add ultra-realistic water condensation with surface tension physics
function addCondensation(canGroup, baseColor) {
    const canRadius = 3.3;
    const canHeight = 11.5;
    
    // Create varied droplet sizes for realism
    const dropletSizes = [
        { size: 0.08, count: 25, opacity: 0.85 },  // Large droplets
        { size: 0.05, count: 40, opacity: 0.75 },  // Medium droplets
        { size: 0.025, count: 60, opacity: 0.65 }, // Small droplets
        { size: 0.012, count: 80, opacity: 0.55 }  // Tiny droplets (mist)
    ];
    
    dropletSizes.forEach(({ size, count, opacity }) => {
        const dropletGeometry = new THREE.SphereGeometry(size, 32, 32);
        const dropletMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd5e8f5,
            metalness: 0.0,
            roughness: 0.02,
            transparent: true,
            opacity: opacity,
            envMapIntensity: 4.5,
            transmission: 0.95,
            thickness: size * 2,
            ior: 1.33,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05
        });
        
        // Create random droplets with gravity effect (more at bottom)
        for (let i = 0; i < count; i++) {
            const droplet = new THREE.Mesh(dropletGeometry, dropletMaterial);
            
            // Random position with gravity bias
            const angle = Math.random() * Math.PI * 2;
            const heightBias = Math.pow(Math.random(), 1.5); // More droplets toward bottom
            const height = (heightBias - 0.5) * canHeight * 0.85;
            const radius = canRadius + 0.03;
            
            droplet.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            // Natural size variation with surface tension effect
            const sizeVariation = 0.8 + Math.random() * 0.4;
            droplet.scale.set(sizeVariation, sizeVariation * 1.3, sizeVariation);
            droplet.castShadow = true;
            
            canGroup.add(droplet);
        }
    });
    
    // Add subtle fingerprint marks (smudges)
    const smudgeGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const smudgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x999999,
        metalness: 0.3,
        roughness: 0.7,
        transparent: true,
        opacity: 0.08,
        depthWrite: false
    });
    
    // Add 2-3 fingerprint areas
    for (let i = 0; i < 3; i++) {
        const smudge = new THREE.Mesh(smudgeGeometry, smudgeMaterial);
        const angle = (i * Math.PI * 0.7) + Math.random() * 0.3;
        smudge.position.set(
            Math.cos(angle) * (canRadius + 0.01),
            -1 + Math.random() * 2,
            Math.sin(angle) * (canRadius + 0.01)
        );
        smudge.scale.set(1, 0.8, 0.1);
        canGroup.add(smudge);
    }
}

// Helper function to darken colors
function shadeColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
        (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
        .toString(16).slice(1);
}

// Animation loop for showcase with cinematic easing
function animateShowcase() {
    requestAnimationFrame(animateShowcase);
    
    const time = Date.now() * 0.001;
    
    showcaseScene.children.forEach(child => {
        if (child.userData.baseY !== undefined) {
            // Asymmetrical rotation combining Y-axis (primary) and X-axis (subtle tilt)
            // Creates organic, non-mechanical motion with natural momentum
            child.rotation.y += 0.0015;
            child.rotation.x = Math.sin(time * 0.2 + child.userData.floatOffset) * 0.08;
            
            // Minimal vertical float (2-4mm range for realism)
            const float = Math.sin(time * 0.25 + child.userData.floatOffset) * 0.03;
            const targetY = child.userData.baseY + float;
            child.position.y += (targetY - child.position.y) * 0.03;
            
            // Subtle Z-axis tilt for natural inertia
            child.rotation.z = Math.sin(time * 0.18 + child.userData.floatOffset) * 0.015;
        }
    });
    
    // Gentle parallax camera movement for cinematic feel
    showcaseCamera.position.x = Math.sin(time * 0.08) * 1.5;
    showcaseCamera.position.y = 2 + Math.cos(time * 0.12) * 0.8;
    showcaseCamera.lookAt(0, 0, 0);
    
    showcaseRenderer.render(showcaseScene, showcaseCamera);
}

// Create individual brand section cans
function initBrandCans() {
    const brands = [
        { id: 'coca-cola', color: 0xb31b1b, metalColor: 0x6b0000, name: 'Coca-Cola', labelColor: '#ffffff', accentColor: 0xdc143c },
        { id: 'sprite', color: 0x0d8a3a, metalColor: 0x085c26, name: 'Sprite', labelColor: '#ffff00', accentColor: 0x10b851 },
        { id: 'redbull', color: 0x152d6b, metalColor: 0x9a9a9a, name: 'Red Bull', labelColor: '#ffd700', accentColor: 0x2563eb },
        { id: 'fanta', color: 0xd87000, metalColor: 0xa05500, name: 'Fanta', labelColor: '#ffffff', accentColor: 0xff9500 },
        { id: 'pepsi', color: 0x003d7a, metalColor: 0x001f3d, name: 'Pepsi', labelColor: '#ffffff', accentColor: 0x0066cc }
    ];
    
    brands.forEach(brand => {
        const container = document.querySelector(`[data-brand="${brand.id}"]`);
        if (!container) return;
        
        // Create scene with transparent background
        const scene = new THREE.Scene();
        scene.background = null;
        scene.fog = new THREE.Fog(0x000000, 18, 45);
        
        // 85mm lens equivalent for product photography (narrower FOV for less distortion)
        const aspect = container.clientWidth / container.clientHeight;
        const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000);
        camera.position.set(0, -2, 28);
        camera.lookAt(0, 1, 0);
        
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance",
            precision: "highp"
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.physicallyCorrectLights = true;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        
        // Low-key dramatic lighting for luxury feel with better illumination
        const keyLight = new THREE.SpotLight(0xffffff, 6.5, 50, Math.PI / 7, 0.25);
        keyLight.position.set(-12, 18, 12);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 1;
        keyLight.shadow.camera.far = 50;
        scene.add(keyLight);
        
        const rimLight = new THREE.DirectionalLight(0xffffff, 4.0);
        rimLight.position.set(10, 6, -12);
        scene.add(rimLight);
        
        const fillLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(fillLight);
        
        const accentRim = new THREE.DirectionalLight(0xffffff, 2.5);
        accentRim.position.set(-8, 5, -10);
        scene.add(accentRim);
        
        // Brand-colored accent light
        const accent = new THREE.PointLight(brand.accentColor, 2.0, 30);
        accent.position.set(14, 6, 10);
        scene.add(accent);
        
        // Additional front fill for better visibility
        const frontFill = new THREE.DirectionalLight(0xffffff, 1.5);
        frontFill.position.set(0, 5, 15);
        scene.add(frontFill);
        
        // Ground shadow plane
        const groundGeo = new THREE.PlaneGeometry(40, 40);
        const groundMat = new THREE.ShadowMaterial({ opacity: 0.2 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -7;
        ground.receiveShadow = true;
        scene.add(ground);
        
        // Environment
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0xffffff);
        const envLight = new THREE.AmbientLight(0xffffff, 1);
        envScene.add(envLight);
        scene.environment = pmremGenerator.fromScene(envScene).texture;
        
        // Create photorealistic can
        const can = createCan(brand.color, brand.metalColor, brand.name, brand.labelColor);
        can.position.y = 2.5;
        can.rotation.y = 0.4;
        scene.add(can);
        
        // Handle window resize
        const handleResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);
        
        // Store for animation
        brandScenes[brand.id] = { scene, camera, renderer, can, handleResize };
    });
    
    // Start brand animation
    animateBrands();
}

// Animate brand cans
function animateBrands() {
    requestAnimationFrame(animateBrands);
    
    if (Object.keys(brandScenes).length === 0) return;
    
    const time = Date.now() * 0.001;
    
    Object.values(brandScenes).forEach(({ scene, camera, renderer, can }) => {
        if (!scene || !camera || !renderer || !can) return;
        
        // Asymmetrical rotation with X and Y axes for organic feel
        can.rotation.y += 0.0012;
        can.rotation.x = Math.sin(time * 0.18) * 0.06;
        // Minimal floating (2-3mm)
        const float = Math.sin(time * 0.35) * 0.025;
        can.position.y = 2.5 + float;
        // Subtle Z-axis tilt for inertia
        can.rotation.z = Math.cos(time * 0.15) * 0.012;
        renderer.render(scene, camera);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🥤 ColdTech Loading...');
    
    // Initialize hero can (optional - container may not exist)
    initHeroCan();
    
    // Initialize premium collection showcase
    initCollection();
    
    // Initialize brand cans in sections
    initBrandCans();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup button interactions
    setupBrandButtons();
    
    // Setup click-based navigation
    setupBrandNavigation();
    
    // Setup smooth scroll
    setupSmoothScroll();
    
    // Setup navbar hide on scroll
    setupNavbarAutoHide();
    
    console.log('✅ ColdTech loaded successfully!');
});

// Auto-hide navbar on scroll down
function setupNavbarAutoHide() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let scrollThreshold = 50;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Show navbar when at top
                if (scrollTop < scrollThreshold) {
                    navbar.classList.remove('hidden');
                }
                // Hide when scrolling down, show when scrolling up
                else if (scrollTop > lastScrollTop) {
                    // Scrolling down
                    navbar.classList.add('hidden');
                } else {
                    // Scrolling up
                    navbar.classList.remove('hidden');
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Smooth scroll for navigation
function setupSmoothScroll() {
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
}

// Scroll-triggered animations
function setupScrollAnimations() {
    // Brand sections are now click-activated, not scroll-based
    // Keep this function for compatibility
}

// Setup navigation click handlers to show brand sections
function setupBrandNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const brandSections = document.querySelectorAll('.brand-section');
    const heroSection = document.querySelector('.hero');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Handle home/collection navigation
            if (targetId === '#home' || targetId === '#collection') {
                // Hide all brand sections
                brandSections.forEach(section => {
                    section.classList.remove('active');
                });
                // Show hero section
                heroSection.style.display = 'flex';
                heroSection.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            
            // Handle brand section navigation
            const targetSection = document.querySelector(targetId);
            if (targetSection && targetSection.classList.contains('brand-section')) {
                // Hide hero section
                heroSection.style.display = 'none';
                
                // Hide all other brand sections
                brandSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show selected brand section
                targetSection.classList.add('active');
                
                // Get brand ID from section
                const brandId = targetId.replace('#', '');
                
                // Update renderer for this brand after a small delay to ensure display is updated
                setTimeout(() => {
                    if (brandScenes[brandId]) {
                        const { renderer, camera, scene } = brandScenes[brandId];
                        const container = document.querySelector(`[data-brand="${brandId}"]`);
                        if (container && renderer) {
                            const width = container.clientWidth;
                            const height = container.clientHeight;
                            if (width > 0 && height > 0) {
                                camera.aspect = width / height;
                                camera.updateProjectionMatrix();
                                renderer.setSize(width, height);
                                renderer.render(scene, camera);
                            }
                        }
                    }
                }, 50);
                
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// Brand button interactions
function setupBrandButtons() {
    const buttons = document.querySelectorAll('.brand-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the brand name
            const brandSection = this.closest('.brand-section');
            const brandName = brandSection.querySelector('h2').textContent;
            
            // Create notification
            createNotification(`${brandName} added to cart!`);
            
            // Button feedback
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

// Create floating notification
function createNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #a3ff12 0%, #7fcc00 100%);
        color: #0a0a0a;
        padding: 20px 35px;
        border-radius: 50px;
        font-weight: 700;
        font-size: 16px;
        z-index: 10000;
        animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 10px 40px rgba(163, 255, 18, 0.4);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced parallax effect on scroll with smooth transitions
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax with enhanced depth effect
            const heroContent = document.querySelector('.hero-content');
            const heroGlow = document.querySelector('.hero-glow');
            const scrollIndicator = document.querySelector('.scroll-indicator');
            
            if (heroContent && scrolled < window.innerHeight) {
                // Multi-layer parallax for depth
                heroContent.style.transform = `translateY(${scrolled * 0.4}px) scale(${1 - scrolled / window.innerHeight * 0.1})`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight * 1.2);
                
                if (heroGlow) {
                    heroGlow.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.2}px)`;
                    heroGlow.style.opacity = 0.4 - (scrolled / window.innerHeight * 0.3);
                }
                
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = 1 - (scrolled / (window.innerHeight * 0.3));
                }
            }
            
            // Animate sections on scroll
            const sections = document.querySelectorAll('.brand-section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
                
                if (inView) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                } else if (rect.top > window.innerHeight) {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(50px)';
                }
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

// Performance optimization - pause animation when not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive operations
    } else {
        // Resume operations
    }
});

console.log('🥤 ColdTech Loaded - Colorful theme with simple animations! 🥤');


