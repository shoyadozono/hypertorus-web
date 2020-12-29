import { mat4, ReadonlyVec4, vec4 } from 'gl-matrix';

export const fromXYRotation = function( out : mat4, radians : number ) : mat4 {
    return mat4.fromZRotation( out, radians );
};

export const fromYZRotation =  function( out : mat4, radians : number ) : mat4 {
    return mat4.fromXRotation( out, radians );
}

export const fromZXRotation = function( out : mat4, radians : number ) : mat4 {
    return mat4.fromYRotation( out, radians );
};

export const fromXWRotation = function( out : mat4, radians : number ) : mat4 {
    const cos = Math.cos( radians );
    const sin = Math.sin( radians );
    mat4.identity( out );
    out[0] = cos;
    out[3] = sin;
    out[12] = -sin;
    out[15] = cos;
    return out;
};

export const fromYWRotation = function( out : mat4, radians : number ) : mat4 {
    const cos = Math.cos( radians );
    const sin = Math.sin( radians );
    mat4.identity( out );
    out[5] = cos;
    out[7] = -sin;
    out[13] = sin;
    out[15] = cos;
    return out;
};

export const fromZWRotation = function( out : mat4, radians : number ) : mat4 {
    const cos = Math.cos( radians );
    const sin = Math.sin( radians );
    mat4.identity( out );
    out[ 10 ] = cos;
    out[ 11 ] = -sin;
    out[ 14 ] = sin;
    out[ 15 ] = cos;
    return out;
};

export const lookAt4D = function( out : mat4, position : ReadonlyVec4, target : ReadonlyVec4, up : vec4, over : vec4 ) : mat4 {
    // Get the normalized Wd column-vector.
    const wd = vec4.create();
    vec4.subtract(wd, target, position);
    vec4.normalize(wd, wd);

    // Calculate the normalized Wa column-vector.
    const wa = vec4.create();
    cross4D(wa, up, over, wd);
    vec4.normalize(wa, wa);

    const wb = vec4.create();
    cross4D(wb, over, wd, wa);
    vec4.normalize(wb, wb);

    // Calculate the Wc column-vector.
    const wc = vec4.create();
    cross4D(wc, wd, wa, wb);

    out[0] = wa[0];
    out[1] = wa[1];
    out[2] = wa[2];
    out[3] = wa[3];

    out[4] = wb[0];
    out[5] = wb[1];
    out[6] = wb[2];
    out[7] = wb[3];

    out[8] = wc[0];
    out[9] = wc[1];
    out[10] = wc[2];
    out[11] = wc[3];

    out[12] = wd[0];
    out[13] = wd[1];
    out[14] = wd[2];
    out[15] = wd[3];
    return out;
};

export const cross4D = function( out : vec4, U : vec4, V : vec4, W : vec4 ) : vec4 {
    let A, B, C, D, E, F;       // Intermediate Values

    // Calculate intermediate values.
    A = (V[0] * W[1]) - (V[1] * W[0]);
    B = (V[0] * W[2]) - (V[2] * W[0]);
    C = (V[0] * W[3]) - (V[3] * W[0]);
    D = (V[1] * W[2]) - (V[2] * W[1]);
    E = (V[1] * W[3]) - (V[3] * W[1]);
    F = (V[2] * W[3]) - (V[3] * W[2]);

    // Calculate the result-vector components.
    out[0] = (U[1] * F) - (U[2] * E) + (U[3] * D);
    out[1] = -(U[0] * F) + (U[2] * C) - (U[3] * B);
    out[2] = (U[0] * E) - (U[1] * C) + (U[3] * A);
    out[3] = -(U[0] * D) + (U[1] * B) - (U[2] * A);
    return out;
};

export const radians = function( degrees : number ) : number {
    return degrees * Math.PI / 180;
};

export const degrees = function( radians : number ) : number {
    return radians * 180 / Math.PI;
};