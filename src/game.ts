// Base
const base = new Entity()
base.addComponent(new GLTFShape("models/baseDarkWithCollider.glb"))
engine.addEntity(base)

const screenBody = new Entity()
screenBody.addComponent(new GLTFShape("models/screen.glb"))
screenBody.addComponent(
    new Transform({
      position: new Vector3(8, 0, 8)
      scale: new Vector3(0.5, 0.5, 0.5),
    })
engine.addEntity(screenBody)

// Screen
const screenTransform = new Entity()
screenTransform.addComponent(new Transform({ position: new Vector3(0, 6.6, 4) }))
screenTransform.setParent(screenBody)

const screen = new Entity()
screen.addComponent(new PlaneShape())
screen.addComponent(new Transform({ scale: new Vector3(16, 10, 1) }))
screen.getComponent(Transform).rotate(Vector3.Forward(), 180)
screen.setParent(screenTransform)
engine.addEntity(screen)

screenTransform.getComponent(Transform).scale.setAll(0.625) // You can change the scale of the screen here...

// Adjust screen material to increase the brightness and clarity
const screenMaterial = new Material()
screen.addComponent(screenMaterial)
screen.addComponent(
  new OnPointerDown(() => {
      openExternalURL("https://t.me/mm_magicnet")
  })
)

const btnTlgBody = new Entity();
engine.addEntity(btnTlgBody);
btnTlgBody.addComponent(new GLTFShape("models/board.glb"));
btnTlgBody.addComponent(
    new Transform({
        position: new Vector3(4, 0.06, 7)
    })
);
btnTlgBody.getComponent(Transform).rotate(Vector3.Up(), 180)
btnTlgBody.getComponent(Transform).scale.setAll(1.625)

const textbody1 = new Entity()
const text1 = new TextShape("Make art from \nyour photo")
text1.fontSize = 1
text1.color = Color3.Gray()
text1.font = new Font(Fonts.SanFrancisco)
text1.shadowColor = Color3.Yellow()
text1.shadowOffsetY = -1
text1.shadowOffsetX = -1
textbody1.addComponent(text1)
textbody1.addComponent(
    new Transform({
        position: new Vector3(-0.2, 1, -0.9)

    })
);
textbody1.getComponent(Transform).rotate(Vector3.Up(), 180)
engine.addEntity(textbody1);
textbody1.setParent(btnTlgBody)


const btnTlg = new Entity();
engine.addEntity(btnTlg);
btnTlg.addComponent(new GLTFShape("models/tlg.glb"));
btnTlg.addComponent(
    new Transform({
        position: new Vector3(-0.2, 0.35, -0.9)
    })
);
btnTlg.getComponent(Transform).scale.setAll(0.325)
btnTlg.addComponent(
    new OnPointerDown(() => {
        openExternalURL("https://t.me/mm_magicnet_bot")
    })
)
btnTlg.setParent(btnTlgBody)

onSceneReadyObservable.add(() => {
  log("SCENE LOADED")  
})


function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function dtformat(sdt) {
    var dateArray = sdt.split(' ');
    var year = dateArray[0].split('.');
    var time = dateArray[1].split(':');

    var finishDate = new Date(year[2], year[1] - 1, year[0], time[0], time[1], time[2]);

    return finishDate
}

const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => { o[k] = v[i]; return o }, {}))
const hdr = Struct('dt', 'filename')

function getHdr() {
    const s = httpGet("https://megamind.network/pic/hdr")
    log("hdr: " + s)

    var arr = s.split(";")

    var dt = dtformat(arr[0])
    log(dt)

    log(arr[1])

    var obj = hdr(dt, arr[1])
    return obj
}

function loadPic(filename) {
    const myTexture = new Texture("https://megamind.network/pic/" + filename)
    screenMaterial.albedoTexture = myTexture
}

var first = getHdr()

loadPic(first.filename)

var lastdt = first.dt
let timerId = setInterval(() => 
{
    var hdr = getHdr()

    if (hdr.dt > lastdt)
    {
        lastdt = hdr.dt

        loadPic(hdr.filename)
    }
}
, 2000);







