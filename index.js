const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let playerDir = [0, 0, 0, 0];
let attackSpeed = 300;

let projectiles = [];
let lastFire = 0;
let delay = 0;
let totalRooms = 0;
let totalRoomsVisited = 0;

let enemies = [];
let hitDelay = 0;
let lastHit = 0;
let totalEnemies = 0;

let particals = [];

let drops = [];
let coins = 0;

const floor = {
    // S - Starting Room
    // N - Nothing
    // X - Can't go there
    // 0 - L
    // 1 - LR
    // 2 - LD
    // 3 - LU
    // 4 - R
    // 5 - RD
    // 6 - RU
    // 7 - D
    // 8 - DU
    // 9 - U
    
    // End - No Exits
    // 1 - Left Exits
    // 0 - Right Exit
    // 3 - Down Exit
    // 2 - Up Exit
    rooms: [
        /*Left Rooms*/ [0, 1, 2, 3],
        /*Right Rooms*/[1, 4, 5, 6],
        /*Down Rooms*/ [2, 5, 7, 8],
        /*Up Rooms*/   [3, 6, 8, 9]
    ],
    
    roomData: [
        /*Left Rooms*/ ['End', 0, 3, 2],
        /*Right Rooms*/[1, 'End', 3, 2],
        /*Down Rooms*/ [1, 0, 'End', 2],
        /*Up Rooms*/   [1, 0, 3, 'End']    
    ],
    
    data: [
        ['N', 7, 7, 7, 7, 7, 7, 7, 'N'],
        [4, 'N', 'N', 'N', 'N', 'N', 'N', 'N', 0],
        [4, 'N', 'N', 'N', 'N', 'N', 'N', 'N', 0],
        [4, 'N', 'N', 'N', 'X', 'N', 'N', 'N', 0],
        [4, 'N', 'N', 'X', 'S', 'X', 'N', 'N', 0],
        [4, 'N', 'N', 'N', 'X', 'N', 'N', 'N', 0],
        [4, 'N', 'N', 'N', 'N', 'N', 'N', 'N', 0],
        [4, 'N', 'N', 'N', 'N', 'N', 'N', 'N', 0],
        ['N', 9, 9, 9, 9, 9, 9, 9, 'N'],
    ],
    
    makeFloor: function(){
        var startPos = {x: 4, y:4}
        for(var d=0; d<4; d++){
            var currPos = {x:4, y:4}
            var prevRoomData = d;
            var currRoomData = d;
            var i = 0;
            
            while(currRoomData != 'End'){
                var randomRoom = Math.floor(Math.random()*4);
                
                if(currRoomData == 0){
                    if(i == 0 && this.data[currPos.y][currPos.x+1] == 'X'){
                        this.data[currPos.y][currPos.x+1] = this.rooms[currRoomData][randomRoom];
                    }else if(this.data[currPos.y][currPos.x+1] == 'N'){
                        this.data[currPos.y][currPos.x+1] = this.rooms[currRoomData][randomRoom];
                    }else{
                        if(prevRoomData == 0){
                            this.data[currPos.y][currPos.x] = 0;
                        }else if(prevRoomData == 1){
                            this.data[currPos.y][currPos.x] = 4;
                        }else if(prevRoomData == 2){
                            this.data[currPos.y][currPos.x] = 7;
                        }else if(prevRoomData == 3){
                            this.data[currPos.y][currPos.x] = 9;
                        }
                        break;
                    }
                    currPos.x ++;
                }else if(currRoomData == 1){
                    if(i == 0 && this.data[currPos.y][currPos.x-1] == 'X'){
                        this.data[currPos.y][currPos.x-1] = this.rooms[currRoomData][randomRoom];
                    }else if(this.data[currPos.y][currPos.x-1] == 'N'){
                        this.data[currPos.y][currPos.x-1] = this.rooms[currRoomData][randomRoom];
                    }else{
                        if(prevRoomData == 0){
                            this.data[currPos.y][currPos.x] = 0;
                        }else if(prevRoomData == 1){
                            this.data[currPos.y][currPos.x] = 4;
                        }else if(prevRoomData == 2){
                            this.data[currPos.y][currPos.x] = 7;
                        }else if(prevRoomData == 3){
                            this.data[currPos.y][currPos.x] = 9;
                        }
                        break;
                    }
                    currPos.x --;
                }else if(currRoomData == 2){
                    if(i == 0 && this.data[currPos.y-1][currPos.x] == 'X'){
                        this.data[currPos.y-1][currPos.x] = this.rooms[currRoomData][randomRoom];
                    }else if(this.data[currPos.y-1][currPos.x] == 'N'){
                        this.data[currPos.y-1][currPos.x] = this.rooms[currRoomData][randomRoom];
                    }else{
                        if(prevRoomData == 0){
                            this.data[currPos.y][currPos.x] = 0;
                        }else if(prevRoomData == 1){
                            this.data[currPos.y][currPos.x] = 4;
                        }else if(prevRoomData == 2){
                            this.data[currPos.y][currPos.x] = 7;
                        }else if(prevRoomData == 3){
                            this.data[currPos.y][currPos.x] = 9;
                        }
                        break;
                    }
                    currPos.y --;
                }else if(currRoomData == 3){
                    if(i == 0 && this.data[currPos.y+1][currPos.x] == 'X'){
                        this.data[currPos.y+1][currPos.x] = this.rooms[currRoomData][randomRoom];
                    }else if(this.data[currPos.y+1][currPos.x] == 'N'){
                        this.data[currPos.y+1][currPos.x] = this.rooms[currRoomData][randomRoom];
                    }else{
                        if(prevRoomData == 0){
                            this.data[currPos.y][currPos.x] = 0;
                        }else if(prevRoomData == 1){
                            this.data[currPos.y][currPos.x] = 4;
                        }else if(prevRoomData == 2){
                            this.data[currPos.y][currPos.x] = 7;
                        }else if(prevRoomData == 3){
                            this.data[currPos.y][currPos.x] = 9;
                        }
                        break;
                    }
                    currPos.y ++;
                }
                
                i++;
                if(i >= 200){
                    break;
                }
                totalRooms ++;
                prevRoomData = currRoomData
                currRoomData = this.roomData[currRoomData][randomRoom];
            }
        }
        
        //boss room
        var index = 0;
        while(this.data.join().indexOf('B') < 0){
            var bossChord = {x: Math.floor(Math.random()*this.data.length), y: Math.floor(Math.random()*this.data.length)};
            if(this.data[bossChord.y][bossChord.x] == 'N'){
                if(bossChord.y > 0){
                    if(this.data[bossChord.y-1][bossChord.x] != 4 && this.data[bossChord.y-1][bossChord.x] != 7 && this.data[bossChord.y-1][bossChord.x] != 0 && this.data[bossChord.y-1][bossChord.x] != 9){
                        if(Number.isInteger(this.data[bossChord.y-1][bossChord.x])){
                            this.data[bossChord.y][bossChord.x] = 'B'    
                        }
                    }
                }else if(bossChord.y < 9){
                    if(this.data[bossChord.y+1][bossChord.x] != 4 && this.data[bossChord.y+1][bossChord.x] != 7 && this.data[bossChord.y+1][bossChord.x] != 0 && this.data[bossChord.y+1][bossChord.x] != 9){
                        if(Number.isInteger(this.data[bossChord.y+1][bossChord.x])){
                            this.data[bossChord.y][bossChord.x] = 'B'    
                        }
                    }
                }else if(bossChord.x > 0){
                    if(this.data[bossChord.y][bossChord.x+1] != 4 && this.data[bossChord.y][bossChord.x+1] != 7 && this.data[bossChord.y][bossChord.x+1] != 0 && this.data[bossChord.y][bossChord.x+1] != 9){
                        if(Number.isInteger(this.data[bossChord.y][bossChord.x+1])){
                            this.data[bossChord.y][bossChord.x] = 'B'    
                        }
                    }
                }else if(bossChord.x < 9){
                    if(this.data[bossChord.y][bossChord.x-1] != 4 && this.data[bossChord.y][bossChord.x-1] != 7 && this.data[bossChord.y][bossChord.x-1] != 0 && this.data[bossChord.y][bossChord.x-1] != 9){
                        if(Number.isInteger(this.data[bossChord.y][bossChodr.x-1])){
                            this.data[bossChord.y][bossChord.x] = 'B'    
                        }
                    }
                }
            }
            
            index ++;
            if(index > 500){
                break;
            }
        }
        // merchant room
        index  = 0;
        while(this.data.join().indexOf('M') < 0){
            var merchantChord = {x: Math.floor(Math.random()*this.data.length), y: Math.floor(Math.random()*this.data.length)};
            if(this.data[merchantChord.y][merchantChord.x] == 'N'){
                if(merchantChord.y > 0){
                    if(this.data[merchantChord.y-1][merchantChord.x] != 4 && this.data[merchantChord.y-1][merchantChord.x] != 7 && this.data[merchantChord.y-1][merchantChord.x] != 0 && this.data[merchantChord.y-1][merchantChord.x] != 9){
                        if(Number.isInteger(this.data[merchantChord.y-1][merchantChord.x])){
                            this.data[merchantChord.y][merchantChord.x] = 'M'    
                        }
                    }
                }else if(merchantChord.y < 9){
                    if(this.data[merchantChord.y+1][merchantChord.x] != 4 && this.data[merchantChord.y+1][merchantChord.x] != 7 && this.data[merchantChord.y+1][merchantChord.x] != 0 && this.data[merchantChord.y+1][merchantChord.x] != 9){
                        if(Number.isInteger(this.data[merchantChord.y+1][merchantChord.x])){
                            this.data[merchantChord.y][merchantChord.x] = 'M'    
                        }
                    }
                }else if(merchantChord.x > 0){
                    if(this.data[merchantChord.y][merchantChord.x+1] != 4 && this.data[merchantChord.y][merchantChord.x+1] != 7 && this.data[merchantChord.y][merchantChord.x+1] != 0 && this.data[merchantChord.y][merchantChord.x+1] != 9){
                        if(Number.isInteger(this.data[merchantChord.y][merchantChord.x+1])){
                            this.data[merchantChord.y][merchantChord.x] = 'M'    
                        }
                    }
                }else if(merchantChord.x < 9){
                    if(this.data[merchantChord.y][merchantChord.x-1] != 4 && this.data[merchantChord.y][merchantChord.x-1] != 7 && this.data[merchantChord.y][merchantChord.x-1] != 0 && this.data[merchantChord.y][merchantChord.x-1] != 9){
                        if(Number.isInteger(this.data[merchantChord.y][merchantChodr.x-1])){
                            this.data[merchantChord.y][merchantChord.x] = 'M'    
                        }
                    }
                }
            }
            
            index ++;
            if(index > 500){
                break;
            }
        }
        
        return this.data;
    }
}

