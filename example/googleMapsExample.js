import {
	WGS84_ELLIPSOID,
	CAMERA_FRAME,
	GeoUtils,
	GlobeControls,
	CameraTransitionManager,
	TilesRenderer,
} from '3d-tiles-renderer';
import {
	TilesFadePlugin,
	UpdateOnChangePlugin,
	TileCompressionPlugin,
	UnloadTilesPlugin,
	GLTFExtensionsPlugin,
	BatchedTilesPlugin,
	// DebugTilesPlugin,
	CesiumIonAuthPlugin,
	GoogleCloudAuthPlugin,
} from '3d-tiles-renderer/plugins';
import {
	Scene,
	WebGLRenderer,
	PerspectiveCamera,
	MathUtils,
	OrthographicCamera,
	Vector3,
} from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { CSM } from "three/examples/jsm/csm/CSM";
import { CSMHelper } from "three/examples/jsm/csm/CSMHelper";

let controls, scene, renderer, tiles, transition, csm, csmHelper;
let statsContainer, stats;
const _uniformArray= [];
const _logArray = [];
const _splitBreaksArray = [];

const params = {

	orthographic: false,
	updateCSM: true,
	showCSMShadowBounds: true,

	enableCacheDisplay: false,
	enableRendererStats: false,
	useBatchedMesh: Boolean( new URLSearchParams( window.location.hash.replace( /^#/, '' ) ).get( 'batched' ) ),
	errorTarget: 40,

	reload: reinstantiateTiles,

};

init();
animate();

function reinstantiateTiles() {

	if ( tiles ) {

		scene.remove( tiles.group );
		tiles.dispose();
		tiles = null;

	}

	tiles = new TilesRenderer();
	// const debugTilesPlug = new DebugTilesPlugin();
	// debugTilesPlug.displayBoxBounds = true;
	// tiles.registerPlugin (debugTilesPlug);
	tiles.registerPlugin( new CesiumIonAuthPlugin( { apiToken: import.meta.env.VITE_ION_KEY, assetId: '2275207', autoRefreshToken: true } ));
	// tiles.registerPlugin( new GoogleCloudAuthPlugin({ apiToken: import.meta.env.VITE_GOOGLE_API_TOKEN, useRecommendedSettings: true }) );
	tiles.registerPlugin( new TileCompressionPlugin() );
	tiles.registerPlugin( new UpdateOnChangePlugin() );
	tiles.registerPlugin( new UnloadTilesPlugin() );
	tiles.registerPlugin( new TilesFadePlugin() );
	tiles.registerPlugin( new GLTFExtensionsPlugin( {
		// Note the DRACO compression files need to be supplied via an explicit source.
		// We use unpkg here but in practice should be provided by the application.
		dracoLoader: new DRACOLoader().setDecoderPath( 'https://unpkg.com/three@0.153.0/examples/jsm/libs/draco/gltf/' )
	} ) );


	if ( params.useBatchedMesh ) {

		tiles.registerPlugin( new BatchedTilesPlugin( {
			renderer,
			discardOriginalContent: false,
			instanceCount: 250,
		} ) );

	}

	tiles.group.rotation.x = - Math.PI / 2;
	scene.add( tiles.group );

	tiles.setResolutionFromRenderer( transition.camera, renderer );
	tiles.setCamera( transition.camera );
	csm = new CSM({
		cascades: 12,
		maxFar: 1000,
		mode: "custom",
		camera: transition.camera,
		lightMargin: 50000,
		shadowMapSize: 4096,
		lightdirection: new Vector3(10,1,100).multiplyScalar(-1).normalize(),
		parent: scene,
		customSplitsCallback: (cascadesAmount, near, far, breaks) => {
				// in case near is negative or 0 to avoid division by zero and other shenanigans...
				near = Math.max(near, 0.001);
				_uniformArray.length = 0;
				_logArray.length = 0;
				_splitBreaksArray.length = 0;
				breaks.length = 0;
				for (let i = 1; i < cascadesAmount; i++) {
						_logArray.push((near * (far / near) ** (i / cascadesAmount)) / far);
						_uniformArray.push((near + ((far - near) * i) / cascadesAmount) / far);
				}
				_logArray.push(1);
				_uniformArray.push(1);
				for (let i = 1; i < cascadesAmount; i++) {
						_splitBreaksArray.push(MathUtils.lerp(_uniformArray[i - 1], _logArray[i - 1], 0.9));
				}
				_splitBreaksArray.push(1);
				breaks.push(..._splitBreaksArray);
		},
	});
	console.log(csm.lightDirection);

	csmHelper = new CSMHelper(csm);
	// const debug = false;
	csmHelper.visible = true;
	csmHelper.displayFrustum = true;
	csmHelper.displayPlanes = true;
	csmHelper.displayShadowBounds = true;
	csmHelper.raycast = () => false;
	scene.add(csmHelper);

	for (const light of csm.lights) {
		tiles.setResolutionFromRenderer( light.shadow.camera, renderer );
		tiles.setCamera( light.shadow.camera );
	}

	controls.setTilesRenderer( tiles );

}

function init() {

	// renderer
	renderer = new WebGLRenderer( { antialias: true } );
	renderer.shadowMap.enabled = true;
	renderer.setClearColor( 0x151c1f );
	document.body.appendChild( renderer.domElement );

	// scene
	scene = new Scene();

	// camera and transition set up
	transition = new CameraTransitionManager(
		new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 160000000 ),
		new OrthographicCamera( - 1, 1, 1, - 1, 1, 160000000 ),
	);
	transition.perspectiveCamera.position.set( 4800000, 2570000, 14720000 );
	transition.perspectiveCamera.lookAt( 0, 0, 0 );
	transition.autoSync = false;

	transition.addEventListener( 'camera-change', ( { camera, prevCamera } ) => {

		tiles.deleteCamera( prevCamera );
		tiles.setCamera( camera );
		controls.setCamera( camera );

	} );

	// disable adjusting the orthographic camera position for zoom since globe controls will do this
	transition.orthographicPositionalZoom = false;

	// controls
	controls = new GlobeControls( scene, transition.camera, renderer.domElement, null );
	controls.enableDamping = true;

	// initialize tiles
	reinstantiateTiles();

	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'hashchange', initFromHash );

	// GUI
	const gui = new GUI();
	gui.width = 300;

	gui.add( params, 'orthographic' ).onChange( v => {

		controls.getPivotPoint( transition.fixedPoint );

		// don't update the cameras if they are already being animated
		if ( ! transition.animating ) {

			// sync the camera positions and then adjust the camera views
			transition.syncCameras();
			controls.adjustCamera( transition.perspectiveCamera );
			controls.adjustCamera( transition.orthographicCamera );

		}

		transition.toggle();

	} );

	gui.add( params, 'updateCSM' ).onChange( v => {
		// updateCSM = v;
	} );
	gui.add( params, 'showCSMShadowBounds' ).onChange( v => {
		csmHelper.visible = v;
	} );

	const mapsOptions = gui.addFolder( 'Google Photorealistic Tiles' );
	mapsOptions.add( params, 'useBatchedMesh' ).listen();
	mapsOptions.add( params, 'reload' );

	const exampleOptions = gui.addFolder( 'Example Options' );
	exampleOptions.add( params, 'enableCacheDisplay' );
	exampleOptions.add( params, 'enableRendererStats' );
	exampleOptions.add( params, 'errorTarget', 5, 100, 1 ).onChange( () => {

		tiles.getPluginByName( 'UPDATE_ON_CHANGE_PLUGIN' ).needsUpdate = true;

	} );

	statsContainer = document.createElement( 'div' );
	document.getElementById( 'info' ).appendChild( statsContainer );

	// Stats
	stats = new Stats();
	stats.showPanel( 0 );
	document.body.appendChild( stats.dom );

	// run hash functions
	initFromHash();
	setInterval( updateHash, 100 );

}

function onWindowResize() {

	const { perspectiveCamera, orthographicCamera } = transition;
	const aspect = window.innerWidth / window.innerHeight;

	perspectiveCamera.aspect = aspect;
	perspectiveCamera.updateProjectionMatrix();

	orthographicCamera.left = - orthographicCamera.top * aspect;
	orthographicCamera.right = - orthographicCamera.left;
	orthographicCamera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );

}

