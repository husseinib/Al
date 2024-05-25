import { sound } from '@pixi/sound';
import { Application, Assets, Graphics, GraphicsContext, Rectangle, Polygon, Container, Text, TextStyle, Point, HTMLText  } from 'pixi.js';
import { Viewport } from 'pixi-viewport'
import { SliderView, ScrollBarView, ScrollBarContents } from "@masatomakino/pixijs-basic-scrollbar";
import TWEEN from "@tweenjs/tween.js";
import AssetsProgressBar from './AssetsProgressBar.js'

const SCREENWIDTH = 1280;
const SCREENHEIGHT = 720;

const app = new Application();
await app.init({ background: '#1099bb', width: SCREENWIDTH, height: SCREENHEIGHT, resizeTo: window });
document.body.appendChild(app.canvas);

const layersCount = 25;
const globalXScale = 1;
const globalYScale = 1;

const SCROLLBAR_W = 16;
const SCROLLBAR_H = 360;
const CONTENTS_W = 360;

let viewport;
let backgroundTexture;
let layerTextures = [];
let layersHoverTextures = [];
let bgGraphics, mapGraphics;
let layerGraphics = [];
let screenWidth,
    screenHeight,
    imageWidth,
    imageHeight;
let shapes = [];
let mapShape;
let boxUI, scrollbarUI, scrollbarButtonUI, closeButtonUI;
let currentPopupScrollbar, currentPopupContainer, popupAudioElement;
let mapTexture, mapHoverTexture;

let isMuralVisible = true;

const data = [
    { index: 1, text: '', audio: '', hasText : false, hasAudio : false },
    { index: 2, text: '', audio: '', hasText : false, hasAudio : false },
    { index: 3, text: '', audio: '', hasText : true, hasAudio : true },
    { index: 4, text: '', audio: '', hasText : true, hasAudio : true },
    { index: 5, text: '', audio: '', hasText : true, hasAudio : false },
    { index: 6, text: '', audio: '', hasText : true, hasAudio : true },
    { index: 7, text: '', audio: '', hasText : false, hasAudio : true },
    { index: 8, text: '', audio: '', hasText : true, hasAudio : true },
    { index: 9, text: '', audio: '', hasText : true, hasAudio : true },
    { index: 10, text: '', audio: '', hasText : false, hasAudio : false },
    { index: 11, text: '', audio: '', hasText : false, hasAudio : false },
    { index: 12, text: '', audio: '', hasText : false, hasAudio : true },
    { index: 13, text: '', audio: '', hasText : true, hasAudio : false },
    { index: 14, text: '', audio: '', hasText : true, hasAudio : true },
    { index: 15, text: '', audio: '', hasText : true, hasAudio : false },
    { index: 16, text: '', audio: '', hasText : false, hasAudio : true },
    { index: 17, text: '', audio: '', hasText : false, hasAudio : false },
    { index: 18, text: '', audio: '', hasText : true, hasAudio : false },
    { index: 19, text: '', audio: '', hasText : true, hasAudio : false },
    { index: 20, text: '', audio: '', hasText : false, hasAudio : false },
    { index: 21, text: '', audio: '', hasText : true, hasAudio : false },
    { index: 22, text: '', audio: '', hasText : false, hasAudio : false },
    { index: 23, text: '', audio: '', hasText : false, hasAudio : false },
    { index: 24, text: '', audio: '', hasText : true, hasAudio : false },
    { index: 25, text: '', audio: '', hasText : false, hasAudio : false },
    { index: 26, text: '', audio: '', hasText : true, hasAudio : false },
    { index: 27, text: '', audio: '', hasText : true, hasAudio : true },
]

const description = { index: -1, text: '', audio: '', hasText : true, hasAudio : false };

initLayerData().then(() => {
    importTextures()
        .then(() => {
            loadLayerShapesJson().then(() => {
                init();
                // initPoup();
                createElements();
                updateImageSize();
                // initScrollBar(app.stage, app.canvas);
            })
        })
});

