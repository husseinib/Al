import { sound } from '@pixi/sound';
import { Application, Assets, Graphics, GraphicsContext, Rectangle, Polygon, Container, Text, TextStyle, Point, HTMLText,Ticker } from 'pixi.js';
import { Viewport } from 'pixi-viewport'
import { SliderView, ScrollBarView, ScrollBarContents } from "@masatomakino/pixijs-basic-scrollbar";
import { SliderViewUtil } from "@masatomakino/pixijs-basic-scrollbar";
import { ScrollBarViewUtil } from "@masatomakino/pixijs-basic-scrollbar";
import TWEEN from "@tweenjs/tween.js";
import AssetsProgressBar from './AssetsProgressBar.js'

const SCREENWIDTH = window.innerWidth;
const SCREENHEIGHT = window.innerHeight;
let isMobile = isMobileAndTablet() || isMobileCheck();
console.log(isMobile);

function isMobileAndTablet() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function isMobileCheck() {
    if ((typeof window.orientation !== "undefined") || ( navigator.userAgent.indexOf('IEMobile') !== -1 ))
        return true;
    return false;
}

const screenSizeDiv = document.getElementById('screen-size');
const app = new Application();
await app.init({ background: '#AA9458', width: SCREENWIDTH, height: SCREENHEIGHT, resizeTo: screenSizeDiv });
document.body.appendChild(app.canvas);

const layersCount = 25;
const globalXScale = 1;
const globalYScale = 1;

let SCROLLBAR_W = 16;
let SCROLLBAR_H = 360;
let CONTENTS_W = 360;

let textFontSize = 18;

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
let closeMuralButtongfx;
let muralButton, muralText;
let font;

let lastMousePosition = null;
let isMuralVisible = true;
let isMouseOverLayer = false;
let isDraggingPopup = false;

let viewPortCenter = { x: 0, y: 0 };

const data = [
    { index: 1, text: '', audio: '', hasText : false, hasAudio : false, hasHover : true },
    { index: 2, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 3, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true },
    { index: 4, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true },
    { index: 5, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true },
    { index: 6, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true },
    { index: 7, text: '', audio: '', hasText : false, hasAudio : true, hasHover : true },
    { index: 8, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true },
    { index: 9, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true },
    { index: 10, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 11, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 12, text: '', audio: '', hasText : false, hasAudio : true, hasHover : true },
    { index: 13, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true },
    { index: 14, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true },
    { index: 15, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true },
    { index: 16, text: '', audio: '', hasText : false, hasAudio : true, hasHover : true },
    { index: 17, text: '', audio: '', hasText : false, hasAudio : false, hasHover : true },
    { index: 18, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true },
    { index: 19, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true },
    { index: 20, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 21, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true },
    { index: 22, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 23, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 24, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true },
    { index: 25, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 26, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true },
    { index: 27, text: '', audio: '', hasText : true, hasAudio : true, hasHover : false },
]

const description = { index: -1, text: '', audio: '', hasText : true, hasAudio : false };

let canLoadMural = false;

fetchFont().then(() => {
    importImportantTextures().then(() => {
        loadMapData().then(() => {
            init();
            createMap();
        }).then(() => {
            initLayerData().then(() => {
                loadLayerShapesJson().then(() => {
                    importTextures().then(() => {
                        createElements();
                        updateImageSize();
                    });
                });
            });
        });
    });
});

async function fetchFont() {
    font = await Assets.load('./assets/fonts/LibreFranklin-Regular.ttf');
    console.log('Font loaded');
}

async function initLayerData() {
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

        if(data[i].hasAudio) {
            if(data[i].audio !== '') {
                setAudio(data[i].audio, container);
            } else {
                try {
                    fetch(`./assets/audio/${data[i].index}.mp3`)
                    .then(response => response.blob())
                    .then(blob => {
                        const url = URL.createObjectURL(blob);
                        data[i].audio = url;
                    });
                } catch (error) {
                    data[i].audio = '';
                }
            }
        }
    }
}

async function loadMapData() {
    await fetch(`./assets/shapes/map_shape.json`)
    .then(response => response.json())
    .then(data => {
        mapShape = data.shapes[0];
    });

    await fetch(`./assets/texts/description.txt`)
    .then(response => response.text())
    .then(text => {
        if(text !== undefined && text.startsWith('<!DOCTYPE html>')) {
            description.text = '';
        } else {
            description.text = text;
        }
    });
}

