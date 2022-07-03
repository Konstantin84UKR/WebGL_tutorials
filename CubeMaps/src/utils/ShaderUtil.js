//import { set } from "./src/gl-matrix/vec2";

export default class Shader {
  constructor(gl, URL_vs, URL_fs) {
    this.shaderProgram = "none";
    this.tex = false;
    this.tex_normal = false;
    this.tex_roughness = false;
    this.tex_metallic = false;
    this.tex_AO = false;
    this.material = [];
  }
  async createPromiseShaderProgram(gl, URL_vs, URL_fs) {
    this.shaderProgram = await createPromiseShaderProgram(gl, URL_vs, URL_fs);
  }

  getAttribLocation(gl) {
    this.a_Position = gl.getAttribLocation(this.shaderProgram, "a_Position");
  }

  getUniformLocation(gl) {
    this.u_viewDirectionProjectionInverse = gl.getUniformLocation(
      this.shaderProgram,
      "u_viewDirectionProjectionInverse"
    );
    this.samplerTex = gl.getUniformLocation(this.shaderProgram, "samplerTex");

    this.u_Pmatrix = gl.getUniformLocation(this.shaderProgram, "u_Pmatrix");
    this.u_Mmatrix = gl.getUniformLocation(this.shaderProgram, "u_Mmatrix");
    this.u_Vmatrix = gl.getUniformLocation(this.shaderProgram, "u_Vmatrix");
    this.u_Nmatrix = gl.getUniformLocation(this.shaderProgram, "u_Nmatrix");

    this.u_source_direction = gl.getUniformLocation(
      this.shaderProgram,
      "u_source_direction"
    );
    this.u_view_direction = gl.getUniformLocation(
      this.shaderProgram,
      "u_view_direction"
    );
    this.u_shininess = gl.getUniformLocation(this.shaderProgram, "u_shininess");

    this.u_Camera = gl.getUniformLocation(this.shaderProgram, "u_Camera");

    this.a_uv = gl.getAttribLocation(this.shaderProgram, "a_uv");

    this.a_normal = gl.getAttribLocation(this.shaderProgram, "a_normal");
    this.a_tangent = gl.getAttribLocation(this.shaderProgram, "a_tangent");
    this.a_bitangent = gl.getAttribLocation(this.shaderProgram, "a_bitangent");

    this.u_sampler = gl.getUniformLocation(this.shaderProgram, "samplerTex");
    this.u_samplerNormalMap = gl.getUniformLocation(
      this.shaderProgram,
      "samplerNormalMap"
    );
    this.u_samplerRoughnessMap = gl.getUniformLocation(
      this.shaderProgram,
      "samplerRoughnessMap"
    );
    this.u_samplerMetallicMap = gl.getUniformLocation(
      this.shaderProgram,
      "samplerMetallicMap"
    );

    this.u_irradianceMap = gl.getUniformLocation(
      this.shaderProgram,
      "u_irradianceMap"
    );
    this.u_sampler_LUT = gl.getUniformLocation(
      this.shaderProgram,
      "u_sampler_LUT"
    );
    this.u_skyBox = gl.getUniformLocation(this.shaderProgram, "u_skyBox");
    this.u_samplerAOMap = gl.getUniformLocation(
      this.shaderProgram,
      "samplerAOMap"
    );

    this.u_diffuse = gl.getUniformLocation(this.shaderProgram, "u_diffuse");
    this.u_normalPower = gl.getUniformLocation(
      this.shaderProgram,
      "u_normalPower"
    );

    this.u_albedo = gl.getUniformLocation(this.shaderProgram, "u_albedo");
    this.u_metallic = gl.getUniformLocation(this.shaderProgram, "u_metallic");
    this.u_roughness = gl.getUniformLocation(this.shaderProgram, "u_roughness");
    this.u_ao = gl.getUniformLocation(this.shaderProgram, "u_ao");
  }

  // setMaterial(index, textureMaterial) {