async function initLayerData() {
    await Assets.load('./assets/fonts/LibreFranklin-Regular.ttf');

    try {
        await fetch(`./assets/texts/description.txt`)
        .then(response => response.text())
        .then(text => {
            if(text !== undefined && text.startsWith('<!DOCTYPE html>')) {
                description.text = '';
            } else {
                description.text = text;
            }
        });
    } catch (error) {
        description.text = '';
    }

    for (let i = 0; i <= layersCount; i++) {
        if(data[i].hasText === true) {   
            try {
                await fetch(`./assets/texts/${i + 1}.txt`)
                .then(response => response.text())
                .then(text => {
                    if(text !== undefined && text.startsWith('<!DOCTYPE html>')) {
                        data[i].text = '';
                    } else {
                        data[i].text = text;
                    }
                });
            } catch (error) {
                data[i].text = '';
            }
        }

        if(data[i].hasAudio === true) {
            try {
                await fetch(`./assets/audio/${i + 1}.mp3`)
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    // sound.add(data[i].audio, url);
                    data[i].audio = url;
                });
            } catch (error) {
                data[i].audio = '';
            }
        }
    }
}

async function loadLayerShapesJson() {
    await fetch(`./assets/shapes/map_shape.json`)
    .then(response => response.json())
    .then(data => {
        mapShape = data.shapes[0];
    });

    await fetch(`./assets/shapes/shapes.json`)
    .then(response => response.json())
    .then(data => {
        data.shapes.forEach((shape) => {
            shapes.push(shape);
        });
    });
}

async function importTextures() {
    mapTexture = await Assets.load('./assets/textures/map/map.png');
    mapHoverTexture = await Assets.load('./assets/textures/map/map-hover.png');
    backgroundTexture = await Assets.load('./assets/textures/background.png');
    for (let i = 2; i <= 27; i++) {
        layerTextures.push(await Assets.load(`./assets/textures/frames/${i}.png`));
        try {
            layersHoverTextures.push(await Assets.load(`./assets/textures/frames/${i}-Hover.png`));
        } catch (error) {
            layersHoverTextures.push(await Assets.load(`./assets/textures/frames/${i}.png`));
        }
    }
    boxUI = await Assets.load('./assets/UI/Box1.png');
    scrollbarUI = await Assets.load('./assets/UI/ScrollBar.png');
    scrollbarButtonUI = await Assets.load('./assets/UI/ScrollBarButton.png');
    closeButtonUI = await Assets.load('./assets/UI/CloseButton.png');
}

function init() {
    imageWidth = backgroundTexture.width;
    imageHeight = backgroundTexture.height;

    const WORLD_WIDTH = imageWidth * globalXScale;
    const WORLD_HEIGHT = imageHeight * globalYScale;
    viewport = new Viewport({
        screenWidth: SCREENWIDTH,
        screenHeight: SCREENHEIGHT,
        worldWidth: WORLD_WIDTH,
        worldHeight: WORLD_HEIGHT,
        events: app.renderer.events
    })
    viewport.drag({ 
        direction: 'x',
        factor: 0.3,
        lineHeight: 20,
    }).decelerate({ friction: 0.95 }).wheel({
        percent: 0.1,
    })
    viewport.clampZoom({
        minScale: 1,
        maxScale: 1,
    });
    viewport.clamp({ left: -264, right: 1550, underflow: 'none' });
    app.stage.addChild(viewport)

    screenWidth = SCREENWIDTH;
    screenHeight = SCREENHEIGHT
    imageWidth = screenWidth;
    imageHeight = screenHeight;

    viewport.plugins.pause('drag')
}

function initPoup() {
    const baseBgContext = new GraphicsContext()
        .rect(0, 0, 320, 50)
        .fill(0x000000, 0.5)
    let baseBgGraphics = new Graphics(baseBgContext);
    const slider = new SliderView({
        base: baseBgGraphics,
        // bar: new Graphics(...),
        base: baseBgGraphics,
        // mask: new Graphics(...),
        minPosition: 0,
        maxPosition: 320, //slider width
        rate: 0.0,
        canvas : app.canvas,
    });
    
    slider.on("slider_change", e => {
        // console.log(e.rate);
    });
    app.stage.addChild(slider);
}

