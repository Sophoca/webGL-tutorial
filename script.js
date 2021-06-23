var gl;

const { mat2, mat3, mat4, vec2, vec3, vec4 } = glMatrix; // Now we can use function without glMatrix.~~~

function testGLError(functionLastCalled) {
    /* gl.getError returns the last error that occurred using WebGL for debugging */
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height / 2);
    } catch (e) {}

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }
    return true;
}

var shaderProgram;

var vertexData = [
    // Backface (RED/WHITE) -> z = 0.5
    -0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0,
    0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 1.0, -0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 1.0,
    -0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0,
    // Front (BLUE/WHITE) -> z = 0.5
    -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 0.5,
    -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, -0.5,
    0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0,
    // LEFT (GREEN/WHITE) -> z = 0.5
    -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0,
    -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
    -0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 1.0, -0.5, 0.5, 0.5, 0.0, 1.0, 1.0, 1.0,
    // RIGHT (YELLOW/WHITE) -> z = 0.5
    0.5, -0.5, -0.5, 1.0, 1.0, 0.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, 0.0, 1.0, 0.5,
    0.5, -0.5, 1.0, 1.0, 0.0, 1.0, 0.5, -0.5, -0.5, 1.0, 1.0, 0.0, 1.0, 0.5,
    -0.5, 0.5, 1.0, 1.0, 0.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0,
    // BOTTON (MAGENTA/WHITE) -> z = 0.5
    -0.5, -0.5, -0.5, 1.0, 0.0, 1.0, 1.0, 0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 1.0,
    0.5, -0.5, -0.5, 1.0, 0.0, 1.0, 1.0, -0.5, -0.5, -0.5, 1.0, 0.0, 1.0, 1.0,
    -0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 1.0, 0.5, -0.5, 0.5, 1.0, 1.0, 1.0, 1.0,
    // TOP (CYAN/WHITE) -> z = 0.5
    -0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 0.0, 1.0, 1.0, 1.0, 0.5,
    0.5, -0.5, 0.0, 1.0, 1.0, 1.0, -0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0, -0.5,
    0.5, 0.5, 0.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0,
];

function initialiseBuffer() {
    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexData),
        gl.STATIC_DRAW
    );

    return testGLError("initialiseBuffers");
}

function initialiseShaders() {
    var fragmentShaderSource = `
			varying highp vec4 col; 
			void main(void) 
			{ 
				gl_FragColor = col;
			}`;

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert(
            "Failed to compile the fragment shader.\n" +
                gl.getShaderInfoLog(gl.fragShader)
        );
        return false;
    }

    // Vertex shader code
    var vertexShaderSource = `
			attribute highp vec4 myVertex; 
			attribute highp vec4 myColor; 
			uniform mediump mat4 mMat; 
			uniform mediump mat4 vMat; 
			uniform mediump mat4 pMat; 
			varying  highp vec4 col;
			void main(void)  
			{ 
				gl_Position = pMat * vMat * mMat * myVertex; 
				gl_PointSize = 8.0;
				col = myColor; 
			}`;

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert(
            "Failed to compile the vertex shader.\n" +
                gl.getShaderInfoLog(gl.vertexShader)
        );
        return false;
    }

    // Create the shader program
    gl.programObject = gl.createProgram();
    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);
    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
    // Link the program
    gl.linkProgram(gl.programObject);
    // Check if linking succeeded in a similar way we checked for compilation errors
    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert(
            "Failed to link the program.\n" +
                gl.getProgramInfoLog(gl.programObject)
        );
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

var xMove = 0.0,
    yMove = 0.0,
    zMove = 0.0;
function fn_moveX(val) {
    xMove = val;
}
function fn_moveY(val) {
    yMove = val;
}
function fn_moveZ(val) {
    zMove = val;
}

var xRot = 0.0;
var yRot = 0.0;
var zRot = 0.0;
var speedRot = 0.01;
function fn_rotateX(val) {
    xRot = glMatrix.glMatrix.toRadian(val);
}
function fn_rotateY(val) {
    yRot = glMatrix.glMatrix.toRadian(val);
}
function fn_rotateZ(val) {
    zRot = glMatrix.glMatrix.toRadian(val);
}

flag_animation = 0;
function toggleAnimation() {
    flag_animation ^= 1;
    console.log("flag_animation=", flag_animation);
}

function speed_scale(a) {
    speedRot *= a;
}

var draw_mode = 4; // 4 Triangles, 3 line_strip 0-Points

function fn_draw_mode(a) {
    draw_mode = a;
}

var xScale = 1.0,
    yScale = 1.0,
    zScale = 1.0;
function fn_scaleX(val) {
    xScale = val;
}
function fn_scaleY(val) {
    yScale = val;
}
function fn_scaleZ(val) {
    zScale = val;
}