async function loadLayerShapesJson() {
    await fetch(`./assets/shapes/shapes.json`)
    .then(response => response.json())
    .then(data => {
        data.shapes.forEach((shape) => {
            shapes.push(shape);
        });
    });
}

async function importImportantTextures() {
    mapTexture = await Assets.load('./assets/textures/map/map.png');
    mapHoverTexture = await Assets.load('./assets/textures/map/map-hover.png');
    backgroundTexture = await Assets.load('./assets/textures/background.png');
    boxUI = await Assets.load('./assets/UI/Box1.png');
    scrollbarUI = await Assets.load('./assets/UI/ScrollBar.png');
    scrollbarButtonUI = await Assets.load('./assets/UI/ScrollBarButton.png');
    closeButtonUI = await Assets.load('./assets/UI/CloseButton.png');
}

async function importTextures() {
    for (let i = 2; i <= 27; i++) {
        let texture = await Assets.load(`./assets/textures/frames/${i}.png`);
        layerTextures.push(texture);
        if(findData(i).hasHover === true) {
            layersHoverTextures.push(await Assets.load(`./assets/textures/frames/${i}-Hover.png`));
        } else {
            layersHoverTextures.push(texture);
        }
    }
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
    let widths = calculateImageWidths();
    viewport.clamp({ left: -((SCREENWIDTH/2) * widths), right: ((SCREENWIDTH/2) * widths) + (SCREENWIDTH/2) * 2, underflow: 'none' });
    viewPortCenter = { x: viewport.center.x, y: viewport.center.y };
    app.stage.addChild(viewport)

    screenWidth = SCREENWIDTH;
    screenHeight = SCREENHEIGHT
    imageWidth = screenWidth;
    imageHeight = screenHeight;

    viewport.plugins.pause('drag')
}

function calculateImageWidths() {
    const imageRatio = backgroundTexture.width / backgroundTexture.height;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    let imageWidth = screenHeight * imageRatio;
    let imageWidths = imageWidth / screenWidth;
    return imageWidths - 1;
}