const initScrollBar = (stage, view, layerData, x = 32, y = 150, hasMuralButton = false) => {
    const container = new Container();
    currentPopupContainer = container;
    container.x = x;
    container.y = y;

    const boxUIgfx = new Graphics().texture(boxUI, 0xffffff, -CONTENTS_W * 0.05, -SCROLLBAR_H * 0.3, CONTENTS_W + CONTENTS_W * 0.15, SCROLLBAR_H + SCROLLBAR_H * 0.4);
    boxUIgfx.zIndex = 0;
    boxUIgfx.x = 0;
    boxUIgfx.y = 0;
    stage.addChild(container);

    const closeButtongfx = new Graphics().texture(closeButtonUI, 0xffffff, 0, 0, 32, 32);
    closeButtongfx.zIndex = 1000;
    closeButtongfx.x = CONTENTS_W;
    closeButtongfx.y = -SCROLLBAR_H * 0.3;
    closeButtongfx.interactive = true;
    closeButtongfx.buttonMode = true;
    closeButtongfx.cursor = 'pointer';
    closeButtongfx.hitArea = new Rectangle(0, 0, 32, 32);
    closeButtongfx.on('pointerdown', () => {
        closePopup();
    });
    container.addChild(closeButtongfx);

    if(hasMuralButton === true) {
        const muralButton = new Graphics().rect(0, 0, 128, 32).fill(0x837D5A);
        muralButton.zIndex = 1100;
        muralButton.x = CONTENTS_W / 2 - (128/2);
        muralButton.y = -SCROLLBAR_H * 0.2;
        muralButton.interactive = true;
        muralButton.buttonMode = true;
        muralButton.cursor = 'pointer';
        muralButton.hitArea = new Rectangle(0, 0, 128, 32);
        muralButton.on('pointerdown', () => {
            closePopup();
            toggleMuralVisibility();
        });
        container.addChild(muralButton);

        const muralText = new Text('View Mural', new TextStyle({
            fontFamily: 'LibreFranklin',
            fontSize: 18,
            fontWeight: 'bold',
            fill: 0x000000,
            align: 'center',
            padding: 10,
        }));
        muralText.roundPixels = true
        muralText.zIndex = 1101;
        muralText.x = 128/2 - muralText.width/2;
        muralText.y = 32/2 - muralText.height/2;
        muralButton.addChild(muralText);
    }

    container.addChild(boxUIgfx);
    if(layerData.hasText) {
        const contents = getScrollBarOption(CONTENTS_W, SCROLLBAR_H, container, layerData);
        const scrollbar = new ScrollBarView(
        {
            base: getScrollBarBase(SCROLLBAR_W, SCROLLBAR_H, 0x0000ff),
            button: getScrollBarButton(SCROLLBAR_W, 0xffff00),
            minPosition: 0,
            maxPosition: SCROLLBAR_H,
            rate: 0.0,
            isHorizontal: false,
            canvas: view,
        },
        contents,
        );
        currentPopupScrollbar = scrollbar;
    
        stage.addChild(scrollbar);
        scrollbar.x = container.x + CONTENTS_W;
        scrollbar.y = y;
    
        scrollbar.sliderEventEmitter.on("slider_change", (e) => {
        // console.log(e);
        });
    }

    // const config = {
    //     progress: {
    //         bar: {
    //             backgroundColor: '#4cd137',
    //             border: 4,
    //             borderColor: '#FFFFFF',
    //             fillColor: '#e55039',
    //             height: 30,
    //             radius: 25,
    //             width: CONTENTS_W,
    //         },
    //         text: {
    //             visible: true,
    //             fill: 0xffffff,
    //             fontSize: 30,
    //         }
    //     }
    // }
    // const audioProgressBar = new AssetsProgressBar(config);
    // audioProgressBar.position.set(CONTENTS_W/2, -16)
    // audioProgressBar.zIndex = 1000;
    // audioProgressBar.setProgress(0)

    // sound.add('my-sound', './assets/audio/sample.mp3');
    // sound.play('my-sound');
    
    // container.addChild(audioProgressBar)
    if(layerData.hasAudio) {
        popupAudioElement = document.querySelector('audio');
        popupAudioElement.style.position = 'absolute';
        popupAudioElement.style.top = container.y - (SCROLLBAR_H * 0.2) + 'px';
        popupAudioElement.style.left = container.x + (CONTENTS_W * 0.04) + 'px';
        popupAudioElement.style.zIndex = '1000';
        popupAudioElement.src = layerData.audio;
        popupAudioElement.style.display = 'block';
        popupAudioElement.style.width = CONTENTS_W + 'px';
        popupAudioElement.style.opacity = 0.7;
        popupAudioElement.controls = true;
    }
  };
  
