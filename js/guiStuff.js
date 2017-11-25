// Just putting this in a separate file so it doesn't clutter Main.js
// but it is in the Main.js namespace.
// maintains the global _params
window.addEventListener('keydown', function (event) {
    //console.log(event.keyCode);
    if (event.keyCode == 13) { // enter key pressed
        _params.draw();
    }
});
function updateMeshAppearance()
{
    var value = _params.material;
	var newMaterial;
	if (value == "Basic") {
		newMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        _sphereColorS.domElement.parentNode.style.display = 'none';
    }
	else if (value == "Lambert") {
		newMaterial = new THREE.MeshLambertMaterial( { color: 0x000000, side: THREE.DoubleSide } );
        _sphereColorS.domElement.parentNode.style.display = 'none';
    }
	else if (value == "Phong") {
		newMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, side: THREE.DoubleSide } );
        _sphereColorS.domElement.parentNode.style.display = 'block';
    }
	else { 
		newMaterial = new THREE.MeshBasicMaterial( { wireframe: true } );
        _sphereColorS.domElement.parentNode.style.display = 'none';
    }
	_lastMesh.material = newMaterial;
	
	_lastMesh.material.color.setHex( _params.color.replace("#", "0x") );
	if (_lastMesh.material.specular)
		_lastMesh.material.specular.setHex( _params.colorS.replace("#", "0x") ); 
    if (_lastMesh.material.shininess)
		_lastMesh.material.shininess = _params.shininess;
	_lastMesh.material.opacity = _params.opacity;  
	_lastMesh.material.transparent = true;

}
var _firstTime = true;
var _sphereColorS;
var _formulaDomElement;
function setupDatGui() {

	var gui1 = new dat.GUI({autoPlace: false, width: 400});
    gui1.domElement.style.position = 'absolute';
    gui1.domElement.style.top = "20px";
    gui1.domElement.style.left = "20px";
    // document.body.appendChild(gui1.domElement );
    var p = gui1.add(_params, 'P').min(-1).max(1).step(0.01).name("p");
    p.onChange(function (value) { draw(); });

	var gui = new dat.GUI();
    var folderAppearance = gui.addFolder('Appearance');
	var sphereColor = folderAppearance.addColor( _params, 'color' ).name('Color (Diffuse)').listen();
	sphereColor.onChange(function(value) // onFinishChange
	{   _lastMesh.material.color.setHex( value.replace("#", "0x") );   });
	
    _sphereColorS = folderAppearance.addColor( _params, 'colorS' ).name('Color (Specular)').listen();
	_sphereColorS.onChange(function(value) // onFinishChange
	{   _lastMesh.material.specular.setHex( value.replace("#", "0x") );   });
	var sphereShininess = folderAppearance.add( _params, 'shininess' ).min(0).max(60).step(1).name('Shininess').listen();
	sphereShininess.onChange(function(value)
	{   _lastMesh.material.shininess = value;   });
	var sphereOpacity = folderAppearance.add( _params, 'opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
	sphereOpacity.onChange(function(value)
	{   _lastMesh.material.opacity = value;   });
	
	var sphereMaterial = folderAppearance.add( _params, 'material', [ "Basic", "Lambert", "Phong", "Wireframe" ] ).name('Material Type');
	sphereMaterial.onChange(function(value) 
	{   updateMeshAppearance();   });
    folderAppearance.open();     // this won't work now that we have textarea for input, 
	                                // given all the shenanigans i did to make that show/hide
    
	var folder1 = gui.addFolder('Camera Focus');
	folder1.add(_params, 'X', -10, 10);
	folder1.add(_params, 'Y', -10, 10);
	folder1.add(_params, 'Z', -10, 10);
	folder1.open();              // ditto

	gui.add(_params, 'spin');
	gui.add(_params, 'spinSpeed',-Math.PI/32,Math.PI/32);

	
	gui.open();
	var x = document.getElementsByTagName('textarea')
	for (var i = 0; i < x.length; i++)
	    x[i].addEventListener('keydown', function (e) {
	        if (e.keyCode == 9) {   // tab key
	            e.preventDefault();
	        }
	    }, false)

}
