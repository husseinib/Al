import { Application, Assets, Sprite, Container, Graphics, GraphicsContext, autoDetectRenderer } from 'pixi.js';
import CombinedShape from './CombinedShape';

const app = new Application();
await app.init({ background: '#1099bb', resizeTo: window });
document.body.appendChild(app.canvas);

const layersCount = 10;
let muralVisible = false;
let backgroundTexture, frameTexture, mapTexture, firstCityTexture, secondCityTexture;
let layerTextures = [];
let layersHoverTextures = [];
let backgroundSprite, frameSprite, mapSprite, firstCitySprite, secondCitySprite;
let layerSprites = [];
let shapesgfx = [];
let mapContainer;
let muralContainer;
let screenWidth,
    screenHeight,
    mapWidth,
    mapHeight,
    imageWidth,
    imageHeight,
    dragTarget = null,
    scrollLimit,
    scrollSpeed = 1;
let shapes = [];

importTextures()
    .then(() => {
        loadLayerShapesJson().then(() => {
            initViewport();
            createElements();
            setScrollLimit();
            adjustSpriteSize();
            addImageToContainer();
            createLayerShapes();
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
    backgroundTexture = await Assets.load('./assets/textures/bg.png');
    frameTexture = await Assets.load('./assets/textures/full_frame.png');
    mapTexture = await Assets.load('./assets/textures/map.png');
    firstCityTexture = await Assets.load('./assets/textures/first_city.png');
    secondCityTexture = await Assets.load('./assets/textures/second_city.png');
    for (let i = 1; i <= 10; i++) {
        layerTextures.push(await Assets.load(`./assets/textures/frames/Frame-${i}.png`));
        layersHoverTextures.push(await Assets.load(`./assets/textures/frames/Frame-${i}-hover.png`));
    }
}

function initViewport() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight
    imageWidth = screenWidth;
    imageHeight = screenHeight;
}

function createElements() {
    // createMapBackground();
    // createFirstCity();
    // createSecondCity();
    createBackground();
    // createFrame();
    createLayers();

    mapContainer = new Container();
    muralContainer = new Container();
    // muralContainer.visible = true;
    // muralContainer.zIndex = 1;
    // mapContainer.zIndex = 2;
    // app.stage.addChild(muralContainer);
    // app.stage.addChild(mapContainer);
}

function setScrollLimit() {
    const imageRatio = backgroundTexture.width / backgroundTexture.height;
    if (imageRatio > screenWidth / screenHeight) {0
        imageWidth = screenHeight * imageRatio;
    } else {
        imageHeight = screenWidth / imageRatio;
    }
    scrollLimit = imageWidth - screenWidth;
}

function adjustSpriteSize() {
    if (mapSprite) {
        mapSprite.width = imageWidth;
        mapSprite.height = imageHeight;
    }

    if(firstCitySprite) {
        firstCitySprite.width = imageWidth;
        firstCitySprite.height = imageHeight;
    }

    if(secondCitySprite) {
        secondCitySprite.width = imageWidth;
        secondCitySprite.height = imageHeight;
    }

    if (backgroundSprite) {
        backgroundSprite.width = imageWidth;
        backgroundSprite.height = imageHeight;
    }
    if (frameSprite) {
        frameSprite.width = imageWidth;
        frameSprite.height = imageHeight;
    }

    if (layerSprites.length > 0) {
        layerSprites.forEach(layerSprite => {
            layerSprite.width = imageWidth;
            layerSprite.height = imageHeight;
        });
    }
}

function addImageToContainer() {
    if (mapSprite)
        mapContainer.addChild(mapSprite);
    if (firstCitySprite)
        mapContainer.addChild(firstCitySprite);
    if (secondCitySprite)
        mapContainer.addChild(secondCitySprite);

    if (backgroundSprite)
        muralContainer.addChild(backgroundSprite);
    if (frameSprite)
        muralContainer.addChild(frameSprite);
    if (layerSprites.length > 0) {
        layerSprites.forEach(layerSprite => {
            muralContainer.addChild(layerSprite);
        });
    }

    muralContainer.eventMode = 'static';
    muralContainer.cursor = 'pointer';
    muralContainer.on('pointerdown', onDragStart, muralContainer);
    adjustImageContainerSize();
    centerImageContainer();
}

function adjustImageContainerSize() {
    muralContainer.width = imageWidth;
    muralContainer.height = imageHeight;
}

function centerImageContainer() {
    muralContainer.x = (screenWidth - imageWidth) / 2;
}

function createMapBackground()
{
    mapSprite = new Sprite(mapTexture);
    mapSprite.label = 'background';
    mapSprite.eventMode = 'static';
    mapSprite.cursor = 'pointer';
    mapSprite.anchor.set(0.5, 0.5);
    setMapSpritePosition();
}

function createFirstCity()
{
    firstCitySprite = new Sprite(firstCityTexture);
    firstCitySprite.label = 'firstCity';
    firstCitySprite.eventMode = 'static';
    firstCitySprite.cursor = 'pointer';
    firstCitySprite.anchor.set(0.5, 0.5);
    firstCitySprite.on('pointerdown', toggleMualVisibility, firstCitySprite);

    setFirstCitySpritePosition();
}

function toggleMualVisibility() {
    if(muralVisible) {
        muralContainer.visible = false;
        muralVisible = false;
    }
    else {
        muralContainer.visible = true;
        muralVisible = true;
    }
}

function setFirstCitySpritePosition()
{
    if(!firstCitySprite) return;

    firstCitySprite.x = app.screen.width / 2;
    firstCitySprite.y = app.screen.height / 2;
}

function createSecondCity()
{
    secondCitySprite = new Sprite(secondCityTexture);
    secondCitySprite.label = 'secondCity';
    secondCitySprite.eventMode = 'static';
    secondCitySprite.cursor = 'pointer';
    secondCitySprite.anchor.set(0.5, 0.5);
    setSecondCitySpritePosition();
}

function setSecondCitySpritePosition()
{
    if(!secondCitySprite) return;

    secondCitySprite.x = app.screen.width / 2;
    secondCitySprite.y = app.screen.height / 2;
}

function setMapSpritePosition()
{
    if(!mapSprite) return;

    mapSprite.x = app.screen.width / 2;
    mapSprite.y = app.screen.height / 2;
}

function createBackground()
{
    const bgContext = new GraphicsContext()
        .rect(0, 0, backgroundTexture.width, backgroundTexture.height)
        .texture(backgroundTexture, 0xffffff, -backgroundTexture.width / 2, -backgroundTexture.height / 2)
    const bgGraphics = new Graphics(bgContext);
    bgGraphics.scale.set(2, 1.5);
    bgGraphics.x = app.screen.width / 2 + backgroundTexture.width / 2;
    bgGraphics.y = app.screen.height / 2;
    app.stage.addChild(bgGraphics);
}

function createFrame()
{
    frameSprite = new Sprite(frameTexture);
    frameSprite.label = 'frame';
    frameSprite.eventMode = 'static';
    frameSprite.cursor = 'pointer';
    frameSprite.anchor.set(0.5, 0.5);
    setFrameSpritePosition();
}

function setFrameSpritePosition() 
{
    if(!frameSprite) return;

    frameSprite.x = app.screen.width / 2;
    frameSprite.y = app.screen.height / 2;
}

function createLayers() {
    for (let i = 0; i < layersCount; i++) {
        let points = []
        shapes[i].points.forEach(point => {
            for (let j = 0; j < point.length; j+=2) {
                points.push(point[j] - layerTextures[i].width / 2);
                points.push(point[j + 1] - layerTextures[i].height / 2);
            }
        });
        const layerContext = new GraphicsContext()
            .poly(points)
            .fill('red')
            .texture(layerTextures[i], 0xffffff, -layerTextures[i].width / 2, -layerTextures[i].height / 2)
        const layerGraphics = new Graphics(layerContext);
        layerGraphics.scale.set(2, 1.5);
        layerGraphics.interactive = true;
        layerGraphics.cursor = 'pointer';
        layerGraphics.on('pointerover', () => {
            layerGraphics.visible = false;
        });
        layerGraphics.x = app.screen.width + layerTextures[i].width / 2;
        layerGraphics.y = app.screen.height / 2;
        app.stage.addChild(layerGraphics);
        // const layerSprite = new Sprite(layerTextures[i]);
        // layerSprite.label = 'layer ' + (i + 1);
        // layerSprite.anchor.set(0.5, 0.5);
        // layerSprite.x = app.screen.width / 2;
        // layerSprite.y = app.screen.height / 2;
        // layerSprite.interactive = false;
        // layerSprites.push(layerSprite);
    }
}

function highlightLayer(layerIndex) {
    layerSprites[layerIndex].texture = layersHoverTextures[layerIndex];
}

function unhighlightLayer(layerIndex) {
    layerSprites[layerIndex].texture = layerTextures[layerIndex];
}

function createLayerShapes() {
    shapes.forEach((shapeData, index) => {
        if(index >= layerSprites.length) return;

        const shape = CombinedShape.parse(shapeData.points, 1, layerSprites[index]);
        let shapeGfx = new Graphics().poly(shape.shape[0].points).fill(0xea00ff);
        shapeGfx.alpha = 0.2;
        // if (shapeData.position) {
        //     shapeGfx.x = shapeData.position.x;
        //     shapeGfx.y = shapeData.position.y;
        // }
        // if(shapeData.scale) {
        //     shapeGfx.scale.set(shapeData.scale);
        // }
        shapeGfx.x = -410;
        shapeGfx.y = -20;
        shapeGfx.scale.set(2);
        if (layerSprites[index]) {
            muralContainer.addChild(shapeGfx);
            layerSprites[index].texture.shape = shape;
            shapeGfx.interactive = true;
            shapeGfx.hitArea = shape.shape[0];
        }

        shapeGfx.on('pointerover', () => {
            shapeGfx.alpha = 0.1;
            highlightLayer(index);
        });
        shapeGfx.on('pointerout', () => {
            shapeGfx.alpha = 0.2;
            unhighlightLayer(index);
        });

        shapesgfx.push(shapeGfx);
        // imageContainer.addChild(shapeGfx);
    });
}

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);
app.stage.addEventListener('pointermove', (e) =>
{
});

function onDragMove(event)
{
    if (dragTarget)
    {
        let leftBound = Math.min(-scrollLimit/2, dragTarget.x + event.data.originalEvent.movementX);
        let rightBound = Math.max(scrollLimit/2, dragTarget.x + event.data.originalEvent.movementX);
        if(dragTarget.x + event.data.originalEvent.movementX > leftBound && dragTarget.x + event.data.originalEvent.movementX < rightBound)
        {
            dragTarget.x += event.data.originalEvent.movementX * scrollSpeed;
        }
    }
}

function onDragStart()
{
    dragTarget = this;
    console.log(dragTarget);
    app.stage.on('pointermove', onDragMove);
}

function onDragEnd()
{
    if (dragTarget)
    {
        app.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        dragTarget = null;
    }
}

window.addEventListener('resize', () =>
{
    // initViewport();
    // setBackgroundSpritePosition();
    // setFrameSpritePosition();
    // setScrollLimit();
    // adjustSpriteSize();
    // centerImageContainer();
    // adjustImageContainerSize();
});

app.ticker.add((time) =>
{

});