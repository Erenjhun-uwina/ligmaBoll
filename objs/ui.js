
class Ui extends Phaser.GameObjects.Container{

	constructor(scene,x,y,w=50,h=50,fill = 0x333333){
		super(scene,x,y)
		this.width = w
		this.height = h
		this.fill = fill
		
		this.#init_bg(w,h,fill)
		scene.add.existing(this)
	}
	
	setTexture(key){
		const t = this.scene.add.image(0,0,key)
		t.setDisplaySize(this.displayHeight,this.displayWidth)
		t.setOrigin(0.5)
		this.texture = t
	}
	
	#init_bg(w,h,fill){
		const{scene} = this
		this.padding = {left:20,right:20,bottom:20,top:20}	
		const r = scene.add.rectangle(0,0,w,h,fill,1)
		.setStrokeStyle(10,0xffffff,1)
		.setDepth(this.depth)
		.setOrigin(0.5,0)	
		this.add(r)
		this.body = r
	}
	
	setInteractive(){
		const {width,height,scene} = this
		this.body.setInteractive()
		this.body.on("pointerdown",()=>this.emit("pointerdown"))
		this.body.on("pointerup",()=>this.emit("pointerup"))
	}
	
}

export class Dynamic_button extends Ui{
	
	constructor(scene,x,y,w=300,h=170,fill=0x223355){
		super(scene,x,y,w,h,fill)
	}
}

export  class Panel extends Ui{
	
	
	
	
	constructor(scene,x,y,w=400,h=250,fill=0x223355){
		super(scene,x,y,w,h,fill)
		
	}
	
	addText(x,y,txt,st={}){
		
		const{left,right,bottom,top} = this.padding
		
		setp(st,"fontSize","100px")
		setp(st,"fontStyle","bold")
		setp(st,"align","center")
		
		const t= this.scene.add.text(x,y,txt,st)
		.setDepth(this.depth+1)
		.setOrigin(0.5,0)	
		

		this.add(t)
		
		t._type = "txt"
		return t
	}
	
	setName(child,name){
		child.name = child.type+"_"+name
	}

}






export class LoadingBar{

	constructor(scene,x,y,w,h,fill){
		
		this.bg = scene.add.rectangle(x,y,w,h,0x222222)		
		this.front = scene.add.rectangle(x,y,w,h,fill)

		
		this.bg.setOrigin(0)
		this.front.setOrigin(0)
	}
	
	update(sx){
		if(isNaN(sx))return
		this.front.setScale(sx,1)
	}
	
	setBgFill(fill,alpha){
		this.bg.fillColor = fill
		this.bg.fillAlpha = alpha
	}
	
	setOrigin(x=0,y=0){
		this.bg.setOrigin(x,y)
		this.front.setOrigin(x,y)
	}
}

export class Button extends Phaser.GameObjects.Rectangle{
	
	constructor(scene,x,y,w,h,fill=0xffffff,a=0){
		super(scene,x,y,w,h,fill,a)
		scene.add.existing(this)		
		
		this.setInteractive()
			.setOrigin(0)
		
		scene.input.addPointer()
	}
	
	setTexture(key){
		const t = this.scene.add.image(this.x,this.y,key)
		t.setDisplaySize(this.displayHeight,this.displayWidth)
		t.setOrigin(0)
		this.texture = t
	}
	
	setPos(x,y){
		this.setPostion(x,y)
		if(this.texture)this.texture.setPosition(x,y)
	}
}


function setp(obj,prop,val){
	if(obj[prop] == undefined)obj[prop] = val
}