function resetCube() {
    xMove = 0.0;
    yMove = 0.0;
    zMove = 0.0;
    xRot = 0.0;
    yRot = 0.0;
    zRot = 0.0;
    xScale = 1.0;
    yScale = 1.0;
    zScale = 1.0;
    flag_animation = 0;
    draw_mode = 4;
    speedRot = 0.01;
    document.getElementById("moveX").value = xMove;
    document.getElementById("moveY").value = yMove;
    document.getElementById("moveZ").value = zMove;
    document.getElementById("rotateX").value = xRot;
    document.getElementById("rotateY").value = yRot;
    document.getElementById("rotateZ").value = zRot;
    document.getElementById("scaleX").value = xScale;
    document.getElementById("scaleY").value = yScale;
    document.getElementById("scaleZ").value = zScale;
}

var lookAtX = 0.0,
    lookAtY = 0.0,
    lookAtZ = 2.0;
function fn_update_lookAtX(val) {
    lookAtX = val;
}
function fn_update_lookAtY(val) {
    lookAtY = val;
}
function fn_update_lookAtZ(val) {
    lookAtZ = val;
}

var eyeAtX = 0.0,
    eyeAtY = 0.0,
    eyeAtZ = 0.0;
function fn_update_eyeAtX(val) {
    eyeAtX = val;
}
function fn_update_eyeAtY(val) {
    eyeAtY = val;
}
function fn_update_eyeAtZ(val) {
    eyeAtZ = val;
}

function resetCamera() {
    lookAtX = 0.0;
    lookAtY = 0.0;
    lookAtZ = 2.0;
    eyeAtX = 0.0;
    eyeAtY = 0.0;
    eyeAtZ = 0.0;
    document.getElementById("lookAt_rangeX").value = lookAtX;
    document.getElementById("lookAt_rangeY").value = lookAtY;
    document.getElementById("lookAt_rangeZ").value = lookAtZ;
    document.getElementById("eye_rangeX").value = eyeAtX;
    document.getElementById("eye_rangeY").value = eyeAtY;
    document.getElementById("eye_rangeZ").value = eyeAtZ;
}

var fov_degree = 90.0;
function fn_update_fov(val) {
    fov_degree = val;
}
var zNear = 1.0,
    zFar = 100.0;
function fn_update_zNear(val) {
    zNear = val;
}
function fn_update_zFar(val) {
    zFar = val;
}
var aspectX = 8.0,
    aspectY = 6.0;
function fn_update_aspectX(val) {
    aspectX = val;
}
function fn_update_aspectY(val) {
    aspectY = val;
}

function resetPerspective() {
    fov_degree = 90.0;
    zNear = 1.0;
    zFar = 100.0;
    aspectX = 8.0;
    aspectY = 6.0;
    document.getElementById("fov").value = fov_degree;
    document.getElementById("zNear").value = zNear;
    document.getElementById("zFar").value = zFar;
    document.getElementById("aspectX").value = aspectX;
    document.getElementById("aspectY").value = aspectY;
}

function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

var mMat, vMat, pMat, mMat2;

function renderScene() {
    // const halfHeight = gl.canvas.height / 2;
    // const width = gl.canvas.width;
    // gl.colorMask(true, true, true, true);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.viewport(0, halfHeight, width, halfHeight);

    gl.enable(gl.DEPTH_TEST);

    var mMatLocation = gl.getUniformLocation(gl.programObject, "mMat");
    var vMatLocation = gl.getUniformLocation(gl.programObject, "vMat");
    var pMatLocation = gl.getUniformLocation(gl.programObject, "pMat");
    pMat = mat4.create();
    vMat = mat4.create();
    mMat = mat4.create();
    mat4.translate(mMat, mMat, [xMove, yMove, zMove]);
    mat4.scale(mMat, mMat, [xScale, yScale, zScale]);
    mat4.rotateX(mMat, mMat, xRot);
    mat4.rotateY(mMat, mMat, yRot);
    mat4.rotateZ(mMat, mMat, zRot);
    mat4.perspective(
        pMat,
        glMatrix.glMatrix.toRadian(fov_degree),
        aspectX / aspectY,
        zNear / 10.0,
        zFar / 10.0
    );
    mat4.lookAt(
        vMat,
        [lookAtX, lookAtY, lookAtZ],
        [eyeAtX, eyeAtY, eyeAtZ],
        [0, 1, 0]
    );

    if (flag_animation == 1) {
        xRot = xRot + speedRot;
        yRot = yRot + speedRot;
        zRot = zRot + speedRot;
    }

    gl.uniformMatrix4fv(mMatLocation, gl.FALSE, mMat);
    gl.uniformMatrix4fv(vMatLocation, gl.FALSE, vMat);
    gl.uniformMatrix4fv(pMatLocation, gl.FALSE, pMat);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 28, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 28, 12);
    gl.drawArrays(draw_mode, 0, 36);

    return true;
}

function main() {
    document.getElementById("defaultTab").click();
    var canvas = document.getElementById("helloapicanvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    // renderScene();
    // Render loop
    requestAnimFrame = (function () {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000, 60);
            }
        );
    })();

    (function renderLoop() {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
