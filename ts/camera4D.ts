import { vec4, mat4 } from 'gl-matrix';

export class Camera4D
{
    position : vec4;
    target : vec4;
    up : vec4;
    over : vec4;
    view : mat4;

    constructor()
    {
        this.position = vec4.create();
        this.target = vec4.create();
        this.up = vec4.create();
        this.over = vec4.create();
        this.view = mat4.create();
    }
};