class Player{
    constructor(x, y, width, height, velocity, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.color = color;
        this.damage = 1;
        this.health = 3;
        this.extraHealth = 0;
    }
    draw(){
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
    }
    update(){
        // Going up
        if(playerDir[0] && (this.y > 60 || ((this.x > 175 && this.x < 325) && floorObj.doors[1])) && !((this.x <= 60 || this.x >= 430) && this.y < 179)){
            this.velocity.y = 5;
        }else if(this.velocity.y == 5){
            this.velocity.y = 0;
        }
        //Going Down
        if(playerDir[1] && (this.y < 426 || ((this.x > 175 && this.x < 325) && floorObj.doors[3])) && !((this.x <= 60 || this.x >= 430) && this.y > 310)){
            this.velocity.y = -5;
        }else if(this.velocity.y == -5){
            this.velocity.y = 0;
        }
        //Going Left
        if(playerDir[2] && (this.x > 60 || ((this.y > 175 && this.y < 325) && floorObj.doors[0])) && !((this.y <= 60 || this.y >= 430) && this.x < 179)){
            this.velocity.x = 5;
        }else if(this.velocity.x == 5){
            this.velocity.x = 0;
        }
        //Going Right
        if(playerDir[3] && (this.x < 426 || ((this.y > 175 && this.y < 325) && floorObj.doors[2])) && !((this.y <= 60 || this.y >= 430) && this.x > 310)){
            this.velocity.x = -5;
        }else if(this.velocity.x == -5){
            this.velocity.x = 0;
        }
        //Swich Rooms
        
        //Left
        if(this.x <= 0){
            floorObj.currRoom.x --;
            this.x = 490;
            projectiles = [];
            drops = [];
            
            switchRooms();
        //Right
        }else if(this.x >= 500){
            floorObj.currRoom.x ++;
            this.x = 10;
            projectiles = [];
            drops = [];
            
            switchRooms();
        //Up
        }else if(this.y <= 0){
            floorObj.currRoom.y --;
            this.y = 490;
            projectiles = [];
            drops = [];
            
            switchRooms();
        //Down
        }else if(this.y >= 500){
            floorObj.currRoom.y ++;
            this.y = 10;
            projectiles = [];
            drops = [];
            
            switchRooms();
        }
        
        this.draw();
        this.x -= Math.abs(this.velocity.x)+Math.abs(this.velocity.y)==10?this.velocity.x/1.5:this.velocity.x;
        this.y -= Math.abs(this.velocity.x)+Math.abs(this.velocity.y)==10?this.velocity.y/1.5:this.velocity.y;
    }
}

