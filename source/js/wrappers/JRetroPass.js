J.RetroPass = 
{
    uniforms: 
    {
        "tDiffuse": { value: null },
        "amount": { value: 1.0 },
        "resolution": { value: new THREE.Vector2(1280.0, 720.0) },
        "bypass": { value: 0.0 }
    },
    vertexShader: shader_retro.vert,
    fragmentShader: shader_retro.frag
};