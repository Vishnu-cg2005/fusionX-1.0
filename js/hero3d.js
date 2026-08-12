// ==================================================
// THREE.JS HIGH-PERFORMANCE 3D CUBE SCENE
// ==================================================

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-3d-canvas');
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
        canvas: container,
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Main Group for Rotation & Parallax
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // 3. Central Red Emissive Glowing Core Cube
    const coreGeo = new THREE.BoxGeometry(1.3, 1.3, 1.3);
    const coreMat = new THREE.MeshLambertMaterial({
        color: 0xff1e38,
        emissive: 0xff1e38,
        emissiveIntensity: 2.0
    });
    const coreCube = new THREE.Mesh(coreGeo, coreMat);
    heroGroup.add(coreCube);

    // 4. Outer Wireframe Matrix Structure (Dense Complex Cube Look)
    const innerWireGeo = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    const innerWireMat = new THREE.MeshBasicMaterial({
        color: 0xff1e38,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const innerWireCube = new THREE.Mesh(innerWireGeo, innerWireMat);
    heroGroup.add(innerWireCube);

    // 5. Outer Semi-Transparent Glass Box
    const outerGeo = new THREE.BoxGeometry(2.8, 2.8, 2.8);
    const outerMat = new THREE.MeshPhongMaterial({
        color: 0x12141a,
        emissive: 0x220508,
        specular: 0xff1e38,
        shininess: 100,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
    });
    const outerCube = new THREE.Mesh(outerGeo, outerMat);
    heroGroup.add(outerCube);

    // 6. External Red Edge Outline
    const edgesGeo = new THREE.EdgesGeometry(outerGeo);
    const edgesMat = new THREE.LineBasicMaterial({
        color: 0xff3b53,
        linewidth: 2
    });
    const wireFrameEdges = new THREE.LineSegments(edgesGeo, edgesMat);
    heroGroup.add(wireFrameEdges);

    // 7. HUD Technical Concentric Rings
    const createHudRing = (radius, color, opacity) => {
        const ringGeo = new THREE.RingGeometry(radius, radius + 0.03, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: opacity
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.3;
        return ring;
    };

    const hudRing1 = createHudRing(2.4, 0xff1e38, 0.7);
    const hudRing2 = createHudRing(3.1, 0x555555, 0.4);
    heroGroup.add(hudRing1);
    heroGroup.add(hudRing2);

    // 8. Orbiting Mini Floating Cubes Grid
    const miniCubesGroup = new THREE.Group();
    heroGroup.add(miniCubesGroup);

    const miniGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const miniMat = new THREE.MeshLambertMaterial({
        color: 0xff1e38,
        emissive: 0xff1e38,
        emissiveIntensity: 1.5
    });

    const miniCubeData = [];
    const count = 24;

    for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(miniGeo, miniMat);
        const radius = 2.2 + Math.random() * 1.5;
        const angle = (i / count) * Math.PI * 2;
        const speed = 0.003 + Math.random() * 0.008;
        const yOffset = (Math.random() - 0.5) * 2.5;

        mesh.position.set(
            Math.cos(angle) * radius,
            yOffset,
            Math.sin(angle) * radius
        );

        miniCubesGroup.add(mesh);
        miniCubeData.push({ mesh, radius, angle, speed });
    }

    // 9. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff1e38, 4, 15);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // 10. Mouse Interactive Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // 11. Animation Render Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Parallax easing
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Rotations
        heroGroup.rotation.y = elapsedTime * 0.25 + targetX * 0.4;
        heroGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.15 + targetY * 0.4;

        innerWireCube.rotation.y = -elapsedTime * 0.3;
        innerWireCube.rotation.z = elapsedTime * 0.15;

        hudRing1.rotation.z = elapsedTime * 0.5;
        hudRing2.rotation.z = -elapsedTime * 0.3;

        // Core Pulse
        coreMat.emissiveIntensity = 1.8 + Math.sin(elapsedTime * 3) * 0.7;

        // Orbiting Mini Cubes Motion
        miniCubeData.forEach((item) => {
            item.angle += item.speed;
            item.mesh.position.x = Math.cos(item.angle) * item.radius;
            item.mesh.position.z = Math.sin(item.angle) * item.radius;
            item.mesh.rotation.x += 0.02;
            item.mesh.rotation.y += 0.02;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Canvas Resize Handler
    function handleResize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width === 0 || height === 0) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});