  //     this.material[index].tex = textureMaterial.tex;
  //     this.material[index].tex_normal = textureMaterial.tex_normal;
  //     this.material[index].tex_roughness = textureMaterial.tex_roughness;
  //     this.material[index].tex_metallic = textureMaterial.tex_metallic;
  //     this.material[index].tex_AO = textureMaterial.tex_AO;
  // }
}

export class Material {
  constructor(name) {
    this.name = name;
    this.texture = {
      tex: "",
      tex_normal: "",
      tex_roughness: "",
      tex_metallic: "",
      tex_AO: "",
    };
  }

  settingTextue(textureSetting) {
    this.texture.tex = textureSetting.tex;
    this.texture.tex_normal = textureSetting.tex_normal;
    this.texture.tex_roughness = textureSetting.tex_roughness;
    this.texture.tex_metallic = textureSetting.tex_metallic;
    this.texture.tex_AO = textureSetting.tex_AO;
  }
}

export function getShader(gl, id, str) {
  var shader;
  if (id == "vs") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else if (id == "fs") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else {
    return null;
  }
  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

export function getProgram(gl, vShader, fShader) {
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vShader);
  gl.attachShader(shaderProgram, fShader);
  gl.linkProgram(shaderProgram);
  //gl.useProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    var info = gl.getProgramInfoLog(shaderProgram);
    throw "Could not compile WebGL program. \n\n" + info;
  }

  return shaderProgram;
}

export function createDomShaderProgram(gl, vectId, fragId) {
  var vShaderTxt = document.getElementById(vectId).text;
  if (!vShaderTxt) return null;
  var fShaderTxt = document.getElementById(fragId).text;
  if (!fShaderTxt) return null;
  var vShader = getShader(gl, "vs", vShaderTxt);
  if (!vShader) return null;
  var fShader = getShader(gl, "fs", fShaderTxt);
  if (!fShader) return null;

  if (!fShader) {
    gl.deleteShader(vShader);
    return null;
  }

  var shaderProgram = getProgram(gl, vShader, fShader);

  return shaderProgram;
}

//--- Promise ---//
export async function LoadShaderTextUsingPromise(URL) {
  let promise = new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", URL, true);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => resolve(console.log(xhr.statusText));
    xhr.send();
  });

  return promise;
}

export async function createPromiseShaderProgram(gl, URL_vs, URL_fs) {
  let vertex_shader_promise = await LoadShaderTextUsingPromise(URL_vs);
  let fragment_shader_promise = await LoadShaderTextUsingPromise(URL_fs);

  let shaderProgram = await Promise.all([
    vertex_shader_promise,
    fragment_shader_promise,
  ])
    .then((data) => {
      let vShaderTxt = data[0];
      let fShaderTxt = data[1];
      let vShader = getShader(gl, "vs", vShaderTxt);
      if (!vShader) return null;
      let fShader = getShader(gl, "fs", fShaderTxt);
      if (!fShader) return null;

      if (!fShader) {
        gl.deleteShader(vShader);
        return null;
      }
      let shaderProgram = getProgram(gl, vShader, fShader);
      return shaderProgram;
    })
    .catch((e) => console.log(e));

  return shaderProgram;
}

export async function getShaderProgram(gl, VS_src, FS_src) {
  const shaderProgram = await createPromiseShaderProgram(gl, VS_src, FS_src);
  return shaderProgram;
}

export async function createShaderProgramFromJSobj(gl, shaderSrc) {
  
  let vShader = getShader(gl, "vs", shaderSrc.vertex);   if (!vShader) return null;
  let fShader = getShader(gl, "fs", shaderSrc.fragment); if (!fShader) return null;
  
  if (!fShader) {
    gl.deleteShader(vShader);
    return null;
  }

  if (!fShader) {
    gl.deleteShader(vShader);
    return null;
  }
  
  let shaderProgram = getProgram(gl, vShader, fShader);
  return shaderProgram;
}
