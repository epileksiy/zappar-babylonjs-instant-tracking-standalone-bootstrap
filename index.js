// Setup BabylonJS in the usual way
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true
});

const scene = new BABYLON.Scene(engine);
const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

// Setup a Zappar camera instead of one of Babylon's cameras
const camera = new ZapparBabylon.Camera('camera', scene);

// Request the necessary permission from the user
ZapparBabylon.permissionRequestUI().then((granted) => {
    if (granted) camera.start();
    else ZapparBabylon.permissionDeniedUI();
});

const instantWorldTracker = new ZapparBabylon.InstantWorldTracker();
const trackerTransformNode = new ZapparBabylon.InstantWorldAnchorTransformNode('tracker', camera, instantWorldTracker, scene);

// Add some content to the instant tracker
const box = BABYLON.Mesh.CreateBox('box', 1, scene, false, BABYLON.Mesh.DOUBLESIDE)
box.parent = trackerTransformNode;

let hasPlaced = false;


const button = document.getElementById('zappar-placement-ui');
button.addEventListener('click', () => {
    hasPlaced = true;
});

window.addEventListener('resize', () => {
    engine.resize();
});

// Set up our render loop
engine.runRenderLoop(() => {
    camera.updateFrame();
    if (!hasPlaced) {
        instantWorldTracker.setAnchorPoseFromCameraOffset(0, 0, -10);
    }
    scene.render();
});
