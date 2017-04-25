// standard global variables
var camera, tick = 0,
    useGl,
    scene, renderer, clock = new THREE.Clock(true),
    controls, container, stats,
    options, spawnerOptions, particleSystem;

function initPage1(){

    init();
    animate()
}

// FUNCTIONS
function init() {


    container = document.getElementById( 'home-gl' );

    var isFirefox = /firefox/i.test(navigator.userAgent);
    if(isFirefox){
        $(container).addClass('gl-ff');
    } else {
        $(container).addClass('gl-reg');
    }

    // useGl = false;
    // return;
    if(isFirefox || (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))){

        $(container).addClass('no-gl');
        useGl = false;
        return;

    }else {

        $(container).addClass('with-gl');
        useGl = true;
        
    }





    camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 140;

    scene = new THREE.Scene();


    // The GPU Particle system extends THREE.Object3D, and so you can use it
    // as you would any other scene graph component.	Particle positions will be
    // relative to the position of the particle system, but you will probably only need one
    // system for your whole scene


    particleSystem = new THREE.GPUParticleSystem({
       /// maxParticles: 250000
        maxParticles: 250000
    });



    // options passed during each spawned
    options = {
        position: new THREE.Vector3(0.1,4,12),
        positionRandomness: 2.35,
        velocity: new THREE.Vector3(22,12,6),
        velocityRandomness: 2.8,
        color: 0xFFAA62,
        colorRandomness: 0.1,
        turbulence: 0.8,
        lifetime: 25,
        size: 3.5,
        sizeRandomness: 12.7
    };

    spawnerOptions = {
        spawnRate: 30000,
        horizontalSpeed: 7.8,
        verticalSpeed: 2.18,
        timeScale: 0.6
    }

    //        gui.add(options, "velocityRandomness", 0, 3);
    //        gui.add(options, "positionRandomness", 0, 3);
    //        gui.add(options, "size", 1, 20);
    //        gui.add(options, "sizeRandomness", 0, 25);
    //        gui.add(options, "colorRandomness", 0, 1);
    //        gui.add(options, "lifetime", .1, 10);
    //        gui.add(options, "turbulence", 0, 1);
    //
    //        gui.add(spawnerOptions, "spawnRate", 10, 30000);
    //        gui.add(spawnerOptions, "timeScale", -1, 1);


    renderer = new THREE.WebGLRenderer();

    renderer.setPixelRatio(window.devicePixelRatio);
    //renderer.setClearColor( 0xffffff );
    renderer.setSize(window.innerWidth, window.innerHeight);


    container.appendChild(renderer.domElement);







    // cube geometry
    var geometry = new THREE.BoxGeometry();

    // texture
    // var texture = new THREE.Texture( generateTexture( ) ); // texture background is transparent
    // texture.needsUpdate = true; // important
    //var texture = THREE.ImageUtils.loadTexture("snowflake7_alpha.png");


    scene.add(particleSystem);

    function generateTexture() {

        // create canvas
        var canvas = renderer.domElement;
        canvas.width = renderer.domElement.width;
        canvas.height = renderer.domElement.height;

        // get context
        var context = canvas.getContext( '3d' );




        var mask = document.createElement('img');
        mask.src = 'resources/images/3dFace2.png';

        mask.onload = function() {
            context.width  = renderer.domElement.width;
            context.height = renderer.domElement.height;

            context.globalCompositeOperation='destination-in';

            context.drawImage(mask, 10, 10, width, height);



            //img.src = imagecanvas.toDataURL();
        }





        return canvas;

    }


    // setup controls
    /**
     *
     * @type {THREE.TrackballControls}
     */
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 2.2;
    controls.panSpeed = 1;
    controls.dynamicDampingFactor = 0.3;


    // stats = new Stats();
    // container.appendChild( stats.dom );

    
   /// window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

 var animationId;
function animate() {

    if(!useGl){
        return;

    }

    animationId = requestAnimationFrame(animate);


     // console.log(renderer.info)

    //   controls.update();



    var delta = clock.getDelta() * spawnerOptions.timeScale;
    tick += delta;

    if (tick < 0) tick = 0;

    if (delta > 0) {
        options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 35;
        options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
        // options.position.y = 0
        options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;

        for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
            // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
            // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
            particleSystem.spawnParticle(options);
        }
    }

    particleSystem.update(tick);

    //stats.update();

    renderer.render(scene, camera);

   


}
function reInitPage1(){

    if(!useGl){
        return;

    }

    scene.add(particleSystem);
    animate();
}


function removeParticles(){

    if(!useGl){
        return;

    }
    scene.remove(particleSystem);

    // animate();
    cancelAnimationFrame(animationId)

    // scene.dispose();
    // renderer.dispose();

    // container.removeChild(renderer.domElement);

    // particleSystem = null;
    //        removeEntity(particleSystem);
    //        scene.dispose();

}


  