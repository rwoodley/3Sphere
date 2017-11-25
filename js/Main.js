var _camera, _scene, _renderer, _system;
var _pointLight,_pointLightSphere;
var _spotLight;
var _controls;
var _stats;
var _mat;
var _lastMesh;
var _params;
var loader = new THREE.FontLoader();
var _drawClicked = false;
function init() {

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    _params = new params();
    _renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    _renderer.setSize(window.innerWidth, window.innerHeight);
	_renderer.shadowMapEnabled = true;
    _renderer.sortObjects = false; // see http://stackoverflow.com/questions/15994944/transparent-objects-in-threejs
	//_renderer.shadowMapCullFace = THREE.CullFaceBack;        
	document.body.appendChild( _renderer.domElement );

	_camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 4000 );
	_camera.position.x = 0;
	_camera.position.y = 4;
	_camera.position.z = 8                                                             ;
	_controls = new THREE.OrbitControls( _camera, _renderer.domElement );

	_scene = new THREE.Scene();
	_camera.lookAt(_scene.position);

	var ambientLight = new THREE.AmbientLight(0x333333);
	_scene.add(ambientLight);

	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 40, 390, -30);
	spotLight.intensity = 3;
	spotLight.distance=600;
	_scene.add( spotLight );

	spotLight = new THREE.SpotLight( 0xaaaaff );
	spotLight.position.set(-40, -190, 80);
	spotLight.intensity = 2;
	spotLight.distance=400;
	_scene.add( spotLight );
    
	//drawLine(0,1000,0,'blue');
	// drawCoords();
    setupDatGui();
    _recordingUtils = new recordingUtils();
    _canvas = document.querySelector('canvas');
    _extraKey = 0;
    document.body.onkeydown = function(e, extraKey){
        console.log(e.keyCode);
        if (e.keyCode == 16 || e.keyCode == 17) // shift & ctrl, respectively...
            _extraKey = e.keyCode;
        else {
            if (e.keyCode == 88 && _extraKey == 16) {  // shift-X - start/stop recording
                if (!_recordingUtils.recording) {
                    _recordingUtils.startRecording();
                }
                else {
                    _recordingUtils.stopRecording();
                }
            }
            if (e.keyCode == 85) {  // u - take a snap.
                var cubeCamera = new THREE.CubeCamera( .1, 1000, 4096 );    
                var equiUnmanaged = new CubemapToEquirectangular( _renderer, false );
                cubeCamera.updateCubeMap( _renderer, _scene );
                equiUnmanaged.convert( cubeCamera );
            }
            e.preventDefault();
        }
    }
    doPlot();
	animate();
    
}
function doPlot() {
    var mesh;
    var color = 0xffffff;
    _mat = new THREE.MeshPhongMaterial(
    { ambient: 0x555555, color: color, specular: 0x0000cc, shininess: 20,shading: THREE.SmoothShading  }  );

    doShape(0,0,0,theFunction);
    updateMeshAppearance();
}
function cos(x) { return Math.cos(x); }
function sin(x) { return Math.sin(x); }
function cross(v1, v2) {
    return new THREE.Vector3(v1.y*v2.z-v1.z*v2.y, v1.z *v2.x - v1.x*v2.z, v1.x*v2.y-v1.y*v2.x);
}
var df3 = function(p,q,x) {
    var xx = q*q*q*cos(p*x)*sin(q*x)+3*p*p*q*cos(p*x)*sin(q*x)+p*p*p*sin(p*x)*(cos(q*x)+2)+3*p*q*q*sin(p*x)*cos(q*x);
    var yy = (q*q*q+3*p*p*q)*sin(p*x)*sin(q*x)+(-3*p*q*q-p*p*p)*cos(p*x)*cos(q*x)-2*p*p*p*cos(p*x);
    var zz = -q*q*q*cos(q*x);  
    var scale=40;
    return new THREE.Vector3(scale*xx,scale*yy,scale*zz);
}
var df2 = function(p,q,x) {
    var xx = 2*p*q*sin(p*x)*sin(q*x)-p*p*cos(p*x)*(cos(q*x)+2)-q*q*cos(p*x)*cos(q*x);
    var yy = -2*p*q*cos(p*x)*sin(q*x)-(q*q+p*p)*sin(p*x)*cos(q*x)-2*p*p*sin(p*x);
    var zz = -q*q*sin(q*x);  
    return new THREE.Vector3(xx,yy,zz);
}
var df = function(p, q, phi) {
    var x = -q*sin(q*phi)*cos(p*phi)-p*sin(p*phi)*(cos(q*phi)+2);
    var y = -q*sin(q*phi)*sin(p*phi)+p*cos(p*phi)*(cos(q*phi)+2);
    var z = q * cos(q*phi);
    return new THREE.Vector3(x,y,z);
}
var f = function(pp, qq, phi) {
    var rr=Math.cos(qq*phi)+2;
    
        var xx=rr*Math.cos(pp*phi);
        var yy=rr*Math.sin(pp*phi);
        var zz=Math.sin(qq*phi);
    
        var x = xx;
        var y = yy;
        var z = zz;
    
        var scale = 1;  
        var vec = new THREE.Vector3(x*scale, y*scale, z*scale);  
    return vec;    
}
var theFunction = function(u,v) {
    u = u * .999999;
    u = u + .00000005;
    u=u*(2*Math.PI);
    v=v*(2*Math.PI);
    var theta = v;
    var phi=u;
    var pp=2;
    var qq=3;

    var vec = f(pp,qq,phi);

    var dv = df(pp, qq, phi); 
    var north = new THREE.Vector3(0,0,1);
    var v1 = cross(dv, north);
    v1.normalize();
    var v2 = cross(dv, v1);
    v2.normalize();

    var dscalar = .2;   // change this to make tube thicker
    var res = new THREE.Vector3(
        vec.x + (cos(theta)*v1.x + sin(theta)*v2.x)*dscalar,
        vec.y + (cos(theta)*v1.y + sin(theta)*v2.y)*dscalar,
        vec.z + (cos(theta)*v1.z + sin(theta)*v2.z)*dscalar,
    );

    // res.setLength(Math.atan(1./res.length()));
    // var scale = 40;
    // return new THREE.Vector3(res.x*scale, res.y*scale, res.z*scale);


    return res;
}
function doShape(x, y, z, daFunc) {
    var Geo3 = new THREE.ParametricGeometry(daFunc, 880, 80, false);
    mesh = new THREE.Mesh( Geo3, _mat );
    mesh.position.x = x; mesh.position.y = y; mesh.position.z = z;
    this._scene.add(mesh);
	_lastMesh = mesh;
}
function animate() {
	requestAnimationFrame( animate );
	if (_params.spin) rotateCameraY(_params.spinSpeed);
    // put the 'lookAt' after the camera rotation or it will be askew.
	_camera.lookAt(new THREE.Vector3(_params.X,_params.Z,_params.Y));
    render();
    if (_recordingUtils.recording) {
        _recordingUtils.capturer.capture(_canvas);
    }

}
function render() {
    _renderer.render( _scene, _camera );
	_controls.update();
}
function SinH(Angle) {                      // Angle in radians
    var e = Math.E;
    var p = Math.pow(e, Angle);
    var n = 1 / p;
    return (p - n) / 2;
} // SinH
function CosH(Angle) {                      // Angle in radians
    var e = Math.E;
    var p = Math.pow(e, Angle);
    var n = 1 / p;
    return (p * 1 + n * 1) / 2;
} // CosH
init();