function updateHash() {

	if ( ! tiles ) {

		return;

	}

	const camera = transition.camera;
	const cartographicResult = {};
	const orientationResult = {};
	const tilesMatInv = tiles.group.matrixWorld.clone().invert();
	const localCameraPos = camera.position.clone().applyMatrix4( tilesMatInv );
	const localCameraMat = camera.matrixWorld.clone().premultiply( tilesMatInv );

	// get the data
	WGS84_ELLIPSOID.getPositionToCartographic( localCameraPos, cartographicResult );
	WGS84_ELLIPSOID.getAzElRollFromRotationMatrix(
		cartographicResult.lat, cartographicResult.lon, localCameraMat,
		orientationResult, CAMERA_FRAME,
	);

	// convert to DEG
	orientationResult.azimuth *= MathUtils.RAD2DEG;
	orientationResult.elevation *= MathUtils.RAD2DEG;
	orientationResult.roll *= MathUtils.RAD2DEG;
	cartographicResult.lat *= MathUtils.RAD2DEG;
	cartographicResult.lon *= MathUtils.RAD2DEG;

	// update hash
	const urlParams = new URLSearchParams();
	urlParams.set( 'lat', cartographicResult.lat.toFixed( 4 ) );
	urlParams.set( 'lon', cartographicResult.lon.toFixed( 4 ) );
	urlParams.set( 'height', cartographicResult.height.toFixed( 2 ) );
	urlParams.set( 'az', orientationResult.azimuth.toFixed( 2 ) );
	urlParams.set( 'el', orientationResult.elevation.toFixed( 2 ) );
	urlParams.set( 'roll', orientationResult.roll.toFixed( 2 ) );

	if ( params.useBatchedMesh ) {

		urlParams.set( 'batched', 1 );

	}
	window.history.replaceState( undefined, undefined, `#${ urlParams }` );

}

