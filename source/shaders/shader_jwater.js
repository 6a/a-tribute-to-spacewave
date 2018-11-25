var shader_water = {
    vert: [

    "uniform mat4 textureMatrix;",
    "varying vec4 vUv;",

    "varying vec4 v_position;",
    "varying vec3 v_normal;",
    "varying float reflFactor;",
    "varying vec3 normal2;",
    "varying float debug1;",

    "uniform float time;",		

    "float wave(float A, float x, float y, float t)",
    "{",
    "		t *= 1.0;",
    "		return A * (",
    "			sin(2.0 * (x * 0.2 +y * 0.7) +t * 1.0) +",
    "			sin(2.0 * (x * 0.7 +y * 0.2) +t * 0.8) +",
    "			pow(sin(2.0 * (x * 0.6 +y * 0.5) +t * 1.2), 2.0) +",
    "			pow(sin(2.0 * (x * 0.8 +y * 0.2) +t * 1.1), 2.0));",
    "}",

    "void main()",
    "{",
    "    vUv = textureMatrix * vec4(position, 1.0);",

    "    // Calculate the wave",
	"    float a = 0.05;",
	"    float y = wave(a, position.x, position.y, time);",

	"    float d = 0.05;",
	"    float dx = (wave(a, position.x+d, position.y, time) - wave(a, position.x-d, position.y, time)) / 2.0 / d;",
	"    float dz = (wave(a, position.x, position.y+d, time) - wave(a, position.x, position.y-d, time)) / 2.0 / d;",

    "    v_position = vec4(position.x, position.y, y * (20.0 / max(5.0, length(position))), 1.0);",

    "    v_normal = normalize(vec3(-dx, -dz, 1.0));",

    "    gl_Position = projectionMatrix * modelViewMatrix * v_position;",

	"    //calculate reflection coefficient",
	"    //using Schlick's approximation of Fresnel formula",
	"    float cosTheta = dot(v_normal, normalize(-v_position.xyz));",
	"    float R0 = 0.02;",
	"    reflFactor = R0 +(1.0 -R0) * pow(1.0 -cosTheta, 5.0);",
    "}",

    ].join("\n"),

    frag: [
 
    "uniform sampler2D tDiffuse;",
    "uniform vec3 waterColor;",
    "uniform vec3 skyColor;",

	"varying vec4 vUv;",
    "varying float reflFactor;",
    "varying vec3 v_normal;",

	"void main()",
    "{",
	"	vec4 base = texture2DProj(tDiffuse, vUv);",
	"	gl_FragColor = mix(vec4(base.rgb, 0.9), vec4(waterColor.rgb, 0.8), 0.1);",

    "    //gl_FragColor = mix(vec4(skyColor, 0.8), gl_FragColor, clamp(reflFactor, 0.0, 1.0));",
    "    //gl_FragColor = base;",
    "}",

    ].join("\n")
};