const getScrollBarBase = (w, h, color) => {
    const g = new Graphics();
    g.rect(0, 0, w, h).fill(color).texture(scrollbarUI, 0xffffff, 0, 0, w, h);
    g.hitArea = new Rectangle(0, 0, w, h);
    g.zIndex = 999;
    return g;
};
  
const getScrollBarButton = (width, color) => {
    const ratio = 0.5;
    const g = new Graphics();
    g.rect(-width / 2, -width * ratio, width, width).texture(scrollbarButtonUI, 0xffffff, -width / 2, -width * ratio, width, width);

    g.hitArea = new Rectangle(-width / 2, -width * ratio, width, width);
    g.x = width / 2;
    g.zIndex = 1000;
    return g;
};
  
const getScrollBarContents = (w, h, container, layerData, isMask, fillStyle) => {
    const g = new Graphics();
    g.rect(0, 0, w, h).fill(fillStyle);

    if(!isMask) {
        const text = new HTMLText({
            text: layerData.text,
            style: {
                fontFamily: 'LibreFranklin',
                fontSize: 18,
                wordWrap: true,
                wordWrapWidth: w,
                align: 'left',
                padding: 10,
            },
          })
        text.x = 0;
        text.y = 0;
        text.zIndex = 1000
        text.width = w;
        text.roundPixels = true
        g.addChild(text);
    }
    g.boundsArea = new Rectangle(0, 0, w, h);
    container.addChild(g);
    return g;
};
  
const getScrollBarOption = (contentsW, scrollBarH, container, layerData) => {
    const targetContents = getScrollBarContents(contentsW, scrollBarH * 4, container, layerData, false, { 
        color: 0xCECAAE, 
    });
    const contentsMask = getScrollBarContents(contentsW, scrollBarH, container, null, true, {
        color: 0x0000ff,
        alpha: 0.3,
    });
    return new ScrollBarContents(targetContents, contentsMask, container);
};

function createElements() {
    createMap();
    createMuralBackground();
    createLayers();

    toggleMuralVisibility();
}

function updateImageSize() {
    const imageRatio = backgroundTexture.width / backgroundTexture.height;
    if (imageRatio > screenWidth / screenHeight) {
        imageWidth = screenHeight * imageRatio;
    } else {
        imageHeight = screenWidth / imageRatio;
    }

    if(bgGraphics) {
        bgGraphics.width = imageWidth;
        bgGraphics.height = imageHeight;
    }
}

function createMap() {
    mapGraphics = new Graphics()
        .texture(mapTexture, 0xffffff, 0, 0, mapTexture.width, mapTexture.height)
    mapGraphics.zIndex = 900;
    mapGraphics.scale.set(0.8, 0.75);
    mapGraphics.x = 0;
    mapGraphics.y = viewport.center.y - window.innerHeight / 2;
    
    viewport.addChild(mapGraphics);
    create_map_collider();
}

