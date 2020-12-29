import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js"
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { vec4 } from 'gl-matrix';
import * as math from './math';
import { Hypertorus } from './hypertorus';
import { Camera4D } from './camera4D';

let DEBUG_MODE : boolean = false;

window.addEventListener( "DOMContentLoaded", () => {
    
    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    renderer.setClearColor( 0x000000, 0 );
    document.body.appendChild( renderer.domElement );
  
    const scene = new THREE.Scene();
  
    const camDist : number = 4.5;
    const camera = new THREE.PerspectiveCamera( 45, width / height );
    camera.position.set( 0, 0, camDist );
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    let camera4D : Camera4D = new Camera4D();
    vec4.set( camera4D.position, 3.6, 0, 0, 0 );
    vec4.set( camera4D.target, 0, 0, 0, 0 );
    vec4.set( camera4D.up, 0, 1, 0, 0 );
    vec4.set( camera4D.over, 0, 0, 1, 0 );
    math.lookAt4D( camera4D.view, camera4D.position, camera4D.target, camera4D.up, camera4D.over );

    let torus : Hypertorus = new Hypertorus( camera4D );
    scene.add( torus.mesh );

    let rot = 0.0;

    const stats : Stats = new Stats();
    if ( DEBUG_MODE === true ) {
        stats.showPanel( 0 );
        document.body.appendChild( stats.dom );   
    }

    const animate = (): void => 
    {
        if ( DEBUG_MODE === true ) {
            stats.begin();
        }

        torus.update();

        rot += 0.10;
        const radian = math.radians( rot );

        camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
        camera.position.x = camDist * Math.sin( radian );
        camera.position.z = camDist * Math.cos( radian );
        
        renderer.render( scene, camera );
        if ( DEBUG_MODE === true ) {
            stats.end();
        }

        requestAnimationFrame( animate );
    };

    animate();

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener( 'resize', onResize, false );
});