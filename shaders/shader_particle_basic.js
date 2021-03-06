﻿var shader_particle_basic = {
    vert: [

        	"attribute float size;",
			"attribute vec3 customColor;",

            "uniform float t;",

			"varying vec3 vColor;",

			"void main() ",
			"{",
			"	vColor = customColor;",
			"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"	gl_PointSize = size * ( 300.0 / -mvPosition.z );",
			"	gl_Position = (projectionMatrix * mvPosition);",
			"}",

    ].join("\n"), 

    frag: [
 
        	"uniform vec3 color;",
			"uniform sampler2D texture;",
			"varying vec3 vColor;",

			"void main()",
            "{",
			"	gl_FragColor = vec4( color * vColor, 1.0 );",
			"	gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );",
			"	if ( gl_FragColor.a < ALPHATEST ) discard;",
			"}",

    ].join("\n")
};