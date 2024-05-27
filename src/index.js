import { sound } from '@pixi/sound';
import { Application, Assets, Graphics, GraphicsContext, Rectangle, Polygon, Container, Text, TextStyle, Point, HTMLText,Ticker, Texture } from 'pixi.js';
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
await app.init({ background: '#AA9458', width: SCREENWIDTH, height: SCREENHEIGHT, resizeTo: screenSizeDiv, resolution: window.devicePixelRatio || 1 });
document.body.appendChild(app.canvas);
console.log(document.parentElement);

const layersCount = 25;
const globalXScale = 1;
const globalYScale = 1;

let SCROLLBAR_W = 16;
let SCROLLBAR_H = 360;
let CONTENTS_W = 360;

let textFontSize = 16;

let viewport;
let backgroundTexture;
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
    { index: 3, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true, text: '<strong>The City Mourned their Departure</strong><br><br>“My neighbours migrated to Turkey and informed me that they always fondly recalled us and our good moments. They would even send money to the neighbours and ask them to cook during our religious occasions, expressing their pride in the neighbourhood, the community, and the beliefs present in the city. …I am confident that they wish to return to their cities. Just as birds, no matter how far they migrate, return to their homelands, so do humans." (Voices from Amara)<br><br><strong>Sabian people I know</strong><br><br>“In the 1980s, many people left Baghdad. There was a man named Yahya and his wife, Fariha.<br><br>Yahya was blind, but he could still climb palm trees and trim them. It was a God-given talent.<br><br>He would climb the tree wearing his slippers.” (Voices from Amara)<br><br><strong>The honourable Sabians</strong><br><br>“Although their numbers are unfortunately declining, not as they used to be, they remain a significant and beloved majority in Iraq. They steadfastly adhere to their path of worship and devotion, making them an integral part of the noble community. It\'s impossible to fully comprehend the Sabians using populist concepts; they are a people deserving of respect. We share meals and drinks with them, embrace their customs, and they reciprocate with equal warmth. Any societal stereotypes about them are baseless. In Islam, we refer to them simply as the honourable Sabians. …Historical anecdotes indicate that certain Sabians observe fasting similar to Muslims. When questioned why, they respond it\'s a matter of brotherhood. …Presently, society is advancing and unifying. We once attended their festivities, and now I witness our community enthusiastically participating in their occasions. In their moments of sorrow, we share tea, just as it\'s served at our own gatherings of mourning. This is the essence of true brotherhood.” (Voices from Maysan)' },
    { index: 4, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true, text: '<strong>Special Rituals</strong><br><br>“They would have separate wedding traditions from Muslims in the town. In Mandaean weddings, they would take the bride in winter or summer and immerse her in a well in the morning before the wedding ceremony, which was a ritual unknown to the Muslims.” (Voices from Amara)<br><br><strong>Wedding Traditions</strong><br><br>“For weddings, many cars would come, and they would call it the Mandi, which was like a forest with trees. They would bring the bride and cover the water well with about seven covers. I saw it with my own eyes. We used to spy on them as they entered the canal, and their Sheikh would marry them.” (Voices from Amara)<br><br><strong><br><br>Present since ancient times</strong><br><br>“This brotherhood, this country, this region, all these matters mean that they need to be practically employed in the subject of dealing with religions, and the Sabians are a key component in Iraq, especially in Maysan province. They have a strong relationship with water and Maysan, this is a well-known historical fact, they have been present since ancient times, practicing their beliefs on the banks of the rivers in Maysan, as well as in Thi Qar and Basra, and in some areas of Iran. This is their historical presence in reality.” (Voices from Maysan)' },
    { index: 5, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true, text: '<strong>The Sabian homeland</strong><br><br>“The original inhabitants are the Houeiza tribe. The people who lived in Qalat Saleh were from the Sabi’ah tribe, who lived in the Al-Kassarah area between Qalat Saleh and Al-Azair. Qalat Saleh became the nucleus city. The Sabians were craftsmen. The Ottoman government brought them from the Al-Kassarah area to Qalat Saleh and settled them on the left bank of the Tigris River, in an area known as Akouf. This information became known to others, and we call it the Tijara Street or Market Street. There was a river called the Qarma River, which connected between the Tigris River and the Materyil River to the eastern marshes. They lived on the left bank of the Qarma River and the Tigris River in a triangular area because their nature was related to water, and places of worship and rituals had to be connected to water. …Qalat Saleh is the capital of Mandaeism and the evidence is the presence of two monasteries that do not exist in other areas of Iraq.” (Voices from Amara)<br><br><strong>God’s Kindness</strong><br><br>“It\'s a testament to God\'s kindness that creation isn\'t confined to any particular sect or class. Iraq takes pride in individuals like Abdul Jabbar Abdullah, a renowned physicist honoured worldwide, even gifted a personal pen by Einstein for his excellence. Maysan cherishes him as one of their own, a sentiment shared by Qal\'at Salih, his hometown. Entrusted by Abdul Karim Qasim to lead Baghdad University, Abdullah aimed to foster genuine intellectual growth, but his efforts were thwarted by senseless acts. Despite his untimely passing, his potential loss is deeply felt. Similarly, Abdul Razzaq Abdul Wahid, a towering figure in vertical poetry, leaves an indelible mark. Al-Jawahiri once beautifully symbolized Iraqi poetry\'s essence, citing Amara and Basra, representing Abdul Razzaq Abdul Wahid and Al-Sayyab, respectively. Lamia’a Abbas Amara, a celebrated poetess known for her warmth, alongside numerous Sabian contributors, further enrich Iraq\'s literary landscape. Noteworthy is the jeweler Zahroun, whose mastery astonished even when using simpler tools. These individuals, with their talents and contributions, stand ready to serve their country whenever the opportunity arises.” (Voices from Masan)' },
    { index: 6, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true, text: '<strong>Distinguished People</strong><br><br>“What distinguishes them from the rest is that they are peaceful, kind, and intelligent people. …We had good relationships with them. A Sabian teacher named Muhtam, who was an English and mathematics teacher, used to take us walking to Al-Mushiriya and bring us back walking. He showed us the beach and the orchards.” (Voices from Amara)' },
    { index: 7, text: '', audio: '', hasText : false, hasAudio : true, hasHover : true },
    { index: 8, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true, text: '<strong>Burial Traditions</strong><br><br>“The Mandaean cemetery was located at the end of the Al-Zahra neighbourhood, separate from the Muslim and Jewish cemeteries. In the Mandaean faith, a funeral procession is not allowed to cross the river. Their burial customs were different from Muslims.” (Voices from Amara)' },
    { index: 9, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true, text: '<strong>Living in One Home</strong><br><br>"I lived near the house of Jabbar Abu Bashar, and at that time, we did not distinguish between religions or sects. The temptations of modern life were not available then. We used to play together and eat together, Muslims, Christians, and Sabaeans, without discrimination. We competed in climbing palm trees, played traditional games like marbles and football, and the purpose of the competition was very spontaneous. They were very involved in agriculture, and their children invited us into their homes to eat mulberries, grapes, and carrots. …“Their behaviour reflected sincerity, honesty, and chivalry. If they saw you in trouble, they would never leave you alone and would stand by your side, whether in your joys or sorrows. …"They had special celebrations like \'Banja,\' during which, amazingly, it used to rain. This was considered a sign that it was their true celebration. …“When they hosted wedding celebrations, they would bring a Muslim cook, acknowledging our adherence to Islamic slaughter. If anything, this reflects their desire for the enduring warmth of friendship and social relations with us.” (Voices from Amara)<br><br><strong>Living alongside the Mandaean community</strong><br><br>The Sabians lived in the Sabian neighbourhood, not in our neighbourhood. We were in the western part of the city. The Sabian neighbourhood was the largest and oldest neighbourhood. It included Al-Husseinia and extended from Lutfa to the other side of the city. The Sabian neighbourhoods were large neighbourhoods with a lot of students and produced many scholars. All the neighbourhoods of Hurriya, such as Abdullah and others, were large Sabian neighbourhoods. I attended Tadaiya School in the Qalaat Saleh in 1948. It opened in 1925. In the first grade, our teacher was Syed Hamed Syed Khalaf and his brother Syed Hassan Sheikh Zain. There were many students in the school. The Sabians were very peaceful people. Currently, the Sabians have all left. Only a few remain, maybe two or three young people. All the rest have left and went to America, Germany and elsewhere.” (Voices from Amara)<br><br><strong>The Mandaean houses</strong><br><br>“The Mandaean houses were all built in a similar style – an iwan/reception room on the right when you enter, no diwaniya, and rooms in a row beyond that where the family lived. The mud brick houses are all gone now.” (Voices from Amara)<br><br><strong>Brotherly Bond</strong><br><br>"My relationship with them is not just a friendship, but they are my brothers. I would enter their homes just as I would enter my own siblings\' homes. We communicate and support each other like brothers and one family. Just as I protect my home, I would protect theirs due to the strength of our relationship. …"Before 2003, I was in school, and one of my close Sabian friends was named Ihab. …One day, Ihab ran out of cold drinking water, so he asked me for some. I gave him my water bottle, and he wanted to pour from it into his own bottle, but I refused. I asked him to drink directly from my bottle because he was my friend, and I did not see any difference between us. My relationship with him was so close that before he emigrated from Iraq, he stayed at my house for two days, as if he was leaving a family member, not just a friend." (Voices from Maysan)' },
    { index: 10, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 11, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 12, text: '', audio: '', hasText : false, hasAudio : true, hasHover : true },
    { index: 13, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true, text: '<strong>Making a beautiful fabric of the city</strong><br><br>"Frankly, I remembered many beautiful things, to the extent that you can see the smile drawn on my face, when we used to play and have fun, when we used to go to the river bank near Mandi\'s place when we used to greet each other, joke around, and share joy and sorrow, and we didn\'t know the meaning of being a Sabi, Muslim, or Christian; we were making a beautiful fabric of the city. …"A simple park has been established in a small area near the Nasiriya Mandi, and it has become a gathering place for all segments of the Iraqi people. If a park or a flower can bring together our scattered pieces, then what memories of life, childhood, lineage, school, and neighbours can do? …My feeling when my Mandean friends emigrated is like the feeling of losing a limb from one\'s body, like losing a hand or a foot. That\'s how I felt when they left. I used to share my life with them in all its details, only for them to disappear overnight." (Voices from Nassiryah) <br><br><strong>Indistinguishable</strong><br><br>"I couldn\'t distinguish them in the city of Rifai where we shared the same style of clothing. They were brought up well, and they were characterized by high morals. They were very sociable, interacting with people during their occasions, and when they passed by us, they greeted us in the Islamic way without any discrimination." (Voices from Nassiryah)' },
    { index: 14, text: '', audio: '', hasText : true, hasAudio : true, hasHover : true, text: '<strong>Traditions</strong><br><br>“I remember there were some unique traditions and customs, such as the use of water in marriage and childbirth, and purification. These are the most famous traditions. But they are also from the nature of being human.” (Voices from Amara)' },
    { index: 15, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true, text: '<strong>Mandaean Crafts</strong><br><br>“In the past, they had many shops in the market. They had two or three goldsmiths, carpenters for boats, metalworkers for plows, and stonemasons. The Sabian carpenters existed in those areas. Their main occupations were carpentry, metalworking, making sickles, and goldsmithing. They were known for goldsmithing, the Sabians were the goldsmiths and no one could match them in this craft. As for the Sabian carpenters, they worked in making bride chairs.” (Voices from Amara)<br><br><strong>The Balam of the Mandaeans</strong><br><br>“The Mandaeans are well-known for practicing crafts. The people in Maysan are well aware of this fact. For example, agricultural tools are items that deserve recognition in speech. One such tool is the \'saq,\' which refers to a tool used for making a sickle. The sickle is an essential economic tool for agriculture; without a good sickle, the quality of the harvest may suffer. Crafts have contributed greatly throughout history. Among these crafts is the making of the \'balam,\' a small boat. In the past, the \'balam\' served as a means of transportation, carrying people and goods from one area to another. It facilitated merchants in reaching the marketplace and delivering fresh goods, known as \'taza\' in the local vernacular. …Unfortunately, we still fail to give them the credit they deserve for their craftsmanship.” (Voices from Maysan)' },
    { index: 16, text: '', audio: '', hasText : false, hasAudio : true, hasHover : true },
    { index: 17, text: '', audio: '', hasText : false, hasAudio : false, hasHover : true },
    { index: 18, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true, text: '<strong>The Sabians\' connection to water is divine</strong><br><br>“It is divine wisdom that water is the essence of everything. Water revitalizes and sustains life for humans and all creations. It is a fundamental component, both physically and spiritually, permeating every aspect of life. Just as science evolves with society, divine wisdom continually introduces new elements to complement existing ones. Integration, as mentioned by Sabians, Jews, and Christians, in Islam signifies integration with the noble Prophet, peace be upon him and his family. A complete individual requires comprehensive knowledge and a harmonious household to thrive in a society that embraces integration. May we achieve such unity in the end journey of life, by the will of God.” (Voices from Maysan)' },
    { index: 19, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true, text: '<strong>Sabian Temples</strong><br><br>“There are three temples here in Qalaat Saleh. One of them is in front of the ruler’s house and one is among the ruins. They had a small temple near the governors house which they used. These were their areas but they were many in number.” (Voices from Amara)' },
    { index: 20, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 21, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true, text: '<strong>‘Builders of Iraq’</strong><br><br>"The Sabaeans are the foundation of Iraq; they are among the ones who built Iraq 4000 years ago. They are the fundamental roots of Iraq, as is the case with the Assyrians and Chaldeans. The Sabaeans revere water, as is the case in all religions, including Islam, due to the significant role of water in creation, as mentioned in the Holy Quran: \'And We created from water every living thing.\' …I am deeply sorry for their migrated, as they are partners in the homeland, city, school, and lifelong companions." (Voices from Amara)<br><br><strong>‘Respect & Peace’</strong><br><br>"When we were young, during the monarchy era, we didn\'t understand matters of religions and sects. One day, one of the elders of the area approached us and informed us that the Mandaeans worship by the river. He advised us not to go to the river during their holidays so as not to disturb them with our presence nearby. We respected this and gave them their space to enjoy peace and continue their worship." (Voices from Nassiryah)' },
    { index: 22, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 23, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 24, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true, text: '<strong>‘Creative in everything’</strong><br><br>“They were creative in everything, not just in craftsmanship, blacksmithing, and carpentry; they were artists, scholars, and exceptionally intelligent poets. In the city where there were no televisions or entertainment venues, we would sit in cafes on the riverbank and play dominoes together, Muslims and Sabaeans, without discrimination. They were characterized by intelligence, wit, culture, and unwavering loyalty to their friends." (Voices from Amara)' },
    { index: 25, text: '', audio: '', hasText : false, hasAudio : false, hasHover : false },
    { index: 26, text: '', audio: '', hasText : true, hasAudio : false, hasHover : true, text: '<strong>A Breeze in the City</strong><br><br>“I didn\'t realize they were Mandaeans until later. They were like a breeze in the city, honest, and trustworthy, and people bought from them without fear of being cheated. They belonged to one of the wonderful families in the city and were a pillar of strength in the community. …"It was the custom of the city that a funeral procession would pass through the main market. So, the Sabians would close their shops and stand in respect for the deceased. This noble gesture also occurred during religious occasions such as Ashura and others. Therefore, we do not feel that there is any difference between us. …"When the Sabian friends informed us of their departure, I went with all members of my family to their house. It was one of the hardest and most sorrowful times for me, as I returned home unconscious due to the intensity of sadness and tears streaming from my eyes. Up until this moment, whenever I remember them, I feel sadness, and the voices of their children ring in my ears, as I used to see them daily, and if I was absent for a day, their children would come to my house and ask me about the reason for my absence, saying, \'Grandma, why didn\'t you visit us today?\' We were just like a single family." (Voices from Nassiryah)<br><br><strong>This is how we are as a society</strong><br><br>“When a material is made of a single component, it becomes fragile and prone to breaking. Just like pure gold lacks the strength and durability of alloys, so do other natural materials like wood, iron, and stone without additives. This fragility mirrors our societal nature, as intended by the Lord. We don’t require rigid categorizations or excessive individualism. In Islam, it’s believed that there are countless ways to reach Allah, akin to the countless breaths we take.” (Voices from Maysan)' },
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
            loadLayerShapesJson().then(() => {
                createElements();
                updateImageSize();
            });
        });
    });
});