class Projectile{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update(index){
        this.draw()
        this.x -= this.velocity.x;
        this.y -= this.velocity.y;
    }
}

class Enemy{
    constructor(x, y, velocity, type){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.type = type;
        this.follow = false;
        if(this.type == 'fly'){
            this.health = 2;
            this.speed = 4;
            this.range = 100;
            this.damage = 0.5;
        }
    }
    draw(){
        if(this.type == 'fly'){
            c.beginPath()
            c.arc(this.x, this.y, 6, 0, Math.PI*2, false)
            c.fillStyle = 'black'
            c.fill()
            c.beginPath()
            c.arc(this.x+0.2, this.y, 2, 0, Math.PI*2, false)
            c.fillStyle = 'red'
            c.fill()
        }
    }
    update(){
        this.draw();
        //left
        if((this.x - this.velocity.x < 60 && !(floorObj.doors[0] && (this.y - this.velocity.y > 180 && this.y - this.velocity.y < 320))) || this.x - this.velocity.x < 0 || ((this.y - this.velocity.y <= 60 || this.y - this.velocity.y >= 430) && this.x - this.velocity.x < 180)){
            this.velocity.x *= -1;
        }
        //right
        if((this.x - this.velocity.x > 440 && !(floorObj.doors[2] && (this.y - this.velocity.y > 180 && this.y - this.velocity.y < 320))) || this.x - this.velocity.x > 500 || ((this.y - this.velocity.y <= 60 || this.y - this.velocity.y >= 430) && this.x - this.velocity.x > 320)){
            this.velocity.x *= -1;
        }
        //up
        if((this.y - this.velocity.y < 60 && !(floorObj.doors[1] && (this.x - this.velocity.x > 180 && this.x - this.velocity.x < 320))) || this.y - this.velocity.y < 0 || ((this.x - this.velocity.x <= 60 || this.x - this.velocity.x >= 430) && this.y - this.velocity.y < 180)){
            this.velocity.y *= -1;
        }
        //down
        if((this.y - this.velocity.y > 440 && !(floorObj.doors[3] && (this.x - this.velocity.x > 180 && this.x - this.velocity.x < 320))) || this.y - this.velocity.y > 500 || ((this.x - this.velocity.x <= 60 || this.x - this.velocity.x >= 430) && this.y - this.velocity.y > 320)){
            this.velocity.y *= -1;
        }

        this.x -= Math.abs(this.velocity.x)+Math.abs(this.velocity.y)==10?this.velocity.x/1.5:this.velocity.x;
        this.y -= Math.abs(this.velocity.x)+Math.abs(this.velocity.y)==10?this.velocity.y/1.5:this.velocity.y;
    }
}