function create_map_collider() {
    let points = []

    if(mapShape !== undefined) {
        mapShape.points.forEach(point => {
            for (let j = 0; j < point.length; j+=2) {
                points.push(point[j]);
                points.push(point[j + 1]);
            }
        });
    }

    const layerContext = new GraphicsContext()
        .poly(points)
        .fill('red')

    const layerGfx = new Graphics(layerContext);
    layerGfx.alpha = 0;
    layerGfx.zIndex = 901;
    layerGfx.interactive = true;
    layerGfx.cursor = 'pointer';
    layerGfx.hitArea = new Polygon(points);
    layerGfx.on('pointerover', () => {
        highlightMap();
    });
    layerGfx.on('pointerout', () => {
        // closePopup();
        unhighlightMap();
    });
    layerGfx.on('pointerdown', (e) => {
        const popupWidth = CONTENTS_W;
        const popupHeight = SCROLLBAR_H;
        let centroid = getCentroid(points);
        initScrollBar(app.stage, app.canvas, description, layerGfx.toGlobal(centroid).x - popupWidth * 1.5, layerGfx.toGlobal(centroid).y - popupHeight/2, true);
        // toggleMuralVisibility();
    });
    mapGraphics.addChild(layerGfx);
}

function highlightMap() {
    mapGraphics.clear();
    const layerContext = new GraphicsContext()
        .texture(mapHoverTexture, 0xffffff, 0, 0, mapTexture.width, mapTexture.height)
    mapGraphics = new Graphics(layerContext);
    mapGraphics.zIndex = 900;
    mapGraphics.scale.set(0.8, 0.75);
    mapGraphics.x = 0;
    mapGraphics.y = viewport.center.y - window.innerHeight / 2;
    viewport.addChild(mapGraphics);
}

function unhighlightMap() {
    mapGraphics.clear();
    const layerContext = new GraphicsContext()
        .texture(mapTexture, 0xffffff, 0, 0, mapTexture.width, mapTexture.height)
    mapGraphics = new Graphics(layerContext);
    mapGraphics.zIndex = 900;
    mapGraphics.scale.set(0.8, 0.75);
    mapGraphics.x = 0;
    mapGraphics.y = viewport.center.y - window.innerHeight / 2;
    viewport.addChild(mapGraphics);
}

function toggleMuralVisibility() {
    if(isMuralVisible) {
        bgGraphics.visible = false;
        isMuralVisible = false;
        mapGraphics.visible = true;
        viewport.plugins.pause('drag')
    } else {
        bgGraphics.visible = true;
        isMuralVisible = true;
        mapGraphics.visible = false;
        viewport.plugins.resume('drag')
    }
}

function createMuralBackground()
{
    const bgContext = new GraphicsContext()
        .rect(-backgroundTexture.width/2, 0, backgroundTexture.width, backgroundTexture.height)
        .texture(backgroundTexture, 0xffffff, -backgroundTexture.width / 2, -backgroundTexture.height / 2)
    bgGraphics = new Graphics(bgContext);
    bgGraphics.scale.set(globalXScale, globalYScale);
    bgGraphics.x = viewport.center.x;
    bgGraphics.y = viewport.center.y;
    bgGraphics.zIndex = 950;
    bgGraphics.interactive = true;
    bgGraphics.buttonMode = true;
    // bgGraphics.cursor = 'pointer';
    bgGraphics.eventMode = 'static';
    bgGraphics.hitArea = new Rectangle(-backgroundTexture.width / 2, -backgroundTexture.height / 2, backgroundTexture.width, backgroundTexture.height);
    viewport.addChild(bgGraphics);

    // bgGraphics.on('pointerdown', (e) => {
    //     closePopup();
    // });
}

function createLayers() {
    for (let i = 0; i < layersCount; i++) {
        const layerContext = new GraphicsContext()
            .texture(layerTextures[i], 0xffffff, -layerTextures[i].width / 2, -layerTextures[i].height / 2)
        const layerGfx = new Graphics(layerContext);
        layerGfx.zIndex = i;
        layerGraphics.push(layerGfx);
        bgGraphics.addChild(layerGfx);
        create_layer_collider(i);
    }
}

