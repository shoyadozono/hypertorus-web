import * as THREE from "three";
import { mat4 } from 'gl-matrix';
import { Camera4D } from './camera4D';
import * as math from './math';

export class Hypertorus 
{
    private vertices : THREE.Vector4[];
    public radius1 : number = 0.75;
    public radius2 : number = 0.1;
    public radius3 : number = 1.0;
    private prevRadius1 : number;
    private prevRadius2 : number;
    private prevRadius3 : number;
    private res : number = 4;
    private geometry : THREE.BufferGeometry;
    private positions : Float32Array;
    private colors : Float32Array;
    public mesh : THREE.Points;
    private model4D : mat4;
    private camera4D : Camera4D;
    public rotation : number = 0;
    public rotateSpeed : number = 0.01;

    constructor( camera : Camera4D )
    {
        this.camera4D = camera;
        this.model4D = mat4.create();

        this.prevRadius1 = this.radius1;
        this.prevRadius2 = this.radius2;
        this.prevRadius3 = this.radius3;

        this.generate( this.radius1, this.radius2, this.radius3, this.res );
    }

    public generate( R1: number, R2: number, R3:number, res : number ) : void
    {
        this.vertices = [];

        for ( let s=0; s < 360; s+=res )
        {
            const a = math.radians( s );
            const z = R1 * Math.sin( a );
            
            for ( let t=0; t < 360; t+=res )
            {
                const b = math.radians( t );
                const y = (R2 + R1 * Math.cos( a )) * Math.sin( b );
                
                for ( let u=0; u < 360; u+=res )
                {
                    const c = math.radians( u );
                    const x = (R3 + (R2 + R1 * Math.cos( a )) * Math.cos( b )) * Math.sin( c );
                    const w = (R3 + (R2 + R1 * Math.cos( a )) * Math.cos( b )) * Math.cos( c );
                    this.vertices.push( new THREE.Vector4( x, y, z, w ) );
                }
            }
        }

        const N = this.vertices.length;

        this.positions = new Float32Array( N * 4 );
        this.colors = new Float32Array( N * 4 );

        for ( let i=0; i < N; i++ ) {
            this.vertices[ i ].toArray( this.positions, i * 4 );
        }

        this.colors = this.colors.map( color => { return 1.0; });

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( this.positions, 4 ) );
        this.geometry.setAttribute( 'aPosition4D', new THREE.Float32BufferAttribute( this.positions, 4 ) );
        this.geometry.setAttribute( 'aColor', new THREE.Float32BufferAttribute( this.colors, 4 ) );

        let uniforms = {
            uAngle: { type: 'f', value: Math.PI/4 },
            uCameraPosition4D: { type: 'v4', value: this.camera4D.position },
            uModel4D: { type: 'm4', value: this.model4D },
            uView4D: { type: 'm4', value: this.camera4D.view }
        };

        // const vert = this.loadFile( "../assets/shaders/projection.vert" );
        // const frag = this.loadFile( "../assets/shaders/projection.frag" );

        const vert = document.querySelector( '#vs' ).textContent;
        const frag = document.querySelector( '#fs' ).textContent;

        const material = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: uniforms,
            depthTest: false,
            transparent: true,
			vertexColors: true
        });

        this.mesh = new THREE.Points( this.geometry, material );
    }

    public update() : void
    {
        if ( Math.abs( this.radius1 - this.prevRadius1 ) > Number.EPSILON || 
             Math.abs( this.radius2 - this.prevRadius2 ) > Number.EPSILON || 
             Math.abs( this.radius3 - this.prevRadius3 ) > Number.EPSILON )
        {
            let positions = this.geometry.getAttribute( 'aPosition4D' );

            let count = 0;
            for ( let s=0; s < 360; s+= this.res )
            {
                const a = math.radians( s );
                const z = this.radius1 * Math.sin( a );
                
                for ( let t=0; t < 360; t+= this.res )
                {
                    const b = math.radians( t );
                    const y = (this.radius2 + this.radius1 * Math.cos( a )) * Math.sin( b );
                    
                    for ( let u=0; u < 360; u+= this.res )
                    {
                        const c = math.radians( u );
                        const x = (this.radius3 + (this.radius2 + this.radius1 * Math.cos( a )) * Math.cos( b )) * Math.sin( c );
                        const w = (this.radius3 + (this.radius2 + this.radius1 * Math.cos( a )) * Math.cos( b )) * Math.cos( c );
                        positions[ count * 4 + 0 ] = x; 
                        positions[ count * 4 + 1 ] = y; 
                        positions[ count * 4 + 2 ] = z; 
                        positions[ count * 4 + 3 ] = w; 
                        count++;
                    }
                }
            }

            this.geometry.attributes.aPosition4D.needsUpdate = true;
        }

        // rotate
        this.rotation += this.rotateSpeed;

        math.fromXYRotation( this.model4D, this.rotation );
        // math.fromXYRotation( this.model4D, math.radians( 150 ) );
        // math.fromYZRotation( this.model4D, this.rotation );
        // math.fromZWRotation( this.model4D, this.rotation );
        // math.fromXWRotation( this.model4D, this.rotation );
        // math.fromYWRotation( this.model4D, this.rotation );
        // math.fromZWRotation( this.model4D, this.rotation );
    }

    private loadFile( url :string ) : any
    {
        var request = new XMLHttpRequest();
        request.open( 'GET', url, false );
    
        request.send( null );
    
        if ( request.readyState == 4 ) {
            if ( request.status == 200 ) {
                return request.responseText;
            } else {
                console.log( "error" );
                return null;
            }
        }
    }

};