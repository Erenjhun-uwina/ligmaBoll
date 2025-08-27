export default class SoundFade extends Phaser.Plugins.ScenePlugin {
	

	
	constructor(sc,key){
		super(sc,key)
	}
	
	
	#fade(sound,duration,value,event){
		this.scene.tweens.add({
			targets:sound,
			volume:value,
			duration:duration,
			ease:'Pow2',
			onComplete:()=>{
				sound.emit("fade"+event)
			}
		});
	}
	
	
	fade(sound,duration,value){
		this.#fade(sound,duration,value)
		console.log("fade") 
	}
	
	
	fadeIn(sound,duration,value){
		this.#fade(sound,duration,value,"in")
	}
	
	fadeOut(sound,duration){
		this.#fade(sound,duration,0,"out")
	}
}