function highlightLayer(i) {
    layerGraphics[i].clear();
    const layerContext = new GraphicsContext()
        .texture(layersHoverTextures[i], 0xffffff, -layerTextures[i].width / 2, -layerTextures[i].height / 2)
    layerGraphics[i] = new Graphics(layerContext);
    layerGraphics[i].zIndex = i;
    bgGraphics.addChild(layerGraphics[i]);
}

function unhighlightLayer(i) {
    layerGraphics[i].clear();
    const layerContext = new GraphicsContext()
        .texture(layerTextures[i], 0xffffff, -layerTextures[i].width / 2, -layerTextures[i].height / 2)        
    layerGraphics[i] = new Graphics(layerContext);
    layerGraphics[i].zIndex = i;
    bgGraphics.addChild(layerGraphics[i]);
}

function create_layer_collider(i) {
    let points = []

    if(shapes[i] !== undefined) {
        shapes[i].points.forEach(point => {
            for (let j = 0; j < point.length; j+=2) {
                points.push(point[j] - backgroundTexture.width / 2);
                points.push(point[j + 1] - backgroundTexture.height / 2);
            }
        });
    }

    const layerContext = new GraphicsContext()
        .poly(points)
        .fill('red')

    const layerGfx = new Graphics(layerContext);
    layerGfx.alpha = 0;
    layerGfx.zIndex = i * layersCount;

    let isInteracting = false;
    if(layersHoverTextures[i].label.includes('Hover')) {
        isInteracting = true;
        layerGfx.alpha = 0;
    }

    layerGfx.interactive = isInteracting;
    layerGfx.cursor = 'pointer';
    layerGfx.hitArea = new Polygon(points);
    layerGfx.on('pointerover', () => {
        highlightLayer(i);
    });
    layerGfx.on('pointerout', () => {
        unhighlightLayer(i);
    });
    layerGfx.on('pointerdown', (e) => {
        const layerIndex = i + 2;
        console.log('layer clicked', layerIndex);
        closePopup();

        // const x = e.global.x;
        // const y = e.global.y;
        const popupWidth = CONTENTS_W;
        const popupHeight = SCROLLBAR_H;

        // let newX = x;
        // let newY = y;

        // if(x + popupWidth > screenWidth) {
        //     newX = x - popupWidth;
        // }

        // if(y + popupHeight > screenHeight) {
        //     newY = y - popupHeight;
        // }

        // calculate the centroid of the polygon to place the popup
        let centroid = getCentroid(points);
        let newX = layerGfx.toGlobal(centroid).x;
        let newY = layerGfx.toGlobal(centroid).y;

        if(newX + popupWidth > screenWidth) {
            newX = screenWidth - popupWidth * 1.2;
        }

        if(newY + popupHeight > screenHeight) {
            newY = screenHeight - popupHeight * 1.2;
        }

        let layerData = findData(layerIndex);
        console.log(layerData);
        if(layerData.hasText || layerData.hasAudio) {
            initScrollBar(app.stage, app.canvas, layerData, newX, newY);
            viewport.pause = true;

        }
    });
    bgGraphics.addChild(layerGfx);
}

function getCentroid(points) {
    let centroidX = 0;
    let centroidY = 0;
    for(let j = 0; j < points.length; j+=2) {
        centroidX += points[j];
        centroidY += points[j + 1];
    }
    centroidX /= points.length / 2;
    centroidY /= points.length / 2;

    return new Point(centroidX, centroidY);
}

function closePopup() {
    viewport.pause = false;
    app.stage.removeChild(currentPopupContainer);
    if(popupAudioElement) {
        popupAudioElement.style.display = 'none';
        popupAudioElement.pause();
    }
    if(currentPopupScrollbar) {
        app.stage.removeChild(currentPopupScrollbar);
        currentPopupScrollbar.destroy();
    }
}

function findData(index) {
    return data.find((item) => item.index === index);
}

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

app.ticker.add((time) => {
    TWEEN.update(performance.now());
});