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
await app.init({ background: '#AA9458', width: SCREENWIDTH, height: SCREENHEIGHT, resizeTo: screenSizeDiv });
document.body.appendChild(app.canvas);

const layersCount = 25;
const globalXScale = 1;
const globalYScale = 1;

let SCROLLBAR_W = 16;
let SCROLLBAR_H = 360;
let CONTENTS_W = 360;

let textFontSize = 16;

let viewport;
let backgroundTexture;
let bgGraphics, mapBgGraphics, mapLayerGraphics;
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
let closeMuralButton;
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

const description = { index: -1, audio: '', hasText : true, hasAudio : false, text: '<center><strong>Reclaiming history through story and memory Mural</strong></center><br><br><center><em>Description Paragraph</em></center><br><br>This mural is an abstraction of the conditions and descriptions collected from interviews with Mandaeans in the diaspora and non-Mandaean Iraqi communities from Nassryah and Amara cities and who lived side by side with their Mandaean neighbours before their departure from Iraq. The mural is interactive and contains both audio and text that convey memories, belonging and anecdotes of when these communities enjoyed sharing space, relations and intimate social ties. The mural is meant to be felt rather than read, as it is not a historical or religious translation, but an artistic rendering of recorded social feelings.<br><br>هذه الجدارية عبارة عن تجريد للأحوال والأوصاف التي تم جمعها من المقابلات مع المندائيين في الشتات والمجتمعات العراقية غير المندائية من مدينتي الناصرية والعمارة والذين عاشوا جنبًا إلى جنب مع جيرانهم المندائيين قبل مغادرتهم العراق. اللوحة الجدارية تفاعلية وتحتوي على صوت ونص ينقل الذكريات والانتماء والحكايات عندما استمتعت هذه المجتمعات بتقاسم المساحة والعلاقات الاجتماعية الحميمة. من المفترض أن يتم الشعور بالجدارية وليس قرائتها حرفيا ، لأنها ليست ترجمة تاريخية أو دينية، ولكنها عرض فني للمشاعر الاجتماعية المسجلة٠ ' };

let canLoadMural = false;

fetchFont().then(() => {
    loadShapesData();
    importImportantTextures();
    init();
    createMap();
    createElements();
    updateImageSize();
    subscribeToEvents();
});

async function fetchFont() {
    font = await Assets.load('./assets/fonts/LibreFranklin-Regular.ttf');
    console.log('Font loaded');
}

function loadShapesData() {
    mapShape = getMapShapes().shapes[0];
    shapes = getLayerShapes().shapes;
}

function importImportantTextures() {
    mapTexture = getTextureByID('mapTexture');
    mapHoverTexture = getTextureByID('mapHoverTexture');
    backgroundTexture = getTextureByID('backgroundTexture');
    boxUI = getTextureByID('boxUI');
    scrollbarUI = getTextureByID('scrollbarUI');
    scrollbarButtonUI = getTextureByID('scrollbarButtonUI');
    closeButtonUI = getTextureByID('closeButtonUI');
}

