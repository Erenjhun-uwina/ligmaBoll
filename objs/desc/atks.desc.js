
export const attacks = [
	{
		key:"dive",
		info:"dive dealing dmg to enemies\ncost 2energy",
		cost:2,
		func:(target)=>{
			

			const g = target.grounded || target.hovering
			const sc = 	target.scene
						
			if(g && target.body.touching.down)return
			
			target.setGround(false)
			const ds = sc.sounds.jump.play()
			target.set_stance(true,true)
			
			target.scene.time.delayedCall(10,
				()=>{
					if(!target.body)return
					target.body.setVelocityY(2500)
					target.trail.start()
					target.trail.emitParticle()
				}
			);
			
			target.once("land",()=>{
				target.trail.stop()
				target.set_stance()
				if(ds.isPlaying)ds.stop()
			});
		}
	},
//##############################################################################
	{
		key:"slam",
		desc:"(when airborne) slam the ground(AOE) deal dmg base on max hp\n cost 4energy",
		cost:5,
		func:(target)=>{


			const g = target.grounded || target.hovering
			const blast_box = target.blast_hitbox
			const sc = 	target.scene
			const enemies = sc.enemies
			const radius = 500
			const bscale = radius*2/blast_box.width
			
			if(g)return
			
			target.set_stance(true,true)
			target.scene.time.delayedCall(10,
				()=>{
				if(!target.body)return
				target.body.setVelocityY(2500)
				target.trail.start()
				target.trail.emitParticle()
			});
		
			target.once("land",
				()=>{
					
					if(enemies){
						enemies.getChildren().forEach(e=>{
							e.emit("knockup")
							
							if(Phaser.Math.Distance.Between(target.x,target.y,e.x,e.y) < radius)
							{target.inflict(e)}
						});
					}
					
					target.set_stance()

					blast_box.setPosition(target.x,target.y)
					target.trail.stop()
					sc.cameras.main.shake(200,0.02)
		
					sc.tweens.add({
						targets:blast_box,
						ease:"Power2",
						scale:{from:0,to:bscale},
						alpha:{from:1,to:0},
						duration:600,
						onComplete:()=>{
							blast_box.setPosition(-500,500)
						}
						});
				});
			}
	},
//##############################################################################
	{
		key:"blast",
		desc:"release huge amount of energy dealing dmg around(cancelled when energy level is low)",
		cost:10,
		cd:500,
		func:(target)=>{
			if(target.energy < 10)return

			const g = target.grounded || target.hovering
			const blast_box = target.blast_hitbox
			const sc = 	target.scene
		
			target.scene.time.delayedCall(10,
				()=>{
					blast_box.setPosition(target.x,target.y)
					sc.tweens.add({
						targets:blast_box,
						ease:"Power2",
						scale:8,
						alpha:0,
						duration:500,
						onComplete:()=>{
							blast_box.setPosition(-500,500)
							.setScale(0)
						.alpha = 1
						}
					});
			});
		}
	},
//##############################################################################
	{},
//##############################################################################
	{},
//##############################################################################
	{},
//##############################################################################
]