const friction = 0.98
class Partical{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    
    draw(){
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }
    
    update(){
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

class Floor{
    constructor(data){
        this.data = data;
        console.log(data.join('\n'))
        this.currRoom = {x:4, y:4}
        this.enemyData = [
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N']
        ]
    }
    draw(){
        this.enemyData[this.currRoom.y][this.currRoom.x] = enemies
        this.roomType = this.data[this.currRoom.y][this.currRoom.x];
        c.fillStyle = 'black';
        c.fillRect(0, 0, 60, 175);
        c.fillRect(0, 325, 60, 400);
        c.fillRect(0, 0, 175, 60);
        c.fillRect(325, 0, 175, 60);
        c.fillRect(440, 0, 60, 175);
        c.fillRect(440, 325, 60, 400);
        c.fillRect(0, 440, 175, 60);
        c.fillRect(325, 440, 175, 60);
        
        this.doors = [false, false, false, false];
        if(this.roomType == 'S'){
            this.doors = [true, true, true, true];
        }else if(this.roomType == 0){
            this.doors = [true, false, false, false];
        }else if(this.roomType == 1){
            this.doors = [true, false, true, false];
        }else if(this.roomType == 2){
            this.doors = [true, false, false, true];
        }else if(this.roomType == 3){
            this.doors = [true, true, false, false];
        }else if(this.roomType == 4){
            this.doors = [false, false, true, false];
        }else if(this.roomType == 5){
            this.doors = [false, false, true, true];
        }else if(this.roomType == 6){
            this.doors = [false, true, true, false];
        }else if(this.roomType == 7){
            this.doors = [false, false, false, true];
        }else if(this.roomType == 8){
            this.doors = [false, true, false, true];
        }else if(this.roomType == 9){
           this.doors = [false, true, false, false];
        }

        //left
        if(!this.doors[0]){
            c.fillRect(0, 175, 60, 325);
        }
        //up
        if(!this.doors[1]){
            c.fillRect(175, 0, 325, 60);
        }
        //right
        if(!this.doors[2]){
            c.fillRect(440, 175, 500, 325);
        }
        //down
        if(!this.doors[3]){
            c.fillRect(175, 440, 180, 500);
        }
        
    }
}

class Drop{
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
    }
    
    draw(){
        var image = new Image();
        
        if(this.type == 'extraHeart'){
            image.src = 'https://th.bing.com/th/id/R.1a1d2355f21bfdce3624eb56360a0090?rik=uRyoAZOXx5Ullw&riu=http%3a%2f%2fimg1.wikia.nocookie.net%2f__cb20130208204952%2fbindingofisaac%2fimages%2fd%2fda%2fSoul_heart.png&ehk=vY4hr14y5HSmvIy%2fM%2b2N6ctZtXXQ0BH0BHg4CfMq4jw%3d&risl=&pid=ImgRaw&r=0';
        }else if(this.type == 'heart'){
            image.src = 'https://th.bing.com/th/id/R.2efc100a5137f7e9572a5d8ead0bbf27?rik=l1zBcJQrYk6uXQ&riu=http%3a%2f%2fimg1.wikia.nocookie.net%2f__cb20130208204815%2fbindingofisaac%2fimages%2fc%2fcb%2fFull_heart.png&ehk=mCG6YkROdwpHb2kLHunqDngmmAslJiAczH0yysvmCo4%3d&risl=&pid=ImgRaw&r=0';
        }else if(this.type == 'coin'){
            image.src = 'https://th.bing.com/th/id/R.cd30811ed1dc5d7f6545c19621ec841d?rik=XEJ2vzRwx3k2fw&riu=http%3a%2f%2fimg4.wikia.nocookie.net%2f__cb20110929211349%2fbindingofisaac%2fimages%2fa%2fab%2fPenny.png&ehk=w8ZvwxLlReM5zFCwAw9TBkJPQ8AHxfHrhd5vyWndUIw%3d&risl=&pid=ImgRaw&r=0';
        }
        
        c.drawImage(image, this.x, this.y, 15, 15);
    }
}

const player = new Player(canvas.width/2, canvas.height/2, 13, 13, {x:0, y:0}, 'red');

const floorObj = new Floor(floor.makeFloor());

let animationId
function animate(){
    animationId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(255, 255, 255, 0.9)'
    c.fillRect(0, 0, canvas.width, canvas.height)
     
    projectiles.forEach((projectile, index) => {
        projectile.update();
    })
    
    particals.forEach((partical, index) =>{
        if(partical.alpha <= 0){
            particals.splice(index, 1)
        }else{
            partical.update()
        }
        partical.update()    
    })
  
    player.update();
    if(player.health <= 0){
        alert('You Are Dead');
        
        cancelAnimationFrame(animationId);
    }
    
    enemies.forEach((enemy, index) => {
        if(enemy.type == 'fly'){
            const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
            if(dist < enemy.range || enemy.follow){
                if(dist <= 10  && lastHit < hitDelay){
                    if(player.extraHealth > 0){
                        player.extraHealth -= enemy.damage; 
                    }else{
                        player.health -= enemy.damage;
                    }
                    
                    for(let i =0; i < Math.floor(Math.random()*5)+5; i++){
                        particals.push(new Partical(player.x, player.y, Math.random()*2, 'red', {x: (Math.random()-0.5)*(Math.random()*5), y: (Math.random()-0.5)*(Math.random()*5)}))
                    }
                    
                    lastHit = Date.now();
                }
                enemy.follow = true;
                const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x)
                if(Math.random() < 0.08){
                    enemy.velocity.x = Math.cos(angle)* -enemy.speed;
                    enemy.velocity.y = Math.sin(angle)* -enemy.speed;    
                }
            }else if(Math.random() < 0.08){
                var randomMove = Math.random();
                if(randomMove <= 0.25){
                    if(!enemy.y + enemy.velocity.y <= 65){
                        enemy.velocity.y = enemy.speed;
                    }
                }else if(randomMove <= 0.50){
                    if(!enemy.y + enemy.velocity.y >= 420){
                        enemy.velocity.y = -enemy.speed;
                    }
                }else if(randomMove <= 0.75){
                    if(!enemy.y + enemy.velocity.y <= 65){
                        enemy.velocity.x = enemy.speed;
                    }
                }else{
                    if(!enemy.y + enemy.velocity.y >= 420){
                        enemy.velocity.x = -enemy.speed;
                    }
                }
            }else if(Math.random() < 0.25){
                if(Math.random() < 0.10){
                    enemy.velocity.x = 0;
                }
                if(Math.random() < 0.10){
                    enemy.velocity.y = 0;
                }
            }
        }
        
        projectiles.forEach((projectile, indexx) => {
            const projectileDist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if(projectileDist <= 15){
                enemy.follow = true;
                for(let i =0; i < Math.floor(Math.random()*5)+5; i++){
                    particals.push(new Partical(enemy.x, enemy.y, Math.random()*2, 'red', {x: (Math.random()-0.5)*(Math.random()*5), y: (Math.random()-0.5)*(Math.random()*5)}))
                }
                
                knockback(projectile.velocity, enemy);
                
                enemy.health -= player.damage;
                if(enemy.health == 0){
                    enemies.splice(index, 1);
                    totalEnemies --;
                    
                    // Drops
                    var dropChance = Math.random();
                    if(dropChance > 0.99){
                        // Drop extra heart
                        drops.push(new Drop(enemy.x, enemy.y, 'extraHeart'));
                    }else if(dropChance > 0.94){
                        // Drop normal heart
                        drops.push(new Drop(enemy.x, enemy.y, 'heart'));
                    }else if(dropChance > 0.70){
                        // Drop coin
                        drops.push(new Drop(enemy.x, enemy.y, 'coin'));
                    }
                }
                projectiles.splice(indexx, 1);
            }
        })
        
        enemy.update();
    })
    