const initScrollBar = (stage, view, layerData, x = 32, y = 150, hasMuralButton = false, pageSize) => {
    const container = new Container();
    currentPopupContainer = container;
    container.x = x;
    container.y = y;

    let popupTopPadding = 0.3;
    if(isMobile) {
        popupTopPadding = 0.15;
    }

    let boxXPosition = -CONTENTS_W * 0.05;
    let boxYPosition = -SCROLLBAR_H * popupTopPadding;
    let boxWidth = CONTENTS_W + CONTENTS_W * 0.11;
    let boxHeight = SCROLLBAR_H + SCROLLBAR_H * 0.4;
    let closeButtonY = -SCROLLBAR_H * popupTopPadding * 0.93;

    const audioOnly = layerData.hasAudio == true && layerData.hasText == false;
    const textOnly = layerData.hasAudio == false && layerData.hasText == true;

    if(hasMuralButton == false) {
        if(audioOnly) {
            boxXPosition = -CONTENTS_W * 0.05;
            boxYPosition = -SCROLLBAR_H * popupTopPadding;
            boxWidth = CONTENTS_W + CONTENTS_W * 0.11;
            boxHeight = SCROLLBAR_H * 0.3;
            closeButtonY = -SCROLLBAR_H * popupTopPadding * 0.92;
        } else if(textOnly) {
            let paddingScale = 0.8;

            boxXPosition = -CONTENTS_W * 0.05;
            boxYPosition = -SCROLLBAR_H * popupTopPadding * paddingScale;
            boxWidth = CONTENTS_W + CONTENTS_W * 0.11;
            boxHeight = SCROLLBAR_H + SCROLLBAR_H * 0.3;
            closeButtonY = -SCROLLBAR_H * popupTopPadding * 0.85;
        }
    }

    const boxUIgfx = new Graphics().texture(boxUI, 0xffffff, boxXPosition, boxYPosition, boxWidth, boxHeight);
    boxUIgfx.zIndex = 0;
    boxUIgfx.x = 0;
    boxUIgfx.y = 0;
    stage.addChild(container);

    const closeButtongfx = new Graphics().texture(closeButtonUI, 0xffffff, 0, 0, 32, 32);
    closeButtongfx.zIndex = 1000;
    closeButtongfx.x = CONTENTS_W * (isMobile ? 0.88 : 0.8)
    closeButtongfx.y = closeButtonY;
    closeButtongfx.interactive = true;
    closeButtongfx.buttonMode = true;
    closeButtongfx.cursor = 'pointer';
    closeButtongfx.hitArea = new Rectangle(0, 0, 32, 32);
    closeButtongfx.on('pointerdown', () => {
        closePopup();
    });
    isMobile ? closeButtongfx.scale.set(5) : closeButtongfx.scale.set(3);
    container.addChild(closeButtongfx);

    if(hasMuralButton === true) {
        muralButton = new Graphics().rect(0, 0, 128, 32).fill(0x837D5A);
        muralButton.zIndex = 1100;
        muralButton.x = CONTENTS_W / 2 * (isMobile ? 0.3 : 0.5);
        muralButton.y = -SCROLLBAR_H * (isMobile ? 0.1 : 0.2);
        muralButton.interactive = true;
        muralButton.buttonMode = true;
        muralButton.cursor = 'pointer';
        muralButton.hitArea = new Rectangle(0, 0, 128, 32);
        muralButton.on('pointerdown', () => {
            if(canLoadMural === false) {
                return;
            }
            closePopup();
            toggleMuralVisibility();
        });
        container.addChild(muralButton);

        muralText = new Text('View Mural', new TextStyle({
            fontFamily: font.family,
            fontSize: textFontSize,
            fontWeight: 'bold',
            fill: 0x000000,
            align: 'center',
            padding: 10,
        }));
        muralText.roundPixels = true
        muralText.zIndex = 1101;
        muralText.x = 128/2 - muralText.width/2;
        muralText.y = 32/2 - muralText.height/2;

        isMobile ? muralButton.scale.set(2) : muralButton.scale.set(1);
        muralButton.addChild(muralText);
    }

    container.addChild(boxUIgfx);
    if(audioOnly) {
        container.y = y + SCROLLBAR_H * 0.5;
    }
    if(layerData.hasText) {
        const contents = getScrollBarOption(CONTENTS_W, SCROLLBAR_H, container, layerData, pageSize);
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

    if(layerData.hasAudio && layerData.audio !== '') {
        setAudio(layerData.audio, container);
    }
};

function setAudio(url, container) {
    let audioTopPadding = 0.2;
    if(isMobile) {
        audioTopPadding = 0.05;
    }

    popupAudioElement = document.querySelector('audio');
    popupAudioElement.style.position = 'absolute';
    popupAudioElement.style.top = container.y - (SCROLLBAR_H * audioTopPadding) + 'px';
    popupAudioElement.style.left = container.x + (CONTENTS_W * 0.05) + 'px';
    popupAudioElement.style.zIndex = '1000';
    popupAudioElement.src = url;
    popupAudioElement.style.display = 'block';
    popupAudioElement.style.width = CONTENTS_W * 0.8 + 'px';
    popupAudioElement.style.opacity = 0.7;
    popupAudioElement.controls = true;
}
  
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
    let text = null;
    let pages = 1;
    if(!isMask) {
        text = new HTMLText({
            text: layerData.text,
            style: {
                fontFamily: font.family,
                textFontSize: 18,
                wordWrap: true,
                wordWrapWidth: w,
                align: 'left',
                padding: 20,
            },
          })
        text.x = 0;
        text.y = 0;
        text.zIndex = 1000
        text.width = w;
        text.roundPixels = true
        let textHeight = text.height;
        pages = Math.ceil(textHeight / h);
    }
    h = h * pages;

    const g = new Graphics();
    g.rect(0, 0, w, h).fill(fillStyle);
    g.boundsArea = new Rectangle(0, 0, w, h);
    if(text != null) {
        g.addChild(text);
    }

    // add on mouse wheel event
    g.interactive = true;
    let delta = 16;
    g.on('wheel', (e) => {
        const shift = e.deltaY > 0 ? -delta : delta;
        scroll(shift);
    });

    g.on('pointerdown', (e) => {
        isDraggingPopup = true;
        currentPopupScrollbar.inertialManager.onMouseDown(e);
    });
    g.on('pointermove', (e) => {
        if(isDraggingPopup) {
            currentPopupScrollbar.inertialManager.onMouseMove(e);
        }
    });
    g.on('pointerup', (e) => {
        isDraggingPopup = false;
        currentPopupScrollbar.inertialManager.onMouseUp(e);
    });
    g.on('pointerupoutside', (e) => {
        isDraggingPopup = false;
        currentPopupScrollbar.inertialManager.onMouseUp(e);
    });

    container.addChild(g);
    return g;
};

