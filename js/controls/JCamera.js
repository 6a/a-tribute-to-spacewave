J.CAMERA.Godmode = function (object, domElement) {
    const DEG_2_RAD = Math.PI / 180;
    const CAM_PITCH_MIN = -85 * DEG_2_RAD;
    const CAM_PITCH_MAX = 85 * DEG_2_RAD;

    this.object = object;
    this.target = new THREE.Vector3(0, 0, 0);

    this.domElement = (domElement !== undefined) ? domElement : document;

    this.inputs = { W_FORWARD: 0, S_BACKWARD: 1, A_LEFT: 2, D_RIGHT: 3, Q_DOWN: 4, E_UP: 5 }
    this.keySwitches = [false, false, false, false, false, false];

    this.movementVector = new THREE.Vector3(0, 0, 0);
    this.movementDelta = new THREE.Vector3(1, 1, 1);
    this.movementDecceleration = new THREE.Vector3(0.50, 0.50, 0.50);

    this.lookDeltaX = 14;
    this.lookDeltaY = 8;
    this.mousePosPrevious = new THREE.Vector3(-1, -1, -1);
    this.mouseMoveVector = new THREE.Vector3(0, 0, 0);
    this.mouseDecceleration = new THREE.Vector3(0.5, 0.5, 0.50);

    this.enabled = true;

    if (this.domElement !== document) {
        this.domElement.setAttribute('tabindex', -1);
    }

    this.handleResize = function () {
        if (this.domElement === document) {

            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;
        }
        else {
            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;
        }
    };

    this.onMouseDown = function (event) {
        // No execution. TODO: Re-evaluate
        return;

        //if (this.domElement !== document)
        //{

        //    this.domElement.focus();
        //}

        //event.preventDefault();
        //event.stopPropagation();

        //if (this.activeLook)
        //{
        //    switch (event.button)
        //    {
        //        case 0: this.moveForward = true; break;
        //        case 2: this.moveBackward = true; break;
        //    }
        //}
        //this.mouseDragOn = true;
    };

    this.onMouseUp = function (event) {
        // No execution. TODO: Re-evaluate
        return;

        //event.preventDefault();
        //event.stopPropagation();

        //if (this.activeLook)
        //{
        //    switch (event.button)
        //    {
        //        case 0: this.moveForward = false; break;
        //        case 2: this.moveBackward = false; break;
        //    }
        //}

        //this.mouseDragOn = false;
    };

    var prevX = 0;
    var prevY = 0;
    this.onMouseMove = function (event)
    {
        if (!this.enabled) return;

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        var trident = ua.indexOf('Trident/');
        if (msie > 0 || trident > 0)
        {
            // IE 11, 10 or older => return version number
            var movementX = (prevX ? event.screenX - prevX : 0)
            var movementY = (prevY ? event.screenY - prevY : 0)

            prevX = event.screenX;
            prevY = event.screenY;

            this.mouseMoveVector.x += movementX || 0;
            this.mouseMoveVector.y += movementY || 0;
        }
        else
        {
            this.mouseMoveVector.x += event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            this.mouseMoveVector.y += event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        }
    };

    this.onKeyDown = function (event) {
        if (!this.enabled) return;

        switch (event.keyCode) {
            case 87: this.keySwitches[this.inputs.W_FORWARD] = true; break;         // W -- Forwards
            case 83: this.keySwitches[this.inputs.S_BACKWARD] = true; break;        // S -- Backwards
            case 65: this.keySwitches[this.inputs.A_LEFT] = true; break;            // A -- Left
            case 68: this.keySwitches[this.inputs.D_RIGHT] = true; break;           // D -- Right
            case 81: this.keySwitches[this.inputs.Q_DOWN] = true; break;            // Q -- Down
            case 69: this.keySwitches[this.inputs.E_UP] = true; break;              // E -- Up
        }
    };

    this.onKeyUp = function (event) {
        if (!this.enabled) return;

        switch (event.keyCode) {
            case 87: this.keySwitches[this.inputs.W_FORWARD] = false; break;         // W -- Forwards
            case 83: this.keySwitches[this.inputs.S_BACKWARD] = false; break;        // S -- Backwards
            case 65: this.keySwitches[this.inputs.A_LEFT] = false; break;            // A -- Left
            case 68: this.keySwitches[this.inputs.D_RIGHT] = false; break;           // D -- Right
            case 81: this.keySwitches[this.inputs.Q_DOWN] = false; break;            // Q -- Down
            case 69: this.keySwitches[this.inputs.E_UP] = false; break;              // E -- Up
        }
    };

    this.update = function (delta) {
        if (!this.enabled) return;

        if (this.keySwitches[this.inputs.W_FORWARD]) this.movementVector.z -= 1;    // W -- Forwards
        if (this.keySwitches[this.inputs.S_BACKWARD]) this.movementVector.z += 1;   // S -- Backwards
        if (this.keySwitches[this.inputs.A_LEFT]) this.movementVector.x -= 1;       // A -- Left
        if (this.keySwitches[this.inputs.D_RIGHT]) this.movementVector.x += 1;      // D -- Right
        if (this.keySwitches[this.inputs.Q_DOWN]) this.movementVector.y -= 1;       // Q -- Down
        if (this.keySwitches[this.inputs.E_UP]) this.movementVector.y += 1;         // E -- Up

        this.object.translateX(this.movementVector.x * delta * this.movementDelta.x);
        this.object.translateY(this.movementVector.y * delta * this.movementDelta.y);
        this.object.translateZ(this.movementVector.z * delta * this.movementDelta.z);

        // Deccelerate
        this.movementVector.x *= this.movementDecceleration.x;
        this.movementVector.y *= this.movementDecceleration.y;
        this.movementVector.z *= this.movementDecceleration.z;

        // If the mouse has been moved, rotate the camera
        if (this.mouseMoveVector.length() > 0) {
            // Apply pitch
            var pitch = this.object.rotation.x - (this.mouseMoveVector.y * DEG_2_RAD * this.lookDeltaY * delta);
            this.object.rotation.x = Math.min(Math.max(pitch, CAM_PITCH_MIN), CAM_PITCH_MAX);

            // Apply yaw
            this.object.rotation.y -= this.mouseMoveVector.x * DEG_2_RAD * this.lookDeltaX * delta;

            // Deccelerate
            this.mouseMoveVector.x *= this.mouseDecceleration.x;
            this.mouseMoveVector.y *= this.mouseDecceleration.y;
            this.mouseMoveVector.z *= this.mouseDecceleration.z;
        }
    };

    this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
    this.domElement.addEventListener('mousemove', bind(this, this.onMouseMove), false);
    this.domElement.addEventListener('mousedown', bind(this, this.onMouseDown), false);
    this.domElement.addEventListener('mouseup', bind(this, this.onMouseUp), false);
    this.domElement.addEventListener('keydown', bind(this, this.onKeyDown), false);
    this.domElement.addEventListener('keyup', bind(this, this.onKeyUp), false);

    function bind(scope, fn) {
        return function () {
            fn.apply(scope, arguments);
        };
    };

    this.handleResize();
};