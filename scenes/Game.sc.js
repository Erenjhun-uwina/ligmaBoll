import Group from "../objs/Group.js"
import Player from "../objs/player.js"

import Chunk from "../objs/Chunk.js"

import UpgradeSystem from "../objs/upgrades.js"
import Level from "../objs/Level.js"

const { random, round, floor } = Math




const lgr = {
	w: 2000
}

const gr = {
	w: 150,
	h: 150,
	gap: 250
}

const hgr = {
	w: 100,
	gap: 100,
	h: 120
}

const lwgr = {
	w: 800,
	h: 120,
	gap: 250
}

const hspn = {
	index: "Pincher",
	xoff: 50
}

const lspn = {
	index: "Totle",
	xoff: 50
}


export default class Game extends Phaser.Scene {

	constructor() {
		super("Game")
	}


	create() {

		this.width = this.sys.game.canvas.width
		this.height = this.sys.game.canvas.height
		this.cam = this.cameras.main
		let sc = this

		this.sounds = {
			snap: this.sound.add("snap"),
			jump: this.sound.add("jump01"),
			damaged: this.sound.add("damaged"),
			bg_chill: this.sounds.bg_chill
		}


		this.soundFade.fade(this.sounds.bg_chill, 800, 0.2)

		this.upgrades = new UpgradeSystem()



		this.init_bg()

		const ranC = new Chunk(this, "random")
		const thinc = new Chunk(this, { ground: gr, spawns: { types: [lspn] } })
		const hthinc = new Chunk(this, { ground: hgr, spawns: { types: [hspn] } })
		const lgrc = new Chunk(this, { ground: lgr })

		this.level = new Level(this, [
			ranC, lgrc, ranC,
			thinc, hthinc, hthinc, hthinc, lwgr,
			ranC, ranC,
			lwgr, hthinc, ranC, ranC,
			thinc, hthinc, hthinc, hthinc, thinc,
			lwgr, thinc, ranC,
			ranC, ranC, ranC, ranC,
			lgrc,
			ranC, ranC, ranC, ranC
		]);


		this.player = new Player(this, 100, 0)

		const { width, height, cam, player, upgrades } = this


		this.cam.setBounds(0, -height, width, height * 2)
		this.cam.startFollow(player, true, 1, 1, (-width / 2) + 100, -(height / 2) + 200 + player.height * 2);


		let up1 = upgrades.get("diver")
		upgrades.activate(player, up1)


		up1 = upgrades.get("glidder")
		upgrades.activate(player, up1)


		up1 = upgrades.get("sumo")
		upgrades.activate(player, up1)

		up1 = upgrades.get("hopper")
		upgrades.activate(player, up1)


		this.init_listeners()
		this.scene.run("GameUi"); // Start a fresh UI scene	


		const rt = this.add.renderTexture(-200, height, width + 400, 500)
		rt.fill(0x00, 1)
		rt.setScrollFactor(0)
		rt.setOrigin(0)


		// Get reference to GameUi scene
		const gameUi = this.scene.get("GameUi");

		// Example usage:
		console.log(this)
		console.log("showing text")

		this.time.delayedCall(100, () => {
			this.scene.get("GameUi").showFadingText(
				"W / Tap LEFT screen to JUMP\nSPACE/Tap RIGHT screen to DIVE",
				600, 1500, { fontSize: "60px", color: "#000" }
			);
		});
	}


	init_bg() {
		const { width, height, cam, player, upgrades } = this
		this.add.image(width * 1.5, height, "rock0.0").setOrigin(0, 1).setScrollFactor(0.2).setDepth(-100).setScale(1.5)
		this.add.image(-500, 0, "black_grad").setOrigin(0).setScrollFactor(0).setDepth(-100).setScale(2.5, 1)
		this.add.image(-500, -height, "black_grad").setOrigin(0).setScrollFactor(0).setDepth(-100).setScale(2.5, 1).flipY = true

	}


	init_listeners() {
		const { player } = this
		player.once("land", this.setup_cam, this)
		player.on("endmorph", () => {/*todo*/ });
	}

	setup_cam() {
		const { cam, player, width, height } = this
		/*camera.startFollow(gameObject, roundPx, lerpX, lerpY, offsetX, offsetY);*/
		cam.startFollow(player, true, 1, 0, (-width / 2) + 100, (height / 2) - 500 - player.height * 2);
		cam.removeBounds()
	}

}