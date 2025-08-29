import { LoadingBar, Button, Panel } from "../objs/ui.js"

let game,
	jump2,
	width,
	height,
	player


//bars
let hp,
	energy,
	target_energy,
	morph,
	morphTimer

//txts
let morph_txt,
	p_txt,
	distance_txt

//btns obj
let jump,
	atk,
	pause

//Panels
let menu,
	gameover




const { round, max, min } = Math

export default class GameUi extends Phaser.Scene {

	#last_fade
	constructor() {
		super("GameUi")
	}


	showFadingText(message, duration = 2000, delay = 3000, style = { fontSize: "32px", color: "#000000ff" }) {
		const textObj = this.showText(message, style);
		this.fadeInOut(textObj, duration, delay, true);
	}


	pause_game() {

		if (this.scene.isPaused(game)) {
			const alpha = round(this.cameras.main.backgroundColor.a / 255)

			this.fade(alpha, 0, 200)
			this.resume(game)
			menu.setScale(0)
		}
		else {
			const alpha = round(this.cameras.main.backgroundColor.a / 255)

			this.fade(0, 0.7, 200)
			this.pause(game)
			menu.setScale(1)
		}

	}

	create() {
		this.cameras.main.setBackgroundColor(`rgba(0,0,0,0)`);
		if (gameover) gameover.setScale(0);
		if (menu) menu.setScale(0);

		this.#last_fade = null
		this.scene.bringToTop()
		this.cameras.main.setBackgroundColor(`rgb(0,0,0,1)`)
		this.fade(1, 0, 500)
		game = this.scene.get("Game")
		player = game.player

		width = this.sys.game.canvas.width
		height = this.sys.game.canvas.height
		this.disp_infos()
		this.player_listeners()
		this.disp_btns()
		this.init_panels()

		player.on("blackout", () => this.fade());
		// let reset_timer

		this.KEY_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.KEY_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.KEY_P = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
		this.KEY_ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

		this.KEY_W.on("down", () => { if (!this.scene.isPaused(game)) player.jump() });
		this.KEY_W.on("up", () => { player.end_glide() });
		this.KEY_SPACE.on("down", () => { if (!this.scene.isPaused(game)) player.attack() });
		this.KEY_P.on("down", () => this.pause_game());
		this.KEY_ESC.on("down", () => this.pause_game());


	}

	update() {
		distance_txt.setText(`distance:${(player.x / 100).toFixed(0)}`)
	}