function init() {
    closeMuralButton = document.getElementsByClassName('close-mural')[0];

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
    if(closeMuralButtongfx) {
        closeMuralButtongfx.visible = false;
    }

    const container = new Container();
    currentPopupContainer = container;
    container.x = x;
    container.y = y;

    let popupTopPadding = 0.3;
    if(isMobile) {
        popupTopPadding = 0.15;
        CONTENTS_W = SCREENWIDTH * 0.8;
        SCROLLBAR_H = SCREENHEIGHT * 0.5;
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
            if(isMobile) {
                boxXPosition = -CONTENTS_W * 0.05;
                boxYPosition = -SCROLLBAR_H * 0.15;
                boxWidth = CONTENTS_W + (CONTENTS_W * 0.05) * 2;
                boxHeight = SCROLLBAR_H * 0.2;
                closeButtonY = -SCROLLBAR_H * popupTopPadding * 0.92;
            } else {
                boxXPosition = -CONTENTS_W * 0.05;
                boxYPosition = -SCROLLBAR_H * popupTopPadding;
                boxWidth = CONTENTS_W + CONTENTS_W * 0.11;
                boxHeight = SCROLLBAR_H * 0.3;
                closeButtonY = -SCROLLBAR_H * popupTopPadding * 0.92;
            }
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
    closeButtongfx.y = closeButtonY * (isMobile ? 1.1 : 1);
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
        muralButton.x = CONTENTS_W / 2 * (isMobile ? 0.6 : 0.5);
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

function initPopup(layerData, hasMuralButton = false) {
    closePopup();
    let popup = document.getElementsByClassName('popup-container')[0];
    currentPopupContainer = popup;
    if(isMobile) {
        currentPopupContainer.style.height = '80%';
        currentPopupContainer.style.width = '80%';
    } else {
        currentPopupContainer.style.height = '70%'
        currentPopupContainer.style.width = '50%';
    }
    currentPopupContainer.style.display = 'flex';

    let popupHeader = document.getElementsByClassName('popup-header')[0];

    let popupTextContent = document.getElementById('text-content');
    popupTextContent.innerHTML = convertLayerDataTextToHTML(layerData);

    let popupAudioSourceElement = document.getElementById('audio' + layerData.index);
    if(layerData.hasAudio) {
        let popupAudioElement = document.getElementById('audio');
        popupAudioElement.src = popupAudioSourceElement.src;
        popupAudioElement.style.display = 'block';
    } else {
        let popupAudioElement = document.getElementById('audio');
        popupAudioElement.style.display = 'none';
    }

    if(hasMuralButton === true) {
        let muralButton = document.createElement('button');
        muralButton.innerHTML = 'View Mural';
        muralButton.className = 'mural-button';
        muralButton.onclick = () => {
            if(canLoadMural === false) {
                return;
            }
            closePopup();
            toggleMuralVisibility();
        }
        popupHeader.insertBefore(muralButton, popupHeader.firstChild);
    }

    if(hasMuralButton == false) {
        const audioOnly = layerData.hasAudio == true && layerData.hasText == false;
        const textOnly = layerData.hasAudio == false && layerData.hasText == true;
        if(audioOnly) {
            let popupContentContainer = document.getElementsByClassName('popup-content')[0];
            popupContentContainer.style.display = 'none';
            if(isMobile) {
                popup.style.height = 12 + 'vh';
                popupHeader.style.borderBottom = 'none';
            } else {
                popup.style.height = 9.5 + 'vh';
                popupHeader.style.borderBottom = 'none';
            }
        }
        if(textOnly) {
            popupHeader.style.borderBottom = 'none';
            // popupHeader.style.display = 'none';
        }
    }

    let popupCloseButton = document.getElementsByClassName('close-button')[0];
    popupCloseButton.onclick = () => {
        closePopup();
    }
}

function convertLayerDataTextToHTML(layerData) {
    let text = layerData.text;
    let textArray = text.split('<br><br>');
    let textHTML = '';
    for(let i = 0; i < textArray.length; i++) {
        textHTML += textArray[i];
        textHTML += '<br><br>';
    }
    textHTML = textHTML.replace(/<center>/g, '');
    textHTML = textHTML.replace(/<\/center>/g, '');
    return textHTML;
}

function setAudio(layerData, container) {
    let audioTopPadding = 0.2;
    if(isMobile) {
        audioTopPadding = 0.08;
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
    g.rect(0, 0, w, h).texture(scrollbarUI, 0xffffff, -w, 0, w, h);
    g.hitArea = new Rectangle(0, 0, w, h);
    g.zIndex = 999;
    return g;
};
  
const getScrollBarButton = (width, color) => {
    const ratio = 0.5;
    const g = new Graphics();
    g.rect(-width * 1.5, -width * ratio, width, width).texture(scrollbarButtonUI, 0xffffff, -width * 1.5, -width * ratio, width, width);

    g.hitArea = new Rectangle(-width * 1.5, -width * ratio, width, width);
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

    if(mapBgGraphics) {
        mapBgGraphics.width = imageWidth;
        mapBgGraphics.height = imageHeight;
    }

    canLoadMural = true;
}

function createMap() {
    const bgContext = new GraphicsContext()
        .rect(-backgroundTexture.width/2, 0, backgroundTexture.width, backgroundTexture.height)
        .texture(mapTexture, 0xffffff, -backgroundTexture.width / 2, -backgroundTexture.height / 2)
    mapBgGraphics = new Graphics(bgContext);
    mapBgGraphics.scale.set(globalXScale, globalYScale);
    mapBgGraphics.x = viewport.center.x;
    mapBgGraphics.y = viewport.center.y;
    mapBgGraphics.zIndex = 950;
    mapBgGraphics.interactive = true;
    mapBgGraphics.buttonMode = true;
    mapBgGraphics.eventMode = 'static';
    mapBgGraphics.hitArea = new Rectangle(-backgroundTexture.width / 2, -backgroundTexture.height / 2, backgroundTexture.width, backgroundTexture.height);
    
    viewport.addChild(mapBgGraphics);

    createMapLayer();
}

function createMapLayer() {
    const layerContext = new GraphicsContext()
        .texture(mapTexture, 0xffffff, -mapTexture.width / 2, -mapTexture.height / 2)
    mapLayerGraphics = new Graphics(layerContext);
    mapLayerGraphics.zIndex = 960;
    mapBgGraphics.addChild(mapLayerGraphics);

    create_map_collider();
}

function highlightMap() {
    mapLayerGraphics.clear();
    const bgContext = new GraphicsContext()
        .texture(mapHoverTexture, 0xffffff, -backgroundTexture.width / 2, -backgroundTexture.height / 2)
    mapLayerGraphics = new Graphics(bgContext);
    mapLayerGraphics.scale.set(globalXScale, globalYScale);
    mapLayerGraphics.zIndex = 960;
    mapLayerGraphics.interactive = true;
    mapLayerGraphics.buttonMode = true;
    mapLayerGraphics.eventMode = 'static';
    mapLayerGraphics.hitArea = new Rectangle(-backgroundTexture.width / 2, -backgroundTexture.height / 2, backgroundTexture.width, backgroundTexture.height);
    mapBgGraphics.addChild(mapLayerGraphics);
}

function unhighlightMap() {
    mapLayerGraphics.clear();
    const bgContext = new GraphicsContext()
        .texture(mapTexture, 0xffffff, -backgroundTexture.width / 2, -backgroundTexture.height / 2)
    mapLayerGraphics = new Graphics(bgContext);
    mapLayerGraphics.scale.set(globalXScale, globalYScale);
    mapLayerGraphics.zIndex = 960;
    mapLayerGraphics.interactive = true;
    mapLayerGraphics.buttonMode = true;
    mapLayerGraphics.eventMode = 'static';
    mapLayerGraphics.hitArea = new Rectangle(-backgroundTexture.width / 2, -backgroundTexture.height / 2, backgroundTexture.width, backgroundTexture.height);
    mapBgGraphics.addChild(mapLayerGraphics);
}

function create_map_collider() {
    let points = []

    if(mapShape !== undefined) {
        mapShape.points.forEach(point => {
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
    layerGfx.zIndex = 970;
    layerGfx.interactive = true;
    layerGfx.eventMode = 'static';
    layerGfx.cursor = 'pointer';
    layerGfx.hitArea = new Polygon(points);
    if(isMobile) {
        // mobile events
        highlightMap();
        layerGfx.addListener('touchstart', () => {
            console.log('touchstart');
            initPopup(description, true);
        });
    } else {
        layerGfx.on('pointerover', () => {
            highlightMap();
        });
        layerGfx.on('pointerout', () => {
            unhighlightMap();
        });
        layerGfx.on('pointerdown', (e) => {
            console.log('pointerdown');
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
            // initScrollBar(app.stage, app.canvas, description, x, y, true, 1);
            initPopup(description, true);
        });
    }
    mapBgGraphics.addChild(layerGfx);
}

function toggleMuralVisibility() {
    closePopup();
    if(isMuralVisible) {
        bgGraphics.visible = false;
        isMuralVisible = false;
        mapBgGraphics.visible = true;
        viewport.plugins.pause('drag')
        viewport.moveCenter(viewPortCenter.x, viewPortCenter.y);
        closeMuralButton.style.display = 'none';
    } else {
        bgGraphics.visible = true;
        isMuralVisible = true;
        mapBgGraphics.visible = false;
        viewport.plugins.resume('drag');
        closeMuralButton.style.display = 'block';
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
            // initScrollBar(app.stage, app.canvas, layerData, newX, newY, false, 4);
            initPopup(layerData);
            viewport.pause = true;
        }
    });
    bgGraphics.addChild(layerGfx);
}

function subscribeToEvents() {
    closeMuralButton.style.display = 'none';
    closeMuralButton.onclick = () => {
        toggleMuralVisibility();
    }
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
    // app.stage.removeChild(currentPopupContainer);
    if(currentPopupContainer) {
        let muralButton = currentPopupContainer.getElementsByClassName('mural-button')[0];
        muralButton && muralButton.remove();
        currentPopupContainer.style.display = 'none';
        currentPopupContainer.style.height = 50 + 'vh';
    }
    let popupAudioElement = document.getElementById('audio');
    popupAudioElement.style.display = 'none';
    popupAudioElement.pause();

    let popupHeader = document.getElementsByClassName('popup-header')[0];
    // popupHeader.style.display = '';
    popupHeader.style.borderBottom = '1px solid #444';

    let popupContentContainer = document.getElementsByClassName('popup-content')[0];
    popupContentContainer.style.display = '';

    // if(popupAudioElement) {
    //     popupAudioElement.style.display = 'none';
    //     popupAudioElement.pause();
    // }
    // if(currentPopupScrollbar) {
    //     app.stage.removeChild(currentPopupScrollbar);
    //     currentPopupScrollbar.destroy();
    // }
}

function findData(index) {
    return data.find((item) => item.index === index);
}

function getMapShapes() {
    let shapes = '{"generator_info":"PixiJS polygon exporter. Visit https://github.com/eXponenta for more!","tag":"pixi_polygon_points","format":{"reshaped":true,"flat":true,"body":false,"normalized":false},"shapes":[{"label":"","id":0,"type":"POLYGON","source":{"width":2710,"height":1080},"points":[[1340,97,921,502,963,624,1496,904,1682,926,1885,832,1669,253]],"bounds":{"x":921,"y":253,"width":964,"height":1632}}]}';
    return JSON.parse(shapes);
}

function getLayerShapes() {
    let shapes = '{"shapes":[{"points":[[2375,136.5,2348.5,167,2338,150.5,2330.5,158,2327.5,188,2302.5,185,2309,214.5,2274.5,247,2304,250.5,2294.5,310,2328.5,297,2350,331.5,2370,267.5,2404.5,330,2453,496.5,2479,500.5,2496.5,476,2494.5,436,2466.5,424,2441,337,2404.5,263,2404,252.5,2444,256.5,2443.5,215,2408.5,196,2420,168.5,2381.5,175,2376,136.5]]},{"points":[[1522,25.5,1512,60.5,1484,52.5,1482,109.5,1466,86.5,1457,106.5,1427.5,100,1444,95.5,1425,77.5,1385.5,125,1398.5,99,1372.5,93,1374,133.5,1353.5,134,1365.5,116,1351,103.5,1331,137.5,1291.5,130,1291,90.5,1277,117.5,1273,83.5,1255,105.5,1254,72.5,1234.5,75,1224.5,107,1214.5,105,1227,89.5,1206,70.5,1187.5,93,1203.5,104,1188,111.5,1172.5,100,1173,66.5,1156.5,79,1158,100.5,1140,90.5,1136,54.5,1115.5,55,1125.5,91,1106.5,99,1114.5,82,1086,46.5,1066,46.5,1041,75.5,1048,92.5,1065.5,82,1068.5,112,986,151.5,945.5,230,949.5,260,983.5,298,977.5,338,994.5,364,1082.5,346,1099.5,403,1070,453.5,994,473.5,970.5,494,983.5,532,1101,554.5,1165.5,585,1180,607.5,1203.5,589,1269,599.5,1307.5,553,1279.5,619,1315,666.5,1344.5,660,1327.5,719,1308.5,727,1328,804.5,1369.5,761,1395.5,763,1385.5,723,1404,700.5,1430,738.5,1472,707.5,1610.5,701,1520.5,544,1439.5,505,1416,455.5,1484,449.5,1498,423.5,1565,427.5,1608,484.5,1690.5,524,1696.5,542,1742.5,529,1721.5,453,1741,398.5,1728.5,370,1686,365.5,1711.5,326,1697,299.5,1745.5,292,1731.5,213,1730.5,253,1726,203.5,1712.5,196,1712.5,226,1701.5,188,1694.5,208,1681.5,193,1682.5,213,1674,152.5,1648,132.5,1634,145.5,1628.5,126,1605,135.5,1593,96.5,1539.5,68,1566,71.5,1575,42.5,1547,30.5,1530.5,64,1523,25.5]]},{"points":[[335,285.5,336,305.5,280.5,316,328,333.5,279,350.5,269,368.5,310,371.5,293.5,409,302,424.5,352.5,390,314,494.5,283.5,498,309.5,464,275,427.5,284.5,414,272,391.5,193,432.5,213.5,436,187,473.5,204,493.5,232.5,481,232,521.5,207,538.5,176.5,542,95,499.5,-0.5,530,4,1079.5,364,1079.5,354,1041.5,374,1039.5,385.5,1001,417,1023.5,463.5,1012,494,1052.5,514,1055.5,535.5,1011,538.5,931,624.5,815,621,785.5,557.5,734,603,693.5,600.5,636,498,621.5,495.5,574,347.5,504,383.5,397,419.5,446,434,411.5,452,408.5,423,334.5,448.5,324,336,285.5]]},{"points":[[201,31.5,166,50.5,130.5,48,89.5,59,52.5,121,70.5,130,64.5,239,77.5,288,66,336.5,84,344.5,124,331,101,550,124,544,157.5,312,172,451.5,181,456.5,179.5,397,186,445.5,201.5,431,198.5,401,207,430.5,233.5,417,234.5,378,245,393.5,248.5,384,217.5,167,220.5,147,247.5,132,251,101.5,270.5,86,262,67.5,234,64.5,252,57.5,245.5,43,202,31.5]]},{"points":[[699,560.5,645.5,651,635.5,653,646.5,614,635,598.5,560.5,622,590,648.5,592.5,678,543.5,729,543.5,749,603.5,783,612.5,811,523.5,910,511,1038.5,470,996.5,412,1006.5,403,971.5,383.5,971,364.5,983,359,1012.5,332.5,1015,331.5,1054,348,1077.5,1108,1079.5,1114,1057.5,1172,1060.5,1212,1028.5,1242,1028.5,1277.5,980,1271.5,1020,1291,1042.5,1278.5,1070,1301.5,1074,1326,1018.5,1304.5,1000,1307.5,942,1292.5,905,1322.5,853,1318.5,835,1166,887.5,1157,861.5,1084,835.5,1074,776.5,1048,762.5,1031.5,775,1031,822.5,1014,811.5,954.5,820,890.5,771,916.5,756,913,737.5,700,560.5]]},{"points":[[620,23.5,591.5,91,584.5,41,570.5,40,573.5,120,540,141,471,112.5,459,122.5,480,144.5,392.5,142,381,187.5,482,234.5,412,215.5,358.5,240,464,264.5,501,298.5,433,305.5,419.5,321,430,338.5,590,340.5,645,368.5,694,354.5,720.5,324,717.5,294,630,265.5,610.5,242,574,179.5,583,164.5,598.5,175,595,156.5,552,151,601,123.5,654,170.5,662,141.5,686.5,160,677,112.5,707,120,736,105.5,733,90.5,684,66.5,664.5,103,645,104.5,666.5,82,662,66.5,588,116.5,639,53.5,619.5,60,621,23.5]]},{"points":[[951,78.5,874.5,100,843.5,195,781.5,236,761.5,231,726.5,324,712.5,393,727,439.5,761.5,461,768.5,508,696.5,542,769,581.5,782.5,618,798.5,612,796,541.5,831,555.5,833,517.5,871.5,521,885.5,557,931.5,541,965.5,560,1004.5,547,983.5,515,988,485.5,1058,475.5,1115.5,419,1096,328.5,1002,360.5,989.5,292,954.5,233,997.5,102,952,78.5]]},{"points":[[1292,451.5,1304,479.5,1254,480.5,1279,502.5,1270,507.5,1189.5,466,1187,486.5,1157.5,491,1173.5,504,1141.5,527,1171,534.5,1164,552.5,1184,551.5,1169,578.5,1117,546.5,1027,532.5,967.5,549,934.5,526,908,539.5,884.5,500,822,500.5,789.5,517,786.5,537,756.5,531,757,551.5,752,542.5,738.5,558,690,541.5,678.5,568,896,741.5,903,749.5,854,757.5,947,838.5,1032.5,828,1036,773.5,1055,766.5,1096.5,852,1153.5,869,1141.5,879,1097.5,859,1099,893.5,1209,890.5,1288,865.5,1340,817.5,1348,824.5,1353,806.5,1326.5,789,1322.5,749,1363.5,645,1382.5,678,1392.5,660,1405,672.5,1409.5,653,1399,585.5,1340,580.5,1356.5,533,1377,554.5,1384.5,547,1377.5,480,1293,451.5]]},{"points":[[457,427.5,444.5,456,460,493.5,416.5,463,405.5,505,444.5,504,405,533.5,491,513.5,455.5,546,483.5,553,470.5,637,498.5,664,580,620.5,630.5,615,613.5,662,636,672.5,676.5,627,692,547.5,784.5,505,772.5,488,781.5,458,718,426.5,633,483.5,575,502.5,576,463.5,542.5,502,526.5,454,524.5,474,501,455.5,535,519.5,487.5,498,484.5,458,458,427.5]]},{"points":[[2566,441.5,2525,454.5,2498,441.5,2480,488.5,2431.5,537,2432.5,567,2414.5,577,2423.5,626,2395.5,668,2431,701.5,2441.5,740,2422,775.5,2394,786.5,2410,888.5,2365,940.5,2401.5,987,2395,1026.5,2370.5,1044,2406,1079.5,2709.5,1070,2709.5,500,2666,480.5,2641,447.5,2624,458.5,2567,441.5]]},{"points":[[1799,635.5,1778.5,640,1789.5,655,1758.5,679,1751,747.5,1722,703.5,1682,715.5,1670,743.5,1639.5,741,1640.5,721,1599,690.5,1500,707.5,1484,683.5,1412.5,674,1381.5,724,1401.5,811,1410.5,830,1437.5,826,1458.5,859,1567,904.5,1704,872.5,1730.5,800,1836.5,772,1843.5,683,1816,655.5,1820,638.5,1800,635.5]]},{"points":[[1373,749.5,1284,884.5,1282.5,937,1260.5,920,1264,892.5,1186.5,905,1196.5,923,1178,940.5,1170.5,898,1131.5,897,1124,910.5,1107,899.5,1101,926.5,1123.5,960,1090,967.5,1084.5,1036,1106,1079.5,1486.5,1077,1503.5,1014,1440.5,1003,1453,944.5,1479,913.5,1462,852.5,1428.5,860,1406.5,773,1374,749.5]]},{"points":[[1508,359.5,1469,386.5,1466,416.5,1439,390.5,1397,400.5,1396,450.5,1382.5,463,1428,519.5,1456.5,529,1461,569.5,1479.5,571,1483,540.5,1502.5,548,1507.5,598,1524.5,598,1529.5,578,1556,621.5,1584,634.5,1629.5,586,1548.5,492,1638,558.5,1697.5,554,1708.5,538,1631,474.5,1582,386.5,1553.5,381,1573,424.5,1509,359.5]]},{"points":[[2105,116.5,2014,150.5,1935,124.5,1919.5,150,1901.5,144,1830,183.5,1873.5,210,1916.5,279,1806.5,372,1806.5,462,1834,493.5,1879,517.5,1947.5,517,1881,470.5,1862.5,424,1904,378.5,2002.5,349,2026.5,309,2036.5,306,2045,337.5,2063,318.5,2095,333.5,2205,317.5,2191,247.5,2134.5,205,2106,116.5]]},{"points":[[1793,255.5,1769.5,263,1781,301.5,1760,287.5,1741,333.5,1738.5,287,1713,270.5,1696.5,283,1682,308.5,1695,324.5,1666.5,353,1677.5,381,1734,395.5,1744,444.5,1793.5,432,1798.5,375,1841.5,331,1812,305.5,1827.5,279,1794,255.5]]},{"points":[[1669,528.5,1616.5,564,1604,589.5,1559.5,594,1577.5,662,1627,697.5,1723,673.5,1753.5,634,1743.5,556,1670,528.5]]},{"points":[[2029,295.5,1982.5,367,1958,385.5,1934.5,380,1954,403.5,1913.5,398,1939,426.5,1898.5,432,1927.5,477,1949.5,479,1956,604.5,2023.5,589,2032,508.5,2100,448.5,2085,400.5,2068.5,408,2069,438.5,2051,441.5,2072.5,323,2050.5,319,2035.5,389,2043,308.5,2030,295.5]]},{"points":[[2101,583.5,2067,595.5,2082.5,625,2066.5,638,2059,612.5,2049,651.5,1976,657.5,1998.5,671,1998.5,791,2036.5,792,2024,939.5,2053.5,781,2069,870.5,2117.5,839,2100.5,679,2132.5,663,2074,648.5,2087.5,634,2115.5,641,2126.5,624,2131.5,603,2097.5,611,2102,583.5]]},{"points":[[2272,651.5,2242.5,679,2176.5,692,2169,733.5,2206.5,739,2190.5,785,2215,811.5,2255.5,766,2310.5,920,2345.5,940,2352.5,923,2297.5,824,2281,754.5,2318,791.5,2338.5,792,2333.5,762,2353,764.5,2360.5,731,2325,709.5,2334,690.5,2294,689.5,2306.5,662,2268,670.5,2273,651.5]]},{"points":[[1898,679.5,1897.5,720,1875.5,699,1862.5,707,1900.5,761,1859.5,746,1892,812.5,1848,788.5,1799,785.5,1761.5,798,1744,823.5,1826.5,952,1774,954.5,1762.5,970,1811,1003.5,1901,1004.5,1966,1079.5,2049.5,1038,1961.5,940,1933,885.5,1958.5,866,1922,846.5,1978,860.5,1983,844.5,1962,822.5,1990,812.5,1949.5,817,1954,787.5,1903.5,837,1908,786.5,1926,796.5,1977,739.5,1947,745.5,1932,726.5,1908.5,760,1937.5,697,1907.5,708,1899,679.5]]},{"points":[[1710,873.5,1711.5,903,1681.5,898,1682.5,908,1726,953.5,1692.5,952,1739.5,1000,1693,992.5,1620,1012.5,1597.5,1052,1629,1079.5,1679,1077.5,1639.5,1045,1691,1078.5,1810.5,1076,1797,1049.5,1821.5,1035,1776,1015.5,1838.5,1016,1792,1001.5,1806,974.5,1784.5,997,1782.5,969,1759.5,1023,1744.5,977,1788,953.5,1798,914.5,1739,951.5,1743.5,882,1723.5,901,1711,873.5]]},{"points":[[823,32.5,799.5,81,809.5,42,787,58.5,768,52.5,793,107.5,755,177,780,178,798.5,125,833.5,137,846.5,113,836,95.5,801.5,108,845.5,52,824,32.5]]},{"points":[[624,473,690,429,682,383,660,368,608,387,586,446]]},{"points":[[1507,909,1490,954,1489,991,1550,1017,1594,964]]},{"points":[[2145,532,2218,536,2317,532,2309,403,2196,369,2135,412]]},{"points":[[2047,514.5,2037,571,2060,568]]}]}';
    return JSON.parse(shapes);
}

function getTextureByID(id) {
    const image = document.getElementById(id);
    const texture = Texture.from(image);
    return texture;
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
    // if(closeMuralButtongfx) {
    //     if(isMobile) {
    //         closeMuralButtongfx.x = viewport.center.x - 16;
    //         closeMuralButtongfx.y = viewport.center.y - window.innerHeight * 0.48;
    //     } else {
    //         closeMuralButtongfx.x = viewport.center.x - 16;
    //         closeMuralButtongfx.y = viewport.center.y - window.innerHeight * 0.48;
    //     }
    // }
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