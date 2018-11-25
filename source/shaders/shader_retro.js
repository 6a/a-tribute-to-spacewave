var shader_retro = {
    vert: [

    "varying vec2 vUv;",

    "void main()",
    "{",
    "   vUv = uv;",
    "   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"

    ].join("\n"),

    frag: [

    "uniform vec2 resolution;",
    "uniform float amount;",
    "uniform sampler2D tDiffuse;",
    "uniform float bypass;",
    "varying vec2 vUv;",

    "#define MOD_OP 0.125",
    "#define INDEX_BIAS 0.05",

    "void main()",
    "{",
        "if (bypass == 1.0)",
        "{",
        "   gl_FragColor = texture2D(tDiffuse, vUv);",
        "   return;",
        "}",

	"   float d = 1.0 / amount;",
    "   float ar = resolution.x / resolution.y;",
    "   float u = floor( vUv.x / d ) * d;",
    "   d = ar / amount;",
    "   float v = floor( vUv.y / d ) * d;",

    "   vec4 index = texture2D( tDiffuse, vec2( u, v ) );",
    //"   index = vec4(vec3((index.r + index.g + index.b) / 3.0), 1);",

    "   gl_FragColor = vec4(INDEX_BIAS + MOD_OP * floor(index.r / MOD_OP), INDEX_BIAS + MOD_OP * floor(index.g / MOD_OP), INDEX_BIAS + MOD_OP * floor(index.b / MOD_OP), 1);",
    "}"

    ].join("\n")
};