    floorObj.draw();

    drops.forEach((drop, index) => {
        const dist = Math.hypot(player.x - drop.x, player.y - drop.y)
        if(dist <= 10){
            if(drop.type == 'heart'){
                if(player.health+1 <= 3){
                    player.health ++;
                }else if(player.health+0.5 <= 3){
                    player.health += 0.5;
                }
            }else if(drop.type == 'extraHeart'){
                if(player.extraHealth+1 <= 9){
                    player.extraHealth ++;
                }else if(player.extraHealth+0.5 <= 3){
                    player.extraHealth += 0.5;
                }
            }else if(drop.type == 'coin'){
                coins ++;
            }

            drops.splice(index, 1);
        }
        
        drop.draw();
    })

    makeHotbar();
    
    delay = Date.now() - attackSpeed;
    hitDelay = Date.now() - 500;

}


window.onkeydown = function(e){
    if(e.key == 'w'){
        playerDir[0] = true;
    }
    if(e.key == 's'){
        playerDir[1] = true;
    }
    if(e.key == 'a'){
        playerDir[2] = true;
    }
    if(e.key == 'd'){
        playerDir[3] = true;
    }
    if(e.key=='ArrowUp' || e.key=='ArrowDown' || e.key=='ArrowRight' || e.key=='ArrowLeft'){
        shoot(e.key);
    }
};
window.onkeyup = function(e){
    if(e.key == 'w'){
        playerDir[0] = false;
    }
    if(e.key == 's'){
        playerDir[1] = false;
    }
    if(e.key == 'a'){
        playerDir[2] = false;
    }
    if(e.key == 'd'){
        playerDir[3] = false;
    }
};