function scroll(delta) {
    const target = currentPopupScrollbar.contents.target;
    const mask = currentPopupScrollbar.contents.mask;
    const isHorizontal = currentPopupScrollbar.isHorizontal;
    const pos = SliderViewUtil.getPosition(target, isHorizontal) + delta;
    ScrollBarViewUtil.clampTargetPosition(target, mask, pos, isHorizontal);
    currentPopupScrollbar.wheelManager.emit("update_target_position");
    currentPopupScrollbar.scrollBarEventEmitter.emit("stop_inertial_tween");
}
  
const getScrollBarOption = (contentsW, scrollBarH, container, layerData, pageSize = 1) => {
    const targetContents = getScrollBarContents(contentsW, scrollBarH, container, layerData, false, { 
        color: 0xCECAAE, 
    });
    const contentsMask = getScrollBarContents(contentsW, scrollBarH, container, null, true, {
        color: 0x0000ff,
        alpha: 0.3,
    });
    return new ScrollBarContents(targetContents, contentsMask, container);
};

function createElements() {
    createMuralBackground();
    createLayers();
    createCloseMuralButton();
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

    canLoadMural = true;
}

function createCloseMuralButton() {
    closeMuralButtongfx = new Graphics().texture(closeButtonUI, 0xffffff, 0, 0, 32, 32);
    closeMuralButtongfx.zIndex = 99999999;
    closeMuralButtongfx.x = window.innerWidth * 0.95;
    closeMuralButtongfx.y = -window.innerHeight * 0.98;
    closeMuralButtongfx.interactive = true;
    closeMuralButtongfx.buttonMode = true;
    closeMuralButtongfx.cursor = 'pointer';
    closeMuralButtongfx.hitArea = new Rectangle(0, 0, 32, 32);
    closeMuralButtongfx.on('pointerdown', () => {
        toggleMuralVisibility();
    });
    isMobile ? closeMuralButtongfx.scale.set(5) : closeMuralButtongfx.scale.set(3);
    viewport.addChild(closeMuralButtongfx);
}

function createMap() {
    let mapWidth = SCREENWIDTH;
    let mapHeight = SCREENHEIGHT;
    if(isMobile) {
        mapWidth = mapTexture.width;
        mapHeight = mapTexture.height;
    }

    mapGraphics = new Graphics()
        .texture(mapTexture, 0xffffff, 0, 0, mapWidth, SCREENHEIGHT);
    mapGraphics.zIndex = 900;
    // mapGraphics.scale.set(0.8, 0.75);
    mapGraphics.x = viewport.center.x - (isMobile ? SCREENWIDTH : SCREENWIDTH / 2)
    mapGraphics.y = viewport.center.y - SCREENHEIGHT / 2;
    
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
    // layerGfx.x = viewport.center.x - (isMobile ? SCREENWIDTH : SCREENWIDTH / 2)
    // layerGfx.y = viewport.center.y - SCREENHEIGHT / 2;
    layerGfx.on('pointerover', () => {
        highlightMap();
    });
    layerGfx.on('pointerout', () => {
        // closePopup();
        unhighlightMap();
    });
    layerGfx.on('pointerdown', (e) => {
        if(isMobile) {
            CONTENTS_W = window.innerWidth * 0.8;
            SCROLLBAR_H = window.innerHeight * 0.6;
            SCROLLBAR_W = 16 * 2;
        }

        const popupWidth = CONTENTS_W;
        const popupHeight = SCROLLBAR_H;
        let x = 0;
        let y = 0;
        if(isMobile) {
            x = SCREENWIDTH / 2 - popupWidth / 2;
            y = SCREENHEIGHT / 2 - popupHeight / 2;
        } else {
            let centroid = getCentroid(points);
            x = layerGfx.toGlobal(centroid).x - popupWidth * 1.5;
            y = layerGfx.toGlobal(centroid).y - popupHeight/2;
        }
        initScrollBar(app.stage, app.canvas, description, x, y, true, 1);
        // toggleMuralVisibility();
    });
    mapGraphics.addChild(layerGfx);
}

