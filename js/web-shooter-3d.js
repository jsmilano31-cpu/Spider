(() => {
  const canvas = document.getElementById('web-shooter-canvas');
  const host = document.querySelector('.web-shooter-3d');
  if (!canvas || !host) return;

  if (!window.THREE) {
    host.classList.add('no-webgl');
    return;
  }

  const THREE = window.THREE;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (_) {
    host.classList.add('no-webgl');
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.2, 10.2);

  const rig = new THREE.Group();
  rig.rotation.set(-0.18, -0.38, -0.13);
  rig.position.set(0, -0.05, 0);
  scene.add(rig);

  // Materials based on the supplied reference image.
  const blackMetal = new THREE.MeshStandardMaterial({
    color: 0x090d10,
    metalness: 0.92,
    roughness: 0.23
  });
  const graphite = new THREE.MeshStandardMaterial({
    color: 0x171d21,
    metalness: 0.84,
    roughness: 0.3
  });
  const steel = new THREE.MeshStandardMaterial({
    color: 0x9ca39f,
    metalness: 0.96,
    roughness: 0.18
  });
  const warmSteel = new THREE.MeshStandardMaterial({
    color: 0x8d8063,
    metalness: 0.92,
    roughness: 0.22
  });
  const cyan = new THREE.MeshStandardMaterial({
    color: 0x50f8ff,
    emissive: 0x16eaf6,
    emissiveIntensity: 2.5,
    metalness: 0.25,
    roughness: 0.2
  });
  const cyanDim = new THREE.MeshStandardMaterial({
    color: 0x1b8790,
    emissive: 0x0ed3df,
    emissiveIntensity: 1.45,
    metalness: 0.45,
    roughness: 0.25
  });
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xff6a2a,
    emissive: 0xff2014,
    emissiveIntensity: 2.2,
    metalness: 0.35,
    roughness: 0.2
  });
  const darkRed = new THREE.MeshStandardMaterial({
    color: 0x4c0d12,
    metalness: 0.6,
    roughness: 0.34
  });

  const cyanLine = new THREE.LineBasicMaterial({
    color: 0x5efaff,
    transparent: true,
    opacity: 0.92
  });

  function extrudedPlate(points, depth, material, z = 0, bevel = 0.05) {
    const shape = new THREE.Shape();
    shape.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: bevel,
      bevelThickness: bevel * 0.65
    });
    geo.center();
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.z = z;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function addEdges(mesh, material = cyanLine, threshold = 18, scale = 1.006) {
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, threshold), material);
    edges.position.copy(mesh.position);
    edges.rotation.copy(mesh.rotation);
    edges.scale.copy(mesh.scale).multiplyScalar(scale);
    mesh.parent?.add(edges);
    return edges;
  }

  function box(w, h, d, material, x = 0, y = 0, z = 0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function cylinder(radius, length, material, x = 0, y = 0, z = 0, axis = 'z', sides = 32) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, sides), material);
    if (axis === 'z') mesh.rotation.x = Math.PI / 2;
    if (axis === 'x') mesh.rotation.z = Math.PI / 2;
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    return mesh;
  }

  function tubeBetween(a, b, radius, material) {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 14), material);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    mesh.castShadow = true;
    return mesh;
  }

  const device = new THREE.Group();
  device.scale.setScalar(1.02);
  rig.add(device);

  // Long tapered wrist chassis — the most important silhouette in the reference.
  const chassisPts = [
    [-1.15, -2.45], [-1.34, -1.65], [-1.22, -0.72], [-0.93, 0.28],
    [-0.62, 1.08], [-0.3, 1.72], [0, 2.05], [0.3, 1.72],
    [0.62, 1.08], [0.93, 0.28], [1.22, -0.72], [1.34, -1.65], [1.15, -2.45]
  ];
  const chassis = extrudedPlate(chassisPts, 0.56, blackMetal, 0, 0.08);
  chassis.scale.x = 0.92;
  device.add(chassis);
  addEdges(chassis);

  // Raised central black panel.
  const centerPanelPts = [
    [-0.56, -1.78], [-0.72, -0.92], [-0.55, 0.05], [-0.28, 0.86],
    [0, 1.28], [0.28, 0.86], [0.55, 0.05], [0.72, -0.92], [0.56, -1.78]
  ];
  const centerPanel = extrudedPlate(centerPanelPts, 0.35, graphite, 0.47, 0.035);
  centerPanel.scale.x = 0.92;
  device.add(centerPanel);
  addEdges(centerPanel, cyanLine, 12, 1.01);

  // Angular silver/gold armor rails visible on both sides of the reference.
  const leftArmor = extrudedPlate([
    [-1.24,-1.7],[-1.48,-1.3],[-1.36,-0.25],[-1.02,0.55],[-0.63,1.2],[-0.52,.75],[-.84,.15],[-1.05,-.72],[-.96,-1.55]
  ], 0.24, warmSteel, 0.38, 0.035);
  const rightArmor = leftArmor.clone();
  rightArmor.scale.x = -1;
  device.add(leftArmor, rightArmor);

  // Additional bright metal blades close to the upper/palm side.
  const bladeL = extrudedPlate([
    [-0.78,.42],[-1.18,.68],[-.82,1.3],[-.35,1.74],[-.26,1.43],[-.55,1.03]
  ], 0.18, steel, 0.63, 0.025);
  const bladeR = bladeL.clone();
  bladeR.scale.x = -1;
  device.add(bladeL, bladeR);

  // Cyan circuit tracks: segmented luminous rails instead of generic neon strips.
  const tracks = [
    [[-0.68,-1.65,0.72],[-0.82,-0.78,0.72],[-0.58,0.05,0.72],[-0.31,.72,0.72]],
    [[0.68,-1.65,0.72],[0.82,-0.78,0.72],[0.58,0.05,0.72],[0.31,.72,0.72]],
    [[-0.34,-1.42,0.75],[-0.42,-.66,0.75],[-.2,-.15,0.75]],
    [[0.34,-1.42,0.75],[0.42,-.66,0.75],[.2,-.15,0.75]]
  ];
  tracks.forEach(path => {
    for (let i = 0; i < path.length - 1; i++) device.add(tubeBetween(path[i], path[i + 1], 0.035, cyan));
  });

  // Small cyan nodes/fasteners.
  [[-.7,-1.45],[.7,-1.45],[-.57,-.25],[.57,-.25],[-.36,.64],[.36,.64]].forEach(([x,y]) => {
    const node = cylinder(0.085, 0.055, cyan, x, y, 0.79, 'z', 20);
    device.add(node);
  });

  // Central red/orange mechanical core, framed by cyan.
  const coreHousing = extrudedPlate([
    [-.38,-.18],[-.48,.18],[-.22,.48],[.22,.48],[.48,.18],[.38,-.18],[0,-.42]
  ], .23, blackMetal, .77, .025);
  device.add(coreHousing);
  addEdges(coreHousing, cyanLine, 10, 1.02);

  const coreRing = new THREE.Mesh(new THREE.TorusGeometry(.215,.055,12,28), cyan);
  coreRing.position.set(0,.1,.98);
  device.add(coreRing);
  const core = cylinder(.115,.075,coreMat,0,.1,1.01,'z',24);
  device.add(core);

  // Rear cartridge spine visible near wrist end.
  const cartridge = box(0.62, 1.02, 0.5, graphite, 0, -2.34, 0.34);
  cartridge.rotation.z = 0.02;
  device.add(cartridge);
  const cartridgeGlow = box(0.09, .72, .04, cyanDim, 0, -2.32, .63);
  device.add(cartridgeGlow);

  // Narrow palm extension: two cyan-lit struts climb from the gauntlet to the palm disc.
  device.add(tubeBetween([-.23,1.68,.55],[-.16,2.55,.57],.075,steel));
  device.add(tubeBetween([ .23,1.68,.55],[ .16,2.55,.57],.075,steel));
  device.add(tubeBetween([-.15,1.82,.67],[-.08,2.48,.69],.025,cyan));
  device.add(tubeBetween([ .15,1.82,.67],[ .08,2.48,.69],.025,cyan));

  // Circular palm trigger / activator from the top of the reference image.
  const palmAssembly = new THREE.Group();
  palmAssembly.position.set(0, 2.73, 0.6);
  const palmOuter = new THREE.Mesh(new THREE.TorusGeometry(.34,.105,14,36), graphite);
  palmAssembly.add(palmOuter);
  const palmGlow = new THREE.Mesh(new THREE.TorusGeometry(.245,.042,12,32), cyan);
  palmGlow.position.z = .04;
  palmAssembly.add(palmGlow);
  const palmDisc = cylinder(.18,.09,blackMetal,0,0,.03,'z',28);
  palmAssembly.add(palmDisc);
  const palmCenter = cylinder(.078,.105,cyan,0,0,.09,'z',22);
  palmAssembly.add(palmCenter);
  device.add(palmAssembly);

  // Short lateral mechanical blocks and bolts.
  [-1,1].forEach(side => {
    const block = box(.32,.52,.34,steel,side*.96,-.78,.56);
    block.rotation.z = side*.15;
    device.add(block);
    const bolt = cylinder(.09,.07,darkRed,side*.98,-.76,.76,'z',18);
    device.add(bolt);
  });

  // Reference-like glow pooling around the mechanism.
  const glowPlane = new THREE.Mesh(
    new THREE.CircleGeometry(3.25, 64),
    new THREE.MeshBasicMaterial({ color:0x0bf2ff, transparent:true, opacity:.035, depthWrite:false })
  );
  glowPlane.scale.set(1,1.45,1);
  glowPlane.position.set(0,0,-1.0);
  scene.add(glowPlane);

  // Cinematic light setup: neutral metal highlights + cyan technological light + red suit spill.
  scene.add(new THREE.HemisphereLight(0xbac8cd, 0x060708, .62));
  const key = new THREE.DirectionalLight(0xffffff, 2.35);
  key.position.set(3.5, 5.5, 7);
  scene.add(key);

  const cyanLight = new THREE.PointLight(0x26f5ff, 3.25, 11);
  cyanLight.position.set(-1.2, .5, 4.2);
  scene.add(cyanLight);

  const redLight = new THREE.PointLight(0xd71920, 1.75, 11);
  redLight.position.set(3.2, -2.1, 3.4);
  scene.add(redLight);

  const rim = new THREE.PointLight(0xdde9e7, 1.15, 10);
  rim.position.set(-3.5, 3.2, -3.2);
  scene.add(rim);

  let targetX = rig.rotation.x;
  let targetY = rig.rotation.y;
  let dragging = false;
  let px = 0, py = 0;
  let userInteracting = false;
  let interactionTimer;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pointerDown(e) {
    dragging = true;
    userInteracting = true;
    px = e.clientX;
    py = e.clientY;
    canvas.setPointerCapture?.(e.pointerId);
    clearTimeout(interactionTimer);
  }
  function pointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - px;
    const dy = e.clientY - py;
    px = e.clientX;
    py = e.clientY;
    targetY += dx * .0075;
    targetX += dy * .0055;
    targetX = Math.max(-.68, Math.min(.45, targetX));
  }
  function pointerUp(e) {
    dragging = false;
    canvas.releasePointerCapture?.(e.pointerId);
    interactionTimer = setTimeout(() => userInteracting = false, 1900);
  }
  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerUp);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.position.z = rect.width < 600 ? 11.3 : rect.width < 900 ? 10.8 : 10.2;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  let visible = true;
  const io = new IntersectionObserver(([entry]) => visible = entry.isIntersecting, { threshold: .02 });
  io.observe(host);

  const clock = new THREE.Clock();
  function render() {
    requestAnimationFrame(render);
    if (!visible) return;
    const t = clock.getElapsedTime();

    if (!dragging) {
      if (!userInteracting && !reduced) targetY = -.38 + Math.sin(t * .34) * .12;
      targetX += ((-.18 + (reduced ? 0 : Math.sin(t * .29) * .025)) - targetX) * .018;
    }

    rig.rotation.x += (targetX - rig.rotation.x) * .085;
    rig.rotation.y += (targetY - rig.rotation.y) * .085;
    if (!reduced) rig.position.y = -.05 + Math.sin(t * .65) * .045;

    // Subtle breathing glow inspired by the cyan illumination in the supplied image.
    if (!reduced) {
      const pulse = 2.2 + Math.sin(t * 2.1) * .45;
      cyan.emissiveIntensity = pulse;
      coreMat.emissiveIntensity = 2.05 + Math.sin(t * 2.7) * .35;
    }

    renderer.render(scene, camera);
  }
  render();
})();
