// render a triangle in webgl
var vertexShaderText = 
`
precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;

void main()
{
  fragColor = vertColor;
  gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`;

var fragmentShaderText = 
`
precision mediump float;

varying vec3 fragColor;
void main()
{
   gl_FragColor = vec4(fragColor, 1.0);
}
`;

var InitDemo = function () {
  
  // init
  var canvas = document.getElementById('game-surface');
  var gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('Using experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
  }
  if (!gl) {
    alert = ('NO WEBGL ON YOUR BROWSER BROKE BOI');
  }
  
  canvas.width = 800;
  canvas.height = 600;
  gl.viewport(0, 0, canvas.width, canvas.height);
  
  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // create shaders
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
  gl.shaderSource(vertexShader, vertexShaderText); // p1 = shader to source - p2 = shader source
  gl.shaderSource(fragmentShader, fragmentShaderText);
  
  gl.compileShader(vertexShader);
  // check for compilation errors
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('COMPILATION ERROR IN VERTEX SHADER!', gl.getShaderInfoLog(vertexShader));
    return;
  }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('COMPILATION ERROR IN FRAGMENT SHADER!', gl.getShaderInfoLog(fragmentShader));
    return;
  }
  
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR LINKING PROGRAM!', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
     console.error('ERROR VALIDATING PROGRAM!', gl.getProgramInfoLog(program));
    return;
  }
  
  // create buffer
  
  var triangleVertices =
  [// X,  Y,       R,  G,  B
    0.0, 0.5,     1.0, 1.0, 0.0,
    -0.5, -0.5,   0.7, 0.0, 1.0,
    0.5, -0.5,    0.1, 1.0, 0.6
  ];
  
  var triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  
  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    positionAttribLocation, // attribute location
    2, // num of elements per attribute
    gl.FLOAT, // type of element
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    0 // offset from beginning of a vertex to this attribute
  );
  gl.vertexAttribPointer(
    colorAttribLocation, // attribute location
    3, // num of elements per attribute
    gl.FLOAT, // type of element
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT, // offset from beginning of a vertex to this attribute
  );
  
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);
  
  // main render code
  
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  
};

