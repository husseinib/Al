"use strict";(self.webpackChunkal=self.webpackChunkal||[]).push([[188],{5611:(e,t,r)=>{r.d(t,{I:()=>function({bits:e,name:t}){return new i.M({name:t,...function({template:e,bits:t}){var r=g(e,t);return f[r]||(f[r]=v(e.vertex,e.fragment,t)),f[r]}({template:{vertex:y,fragment:P},bits:[M,...e]})})},v:()=>function({bits:e,name:t}){e=function({template:e,bits:t}){var r=g(e,t);var i;return f[r]||({vertex:e,fragment:i}=function(e,t){var r=t.map(e=>e.vertex).filter(e=>!!e),t=t.map(e=>e.fragment).filter(e=>!!e);var i=d(r,e.vertex,!0);i=function(e,t){const r=[];c(t,r),e.forEach(e=>{e.header&&c(e.header,r)});let i=0;var e=r.sort().map(e=>-1<e.indexOf("builtin")?e:`@location(${i++}) `+e).join(",\n"),o=r.sort().map(e=>{return`       var ${e=e,e.replace(/@.*?\s+/g,"")};`}).join("\n"),n=`return VSOutput(
                ${r.sort().map(e=>" "+function(e){e=/\b(\w+)\s*:/g.exec(e);return e?e[1]:""}(e)).join(",\n")});`;let s=t.replace(/@out\s+[^;]+;\s*/g,"");return s=(s=(s=s.replace("{{struct}}",`
${e}
`)).replace("{{start}}",`
${o}
`)).replace("{{return}}",`
${n}
`)}(r,i);r=d(t,e.fragment,!0);return{vertex:i,fragment:r}}(e,t),f[r]=v(e,i,t)),f[r]}({template:{fragment:b,vertex:x},bits:[_,...e]});return o.B.from({name:t,vertex:{source:e.vertex,entryPoint:"main"},fragment:{source:e.fragment,entryPoint:"main"}})}});var i=r(9114),o=r(3012),n=r(268);function s(t,e,r){if(t)for(const o in t){var i=e[o.toLocaleLowerCase()];if(i){let e=t[o];"header"===o&&(e=e.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),r&&i.push(`//----${r}----//`),i.push(e)}else(0,n.R)(o+" placement hook does not exist in shader")}}const a=/\{\{(.*?)\}\}/g;function u(e){const t={};return(e.match(a)?.map(e=>e.replace(/[{()}]/g,""))??[]).forEach(e=>{t[e]=[]}),t}function l(e,t){for(var r,i=/@in\s+([^;]+);/g;null!==(r=i.exec(e));)t.push(r[1])}function d(e,t,r=!1){const i=[];l(t,i),e.forEach(e=>{e.header&&l(e.header,i)});e=i,r&&e.sort(),r=e.map((e,t)=>`       @location(${t}) ${e},`).join("\n");let o=t.replace(/@in\s+[^;]+;\s*/g,"");return o=o.replace("{{in}}",`
${r}
`)}function c(e,t){for(var r,i=/@out\s+([^;]+);/g;null!==(r=i.exec(e));)t.push(r[1])}function m(e,t){let r=e;for(const n in t){var i=t[n],o=i.join("\n");r=o.length?r.replace(`{{${n}}}`,`//-----${n} START-----//
${i.join("\n")}
//----${n} FINISH----//`):r.replace(`{{${n}}}`,"")}return r}const f=Object.create(null),h=new Map;let p=0;function g(e,t){return t.map(e=>(h.has(e)||h.set(e,p++),h.get(e))).sort((e,t)=>e-t).join("-")+e.vertex+e.fragment}function v(e,t,r){const i=u(e),o=u(t);return r.forEach(e=>{s(e.vertex,i,e.name),s(e.fragment,o,e.name)}),{vertex:m(e,i),fragment:m(t,o)}}const x=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}
        
        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);
       
        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,b=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;
   
    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {
        
        {{start}}

        var outColor:vec4<f32>;
      
        {{main}}
        
        return outColor * vColor;
      };
`,y=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;
        
        {{start}}
        
        vColor = vec4(1.);
        
        {{main}}
        
        vUV = uv;
        
        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,P=`
   
    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {
        
        {{start}}

        vec4 outColor;
      
        {{main}}
        
        finalColor = outColor * vColor;
    }
`,_={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}};const M={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}}},4459:(e,t,r)=>{r.d(t,{F:()=>i,a:()=>o});const i={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},o={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}}},4e3:(e,t,r)=>{r.d(t,{P:()=>function(e){o[e]||(o[e]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;
              
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;
    
                uniform sampler2D uTextures[${e}];
              
            `,main:`
    
                ${function(t){var r=[];for(let e=0;e<t;e++)0<e&&r.push("else"),e<t-1&&r.push(`if(vTextureId < ${e}.5)`),r.push("{"),r.push(`	outColor = texture(uTextures[${e}], vUV);`),r.push("}");return r.join("\n")}(16)}
            `}});return o[e]},_:()=>function(e){i[e]||(i[e]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;
    
                ${function(r){var i=[];if(1===r)i.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),i.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let t=0;for(let e=0;e<r;e++)i.push(`@group(1) @binding(${t++}) var textureSource${e+1}: texture_2d<f32>;`),i.push(`@group(1) @binding(${t++}) var textureSampler${e+1}: sampler;`)}return i.join("\n")}(16)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);
    
                ${function(t){var r=[];if(1===t)r.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{r.push("switch vTextureId {");for(let e=0;e<t;e++)e===t-1?r.push("  default:{"):r.push(`  case ${e}:{`),r.push(`      outColor = textureSampleGrad(textureSource${e+1}, textureSampler${e+1}, vUV, uvDx, uvDy);`),r.push("      break;}");r.push("}")}return r.join("\n")}(16)}
            `}});return i[e]}});const i={};const o={}},2067:(e,t,r)=>{r.d(t,{Ls:()=>i,_Q:()=>o,mA:()=>n});const i={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},o={...i,vertex:{...i.vertex,header:i.vertex.header.replace("group(1)","group(2)")}},n={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}}},6665:(e,t,r)=>{r.d(t,{b:()=>i,m:()=>o});const i={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},o={name:"round-pixels-bit",vertex:{header:`   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}}},9114:(e,t,r)=>{r.d(t,{M:()=>f});var n=r(7952),i=r(1761);let o;let s;function a(){var e,t;return s||(s="mediump",o&&!o?.isContextLost()||(t=i.e.get().createCanvas(),o=t.getContext("webgl",{})),(t=o)&&t.getShaderPrecisionFormat&&(e=t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT),s=e.precision?"highp":"mediump")),s}const u={},l={};const d={stripVersion:function(e,t){return t?e.replace("#version 300 es",""):e},ensurePrecision:function(t,r,i){var o=i?r.maxSupportedFragmentPrecision:r.maxSupportedVertexPrecision;if("precision"===t.substring(0,9))return"highp"!==o&&"precision highp"===t.substring(0,15)?t.replace("precision highp","precision mediump"):t;{let e=i?r.requestedFragmentPrecision:r.requestedVertexPrecision;return`precision ${e="highp"===e&&"highp"!==o?"mediump":e} float;
`+t}},addProgramDefines:function(e,t,r){return t?e:r?`
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${e=e.replace("out vec4 finalColor;","")}
        `:`
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${e}
        `},setProgramName:function(e,{name:t="pixi-program"},r=!0){return t=t.replace(/\s+/g,"-"),t+=r?"-fragment":"-vertex",(r=r?u:l)[t]?(r[t]++,t+="-"+r[t]):r[t]=1,-1!==e.indexOf("#define SHADER_NAME")?e:"#define SHADER_NAME "+t+`
`+e},insertVersion:function(e,t){return t?`#version 300 es
`+e:e}},c=Object.create(null),m=class m{constructor(e){var t=-1!==(e={...m.defaultOptions,...e}).fragment.indexOf("#version 300 es");const r={stripVersion:t,ensurePrecision:{requestedFragmentPrecision:e.preferredFragmentPrecision,requestedVertexPrecision:e.preferredVertexPrecision,maxSupportedVertexPrecision:"highp",maxSupportedFragmentPrecision:a()},setProgramName:{name:e.name},addProgramDefines:t,insertVersion:t};let i=e.fragment,o=e.vertex;Object.keys(d).forEach(e=>{var t=r[e];i=d[e](i,t,!0),o=d[e](o,t,!1)}),this.fragment=i,this.vertex=o,this._key=(0,n.X)(this.vertex+":"+this.fragment,"gl-program")}destroy(){this.fragment=null,this.vertex=null,this._attributeData=null,this._uniformData=null,this._uniformBlockData=null,this.transformFeedbackVaryings=null}static from(e){var t=e.vertex+":"+e.fragment;return c[t]||(c[t]=new m(e)),c[t]}};m.defaultOptions={preferredVertexPrecision:"highp",preferredFragmentPrecision:"mediump"};let f=m},3012:(e,t,r)=>{r.d(t,{B:()=>a});var i=r(7952),u=r(8306);const l={f32:"float32","vec2<f32>":"float32x2","vec3<f32>":"float32x3","vec4<f32>":"float32x4",vec2f:"float32x2",vec3f:"float32x3",vec4f:"float32x4",i32:"sint32","vec2<i32>":"sint32x2","vec3<i32>":"sint32x3","vec4<i32>":"sint32x4",u32:"uint32","vec2<u32>":"uint32x2","vec3<u32>":"uint32x3","vec4<u32>":"uint32x4",bool:"uint32","vec2<bool>":"uint32x2","vec3<bool>":"uint32x3","vec4<bool>":"uint32x4"};function n(e){const t=/@group\((\d+)\)/,r=/@binding\((\d+)\)/,i=/var(<[^>]+>)? (\w+)/,o=/:\s*(\w+)/;const n=/(\w+)\s*:\s*([\w\<\>]+)/g,s=/struct\s+(\w+)/,a=e.match(/(^|[^/])@(group|binding)\(\d+\)[^;]+;/g)?.map(e=>({group:parseInt(e.match(t)[1],10),binding:parseInt(e.match(r)[1],10),name:e.match(i)[2],isUniform:"<uniform>"===e.match(i)[1],type:e.match(o)[1]}));return a?(e=e.match(/struct\s+(\w+)\s*{([^}]+)}/g)?.map(e=>{var t=e.match(s)[1],e=e.match(n).reduce((e,t)=>{var[t,r]=t.split(":");return e[t.trim()]=r.trim(),e},{});return e?{name:t,members:e}:null}).filter(({name:t})=>a.some(e=>e.type===t))??[],{groups:a,structs:e}):{groups:[],structs:[]}}var s=(e=>(e[e.VERTEX=1]="VERTEX",e[e.FRAGMENT=2]="FRAGMENT",e[e.COMPUTE=4]="COMPUTE",e))({});const o=Object.create(null);class a{constructor(e){this._layoutKey=0;var{fragment:e,vertex:t,layout:r,gpuLayout:i,name:o}=e;this.name=o,this.fragment=e,this.vertex=t,e.source===t.source?(o=n(e.source),this.structsAndGroups=o):(o=n(t.source),t=n(e.source),this.structsAndGroups=function(e,t){const r=new Set,i=new Set;return{structs:[...e.structs,...t.structs].filter(e=>!r.has(e.name)&&(r.add(e.name),!0)),groups:[...e.groups,...t.groups].filter(e=>{e=e.name+"-"+e.binding;return!i.has(e)&&(i.add(e),!0)})}}(o,t)),this.layout=r??function({groups:t}){var r=[];for(let e=0;e<t.length;e++){var i=t[e];r[i.group]||(r[i.group]={}),r[i.group][i.name]=i.binding}return r}(this.structsAndGroups),this.gpuLayout=i??function({groups:t}){var r=[];for(let e=0;e<t.length;e++){var i=t[e];r[i.group]||(r[i.group]=[]),i.isUniform?r[i.group].push({binding:i.binding,visibility:s.VERTEX|s.FRAGMENT,buffer:{type:"uniform"}}):"sampler"===i.type?r[i.group].push({binding:i.binding,visibility:s.FRAGMENT,sampler:{type:"filtering"}}):"texture_2d"===i.type&&r[i.group].push({binding:i.binding,visibility:s.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d",multisampled:!1}})}return r}(this.structsAndGroups),this.autoAssignGlobalUniforms=!(void 0===this.layout[0]?.globalUniforms),this.autoAssignLocalUniforms=!(void 0===this.layout[1]?.localUniforms),this._generateProgramKey()}_generateProgramKey(){var{vertex:e,fragment:t}=this,e=e.source+t.source+e.entryPoint+t.entryPoint;this._layoutKey=(0,i.X)(e,"program")}get attributeData(){return this._attributeData??(this._attributeData=function({source:e,entryPoint:t}){var r={};if(-1!==(t=e.indexOf("fn "+t))){var i=e.indexOf("->",t);if(-1!==i)for(var o,n=e.substring(t,i),s=/@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;null!==(o=s.exec(n));){var a=l[o[3]]??"float32";r[o[2]]={location:parseInt(o[1],10),format:a,stride:(0,u.m)(a).stride,offset:0,instance:!1,start:0}}}return r}(this.vertex)),this._attributeData}destroy(){this.gpuLayout=null,this.layout=null,this.structsAndGroups=null,this.fragment=null,this.vertex=null}static from(e){var t=`${e.vertex.source}:${e.fragment.source}:${e.fragment.entryPoint}:`+e.vertex.entryPoint;return o[t]||(o[t]=new a(e)),o[t]}}},8306:(e,t,r)=>{r.d(t,{m:()=>function(e){return i[e]??i.float32}});const i={uint8x2:{size:2,stride:2,normalised:!1},uint8x4:{size:4,stride:4,normalised:!1},sint8x2:{size:2,stride:2,normalised:!1},sint8x4:{size:4,stride:4,normalised:!1},unorm8x2:{size:2,stride:2,normalised:!0},unorm8x4:{size:4,stride:4,normalised:!0},snorm8x2:{size:2,stride:2,normalised:!0},snorm8x4:{size:4,stride:4,normalised:!0},uint16x2:{size:2,stride:4,normalised:!1},uint16x4:{size:4,stride:8,normalised:!1},sint16x2:{size:2,stride:4,normalised:!1},sint16x4:{size:4,stride:8,normalised:!1},unorm16x2:{size:2,stride:4,normalised:!0},unorm16x4:{size:4,stride:8,normalised:!0},snorm16x2:{size:2,stride:4,normalised:!0},snorm16x4:{size:4,stride:8,normalised:!0},float16x2:{size:2,stride:4,normalised:!1},float16x4:{size:4,stride:8,normalised:!1},float32:{size:1,stride:4,normalised:!1},float32x2:{size:2,stride:8,normalised:!1},float32x3:{size:3,stride:12,normalised:!1},float32x4:{size:4,stride:16,normalised:!1},uint32:{size:1,stride:4,normalised:!1},uint32x2:{size:2,stride:8,normalised:!1},uint32x3:{size:3,stride:12,normalised:!1},uint32x4:{size:4,stride:16,normalised:!1},sint32:{size:1,stride:4,normalised:!1},sint32x2:{size:2,stride:8,normalised:!1},sint32x3:{size:3,stride:12,normalised:!1},sint32x4:{size:4,stride:16,normalised:!1}}},8475:(e,t,r)=>{r.d(t,{M:()=>u});var t=r(4486),s=r(9114),h=r(3513),a=r(3012),p=r(5099),g=r(7222);class u extends t.A{constructor(e){super(),this._uniformBindMap=Object.create(null),this._ownedBindGroups=[];let{gpuProgram:t,glProgram:r,groups:i,resources:o,compatibleRenderers:n,groupMap:s}=e;this.gpuProgram=t,this.glProgram=r,void 0===n&&(n=0,t&&(n|=p.W.WEBGPU),r)&&(n|=p.W.WEBGL),this.compatibleRenderers=n;const a={};if((o=o||i?o:{})&&i)throw new Error("[Shader] Cannot have both resources and groups");if(!t&&i&&!s)throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");if(!t&&i&&s)for(const d in s)for(const c in s[d]){var u=s[d][c];a[u]={group:d,binding:c,name:u}}else if(t&&i&&!s){e=t.structsAndGroups.groups;s={},e.forEach(e=>{s[e.group]=s[e.group]||{},s[e.group][e.binding]=e.name,a[e.name]=e})}else if(o){if(t){e=t.structsAndGroups.groups;s={},e.forEach(e=>{s[e.group]=s[e.group]||{},s[e.group][e.binding]=e.name,a[e.name]=e})}else{s={},i={99:new h.T},this._ownedBindGroups.push(i[99]);let e=0;for(const m in o)a[m]={group:99,binding:e,name:m},s[99]=s[99]||{},s[99][e]=m,e++}i={};for(const f in o){var l=f;let e=o[f];e.source||e._resourceType||(e=new g.k(e));l=a[l];l&&(i[l.group]||(i[l.group]=new h.T,this._ownedBindGroups.push(i[l.group])),i[l.group].setResource(e,l.binding))}}this.groups=i,this._uniformBindMap=s,this.resources=this._buildResourceAccessor(i,a)}addResource(e,t,r){var i;(i=this._uniformBindMap)[t]||(i[t]={}),(i=this._uniformBindMap[t])[r]||(i[r]=e),this.groups[t]||(this.groups[t]=new h.T,this._ownedBindGroups.push(this.groups[t]))}_buildResourceAccessor(t,e){var r={};for(const i in e){const o=e[i];Object.defineProperty(r,o.name,{get(){return t[o.group].getResource(o.binding)},set(e){t[o.group].setResource(e,o.binding)}})}return r}destroy(e=!1){this.emit("destroy",this),e&&(this.gpuProgram?.destroy(),this.glProgram?.destroy()),this.gpuProgram=null,this.glProgram=null,this.removeAllListeners(),this._uniformBindMap=null,this._ownedBindGroups.forEach(e=>{e.destroy()}),this._ownedBindGroups=null,this.resources=null,this.groups=null}static from(e){const{gpu:t,gl:r,...i}=e;let o,n;return t&&(o=a.B.from(t)),r&&(n=s.M.from(r)),new u({gpuProgram:o,glProgram:n,...i})}}},7222:(e,t,r)=>{r.d(t,{k:()=>i});var n=r(133),s=r(7952);const a=class a{constructor(t,e){this._touched=0,this.uid=(0,n.L)("uniform"),this._resourceType="uniformGroup",this._resourceId=(0,n.L)("resource"),this.isUniformGroup=!0,this._dirtyId=0,this.destroyed=!1,e={...a.defaultOptions,...e};var r={};for(const o in this.uniformStructures=t){var i=t[o];i.name=o,i.size=i.size??1,i.value??(i.value=function(e,t){switch(e){case"f32":return 0;case"vec2<f32>":return new Float32Array(2*t);case"vec3<f32>":return new Float32Array(3*t);case"vec4<f32>":return new Float32Array(4*t);case"mat2x2<f32>":return new Float32Array([1,0,0,1]);case"mat3x3<f32>":return new Float32Array([1,0,0,0,1,0,0,0,1]);case"mat4x4<f32>":return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return null}(i.type,i.size)),r[o]=i.value}this.uniforms=r,this._dirtyId=1,this.ubo=e.ubo,this.isStatic=e.isStatic,this._signature=(0,s.X)(Object.keys(r).map(e=>e+"-"+t[e].type).join("-"),"uniform-group")}update(){this._dirtyId++}};a.defaultOptions={ubo:!1,isStatic:!1};let i=a},7547:(e,t,r)=>{r.d(t,{U:()=>n});const i={normal:0,add:1,multiply:2,screen:3,overlay:4,erase:5,"normal-npm":6,"add-npm":7,"screen-npm":8},o=class o{constructor(){this.data=0,this.blendMode="normal",this.polygonOffset=0,this.blend=!0,this.depthMask=!0}get blend(){return!!(1&this.data)}set blend(e){!!(1&this.data)!==e&&(this.data^=1)}get offsets(){return!!(2&this.data)}set offsets(e){!!(2&this.data)!==e&&(this.data^=2)}set cullMode(e){"none"===e?this.culling=!1:(this.culling=!0,this.clockwiseFrontFace="front"===e)}get cullMode(){return this.culling?this.clockwiseFrontFace?"front":"back":"none"}get culling(){return!!(4&this.data)}set culling(e){!!(4&this.data)!==e&&(this.data^=4)}get depthTest(){return!!(8&this.data)}set depthTest(e){!!(8&this.data)!==e&&(this.data^=8)}get depthMask(){return!!(32&this.data)}set depthMask(e){!!(32&this.data)!==e&&(this.data^=32)}get clockwiseFrontFace(){return!!(16&this.data)}set clockwiseFrontFace(e){!!(16&this.data)!==e&&(this.data^=16)}get blendMode(){return this._blendMode}set blendMode(e){this.blend="none"!==e,this._blendMode=e,this._blendModeId=i[e]||0}get polygonOffset(){return this._polygonOffset}set polygonOffset(e){this.offsets=!!e,this._polygonOffset=e}toString(){return`[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`}static for2d(){var e=new o;return e.depthTest=!1,e.blend=!0,e}};o.default2d=o.for2d();let n=o},2437:(e,t,r)=>{r.d(t,{W:()=>s});var u=r(9939),i=r(6932),o=r(4492);let n=0;const s=new class{constructor(e){this._poolKeyHash=Object.create(null),this._texturePool={},this.textureOptions=e||{},this.enableFullScreen=!1}createTexture(e,t,r){e=new i.v({...this.textureOptions,width:e,height:t,resolution:1,antialias:r,autoGarbageCollect:!0});return new o.g({source:e,label:"texturePool_"+n++})}getOptimalTexture(e,t,r=1,i){var o=Math.ceil(e*r-1e-6),n=Math.ceil(t*r-1e-6),s=((o=(0,u.U5)(o))<<17)+((n=(0,u.U5)(n))<<1)+(i?1:0);this._texturePool[s]||(this._texturePool[s]=[]);let a=this._texturePool[s].pop();return(a=a||this.createTexture(o,n,i)).source._resolution=r,a.source.width=o/r,a.source.height=n/r,a.source.pixelWidth=o,a.source.pixelHeight=n,a.frame.x=0,a.frame.y=0,a.frame.width=e,a.frame.height=t,a.updateUvs(),this._poolKeyHash[a.uid]=s,a}getSameSizeTexture(e,t=!1){var r=e.source;return this.getOptimalTexture(e.width,e.height,r._resolution,t)}returnTexture(e){var t=this._poolKeyHash[e.uid];this._texturePool[t].push(e)}clear(e){if(e=!1!==e)for(const r in this._texturePool){var t=this._texturePool[r];if(t)for(let e=0;e<t.length;e++)t[e].destroy(!0)}this._texturePool={}}}},7952:(e,t,r)=>{r.d(t,{X:()=>function(e,t){let r=o[e];void 0===r&&(void 0===i[t]&&(i[t]=1),o[e]=r=i[t]++);return r}});const i=Object.create(null),o=Object.create(null)},5099:(e,t,r)=>{r.d(t,{W:()=>i});var i=(e=>(e[e.WEBGL=1]="WEBGL",e[e.WEBGPU=2]="WEBGPU",e[e.BOTH=3]="BOTH",e))(i||{})},2760:(e,t,r)=>{r.d(t,{V:()=>function(e,t,r){var i=(e>>24&255)/255;t[r++]=(255&e)/255*i,t[r++]=(e>>8&255)/255*i,t[r++]=(e>>16&255)/255*i,t[r++]=i}})},8422:(e,t,r)=>{r.d(t,{K:()=>i});class i{constructor(){this.vertexSize=4,this.indexSize=6,this.location=0,this.batcher=null,this.batch=null,this.roundPixels=0}get blendMode(){return this.renderable.groupBlendMode}packAttributes(e,t,r,i){var o=this.renderable,n=this.texture,s=o.groupTransform,a=s.a,u=s.b,l=s.c,d=s.d,c=s.tx,s=s.ty,m=this.bounds,f=m.maxX,h=m.minX,p=m.maxY,m=m.minY,n=n.uvs,o=o.groupColorAlpha,i=i<<16|65535&this.roundPixels;e[r+0]=a*h+l*m+c,e[r+1]=d*m+u*h+s,e[r+2]=n.x0,e[r+3]=n.y0,t[r+4]=o,t[r+5]=i,e[r+6]=a*f+l*m+c,e[r+7]=d*m+u*f+s,e[r+8]=n.x1,e[r+9]=n.y1,t[r+10]=o,t[r+11]=i,e[r+12]=a*f+l*p+c,e[r+13]=d*p+u*f+s,e[r+14]=n.x2,e[r+15]=n.y2,t[r+16]=o,t[r+17]=i,e[r+18]=a*h+l*p+c,e[r+19]=d*p+u*h+s,e[r+20]=n.x3,e[r+21]=n.y3,t[r+22]=o,t[r+23]=i}packIndex(e,t,r){e[t]=r+0,e[t+1]=r+1,e[t+2]=r+2,e[t+3]=r+0,e[t+4]=r+2,e[t+5]=r+3}reset(){this.renderable=null,this.texture=null,this.batcher=null,this.batch=null,this.bounds=null}}}}]);