function shoot(key){
    if(!(lastFire > delay)){
        if(key == 'ArrowUp'){
            projectiles.push(new Projectile(player.x+player.width/2, player.y+player.height/2, 3, 'black', {x:0, y:6}));
        }
        if(key == 'ArrowLeft'){
            projectiles.push(new Projectile(player.x+player.width/2, player.y+player.height/2, 3, 'black', {x:6, y:0}));
        }
        if(key == 'ArrowDown'){
            projectiles.push(new Projectile(player.x+player.width/2, player.y+player.height/2, 3, 'black', {x:0, y:-6}));
        }
        if(key == 'ArrowRight'){
            projectiles.push(new Projectile(player.x+player.width/2, player.y+player.height/2, 3, 'black', {x:-6, y:0}));
        }
        lastFire = Date.now();
    }
}

function switchRooms(){
    enemies = [];
    totalRoomsVisited ++;
    if(floorObj.enemyData[floorObj.currRoom.y][floorObj.currRoom.x] == 'N'){
        for(var i=0; i<Math.floor(Math.random()*3)+1; i++){
            enemies.push(new Enemy((Math.random()*200)+80, (Math.random()*200)+80, {x:0, y:0}, 'fly'));
            totalEnemies ++;
        }
    }else{
        enemies = floorObj.enemyData[floorObj.currRoom.y][floorObj.currRoom.x];
    }
}