function initFromHash() {

	const hash = window.location.hash.replace( /^#/, '' );
	const urlParams = new URLSearchParams( hash );
	if ( urlParams.has( 'batched' ) ) {

		params.useBatchedMesh = Boolean( urlParams.get( 'batched' ) );

	}

	if ( ! urlParams.has( 'lat' ) && ! urlParams.has( 'lon' ) ) {

		return;

	}

	// update the tiles matrix world so we can use it
	tiles.group.updateMatrixWorld();

	// get the position fields
	const camera = transition.camera;
	const lat = parseFloat( urlParams.get( 'lat' ) );
	const lon = parseFloat( urlParams.get( 'lon' ) );
	const height = parseFloat( urlParams.get( 'height' ) ) || 1000;

	if ( urlParams.has( 'az' ) && urlParams.has( 'el' ) ) {

		// get the az el fields for rotation if present
		const az = parseFloat( urlParams.get( 'az' ) );
		const el = parseFloat( urlParams.get( 'el' ) );
		const roll = parseFloat( urlParams.get( 'roll' ) ) || 0;

		// extract the east-north-up frame into matrix world
		WGS84_ELLIPSOID.getRotationMatrixFromAzElRoll(
			lat * MathUtils.DEG2RAD, lon * MathUtils.DEG2RAD,
			az * MathUtils.DEG2RAD, el * MathUtils.DEG2RAD, roll * MathUtils.DEG2RAD,
			camera.matrixWorld, CAMERA_FRAME,
		);

		// apply the necessary tiles transform
		camera.matrixWorld.premultiply( tiles.group.matrixWorld );
		camera.matrixWorld.decompose( camera.position, camera.quaternion, camera.scale );

		// get the height
		WGS84_ELLIPSOID.getCartographicToPosition( lat * MathUtils.DEG2RAD, lon * MathUtils.DEG2RAD, height, camera.position );
		camera.position.applyMatrix4( tiles.group.matrixWorld );

	} else {

		// default to looking down if no az el are present
		WGS84_ELLIPSOID.getCartographicToPosition( lat * MathUtils.DEG2RAD, lon * MathUtils.DEG2RAD, height, camera.position );
		camera.position.applyMatrix4( tiles.group.matrixWorld );
		camera.lookAt( 0, 0, 0 );

	}

}

function animate() {

	requestAnimationFrame( animate );

	if ( ! tiles ) return;

	controls.enabled = ! transition.animating;
	if (params.updateCSM) {

		// custom adjustment of the far plane of the shadow lights
		for (let i = 0; i < csm.lights.length; i++) {
			const light = csm.lights[i];
			tiles.setResolutionFromRenderer( light.shadow.camera, renderer );
			tiles.setCamera( light.shadow.camera );
				const camera = transition.camera;
				const camSplitNear = i == 0 ? 0 : _splitBreaksArray[i - 1] * camera.far;
					const camSplitFar = _splitBreaksArray[i] * camera.far;

				light.shadow.normalBias = Math.sqrt(camSplitFar + 1) * 0.014;
					light.shadow.bias = (camSplitFar + 1) * 0.00000000001;

				if (camera instanceof PerspectiveCamera) {
							const halfFovTan = Math.tan(MathUtils.degToRad(camera.fov) / 2);

						// Far plane diagonal (distance between opposite far corners)
							const farPlaneDiagonal = 2 * camSplitFar * halfFovTan * Math.sqrt(camera.aspect * camera.aspect + 1);

						// Diagonal from lower left near to upper right far
						const nearToFarDiagonal = Math.sqrt(
								Math.pow((camSplitFar + camSplitNear) * halfFovTan, 2) * (camera.aspect * camera.aspect + 1) +
										Math.pow(camSplitFar - camSplitNear, 2),
							);

						const maxFrustumExtend = Math.max(farPlaneDiagonal, nearToFarDiagonal);
						light.shadow.camera.far = maxFrustumExtend + csm.lightMargin;
				} else if (camera instanceof OrthographicCamera) {
						const dx = (camera.right - camera.left) / camera.zoom;
						const dy = (camera.top - camera.bottom) / camera.zoom;
							const dz = camSplitFar - camSplitNear;

						const diagonal = Math.sqrt(dx * dx + dy * dy + dz * dz);
						light.shadow.camera.far = diagonal + csm.lightMargin;
				}
		}
		csm.updateFrustums();
		csm.update();
		csmHelper.update();
	}
	controls.update();
	transition.update();

	// update options
	const camera = transition.camera;

	// update tiles
	camera.updateMatrixWorld();
	tiles.setResolutionFromRenderer( camera, renderer );
	tiles.setCamera( camera );
	tiles.errorTarget = params.errorTarget;
	tiles.update();

	renderer.render( scene, camera );
	stats.update();

	updateHtml();

}

function updateHtml() {

	// render html text updates
	let str = '';

	if ( params.enableCacheDisplay ) {

		const lruCache = tiles.lruCache;
		const cacheFullness = lruCache.cachedBytes / lruCache.maxBytesSize;
		str += `Downloading: ${ tiles.stats.downloading } Parsing: ${ tiles.stats.parsing } Visible: ${ tiles.visibleTiles.size }<br/>`;
		str += `Cache: ${ ( 100 * cacheFullness ).toFixed( 2 ) }% ~${ ( lruCache.cachedBytes / 1000 / 1000 ).toFixed( 2 ) }mb<br/>`;

	}

	if ( params.enableRendererStats ) {

		const memory = renderer.info.memory;
		const render = renderer.info.render;
		const programCount = renderer.info.programs.length;
		str += `Geometries: ${ memory.geometries } Textures: ${ memory.textures } Programs: ${ programCount } Draw Calls: ${ render.calls }`;

		const batchPlugin = tiles.getPluginByName( 'BATCHED_TILES_PLUGIN' );
		const fadePlugin = tiles.getPluginByName( 'FADE_TILES_PLUGIN' );
		if ( batchPlugin ) {

			let tot = 0;
			batchPlugin.batchedMesh?._instanceInfo.forEach( info => {

				if ( info.visible && info.active ) tot ++;

			} );

			fadePlugin.batchedMesh?._instanceInfo.forEach( info => {

				if ( info.visible && info.active ) tot ++;

			} );

			str += ', Batched: ' + tot;

		}

	}

	if ( statsContainer.innerHTML !== str ) {

		statsContainer.innerHTML = str;

	}

	const mat = tiles.group.matrixWorld.clone().invert();
	const vec = transition.camera.position.clone().applyMatrix4( mat );

	const res = {};
	WGS84_ELLIPSOID.getPositionToCartographic( vec, res );

	const attributions = tiles.getAttributions()[ 0 ]?.value || '';
	document.getElementById( 'credits' ).innerText = GeoUtils.toLatLonString( res.lat, res.lon ) + '\n' + attributions;

}
