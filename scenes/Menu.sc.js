

let curve,
	graphics,
	smooth,
	x = 0,
	space = 100



export default class Menu extends Phaser.Scene {


	constructor() {
		super("Menu")
	}



	preload() {




		//ui
		this.load.image("pause0", "assets/imgs/ui/pause0.png")
		this.load.image("pause1", "assets/imgs/ui/pause1.png")

		//bg 
		this.preload_rocks(3, 2)
		this.load.image("black_grad", "assets/imgs/bg/black_grad.png")


		//orbs sprite
		this.load.setPath("assets/imgs/orbs")
		this.load.atlas("orb", "sp.png", "sp.json")

		//player sprite
		this.load.setPath("assets/imgs")
		this.load.image("ball", "ball.png")
		this.load.image("eye", "eye.png")


		//pincher sprites
		this.load.setPath("assets/imgs/enemies/pincher")
		this.load.atlas("pincher", "sp.png", "sp.json")

		//frog
		this.load.setPath("assets/imgs/enemies/frog")
		this.load.atlas("frog", "sp.png", "sp.json")

		//totle
		this.load.setPath("assets/imgs/enemies/totle")
		this.load.atlas("totle", "sp.png", "sp.json")

		//audios
		this.load.setPath("assets/sounds")
		this.load.audio("jump01", "jump01.wav")
		this.load.audio("damaged", "damaged.wav")
		this.load.audio("snap", "snap.wav")
		this.load.audio("bg_chill", "bg_chill.wav")




		const { width, height } = this.sys.game.canvas
		let c = this.add.circle(width / 2, height / 2, height / 2, 0xffffff, 1)

		c.setStrokeStyle(5, 0x00, 1)
		c = this.add.circle(width / 2, height / 2, height / 2, 0x000)
		c.setScale(0)
		this.c = c

		this.txt = this.add.text(width / 2, height / 2, "", { fontSize: "5rem", fontStyle: "bold" }).setOrigin(0.5).setBlendMode("SCREEN")


		this.load.on("progress", (p) => {


			this.tweens.add({
				targets: c,
				scale: p,
				alpha: 100,
				duration: 100,
				ease: "Pow2"
			});

			this.txt.setText((100 * p).toFixed(2) + "%")
		})

		
		// Title text
		this.titleText = this.add.text(
			this.sys.game.canvas.width / 2,
			this.sys.game.canvas.height / 2 - 100,
			"LIGMA BOLL",
			{ fontSize: "80px", fontStyle: "bold", color: "#ffffff" }
		).setOrigin(0.5);

		// Instruction text
		this.instructionText = this.add.text(
			this.sys.game.canvas.width / 2,
			this.sys.game.canvas.height / 2 + 100,
			"Press SPACE or click to start",
			{ fontSize: "40px", color: "#ffffff" }
		).setOrigin(0.5);

		this.load.on("complete", () => {
			this.txt.setText("START")
			const bg_chill = this.sound.add("bg_chill")
			bg_chill.play({ loop: true })
			const game = this.scene.get("Game")
			game.sounds = { bg_chill: bg_chill }

			this.input.on("pointerdown", () => {
				this.start()
			});


		});
	}

	update() {
		if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
			this.start()
		}
	}





	start() {
		this.txt.setText("")

		this.tweens.add({
			targets: this.c,
			duration: 300,
			ease: "Pow2",
			scale: 2,
			onComplete: () => {
				this.scene.start("Game")
			}
		});

	}

	preload_rocks(x = 1, y = 1) {

		for (let iy = 0; iy < y; iy++) {
			for (let ix = 0; ix < x; ix++) {
				this.load.image(`rock${iy}.${ix}`, `assets/imgs/bg/rock${iy}.${ix}.png`)
			}
		}
	}


}