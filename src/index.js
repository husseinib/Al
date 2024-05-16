import { Application, Assets, Graphics, GraphicsContext, Rectangle, Polygon } from 'pixi.js';
import { Viewport } from 'pixi-viewport'
import { SliderView } from "@masatomakino/pixijs-basic-scrollbar";

const SCREENWIDTH = 1280;
const SCREENHEIGHT = 720;

const app = new Application();
await app.init({ background: '#1099bb', width: SCREENWIDTH, height: SCREENHEIGHT });
document.body.appendChild(app.canvas);

const layersCount = 25;
const globalXScale = 1;
const globalYScale = 1;
let viewport;
let backgroundTexture;
let layerTextures = [];
let layersHoverTextures = [];
let bgGraphics;
let layerGraphics = [];
let screenWidth,
    screenHeight,
    imageWidth,
    imageHeight;
let shapes = [];

importTextures()
    .then(() => {
        loadLayerShapesJson().then(() => {
            init();
            // initPoup();
            createElements();
            updateImageSize();
        })
    })

async function loadLayerShapesJson() {
    await fetch(`./assets/shapes/shapes.json`)
    .then(response => response.json())
    .then(data => {
        data.shapes.forEach((shape) => {
            shapes.push(shape);
        });
    });
}

async function importTextures() {
    backgroundTexture = await Assets.load('./assets/textures/background.png');
    for (let i = 2; i <= 27; i++) {
        layerTextures.push(await Assets.load(`./assets/textures/frames/${i}.png`));
        try {
            layersHoverTextures.push(await Assets.load(`./assets/textures/frames/${i}-Hover.png`));
        } catch (error) {
            layersHoverTextures.push(await Assets.load(`./assets/textures/frames/${i}.png`));
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
    viewport.clamp({ left: -264, right: 1550, underflow: 'none' });
    app.stage.addChild(viewport)

    screenWidth = SCREENWIDTH;
    screenHeight = SCREENHEIGHT
    imageWidth = screenWidth;
    imageHeight = screenHeight;
}

function initPoup() {
    const baseBgContext = new GraphicsContext()
        .rect(0, 0, 320, 50)
        .fill(0x000000, 0.5)
    let baseBgGraphics = new Graphics(baseBgContext);
    const slider = new SliderView({
        base: baseBgGraphics,
        // bar: new Graphics(...),
        // button: new Graphics(...),
        // mask: new Graphics(...),
        minPosition: 0,
        maxPosition: 320, //slider width
        rate: 0.0,
        canvas : app.canvas,
    });
    
    slider.on("slider_change", e => {
        console.log(e.rate);
    });
    app.stage.addChild(slider);
}

function createElements() {
    createMuralBackground();
    createLayers();
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

function createMuralBackground()
{
    const bgContext = new GraphicsContext()
        .rect(-backgroundTexture.width/2, 0, backgroundTexture.width, backgroundTexture.height)
        .texture(backgroundTexture, 0xffffff, -backgroundTexture.width / 2, -backgroundTexture.height / 2)
    bgGraphics = new Graphics(bgContext);
    bgGraphics.scale.set(globalXScale, globalYScale);
    bgGraphics.x = viewport.center.x;
    bgGraphics.y = viewport.center.y;
    bgGraphics.interactive = true;
    bgGraphics.buttonMode = true;
    // bgGraphics.cursor = 'pointer';
    bgGraphics.eventMode = 'static';
    bgGraphics.hitArea = new Rectangle(-backgroundTexture.width / 2, -backgroundTexture.height / 2, backgroundTexture.width, backgroundTexture.height);
    viewport.addChild(bgGraphics);
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
    bgGraphics.addChild(layerGfx);
}

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

app.ticker.add((time) => {

});