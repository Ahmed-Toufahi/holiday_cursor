let icont = new Date().getTime();


const originPosition = { x: 0, y: 0 };

const last = {
    iconTimestamp: icont,
    iconPosition: originPosition,
    mousePosition: originPosition
}

const config = {
    iconAnimationDuration: 1500,
    minimumTimeBetweenicons: 250,
    minimumDistanceBetweenicons: 75,
    glowDuration: 70,
    maximumGlowPointSpacing: 10,
    colors: ["249 146 253", "252 254 255"],
    icons: [{ c: "fa-tree", color: "105, 131, 8" },
    { c: "fa-bell", color: "253, 186, 28" },
    //{c: "fa-circle" , color:"202, 36, 5"},
    { c: "fa-gift", color: "218 27 27" },
    { c: "fa-snowflake", color: "171,240,255" }],
    sizes: ["30px", "25px"],
    animations: ["fall-1", "fall-2", "fall-3"]
}

let count = 0;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    selectRandom = items => items[rand(0, items.length - 1)];

const withUnit = (value, unit) => `${value}${unit}`,
    px = value => withUnit(value, "px"),
    ms = value => withUnit(value, "ms");

const calcDistance = (a, b) => {
    const diffX = b.x - a.x,
        diffY = b.y - a.y;

    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
}

const calcElapsedTime = (icont, end) => end - icont;

const appendElement = element => document.body.appendChild(element),
    removeElement = (element, delay) => setTimeout(() => document.body.removeChild(element), delay);


const createicon = position => {
    const icon = document.createElement("span");
    //color = selectRandom(config.colors),
    let iconConf = selectRandom(config.icons),
        type = iconConf.c,
        color = iconConf.color;


    icon.className = "icon fa-solid " + type;

    icon.style.left = px(position.x);
    icon.style.top = px(position.y);
    icon.style.fontSize = selectRandom(config.sizes);
    icon.style.color = `rgb(${color})`;
    icon.style.textShadow = `0px 0px 1.5rem rgb(${color} / 0.5)`;
    icon.style.animationName = config.animations[count++ % 3];
    icon.style.iconAnimationDuration = ms(config.iconAnimationDuration);

    appendElement(icon);

    removeElement(icon, config.iconAnimationDuration);
}



const updateLasticon = position => {
    last.iconTimestamp = new Date().getTime();

    last.iconPosition = position;
}

const updateLastMousePosition = position => last.mousePosition = position;

const adjustLastMousePosition = position => {
    if (last.mousePosition.x === 0 && last.mousePosition.y === 0) {
        last.mousePosition = position;
    }
};

const handleOnMove = e => {
    let d = window.scrollY
    const mousePosition = { x: e.clientX, y: e.clientY + d }
    adjustLastMousePosition(mousePosition);

    const now = new Date().getTime(),
        hasMovedFarEnough = calcDistance(last.iconPosition, mousePosition) >= config.minimumDistanceBetweenicons,
        hasBeenLongEnough = calcElapsedTime(last.iconTimestamp, now) > config.minimumTimeBetweenicons;

    if (hasMovedFarEnough || hasBeenLongEnough) {
        createicon(mousePosition);

        updateLasticon(mousePosition);
    }

    //createGlow(last.mousePosition, mousePosition);

    updateLastMousePosition(mousePosition);
}


function updateIcons() {
    window.onmousemove = e => handleOnMove(e);

    window.ontouchmove = e => handleOnMove(e.touches[0]);

    document.body.onmouseleave = () => updateLastMousePosition(originPosition);
}
function removeIcons() {
    window.onmousemove = null;
    window.ontouchmove = null;
    document.body.onmouseleave = null;
}

let glowElement = document.createElement("span");
let addGlow = function () {

    glowElement.style.display = "none"
    glowElement.className = "glowElement";
    document.body.appendChild(glowElement);
}
let removeGlow = function () {
    glowElement.remove();
}
let x, y
let updateGlow = () => {
    document.addEventListener('mousemove', (event) => {
        let d = window.scrollY
        x = event.clientX;
        y = event.clientY;


        glowElement.style.left = `${x}px`;
        glowElement.style.top = `${y + d}px`;
        if (glowElement.style.left != 0 || glowElement.style.top != 0) {
            glowElement.style.display = "block"
        }
    });
    document.addEventListener('mouseleave', () => {
        glowElement.style.display = 'none';
    });

    // Show glowElement when mouse enters the document
    document.addEventListener('mouseenter', () => {
        glowElement.style.display = 'block';
    });
}
function updateGlowScroll() {
    document.addEventListener('scroll', () => {
        let d = window.scrollY
        if (y !== undefined) {
            glowElement.style.top = `${y + d}px`;
        }

    })
}



let effectOn = function () {
    let glowElement = document.createElement("span");
    updateIcons()
    addGlow()
    updateGlow()
    updateGlowScroll()
}

let effectOff = function(){
    removeIcons()
    removeGlow()
}
effectOff()

chrome.runtime.onMessage.addListener((msg)=>{
    effectOn()
})






// Hide glowElement when mouse leaves the document

/*const script = document.createElement("script");

script.src = "font.js";

document.body.appendChild(script);*/