gsap.registerPlugin(ScrollTrigger);

let scene, camera, renderer, material; 
const nodes = [];

function init3DScene() {
    const canvas = document.querySelector('#webgl-canvas');
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.03);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050505, 1); 

    const geometries = [
        new THREE.BoxGeometry(1.2, 1.2, 1.2),           
        new THREE.TetrahedronGeometry(1.5, 0),          
        new THREE.TorusGeometry(1, 0.3, 16, 32),        
        new THREE.OctahedronGeometry(1.5, 0),           
        new THREE.IcosahedronGeometry(1.2, 0)           
    ];

    material = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true });

    for (let i = 0; i < 60; i++) {
        const randomGeo = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(randomGeo, material);
        
        mesh.position.x = (Math.random() - 0.5) * 40;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 1) * 120; 
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        const scale = Math.random() * 1.5 + 0.5;
        mesh.scale.set(scale, scale, scale);
        
        // Track the original Y position for the gravity effect
        mesh.userData = {
            originalY: mesh.position.y,
            isFallen: false
        };
        
        scene.add(mesh);
        nodes.push(mesh);
    }

    camera.position.set(0, 0, 10);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    tl.to(camera.position, { z: -15, x: 5, ease: "power1.inOut" }, "step1")
      .to(camera.rotation, { y: 0.15, ease: "power1.inOut" }, "step1");
    tl.to(camera.position, { z: -35, x: -5, ease: "power1.inOut" }, "step2")
      .to(camera.rotation, { y: -0.15, ease: "power1.inOut" }, "step2");
    tl.to(camera.position, { z: -55, x: 5, ease: "power1.inOut" }, "step3")
      .to(camera.rotation, { y: 0.15, ease: "power1.inOut" }, "step3");
    tl.to(camera.position, { z: -80, x: 0, ease: "power1.inOut" }, "step4")
      .to(camera.rotation, { y: 0, ease: "power1.inOut" }, "step4");

    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        nodes.forEach((node, index) => {
            node.rotation.y += 0.002;
            node.rotation.x += 0.001;
            
            // Only apply the float effect if they haven't fallen
            if (!node.userData.isFallen) {
                node.position.y += Math.sin(elapsedTime + index) * 0.002;
            }
        });

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Gravity Trigger Function
window.isGravityActive = false;
window.toggleGravity = function() {
    window.isGravityActive = !window.isGravityActive;
    
    nodes.forEach((node) => {
        if (window.isGravityActive) {
            node.userData.isFallen = true;
            // Plunge down off the screen
            gsap.to(node.position, {
                y: -100 - (Math.random() * 50), 
                duration: 1 + Math.random(),
                ease: "power2.in"
            });
        } else {
            // Bounce back up to original positions
            gsap.to(node.position, {
                y: node.userData.originalY,
                duration: 2 + Math.random(),
                ease: "back.out(1.2)",
                onComplete: () => { node.userData.isFallen = false; }
            });
        }
    });
};

window.update3DTheme = function(isLight) {
    if (!scene || !renderer || !material) return;
    const bgColor = isLight ? 0xf0f4f8 : 0x050505;
    scene.fog.color.setHex(bgColor);
    renderer.setClearColor(bgColor, 1);
    
    const shapeColor = isLight ? 0x000000 : 0x00f2fe;
    material.color.setHex(shapeColor);
};