async function fetchFont() {
    font = await Assets.load('./assets/fonts/LibreFranklin-Regular.ttf');
    console.log('Font loaded');
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

    if(layerData.hasAudio) {
        setAudio(layerData, container);
    }
};

function setAudio(layerData, container) {
    let audioTopPadding = 0.2;
    if(isMobile) {
        audioTopPadding = 0.05;
    }

    popupAudioElement = document.getElementById('audio' + layerData.index);
    popupAudioElement.style.position = 'absolute';
    popupAudioElement.style.top = container.y - (SCROLLBAR_H * audioTopPadding) + 'px';
    popupAudioElement.style.left = container.x + (CONTENTS_W * 0.05) + 'px';
    popupAudioElement.style.zIndex = '1000';
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
        let layerTexture = getTexture(i + 2);
        const layerContext = new GraphicsContext()
            .texture(layerTexture, 0xffffff, -layerTexture.width / 2, -layerTexture.height / 2)
        const layerGfx = new Graphics(layerContext);
        layerGfx.zIndex = i;
        layerGraphics.push(layerGfx);
        bgGraphics.addChild(layerGfx);
        create_layer_collider(i);
    }
}

function highlightLayer(i) {
    layerGraphics[i].clear();
    let hoverTexture = getHoverTexture(i + 2);
    const layerContext = new GraphicsContext()
        .texture(hoverTexture, 0xffffff, -hoverTexture.width / 2, -hoverTexture.height / 2)
    layerGraphics[i] = new Graphics(layerContext);
    layerGraphics[i].zIndex = i;
    bgGraphics.addChild(layerGraphics[i]);
}

function unhighlightLayer(i) {
    layerGraphics[i].clear();
    let layerTexture = getTexture(i + 2);
    const layerContext = new GraphicsContext()
        .texture(layerTexture, 0xffffff, -layerTexture.width / 2, -layerTexture.height / 2)        
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
    if(findData(i + 2).hasHover == true) {
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

function getTexture(index) {
    const image = document.getElementById('image' + index);
    const texture = Texture.from(image);
    return texture;
}

function getHoverTexture(index) {
    const image = document.getElementById('image-hover-' + index);
    const texture = Texture.from(image);
    return texture;
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

// on resize event
// window.addEventListener('resize', resize);

// function resize() {
//     console.log('Resize');
//     const scaleFactor = Math.min(
//       window.innerWidth / app.screen.width,
//       window.innerHeight / app.screen.height
//     );
  
//     const newWidth = Math.ceil(app.screen.width * scaleFactor);
//     const newHeight = Math.ceil(app.screen.height * scaleFactor);
  
//     console.log('New width: ', app.renderer.view);
//     app.renderer.view.screen.width = `${newWidth}px`;
//     app.renderer.view.screen.height = `${newHeight}px`;
  
//     app.renderer.resize(newWidth, newHeight);
//   }