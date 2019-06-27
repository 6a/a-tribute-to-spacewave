J.MATERIAL = function ()
{
    const FLAT_SHADING = false;

    var textureLoader = new THREE.TextureLoader();

    this.Glass = function (cubecamera)
    {
        MAT_GLASS.envMap = cubecamera.renderTarget.texture;
        return MAT_GLASS;
    };

    this.MetalBody = function (cubecamera, colour)
    {
        MAT_METAL_BODY.color = colour;
        MAT_METAL_BODY.envMap = cubecamera.renderTarget.texture;
        return MAT_METAL_BODY;
    };

    this.MetalDetail = function (colour) {
        MAT_METAL_DETAIL.color = colour;
        return MAT_METAL_DETAIL;
    };

    this.GrillFront = function (cubecamera)
    {
        MAT_GRILL_FRONT.envMap = cubecamera.renderTarget.texture;
        return MAT_GRILL_FRONT;
    };

    this.Tyre = function ()
    {
        return MAT_TYRE;
    };

    this.Wheel = function (cubecamera)
    {
        MAT_WHEEL.envMap = cubecamera.renderTarget.texture;
        return MAT_WHEEL;
    };

    this.Chrome = function(cubecamera)
    {
        MAT_CHROME.envMap = cubecamera.renderTarget.texture;
        return MAT_CHROME;
    };

    this.Default = function(color)
    {
        if (!color) color = new THREE.Color(0xffffff);

        return new THREE.MeshStandardMaterial({ 
            color: color.getHex(), metalness: 0.1, roughness: 0.4, emissive: 1.0, flatShading: FLAT_SHADING
        });
    }

    this.LightEmitter = function(color)
    {
        return new THREE.MeshBasicMaterial({ color: color.getHex() });
    }

    this.Terrain = function (waterLevel, waterColor) {
        var uniforms_terrain = THREE.UniformsUtils.merge([
            THREE.UniformsLib.common,
            THREE.UniformsLib.specularmap,
            THREE.UniformsLib.envmap,
            THREE.UniformsLib.aomap,
            THREE.UniformsLib.lightmap,
            THREE.UniformsLib.emissivemap,
            THREE.UniformsLib.fog,
            THREE.UniformsLib.lights,
            {
                emissive: { value: new THREE.Color(0x000000) },
                uvScale: { value: new THREE.Vector2(4.0, 4.0) },
                waterLevel: { value: waterLevel },
                waterColor: { value: waterColor },
                normalMap: { value: textureLoader.load('./textures/texture_normal_test.jpg') },
                normalScale: { value: new THREE.Vector2(0.5, 0.5) },

                // Have to load these even though we overwrite them later. TODO: Replace with blank 1px textures.
                bedTexture: { value: textureLoader.load('./textures/texture_blank.png') },
                shoreTexture: { value: textureLoader.load('./textures/texture_blank.png') },
                bedNormal: { value: textureLoader.load('./textures/texture_blank.png') },
                shoreNormal: { value: textureLoader.load('./textures/texture_blank.png') }
            }
        ]);

        // Terrain material init
        var mat = new THREE.ShaderMaterial({
            lights: true,
            uniforms: uniforms_terrain,
            vertexShader: shader_pbr_terrain.vert,
            fragmentShader: shader_pbr_terrain.frag,
        });

        // TODO: replace with blank 1px textures
        mat.map = textureLoader.load('./textures/texture_blank.png');
        mat.normalMap = textureLoader.load('./textures/texture_blank.png');

        var t_bd = textureLoader.load('./textures/texture_diffuse_sand_seamless2.jpg');
        var t_sd = textureLoader.load('./textures/texture_diffuse_roughsand_seamless.png');
        var t_bn = textureLoader.load('./textures/texture_normal_sand_seamless2.jpg');
        var t_sn = textureLoader.load('./textures/texture_normal_roughsand_seamless.png');

        t_bd.wrapS = t_bd.wrapT = THREE.RepeatWrapping;
        t_sd.wrapS = t_sd.wrapT = THREE.RepeatWrapping;
        t_bn.wrapS = t_bn.wrapT = THREE.RepeatWrapping;
        t_sn.wrapS = t_sn.wrapT = THREE.RepeatWrapping;

        mat.uniforms.bedTexture.value = t_bd;
        mat.uniforms.shoreTexture.value = t_sd;
        mat.uniforms.bedNormal.value = t_bn;
        mat.uniforms.shoreNormal.value = t_sn;

        // For somereason I have to call this to make it work.
        mat.uniforms.map.value = t_bd;

        mat.roughness = 1;
        mat.metalness = 0;

        return mat;
    };

    this.Skybox = function (callback)
    {
        var side = THREE.BackSide;

        // for skybox

        //var cubemats =
        //[
        //    new THREE.MeshBasicMaterial({ map: textureLoader.load('./textures/skybox/hw_sahara/sahara_ft.png'), side: side } ),
        //    new THREE.MeshBasicMaterial({ map: textureLoader.load('./textures/skybox/hw_sahara/sahara_bk.png'), side: side }),
        //    new THREE.MeshBasicMaterial({ map: textureLoader.load('./textures/skybox/hw_sahara/sahara_up.png'), side: side }),
        //    new THREE.MeshBasicMaterial({ map: textureLoader.load('./textures/skybox/hw_sahara/sahara_dn.png'), side: side }),
        //    new THREE.MeshBasicMaterial({ map: textureLoader.load('./textures/skybox/hw_sahara/sahara_rt.png'), side: side }),
        //    new THREE.MeshBasicMaterial({ map: textureLoader.load('./textures/skybox/hw_sahara/sahara_lf.png'), side: side }),
        //];

        //return cubemats;

        // for hdri imagesphere thing
        var mat = new THREE.MeshBasicMaterial({
            map: textureLoader.load('./textures/skybox/hdri_milkyway/hdri.jpg', callback, undefined, undefined),
            side: side
        });

        return mat;
    };

    this.Asteroid = function (index)
    {
        switch (index) {
            case 1: return MAT_ASTEROID_1;
            case 2: return MAT_ASTEROID_2;
            case 3:

            default:
        }
    };

    this.Moon = function ()
    {
        return MAT_MOON;
    };

    this.Palm = function (type)
    {
        switch (type) {
            case 0: return MAT_PALM_BARK;
            case 1: return MAT_PALM_BARK;
            case 2: return MAT_PALM_BARK;
            case 3: return MAT_PALM_BARK;
            case 4: return MAT_PALM_BARK;
            case 5: return MAT_PALM_BARK;
            case 6: return MAT_PALM_LEAF;
            case 7: return MAT_PALM_LEAF;
            case 8: return MAT_PALM_LEAF;
            case 9: return MAT_PALM_LEAF;
            case 10: return MAT_PALM_LEAF;
            case 11: return MAT_PALM_LEAF;
            default: return new THREE.MeshBasicMaterial(0xff00ff);

        }

        if (type == 1) return MAT_PALM_BARK;
        else if (type == 0) return MAT_PALM_LEAF;
    };

    this.Statue = function ()
    {
        return MAT_STATUE;
    };

    this.Star = function () {
        return MAT_STAR;
    }

    // Material definitions
    var MAT_GLASS = new THREE.MeshPhysicalMaterial({
        color: 0x303030, metalness: 0.0, clearCoat: 1.0, clearCoatRoughness: 0.0, reflectivity: 1.0,
        transparent: true, opacity: 0.8, refractionRatio: 0.1, flatShading: FLAT_SHADING
    });

    var MAT_METAL_BODY = new THREE.MeshPhysicalMaterial({
        metalness: 0.65, clearCoat: 1.0, clearCoatRoughness: 0.0, reflectivity: 1.0, roughness: 0.1, flatShading: FLAT_SHADING
    });

    var MAT_METAL_DETAIL = new THREE.MeshPhysicalMaterial({
        metalness: 0.7, clearCoat: 0.8, clearCoatRoughness: 0.3, roughness: 0.4, flatShading: FLAT_SHADING
    });

    var MAT_GRILL_FRONT = new THREE.MeshPhysicalMaterial({
        color:0x333333, metalness: 0.1, clearCoat: 0.0, clearCoatRoughness: 0.0, roughness: 0.0, flatShading: FLAT_SHADING
    });

    var MAT_TYRE = new THREE.MeshPhysicalMaterial({
        color: 0x1d1d1e, metalness: 0.0, clearCoat: 0.0, clearCoatRoughness: 1.0, roughness: 0.9, flatShading: FLAT_SHADING
    });

    var MAT_WHEEL = new THREE.MeshPhysicalMaterial({
        color: 0xDDDDDD, metalness: 0.8, clearCoat: 0.4, clearCoatRoughness: 0.4, reflectivity: 0.3, roughness: 0.3, flatShading: FLAT_SHADING
    });

    var MAT_CHROME = new THREE.MeshPhysicalMaterial({
        metalness: 0.8, clearCoat: 1.0, clearCoatRoughness: 0.2, reflectivity: 1.0, roughness: 0.1, flatShading: FLAT_SHADING
    });

    var MAT_LIGHT_EMISSIVE = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

    var MAT_ASTEROID_1 = new THREE.MeshPhysicalMaterial({
        metalnessMap: textureLoader.load('./textures/asteroid1/texture_metalness.jpg'),
        normalMap: textureLoader.load('./textures/asteroid1/texture_normal.jpg'),
        map: textureLoader.load('./textures/asteroid1/texture_diffuse.jpg'),
        //displacementMap: textureLoader.load('./textures/asteroid1/texture_displacement.jpg'),
        //displacementScale: 0.3,
        emissiveMap: textureLoader.load('./textures/asteroid1/texture_emissive.jpg'),
        clearCoat: 1.0, roughness: 0.1, flatShading: FLAT_SHADING
    });

    var MAT_ASTEROID_2 = new THREE.MeshPhysicalMaterial({
        normalMap: textureLoader.load('./textures/texture_normal_asteroid.jpg'),
        map: textureLoader.load('./textures/texture_diffuse_asteroid.jpg'),
        color: 0xffea4f, metalness: 0.3, clearCoat: 1.0, roughness: 0.1, flatShading: FLAT_SHADING
    });

    var MAT_MOON = new THREE.MeshPhysicalMaterial({
        normalMap: textureLoader.load('./textures/texture_normal_moon.jpg'),
        map: textureLoader.load('./textures/texture_diffuse_moon.jpg'),
        clearCoat: 1.0, roughness: 0.1, flatShading: FLAT_SHADING
    });

    var MAT_PALM_BARK = new THREE.MeshPhysicalMaterial({
        map: textureLoader.load('./textures/palms/texture_diffuse_bark.jpg'),
        normalMap: textureLoader.load('./textures/palms/texture_normal_bark.jpg'),
        clearCoat: 0.2, roughness: 0.5, flatShading: FLAT_SHADING
    });

    var MAT_PALM_LEAF = new THREE.MeshPhysicalMaterial({
        map: textureLoader.load('./textures/palms/texture_diffuse_leaf.png'),
        clearCoat: 0.0, roughness: 0.96, flatShading: FLAT_SHADING, transparent: true, side: THREE.DoubleSide,
        depthWrite: false
    });

    var MAT_STATUE = new THREE.MeshPhysicalMaterial({
        normalMap: textureLoader.load('./textures/statue/texture_normal_statue.jpg'),
        map: textureLoader.load('./textures/statue/texture_diffuse_statue.jpg'),
        metalness: 0.05, clearCoat: 0.7, roughness: 0.2, flatShading: FLAT_SHADING
    });

    var MAT_STAR = new THREE.MeshBasicMaterial({ color: 0xffb7d1 });
};