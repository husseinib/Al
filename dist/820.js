"use strict";(self.webpackChunkal=self.webpackChunkal||[]).push([[820],{8634:(t,e,r)=>{r.d(e,{J:()=>a});var i=r(949),s=r(1132),e=r(6011);const n=new Float32Array(1),o=new Uint32Array(1);class a extends e.V{constructor(){var t=new i.h({data:n,label:"attribute-batch-buffer",usage:s.S.VERTEX|s.S.COPY_DST,shrinkToFit:!1});super({attributes:{aPosition:{buffer:t,format:"float32x2",stride:24,offset:0,location:1},aUV:{buffer:t,format:"float32x2",stride:24,offset:8,location:3},aColor:{buffer:t,format:"unorm8x4",stride:24,offset:16,location:0},aTextureIdAndRound:{buffer:t,format:"uint16x2",stride:24,offset:20,location:2}},indexBuffer:new i.h({data:o,label:"index-batch-buffer",usage:s.S.INDEX|s.S.COPY_DST,shrinkToFit:!1})})}}},1478:(t,e,r)=>{r.d(e,{i:()=>u});var i=r(133);class s{constructor(t){"number"==typeof t?this.rawBinaryData=new ArrayBuffer(t):t instanceof Uint8Array?this.rawBinaryData=t.buffer:this.rawBinaryData=t,this.uint32View=new Uint32Array(this.rawBinaryData),this.float32View=new Float32Array(this.rawBinaryData),this.size=this.rawBinaryData.byteLength}get int8View(){return this._int8View||(this._int8View=new Int8Array(this.rawBinaryData)),this._int8View}get uint8View(){return this._uint8View||(this._uint8View=new Uint8Array(this.rawBinaryData)),this._uint8View}get int16View(){return this._int16View||(this._int16View=new Int16Array(this.rawBinaryData)),this._int16View}get int32View(){return this._int32View||(this._int32View=new Int32Array(this.rawBinaryData)),this._int32View}get float64View(){return this._float64Array||(this._float64Array=new Float64Array(this.rawBinaryData)),this._float64Array}get bigUint64View(){return this._bigUint64Array||(this._bigUint64Array=new BigUint64Array(this.rawBinaryData)),this._bigUint64Array}view(t){return this[t+"View"]}destroy(){this.rawBinaryData=null,this._int8View=null,this._uint8View=null,this._int16View=null,this.uint16View=null,this._int32View=null,this.uint32View=null,this.float32View=null}static sizeOf(t){switch(t){case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;default:throw new Error(t+" isn't a valid view type")}}}var n=r(6736),o=r(1957);function x(t,e){return"no-premultiply-alpha"===e.alphaMode&&o.Q[t]||t}class g{constructor(){this.ids=Object.create(null),this.textures=[],this.count=0}clear(){for(let t=0;t<this.count;t++){var e=this.textures[t];this.textures[t]=null,this.ids[e.uid]=null}this.count=0}}var v=r(9104);class b{constructor(){this.renderPipeId="batch",this.action="startBatch",this.start=0,this.size=0,this.blendMode="normal",this.canBundle=!0}destroy(){this.textures=null,this.gpuBindGroup=null,this.bindGroup=null,this.batcher=null}}let _=0;const a=class a{constructor(t={}){this.uid=(0,i.L)("batcher"),this.dirty=!0,this.batchIndex=0,this.batches=[],this._vertexSize=6,this._elements=[],this._batchPool=[],this._batchPoolIndex=0,this._textureBatchPool=[],this._textureBatchPoolIndex=0;var{vertexSize:t,indexSize:e}=t={...a.defaultOptions,...t};this.attributeBuffer=new s(t*this._vertexSize*4),this.indexBuffer=new Uint16Array(e)}begin(){this.batchIndex=0,this.elementSize=0,this.elementStart=0,this.indexSize=0,this.attributeSize=0,this._batchPoolIndex=0,this._textureBatchPoolIndex=0,this._batchIndexStart=0,this._batchIndexSize=0,this.dirty=!0}add(t){(this._elements[this.elementSize++]=t).indexStart=this.indexSize,t.location=this.attributeSize,(t.batcher=this).indexSize+=t.indexSize,this.attributeSize+=t.vertexSize*this._vertexSize}checkAndUpdateTexture(t,e){var r=t.batch.textures.ids[e._source.uid];return!(!r&&0!==r||(t.textureId=r,t.texture=e,0))}updateElement(t){this.dirty=!0,t.packAttributes(this.attributeBuffer.float32View,this.attributeBuffer.uint32View,t.location,t.textureId)}break(o){var a=this._elements;let u=this._textureBatchPool[this._textureBatchPoolIndex++]||new g;if(u.clear(),a[this.elementStart]){var t=a[this.elementStart];let e=x(t.blendMode,t.texture._source);4*this.attributeSize>this.attributeBuffer.size&&this._resizeAttributeBuffer(4*this.attributeSize),this.indexSize>this.indexBuffer.length&&this._resizeIndexBuffer(this.indexSize);var l=this.attributeBuffer.float32View,h=this.attributeBuffer.uint32View,d=this.indexBuffer;let r=this._batchIndexSize,i=this._batchIndexStart,s="startBatch",n=this._batchPool[this._batchPoolIndex++]||new b;for(let t=this.elementStart;t<this.elementSize;++t){var c=a[t],f=(a[t]=null,c.texture),f=f._source,m=x(c.blendMode,f),p=e!==m;f._batchTick!==_||p?(f._batchTick=_,(u.count>=v.k||p)&&(this._finishBatch(n,i,r-i,u,e,o,s),s="renderBatch",i=r,e=m,(u=this._textureBatchPool[this._textureBatchPoolIndex++]||new g).clear(),n=this._batchPool[this._batchPoolIndex++]||new b,++_),c.textureId=f._textureBindLocation=u.count,u.ids[f.uid]=u.count,u.textures[u.count++]=f,c.batch=n,r+=c.indexSize,c.packAttributes(l,h,c.location,c.textureId),c.packIndex(d,c.indexStart,c.location/this._vertexSize)):(c.textureId=f._textureBindLocation,r+=c.indexSize,c.packAttributes(l,h,c.location,c.textureId),c.packIndex(d,c.indexStart,c.location/this._vertexSize),c.batch=n)}0<u.count&&(this._finishBatch(n,i,r-i,u,e,o,s),i=r,++_),this.elementStart=this.elementSize,this._batchIndexStart=i,this._batchIndexSize=r}}_finishBatch(t,e,r,i,s,n,o){t.gpuBindGroup=null,t.action=o,t.batcher=this,t.textures=i,t.blendMode=s,t.start=e,t.size=r,++_,n.add(t)}finish(t){this.break(t)}ensureAttributeBuffer(t){4*t<=this.attributeBuffer.size||this._resizeAttributeBuffer(4*t)}ensureIndexBuffer(t){t<=this.indexBuffer.length||this._resizeIndexBuffer(t)}_resizeAttributeBuffer(t){t=Math.max(t,2*this.attributeBuffer.size),t=new s(t);(0,n.W)(this.attributeBuffer.rawBinaryData,t.rawBinaryData),this.attributeBuffer=t}_resizeIndexBuffer(t){var e=this.indexBuffer,t=Math.max(t,1.5*e.length),r=new(65535<(t+=t%2)?Uint32Array:Uint16Array)(t);if(r.BYTES_PER_ELEMENT!==e.BYTES_PER_ELEMENT)for(let t=0;t<e.length;t++)r[t]=e[t];else(0,n.W)(e.buffer,r.buffer);this.indexBuffer=r}destroy(){for(let t=0;t<this.batches.length;t++)this.batches[t].destroy();this.batches=null;for(let t=0;t<this._elements.length;t++)this._elements[t].batch=null;this._elements=null,this.indexBuffer=null,this.attributeBuffer.destroy(),this.attributeBuffer=null}};a.defaultOptions={vertexSize:4,indexSize:6};let u=a},9104:(t,e,r)=>{r.d(e,{k:()=>i});const i=16},5611:(t,e,r)=>{r.d(e,{I:()=>function({bits:t,name:e}){return new i.M({name:e,...function({template:t,bits:e}){var r=x(t,e);return f[r]||(f[r]=g(t.vertex,t.fragment,e)),f[r]}({template:{vertex:_,fragment:y},bits:[S,...t]})})},v:()=>function({bits:t,name:e}){t=function({template:t,bits:e}){var r=x(t,e);var i;return f[r]||({vertex:t,fragment:i}=function(t,e){var r=e.map(t=>t.vertex).filter(t=>!!t),e=e.map(t=>t.fragment).filter(t=>!!t);var i=h(r,t.vertex,!0);i=function(t,e){const r=[];d(e,r),t.forEach(t=>{t.header&&d(t.header,r)});let i=0;var t=r.sort().map(t=>-1<t.indexOf("builtin")?t:`@location(${i++}) `+t).join(",\n"),s=r.sort().map(t=>{return`       var ${t=t,t.replace(/@.*?\s+/g,"")};`}).join("\n"),n=`return VSOutput(
                ${r.sort().map(t=>" "+function(t){t=/\b(\w+)\s*:/g.exec(t);return t?t[1]:""}(t)).join(",\n")});`;let o=e.replace(/@out\s+[^;]+;\s*/g,"");return o=(o=(o=o.replace("{{struct}}",`
${t}
`)).replace("{{start}}",`
${s}
`)).replace("{{return}}",`
${n}
`)}(r,i);r=h(e,t.fragment,!0);return{vertex:i,fragment:r}}(t,e),f[r]=g(t,i,e)),f[r]}({template:{fragment:b,vertex:v},bits:[w,...t]});return s.B.from({name:e,vertex:{source:t.vertex,entryPoint:"main"},fragment:{source:t.fragment,entryPoint:"main"}})}});var i=r(9114),s=r(3012),n=r(268);function o(e,t,r){if(e)for(const s in e){var i=t[s.toLocaleLowerCase()];if(i){let t=e[s];"header"===s&&(t=t.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),r&&i.push(`//----${r}----//`),i.push(t)}else(0,n.R)(s+" placement hook does not exist in shader")}}const a=/\{\{(.*?)\}\}/g;function u(t){const e={};return(t.match(a)?.map(t=>t.replace(/[{()}]/g,""))??[]).forEach(t=>{e[t]=[]}),e}function l(t,e){for(var r,i=/@in\s+([^;]+);/g;null!==(r=i.exec(t));)e.push(r[1])}function h(t,e,r=!1){const i=[];l(e,i),t.forEach(t=>{t.header&&l(t.header,i)});t=i,r&&t.sort(),r=t.map((t,e)=>`       @location(${e}) ${t},`).join("\n");let s=e.replace(/@in\s+[^;]+;\s*/g,"");return s=s.replace("{{in}}",`
${r}
`)}function d(t,e){for(var r,i=/@out\s+([^;]+);/g;null!==(r=i.exec(t));)e.push(r[1])}function c(t,e){let r=t;for(const n in e){var i=e[n],s=i.join("\n");r=s.length?r.replace(`{{${n}}}`,`//-----${n} START-----//
${i.join("\n")}
//----${n} FINISH----//`):r.replace(`{{${n}}}`,"")}return r}const f=Object.create(null),m=new Map;let p=0;function x(t,e){return e.map(t=>(m.has(t)||m.set(t,p++),m.get(t))).sort((t,e)=>t-e).join("-")+t.vertex+t.fragment}function g(t,e,r){const i=u(t),s=u(e);return r.forEach(t=>{o(t.vertex,i,t.name),o(t.fragment,s,t.name)}),{vertex:c(t,i),fragment:c(e,s)}}const v=`
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
`,_=`
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
`,y=`
   
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
`,w={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}};const S={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}}},4459:(t,e,r)=>{r.d(e,{F:()=>i,a:()=>s});const i={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},s={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}}},4e3:(t,e,r)=>{r.d(e,{P:()=>function(t){s[t]||(s[t]={name:"texture-batch-bit",vertex:{header:`
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
    
                uniform sampler2D uTextures[${t}];
              
            `,main:`
    
                ${function(e){var r=[];for(let t=0;t<e;t++)0<t&&r.push("else"),t<e-1&&r.push(`if(vTextureId < ${t}.5)`),r.push("{"),r.push(`	outColor = texture(uTextures[${t}], vUV);`),r.push("}");return r.join("\n")}(16)}
            `}});return s[t]},_:()=>function(t){i[t]||(i[t]={name:"texture-batch-bit",vertex:{header:`
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
    
                ${function(r){var i=[];if(1===r)i.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),i.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let e=0;for(let t=0;t<r;t++)i.push(`@group(1) @binding(${e++}) var textureSource${t+1}: texture_2d<f32>;`),i.push(`@group(1) @binding(${e++}) var textureSampler${t+1}: sampler;`)}return i.join("\n")}(16)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);
    
                ${function(e){var r=[];if(1===e)r.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{r.push("switch vTextureId {");for(let t=0;t<e;t++)t===e-1?r.push("  default:{"):r.push(`  case ${t}:{`),r.push(`      outColor = textureSampleGrad(textureSource${t+1}, textureSampler${t+1}, vUV, uvDx, uvDy);`),r.push("      break;}");r.push("}")}return r.join("\n")}(16)}
            `}});return i[t]}});const i={};const s={}},2067:(t,e,r)=>{r.d(e,{Ls:()=>i,_Q:()=>s,mA:()=>n});const i={name:"local-uniform-bit",vertex:{header:`

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
        `}},s={...i,vertex:{...i.vertex,header:i.vertex.header.replace("group(1)","group(2)")}},n={name:"local-uniform-bit",vertex:{header:`

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
        `}}},6665:(t,e,r)=>{r.d(e,{b:()=>i,m:()=>s});const i={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},s={name:"round-pixels-bit",vertex:{header:`   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}}},9114:(t,e,r)=>{r.d(e,{M:()=>f});var n=r(7952),i=r(1761);let s;let o;function a(){var t,e;return o||(o="mediump",s&&!s?.isContextLost()||(e=i.e.get().createCanvas(),s=e.getContext("webgl",{})),(e=s)&&e.getShaderPrecisionFormat&&(t=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT),o=t.precision?"highp":"mediump")),o}const u={},l={};const h={stripVersion:function(t,e){return e?t.replace("#version 300 es",""):t},ensurePrecision:function(e,r,i){var s=i?r.maxSupportedFragmentPrecision:r.maxSupportedVertexPrecision;if("precision"===e.substring(0,9))return"highp"!==s&&"precision highp"===e.substring(0,15)?e.replace("precision highp","precision mediump"):e;{let t=i?r.requestedFragmentPrecision:r.requestedVertexPrecision;return`precision ${t="highp"===t&&"highp"!==s?"mediump":t} float;
`+e}},addProgramDefines:function(t,e,r){return e?t:r?`
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${t=t.replace("out vec4 finalColor;","")}
        `:`
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${t}
        `},setProgramName:function(t,{name:e="pixi-program"},r=!0){return e=e.replace(/\s+/g,"-"),e+=r?"-fragment":"-vertex",(r=r?u:l)[e]?(r[e]++,e+="-"+r[e]):r[e]=1,-1!==t.indexOf("#define SHADER_NAME")?t:"#define SHADER_NAME "+e+`
`+t},insertVersion:function(t,e){return e?`#version 300 es
`+t:t}},d=Object.create(null),c=class c{constructor(t){var e=-1!==(t={...c.defaultOptions,...t}).fragment.indexOf("#version 300 es");const r={stripVersion:e,ensurePrecision:{requestedFragmentPrecision:t.preferredFragmentPrecision,requestedVertexPrecision:t.preferredVertexPrecision,maxSupportedVertexPrecision:"highp",maxSupportedFragmentPrecision:a()},setProgramName:{name:t.name},addProgramDefines:e,insertVersion:e};let i=t.fragment,s=t.vertex;Object.keys(h).forEach(t=>{var e=r[t];i=h[t](i,e,!0),s=h[t](s,e,!1)}),this.fragment=i,this.vertex=s,this._key=(0,n.X)(this.vertex+":"+this.fragment,"gl-program")}destroy(){this.fragment=null,this.vertex=null,this._attributeData=null,this._uniformData=null,this._uniformBlockData=null,this.transformFeedbackVaryings=null}static from(t){var e=t.vertex+":"+t.fragment;return d[e]||(d[e]=new c(t)),d[e]}};c.defaultOptions={preferredVertexPrecision:"highp",preferredFragmentPrecision:"mediump"};let f=c},3513:(t,e,r)=>{r.d(e,{T:()=>i});class i{constructor(t){this.resources=Object.create(null),this._dirty=!0;let e=0;for(const i in t){var r=t[i];this.setResource(r,e++)}this._updateKey()}_updateKey(){if(this._dirty){this._dirty=!1;var e=[];let t=0;for(const r in this.resources)e[t++]=this.resources[r]._resourceId;this._key=e.join("|")}}setResource(t,e){var r=this.resources[e];t!==r&&(r&&t.off?.("change",this.onResourceChange,this),t.on?.("change",this.onResourceChange,this),this.resources[e]=t,this._dirty=!0)}getResource(t){return this.resources[t]}_touch(t){var e=this.resources;for(const r in e)e[r]._touched=t}destroy(){var t=this.resources;for(const e in t)t[e].off?.("change",this.onResourceChange,this);this.resources=null}onResourceChange(t){if(this._dirty=!0,t.destroyed){var e=this.resources;for(const r in e)e[r]===t&&(e[r]=null)}else this._updateKey()}}},3012:(t,e,r)=>{r.d(e,{B:()=>a});var i=r(7952),u=r(8306);const l={f32:"float32","vec2<f32>":"float32x2","vec3<f32>":"float32x3","vec4<f32>":"float32x4",vec2f:"float32x2",vec3f:"float32x3",vec4f:"float32x4",i32:"sint32","vec2<i32>":"sint32x2","vec3<i32>":"sint32x3","vec4<i32>":"sint32x4",u32:"uint32","vec2<u32>":"uint32x2","vec3<u32>":"uint32x3","vec4<u32>":"uint32x4",bool:"uint32","vec2<bool>":"uint32x2","vec3<bool>":"uint32x3","vec4<bool>":"uint32x4"};function n(t){const e=/@group\((\d+)\)/,r=/@binding\((\d+)\)/,i=/var(<[^>]+>)? (\w+)/,s=/:\s*(\w+)/;const n=/(\w+)\s*:\s*([\w\<\>]+)/g,o=/struct\s+(\w+)/,a=t.match(/(^|[^/])@(group|binding)\(\d+\)[^;]+;/g)?.map(t=>({group:parseInt(t.match(e)[1],10),binding:parseInt(t.match(r)[1],10),name:t.match(i)[2],isUniform:"<uniform>"===t.match(i)[1],type:t.match(s)[1]}));return a?(t=t.match(/struct\s+(\w+)\s*{([^}]+)}/g)?.map(t=>{var e=t.match(o)[1],t=t.match(n).reduce((t,e)=>{var[e,r]=e.split(":");return t[e.trim()]=r.trim(),t},{});return t?{name:e,members:t}:null}).filter(({name:e})=>a.some(t=>t.type===e))??[],{groups:a,structs:t}):{groups:[],structs:[]}}var o=(t=>(t[t.VERTEX=1]="VERTEX",t[t.FRAGMENT=2]="FRAGMENT",t[t.COMPUTE=4]="COMPUTE",t))({});const s=Object.create(null);class a{constructor(t){this._layoutKey=0;var{fragment:t,vertex:e,layout:r,gpuLayout:i,name:s}=t;this.name=s,this.fragment=t,this.vertex=e,t.source===e.source?(s=n(t.source),this.structsAndGroups=s):(s=n(e.source),e=n(t.source),this.structsAndGroups=function(t,e){const r=new Set,i=new Set;return{structs:[...t.structs,...e.structs].filter(t=>!r.has(t.name)&&(r.add(t.name),!0)),groups:[...t.groups,...e.groups].filter(t=>{t=t.name+"-"+t.binding;return!i.has(t)&&(i.add(t),!0)})}}(s,e)),this.layout=r??function({groups:e}){var r=[];for(let t=0;t<e.length;t++){var i=e[t];r[i.group]||(r[i.group]={}),r[i.group][i.name]=i.binding}return r}(this.structsAndGroups),this.gpuLayout=i??function({groups:e}){var r=[];for(let t=0;t<e.length;t++){var i=e[t];r[i.group]||(r[i.group]=[]),i.isUniform?r[i.group].push({binding:i.binding,visibility:o.VERTEX|o.FRAGMENT,buffer:{type:"uniform"}}):"sampler"===i.type?r[i.group].push({binding:i.binding,visibility:o.FRAGMENT,sampler:{type:"filtering"}}):"texture_2d"===i.type&&r[i.group].push({binding:i.binding,visibility:o.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d",multisampled:!1}})}return r}(this.structsAndGroups),this.autoAssignGlobalUniforms=!(void 0===this.layout[0]?.globalUniforms),this.autoAssignLocalUniforms=!(void 0===this.layout[1]?.localUniforms),this._generateProgramKey()}_generateProgramKey(){var{vertex:t,fragment:e}=this,t=t.source+e.source+t.entryPoint+e.entryPoint;this._layoutKey=(0,i.X)(t,"program")}get attributeData(){return this._attributeData??(this._attributeData=function({source:t,entryPoint:e}){var r={};if(-1!==(e=t.indexOf("fn "+e))){var i=t.indexOf("->",e);if(-1!==i)for(var s,n=t.substring(e,i),o=/@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;null!==(s=o.exec(n));){var a=l[s[3]]??"float32";r[s[2]]={location:parseInt(s[1],10),format:a,stride:(0,u.m)(a).stride,offset:0,instance:!1,start:0}}}return r}(this.vertex)),this._attributeData}destroy(){this.gpuLayout=null,this.layout=null,this.structsAndGroups=null,this.fragment=null,this.vertex=null}static from(t){var e=`${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:`+t.vertex.entryPoint;return s[e]||(s[e]=new a(t)),s[e]}}},949:(t,e,r)=>{r.d(e,{h:()=>s});var e=r(4486),o=r(133),i=r(1132);class s extends e.A{constructor(t){let{data:e,size:r}=t;var{usage:t,label:i,shrinkToFit:s}=t,n=(super(),this.uid=(0,o.L)("buffer"),this._resourceType="buffer",this._resourceId=(0,o.L)("resource"),this._touched=0,this._updateID=1,this.shrinkToFit=!0,this.destroyed=!1,e instanceof Array&&(e=new Float32Array(e)),this._data=e,r=r??e?.byteLength,!!e);this.descriptor={size:r,usage:t,mappedAtCreation:n,label:i},this.shrinkToFit=s??!0}get data(){return this._data}set data(t){this.setDataWithSize(t,t.length,!0)}get static(){return!!(this.descriptor.usage&i.S.STATIC)}set static(t){t?this.descriptor.usage|=i.S.STATIC:this.descriptor.usage&=~i.S.STATIC}setDataWithSize(t,e,r){this._updateID++,this._updateSize=e*t.BYTES_PER_ELEMENT,this._data===t||(e=this._data,this._data=t,e.length===t.length)||!this.shrinkToFit&&t.byteLength<e.byteLength?r&&this.emit("update",this):(this.descriptor.size=t.byteLength,this._resourceId=(0,o.L)("resource"),this.emit("change",this))}update(t){this._updateSize=t??this._updateSize,this._updateID++,this.emit("update",this)}destroy(){this.destroyed=!0,this.emit("destroy",this),this.emit("change",this),this._data=null,this.descriptor=null,this.removeAllListeners()}}},1132:(t,e,r)=>{r.d(e,{S:()=>i});var i=(t=>(t[t.MAP_READ=1]="MAP_READ",t[t.MAP_WRITE=2]="MAP_WRITE",t[t.COPY_SRC=4]="COPY_SRC",t[t.COPY_DST=8]="COPY_DST",t[t.INDEX=16]="INDEX",t[t.VERTEX=32]="VERTEX",t[t.UNIFORM=64]="UNIFORM",t[t.STORAGE=128]="STORAGE",t[t.INDIRECT=256]="INDIRECT",t[t.QUERY_RESOLVE=512]="QUERY_RESOLVE",t[t.STATIC=1024]="STATIC",t))(i||{})},6736:(t,e,r)=>{r.d(e,{W:()=>function(t,e){var r=t.byteLength/8|0,i=new Float64Array(t,0,r),s=new Float64Array(e,0,r),s=(s.set(i),t.byteLength-8*r);0<s&&(i=new Uint8Array(t,8*r,s),new Uint8Array(e,8*r,s).set(i))}})},6011:(t,e,r)=>{r.d(e,{V:()=>s});var e=r(4486),o=r(9636),a=r(133),u=r(949),i=r(1132);function l(e,r){if(!(e instanceof u.h)){let t=r?i.S.INDEX:i.S.VERTEX;e instanceof Array&&(t=r?(e=new Uint32Array(e),i.S.INDEX|i.S.COPY_DST):(e=new Float32Array(e),i.S.VERTEX|i.S.COPY_DST)),e=new u.h({data:e,label:r?"index-mesh-buffer":"vertex-mesh-buffer",usage:t})}return e}class s extends e.A{constructor(t){var{attributes:e,indexBuffer:r,topology:i}=t;super(),this.uid=(0,a.L)("geometry"),this._layoutKey=0,this.instanceCount=1,this._bounds=new o.c,this._boundsDirty=!0,this.attributes=e,this.buffers=[],this.instanceCount=t.instanceCount||1;for(const n in e){var s=e[n]=((s=(s=e[n])instanceof u.h||Array.isArray(s)||s.BYTES_PER_ELEMENT?{buffer:s}:s).buffer=l(s.buffer,!1),s);-1===this.buffers.indexOf(s.buffer)&&(this.buffers.push(s.buffer),s.buffer.on("update",this.onBufferUpdate,this),s.buffer.on("change",this.onBufferUpdate,this))}r&&(this.indexBuffer=l(r,!0),this.buffers.push(this.indexBuffer)),this.topology=i||"triangle-list"}onBufferUpdate(){this._boundsDirty=!0,this.emit("update",this)}getAttribute(t){return this.attributes[t]}getIndex(){return this.indexBuffer}getBuffer(t){return this.getAttribute(t).buffer}getSize(){for(const e in this.attributes){var t=this.attributes[e];return t.buffer.data.length/(t.stride/4||t.size)}return 0}get bounds(){if(!this._boundsDirty)return this._bounds;this._boundsDirty=!1;var t=this,n="aPosition",o=this._bounds;if(t=t.getAttribute(n)){var a=t.buffer.data;let e=1/0,r=1/0,i=-1/0,s=-1/0;var n=a.BYTES_PER_ELEMENT,u=(t.offset||0)/n,l=(t.stride||8)/n;for(let t=u;t<a.length;t+=l){var h=a[t],d=a[t+1];h>i&&(i=h),d>s&&(s=d),h<e&&(e=h),d<r&&(r=d)}o.minX=e,o.minY=r,o.maxX=i,o.maxY=s}else o.minX=0,o.minY=0,o.maxX=0,o.maxY=0;return o}destroy(t=!1){this.emit("destroy",this),this.removeAllListeners(),t&&this.buffers.forEach(t=>t.destroy()),this.attributes=null,this.buffers=null,this.indexBuffer=null,this._bounds=null}}},8306:(t,e,r)=>{r.d(e,{m:()=>function(t){return i[t]??i.float32}});const i={uint8x2:{size:2,stride:2,normalised:!1},uint8x4:{size:4,stride:4,normalised:!1},sint8x2:{size:2,stride:2,normalised:!1},sint8x4:{size:4,stride:4,normalised:!1},unorm8x2:{size:2,stride:2,normalised:!0},unorm8x4:{size:4,stride:4,normalised:!0},snorm8x2:{size:2,stride:2,normalised:!0},snorm8x4:{size:4,stride:4,normalised:!0},uint16x2:{size:2,stride:4,normalised:!1},uint16x4:{size:4,stride:8,normalised:!1},sint16x2:{size:2,stride:4,normalised:!1},sint16x4:{size:4,stride:8,normalised:!1},unorm16x2:{size:2,stride:4,normalised:!0},unorm16x4:{size:4,stride:8,normalised:!0},snorm16x2:{size:2,stride:4,normalised:!0},snorm16x4:{size:4,stride:8,normalised:!0},float16x2:{size:2,stride:4,normalised:!1},float16x4:{size:4,stride:8,normalised:!1},float32:{size:1,stride:4,normalised:!1},float32x2:{size:2,stride:8,normalised:!1},float32x3:{size:3,stride:12,normalised:!1},float32x4:{size:4,stride:16,normalised:!1},uint32:{size:1,stride:4,normalised:!1},uint32x2:{size:2,stride:8,normalised:!1},uint32x3:{size:3,stride:12,normalised:!1},uint32x4:{size:4,stride:16,normalised:!1},sint32:{size:1,stride:4,normalised:!1},sint32x2:{size:2,stride:8,normalised:!1},sint32x3:{size:3,stride:12,normalised:!1},sint32x4:{size:4,stride:16,normalised:!1}}},8475:(t,e,r)=>{r.d(e,{M:()=>u});var e=r(4486),o=r(9114),m=r(3513),a=r(3012),p=r(5099),x=r(7222);class u extends e.A{constructor(t){super(),this._uniformBindMap=Object.create(null),this._ownedBindGroups=[];let{gpuProgram:e,glProgram:r,groups:i,resources:s,compatibleRenderers:n,groupMap:o}=t;this.gpuProgram=e,this.glProgram=r,void 0===n&&(n=0,e&&(n|=p.W.WEBGPU),r)&&(n|=p.W.WEBGL),this.compatibleRenderers=n;const a={};if((s=s||i?s:{})&&i)throw new Error("[Shader] Cannot have both resources and groups");if(!e&&i&&!o)throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");if(!e&&i&&o)for(const h in o)for(const d in o[h]){var u=o[h][d];a[u]={group:h,binding:d,name:u}}else if(e&&i&&!o){t=e.structsAndGroups.groups;o={},t.forEach(t=>{o[t.group]=o[t.group]||{},o[t.group][t.binding]=t.name,a[t.name]=t})}else if(s){if(e){t=e.structsAndGroups.groups;o={},t.forEach(t=>{o[t.group]=o[t.group]||{},o[t.group][t.binding]=t.name,a[t.name]=t})}else{o={},i={99:new m.T},this._ownedBindGroups.push(i[99]);let t=0;for(const c in s)a[c]={group:99,binding:t,name:c},o[99]=o[99]||{},o[99][t]=c,t++}i={};for(const f in s){var l=f;let t=s[f];t.source||t._resourceType||(t=new x.k(t));l=a[l];l&&(i[l.group]||(i[l.group]=new m.T,this._ownedBindGroups.push(i[l.group])),i[l.group].setResource(t,l.binding))}}this.groups=i,this._uniformBindMap=o,this.resources=this._buildResourceAccessor(i,a)}addResource(t,e,r){var i;(i=this._uniformBindMap)[e]||(i[e]={}),(i=this._uniformBindMap[e])[r]||(i[r]=t),this.groups[e]||(this.groups[e]=new m.T,this._ownedBindGroups.push(this.groups[e]))}_buildResourceAccessor(e,t){var r={};for(const i in t){const s=t[i];Object.defineProperty(r,s.name,{get(){return e[s.group].getResource(s.binding)},set(t){e[s.group].setResource(t,s.binding)}})}return r}destroy(t=!1){this.emit("destroy",this),t&&(this.gpuProgram?.destroy(),this.glProgram?.destroy()),this.gpuProgram=null,this.glProgram=null,this.removeAllListeners(),this._uniformBindMap=null,this._ownedBindGroups.forEach(t=>{t.destroy()}),this._ownedBindGroups=null,this.resources=null,this.groups=null}static from(t){const{gpu:e,gl:r,...i}=t;let s,n;return e&&(s=a.B.from(e)),r&&(n=o.M.from(r)),new u({gpuProgram:s,glProgram:n,...i})}}},7222:(t,e,r)=>{r.d(e,{k:()=>i});var n=r(133),o=r(7952);const a=class a{constructor(e,t){this._touched=0,this.uid=(0,n.L)("uniform"),this._resourceType="uniformGroup",this._resourceId=(0,n.L)("resource"),this.isUniformGroup=!0,this._dirtyId=0,this.destroyed=!1,t={...a.defaultOptions,...t};var r={};for(const s in this.uniformStructures=e){var i=e[s];i.name=s,i.size=i.size??1,i.value??(i.value=function(t,e){switch(t){case"f32":return 0;case"vec2<f32>":return new Float32Array(2*e);case"vec3<f32>":return new Float32Array(3*e);case"vec4<f32>":return new Float32Array(4*e);case"mat2x2<f32>":return new Float32Array([1,0,0,1]);case"mat3x3<f32>":return new Float32Array([1,0,0,0,1,0,0,0,1]);case"mat4x4<f32>":return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return null}(i.type,i.size)),r[s]=i.value}this.uniforms=r,this._dirtyId=1,this.ubo=t.ubo,this.isStatic=t.isStatic,this._signature=(0,o.X)(Object.keys(r).map(t=>t+"-"+e[t].type).join("-"),"uniform-group")}update(){this._dirtyId++}};a.defaultOptions={ubo:!1,isStatic:!1};let i=a},7547:(t,e,r)=>{r.d(e,{U:()=>n});const i={normal:0,add:1,multiply:2,screen:3,overlay:4,erase:5,"normal-npm":6,"add-npm":7,"screen-npm":8},s=class s{constructor(){this.data=0,this.blendMode="normal",this.polygonOffset=0,this.blend=!0,this.depthMask=!0}get blend(){return!!(1&this.data)}set blend(t){!!(1&this.data)!==t&&(this.data^=1)}get offsets(){return!!(2&this.data)}set offsets(t){!!(2&this.data)!==t&&(this.data^=2)}set cullMode(t){"none"===t?this.culling=!1:(this.culling=!0,this.clockwiseFrontFace="front"===t)}get cullMode(){return this.culling?this.clockwiseFrontFace?"front":"back":"none"}get culling(){return!!(4&this.data)}set culling(t){!!(4&this.data)!==t&&(this.data^=4)}get depthTest(){return!!(8&this.data)}set depthTest(t){!!(8&this.data)!==t&&(this.data^=8)}get depthMask(){return!!(32&this.data)}set depthMask(t){!!(32&this.data)!==t&&(this.data^=32)}get clockwiseFrontFace(){return!!(16&this.data)}set clockwiseFrontFace(t){!!(16&this.data)!==t&&(this.data^=16)}get blendMode(){return this._blendMode}set blendMode(t){this.blend="none"!==t,this._blendMode=t,this._blendModeId=i[t]||0}get polygonOffset(){return this._polygonOffset}set polygonOffset(t){this.offsets=!!t,this._polygonOffset=t}toString(){return`[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`}static for2d(){var t=new s;return t.depthTest=!1,t.blend=!0,t}};s.default2d=s.for2d();let n=s},1957:(t,e,r)=>{r.d(e,{K:()=>s,Q:()=>i});const i={normal:"normal-npm",add:"add-npm",screen:"screen-npm"};var s=(t=>(t[t.DISABLED=0]="DISABLED",t[t.RENDERING_MASK_ADD=1]="RENDERING_MASK_ADD",t[t.MASK_ACTIVE=2]="MASK_ACTIVE",t[t.RENDERING_MASK_REMOVE=3]="RENDERING_MASK_REMOVE",t[t.NONE=4]="NONE",t))(s||{})},2437:(t,e,r)=>{r.d(e,{W:()=>o});var u=r(9939),i=r(6932),s=r(4492);let n=0;const o=new class{constructor(t){this._poolKeyHash=Object.create(null),this._texturePool={},this.textureOptions=t||{},this.enableFullScreen=!1}createTexture(t,e,r){t=new i.v({...this.textureOptions,width:t,height:e,resolution:1,antialias:r,autoGarbageCollect:!0});return new s.g({source:t,label:"texturePool_"+n++})}getOptimalTexture(t,e,r=1,i){var s=Math.ceil(t*r-1e-6),n=Math.ceil(e*r-1e-6),o=((s=(0,u.U5)(s))<<17)+((n=(0,u.U5)(n))<<1)+(i?1:0);this._texturePool[o]||(this._texturePool[o]=[]);let a=this._texturePool[o].pop();return(a=a||this.createTexture(s,n,i)).source._resolution=r,a.source.width=s/r,a.source.height=n/r,a.source.pixelWidth=s,a.source.pixelHeight=n,a.frame.x=0,a.frame.y=0,a.frame.width=t,a.frame.height=e,a.updateUvs(),this._poolKeyHash[a.uid]=o,a}getSameSizeTexture(t,e=!1){var r=t.source;return this.getOptimalTexture(t.width,t.height,r._resolution,e)}returnTexture(t){var e=this._poolKeyHash[t.uid];this._texturePool[e].push(t)}clear(t){if(t=!1!==t)for(const r in this._texturePool){var e=this._texturePool[r];if(e)for(let t=0;t<e.length;t++)e[t].destroy(!0)}this._texturePool={}}}},7952:(t,e,r)=>{r.d(e,{X:()=>function(t,e){let r=s[t];void 0===r&&(void 0===i[e]&&(i[e]=1),s[t]=r=i[e]++);return r}});const i=Object.create(null),s=Object.create(null)},5099:(t,e,r)=>{r.d(e,{W:()=>i});var i=(t=>(t[t.WEBGL=1]="WEBGL",t[t.WEBGPU=2]="WEBGPU",t[t.BOTH=3]="BOTH",t))(i||{})},2760:(t,e,r)=>{r.d(e,{V:()=>function(t,e,r){var i=(t>>24&255)/255;e[r++]=(255&t)/255*i,e[r++]=(t>>8&255)/255*i,e[r++]=(t>>16&255)/255*i,e[r++]=i}})},8422:(t,e,r)=>{r.d(e,{K:()=>i});class i{constructor(){this.vertexSize=4,this.indexSize=6,this.location=0,this.batcher=null,this.batch=null,this.roundPixels=0}get blendMode(){return this.renderable.groupBlendMode}packAttributes(t,e,r,i){var s=this.renderable,n=this.texture,o=s.groupTransform,a=o.a,u=o.b,l=o.c,h=o.d,d=o.tx,o=o.ty,c=this.bounds,f=c.maxX,m=c.minX,p=c.maxY,c=c.minY,n=n.uvs,s=s.groupColorAlpha,i=i<<16|65535&this.roundPixels;t[r+0]=a*m+l*c+d,t[r+1]=h*c+u*m+o,t[r+2]=n.x0,t[r+3]=n.y0,e[r+4]=s,e[r+5]=i,t[r+6]=a*f+l*c+d,t[r+7]=h*c+u*f+o,t[r+8]=n.x1,t[r+9]=n.y1,e[r+10]=s,e[r+11]=i,t[r+12]=a*f+l*p+d,t[r+13]=h*p+u*f+o,t[r+14]=n.x2,t[r+15]=n.y2,e[r+16]=s,e[r+17]=i,t[r+18]=a*m+l*p+d,t[r+19]=h*p+u*m+o,t[r+20]=n.x3,t[r+21]=n.y3,e[r+22]=s,e[r+23]=i}packIndex(t,e,r){t[e]=r+0,t[e+1]=r+1,t[e+2]=r+2,t[e+3]=r+0,t[e+4]=r+2,t[e+5]=r+3}reset(){this.renderable=null,this.texture=null,this.batcher=null,this.batch=null,this.bounds=null}}}}]);