	fade(f = 1, t = 0, d = 1500, prio) {
		if (this.#last_fade) return
		this.#last_fade = prio
		this.tweens.addCounter({
			from: f,
			to: t,
			duration: d,
			onUpdate: (t) => {
				let alpha = t.getValue()
				this.cameras.main.setBackgroundColor(`rgb(0,0,0,${alpha})`)
			}
		});
	}

	init_panels() {

		menu = new Panel(this, width / 2, 20, width * 0.6, height - 200)
		menu.setScale(0)
		const p = menu.addText(0, 0, `paused`, { fontSize: "100px" })
		menu.setDepth(2)

		gameover = new Panel(this, width / 2, 20, width * 0.6, height - 200)
		gameover.setScale(0)
		gameover.addText(0, 50, `GAMEOVER`, { fontSize: "150px" })

		gameover.setInteractive(true)
		gameover.on("pointerdown", () => { this.restart_game() })


	}



	disp_btns() {
		jump = new Button(this, 0, 0, width / 2, height, 0x55ff55, 0)
		atk = new Button(this, width / 2, 0, width / 2, height, 0x55ff55, 0)
		const pdng = 20
		const w = 60
		pause = new Button(this, width - pdng - w, pdng, w, w, 0xffffff)
		pause.setTexture("pause0")

		pause.on("pointerdown", () => this.pause_game())

		jump.on("pointerdown", () => { if (!this.scene.isPaused(game)) player.jump() });
		jump.on("pointerup", () => { player.end_glide() });
		atk.on("pointerup", () => { if (!this.scene.isPaused(game)) player.attack() });

		player.on("destroy", () => {
			hp.update(0)
			this.fade(0, 1, 2000, true)
			this.physics.world.setFPS(10)
			jump.off("pointerdown")
			jump.off("pointerup")
			atk.off("pointerup")

			this.KEY_SPACE.on("down", () => { this.restart_game() });
			this.KEY_W.on("down", () => { this.restart_game() });
			this.KEY_P.off("down")
			this.KEY_ESC.off("down")

			this.time.delayedCall(500, () => {
				gameover.setScale(1)
				gameover.addText(0, 200, `distance:${(player.x / 100).toFixed(0)}`, { fontSize: "50px" })
				gameover.addText(0, 270, `tap to restart`, { fontSize: '30px' })
			});
		})
	}


	restart_game() {
		this.scene.get("GameUi").scene.restart();
		game.scene.restart();
	}

	player_listeners() {
		player.on("setHp", (d) => {

			const sx = min(1, max(d[0] / d[1], 0))
			hp.update(sx)
		});

		player.on("setEnergy", (d) => {

			const sx = min(1, max(d[0] / d[1], 0))
			energy.update(sx)
		});

		player.setHp()
		player.setEnergy()

		player.on("startmorph", () => {

			let i = 0
			morphTimer = this.time.addEvent({
				delay: 200,
				callback: () => {
					let md = player.morph_duration

					i += 1 / 5

					morph.update(i / md)
					if (i < md) return
					i = 0
					morph.update(i / md)
					player.morph()
					morphTimer.remove()
				},
				loop: true
			})
		});
		///////////////////		

		player.on("endmorph", () => {
			console.log("morphinnnn!!")
			if (player.isDead()) return
			this.showAbilityPanel(game.upgrades.list)
			this.pause(game)
			target_energy.update(player.target_energy / player.m_energy)
		})

	}




	disp_infos() {
		const hpx = 20
		const hpw = 250
		const hph = 30

		hp = new LoadingBar(this, hpx, hpx, hpw, hph, 0xbb0000)
		target_energy = new LoadingBar(this, hpx, hpx + hph + 5, hpw, hph / 2, 0x777777)
		energy = new LoadingBar(this, hpx, hpx + hph + 5, hpw, hph / 2, 0xaaffcc)
		energy.setBgFill(0x0000, 0)

		morph = new LoadingBar(this, hpx + 90, hpx + hph * 2 + 10, hpw - 90, hph / 3, 0xffffff)
		morph.setOrigin(0, 0.5)

		morph_txt = this.add.text(hpx, hpx + hph * 2 + 10, "Morphing").setOrigin(0, 0.5)

		morph.update(0)
		target_energy.update(player.target_energy / player.m_energy)

		distance_txt = this.add.text(width / 2, hpx, `distance: 0`, { fontSize: '50px' }).setOrigin(0.5, 0)
	}


	pause(sc) {
		this.soundFade.fadeOut(game.sounds.bg_chill, 400)
		this.scene.pause(sc)
		if (morphTimer) morphTimer.paused = true
	}

	resume(sc) {
		this.soundFade.fade(game.sounds.bg_chill, 500, 0.2)
		this.scene.resume(sc)
		if (morphTimer) morphTimer.paused = false
	}

	fadeInOut(target, duration = 2000, delay = 3000, destroyOnComplete = true) {
		target.setAlpha(0);
		this.tweens.add({
			targets: target,
			alpha: 1,
			duration: 400,
			ease: "Power1",
			onComplete: () => {
				this.tweens.add({
					targets: target,
					alpha: 0,
					duration: duration,
					delay: delay,
					ease: "Power1",
					onComplete: () => {
						if (destroyOnComplete) target.destroy();
					}
				});
			}
		});
	}

	showText(message, style = { fontSize: "32px", color: "#000000ff" }, x = null, y = null, depth = 100) {
		const width = this.sys.game.canvas.width;
		const height = this.sys.game.canvas.height;
		const textObj = this.add.text(
			x ?? width / 2,
			y ?? height / 2 - 70,
			message,
			style
		).setOrigin(0.5);
		textObj.setDepth(depth);
		return textObj;
	}

	showAbilityPanel(availableAbilities) {

		console.log(availableAbilities)
		if (!availableAbilities || availableAbilities.length < 1) return;

		console.log("youww?")
		let scene = this
		const width = this.sys.game.canvas.width;
		const height = this.sys.game.canvas.height;

		// Pick up to 3 random abilities from availableAbilities
		const shuffled = availableAbilities
			.filter((ability) => {


				if (ability.req == "none") {
					console.log(ability.key, " [none]")
					return true
				}

				let reqs = Array.isArray(ability.req) ? ability.req : [ability.req]
				console.log(ability.key, reqs)

				//check each req of this ability if it is still in availAbilities it means it is  not yet chosen so skip it
				for (let req of reqs) {
					console.log(req)
					if (availableAbilities.includes(game.upgrades.get(req))) return false
				}

				return true
			})
			.sort(() => Math.random() - 0.5)



		const choices = shuffled.slice(0, 3);

		const panelSize = { w: width - 200, h: height - 200 };
		const panel = new Panel(this, width / 2, 100, panelSize.w, panelSize.h);

		choices.forEach((ability, i) => {
			const btn = panel.addText(panel.width / 3 * (i - 1), +25, ability.key, {
				fontSize: "4rem",
				maxWidth: "100px",
				padding: { x: 0, y: 300 },
				color: "#2e2e2eff",
				backgroundColor: "#bebebeff",
				fontFamily: "Arial, Verdana, sans-serif"
			}).setInteractive({ useHandCursor: true })
				.setFixedSize(panel.width / 3 - 60, panel.height - 50)
				;

			btn.on("pointerdown", () => {
				scene.events.emit("ability-selected", ability);
				panel.destroy();
			});
		});
	}

}