function highlightMap() {
    let mapWidth = SCREENWIDTH;
    let mapHeight = SCREENHEIGHT;
    if(isMobile) {
        mapWidth = mapTexture.width;
        mapHeight = mapTexture.height;
    }

    mapGraphics.clear();
    const layerContext = new GraphicsContext()
        .texture(mapHoverTexture, 0xffffff, 0, 0, mapWidth, SCREENHEIGHT)
    mapGraphics = new Graphics(layerContext);
    mapGraphics.zIndex = 900;
    // mapGraphics.scale.set(0.8, 0.75);
    mapGraphics.x = viewport.center.x - (isMobile ? SCREENWIDTH : SCREENWIDTH / 2)
    mapGraphics.y = viewport.center.y - SCREENHEIGHT / 2;
    viewport.addChild(mapGraphics);
}

function unhighlightMap() {
    let mapWidth = SCREENWIDTH;
    let mapHeight = SCREENHEIGHT;
    if(isMobile) {
        mapWidth = mapTexture.width;
        mapHeight = mapTexture.height;
    }

    mapGraphics.clear();
    const layerContext = new GraphicsContext()
        .texture(mapTexture, 0xffffff, 0, 0, mapWidth, SCREENHEIGHT)
    mapGraphics = new Graphics(layerContext);
    mapGraphics.zIndex = 900;
    // mapGraphics.scale.set(0.8, 0.75);
    mapGraphics.x = viewport.center.x - (isMobile ? SCREENWIDTH : SCREENWIDTH / 2)
    mapGraphics.y = viewport.center.y - SCREENHEIGHT / 2;
    viewport.addChild(mapGraphics);
}

function toggleMuralVisibility() {
    closePopup();
    if(isMuralVisible) {
        bgGraphics.visible = false;
        isMuralVisible = false;
        mapGraphics.visible = true;
        viewport.plugins.pause('drag')
        closeMuralButtongfx.visible = false;
        viewport.moveCenter(viewPortCenter.x, viewPortCenter.y);
    } else {
        bgGraphics.visible = true;
        isMuralVisible = true;
        mapGraphics.visible = false;
        closeMuralButtongfx.visible = true;
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
        isMouseOverLayer = true;
        highlightLayer(i);
    });
    layerGfx.on('pointerout', () => {
        isMouseOverLayer = false;
        unhighlightLayer(i);
    });
    layerGfx.on('pointerdown', (e) => {
        lastMousePosition = new Point(e.global.x, e.global.y);
    });
    layerGfx.on('pointerup', (e) => {
        if(isMouseOverLayer === false) {
            return;
        }

        if(lastMousePosition && (lastMousePosition.x !== e.global.x || lastMousePosition.y !== e.global.y)) {
            return;
        }

        const layerIndex = i + 2;
        closePopup();

        if(isMobile) {
            CONTENTS_W = window.innerWidth * 0.8;
            SCROLLBAR_H = window.innerHeight * 0.6;
            SCROLLBAR_W = 16 * 2;
        }
        const popupWidth = CONTENTS_W;
        const popupHeight = SCROLLBAR_H;

        let newX = 0;
        let newY = 0;
        if(isMobile) {
            newX = SCREENWIDTH / 2 - popupWidth / 2;
            newY = SCREENHEIGHT / 2 - popupHeight / 2;
        } else {
            let centroid = getCentroid(points);
            newX = layerGfx.toGlobal(centroid).x;
            newY = layerGfx.toGlobal(centroid).y + 64;
            
            if(newX + popupWidth > screenWidth) {
                newX = screenWidth - popupWidth * 1.2;
            }

            if(newY + popupHeight > screenHeight) {
                newY = screenHeight - popupHeight * 1.2;
            }
        }


        let layerData = findData(layerIndex);
        if(layerData.hasText || layerData.hasAudio) {
            initScrollBar(app.stage, app.canvas, layerData, newX, newY, false, 4);
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
    if(closeMuralButtongfx) {
        if(isMobile) {
            closeMuralButtongfx.x = viewport.center.x + window.innerWidth * 0.3;
            closeMuralButtongfx.y = viewport.center.y - window.innerHeight * 0.48;
        } else {
            closeMuralButtongfx.x = viewport.center.x + window.innerWidth * 0.45;
            closeMuralButtongfx.y = viewport.center.y - window.innerHeight * 0.48;
        }
    }
});

Ticker.shared.add((e) => {
    TWEEN.update(performance.now());
});