function knockback(force, obj){
    obj.velocity.x = force.x;
    obj.velocity.y = force.y;
    
    setTimeout(() => {
        obj.velocity.x = 0;
        obj.velocity.y = 0;    
    }, 75)
}

function makeHotbar(){
    let heartIndex = 0;
    c.fillStyle = 'red';
    for(var i=0; i<Math.floor(player.health); i++){
        heartIndex ++;
        c.fillRect(10+(i*25), 10, 15, 15);
    }
    if(player.health%1 != 0){
        c.fillRect(10+(heartIndex*25), 10, 7.5, 15)
    }
    
    heartIndex = 0;
    c.fillStyle = 'grey';
    for(var i=0; i<Math.floor(player.extraHealth); i++){
        heartIndex ++;
        if(i < 3){
            c.fillRect(85+(i*25), 10, 15, 15); 
        }else{
            c.fillRect(10+((i-3)*25), 30, 15, 15); 
        }
    }
    if(player.extraHealth%1 != 0){
        if(heartIndex < 3){
            c.fillRect(85+(heartIndex*25), 10, 7.5, 15); 
        }else{
            c.fillRect(10+((heartIndex-3)*25), 30, 7.5, 15); 
        }
    }

    c.beginPath()
    c.arc(450, 20, 8, 0, Math.PI*2, false)
    c.fillStyle = 'yellow'
    c.fill()

    c.fillStyle = 'gray';
    c.font = '25px Arial';
    c.fillText("x "+coins, 465, 27);
}


animate();
