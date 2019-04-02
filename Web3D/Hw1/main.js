class Light {
    constructor(anotherLights) {  
        this.element = document.createElement ('div');
        this.element.id = 'light';
        this.element.style.cssText = "position:absolute;width:20px;height:20px;border-radius:10px;z-index:1"; 

        while(true){
            this.top = Math.random() * 65 + 3;
            this.left = (50 - (this.top / 65) * 40) + (80 * (this.top / 65)) * Math.random();
        
            let can = true;
            for(let i = 0; i < anotherLights.length; i++){
                if(Math.sqrt((anotherLights[i].top - this.top) * (anotherLights[i].top - this.top)
                    + (anotherLights[i].left - this.left) * (anotherLights[i].left - this.left))  < 7){
                        can = false;
                        break;
                    }
            }

            if(can)break;
        }
        this.element.style.top = this.top + '%';
        this.element.style.left = this.left + '%';
        this.element.style.background = "hsl(89, 73%, 51%)";
        document.getElementById('christmasTree').appendChild(this.element);
    }
  
    changeColor() {
        var self = this;
        var hue = Math.random()*360;
        self.element.style.background = "hsl(" + hue + ", 73%, 51%)";  
        setTimeout (function() { self.changeColor() } , Math.random() * 1000 + 1000);
    }
  
}

var santaPos = 0;
function SantaMove(){
    santaPos += (85 / 300);
    santaPos %= 85;

    let gift = document.getElementById("gift");
    let gift1 = document.getElementById("gift1");

    if(santaPos >= 50)gift.style.opacity = 1;
    else gift.style.opacity = 0;
    if(santaPos >= 30)gift1.style.opacity = 1;
    else gift1.style.opacity = 0;

    document.getElementById("santa").style.left = santaPos + 'vw';
    setTimeout(SantaMove,1000 / 60);
}

var lights = [];
function init() {
    for(let i = 0; i < 25; i++)
        lights.push(new Light(lights));
    lights.forEach((e) => e.changeColor());
    SantaMove();
    //var light = new Light();
    //light.changeColor();
}


var isOpen = true;
function toggle(){
    if(isOpen){
        lights.forEach((e) => e.element.style.opacity = 0);
        document.getElementById("power").innerHTML = '打開電源';
    }
    else {
        lights.forEach((e) => e.element.style.opacity = 1);
        document.getElementById("power").innerHTML = '關掉電源';
    }

    isOpen = !isOpen;
}

  