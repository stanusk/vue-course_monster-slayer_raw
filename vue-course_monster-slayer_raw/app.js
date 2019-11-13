new Vue({
	el: '#app',
	data: {
		playerHealth: 100,
		monsterHealth: 100,
		isGameOn: false,
		turns: [],
		specialsLimit: 3,
		healingLimit: 2,
	},
	computed: {
		specialAttacksRemaining: function () {
			const specials = this.turns.filter(turn => turn.isSpecialAttack);
			return this.specialsLimit - specials.length;
		},
		healingRemaining: function () {
			const healing = this.turns.filter(turn => turn.class === 'healing');
			return this.healingLimit - healing.length;
		}
	},
	methods: {
		resetHealth: function () {
			this.playerHealth = 100;
			this.monsterHealth = 100;
		},
		calculateDamage: function (min, max) {
			return Math.max(Math.floor(Math.random() * max) + 1, min);
		},
		calculateMonsterDamage: function (isSpecialAttack) {
			const min = isSpecialAttack ? 5 : 2;
			const max = isSpecialAttack ? 20 : 9;

			return this.calculateDamage(min, max);
		},
		calculatePlayerDamage: function () {
			const min = 3;
			const max = 10;

			return this.calculateDamage(min, max);
		},
		checkAndHandleGameOver: function () {
			const isPlayerDead = this.playerHealth <= 0;
			const isMonsterDead = this.monsterHealth <= 0;

			if (isPlayerDead || isMonsterDead) {
				const message = `You ${isPlayerDead ? 'lost' : 'won'}! Play again?`;
				if (confirm(message)) {
					this.startGame();
				}
				else {
					this.isGameOn = false;
				}
				return true;
			}
			else {
				return false;
			}
		},
		attackByMonster: function () {
			const damage = this.calculatePlayerDamage();
			this.playerHealth = Math.max(this.playerHealth - damage, 0);

			this.turns.unshift({
				class: 'monster-turn',
				text: `Monster attacked! Damage dealt: ${damage}. Your remaining health is ${this.playerHealth}.`
			});
		},
		attackByPlayer: function (isSpecialAttack) {
			const damage = this.calculateMonsterDamage(isSpecialAttack);
			this.monsterHealth = Math.max(this.monsterHealth - damage, 0);

			this.turns.unshift({
				class: 'player-turn',
				isSpecialAttack: isSpecialAttack,
				text: `You attacked! Damage dealt: ${damage}. Monster's remaining health is ${this.monsterHealth}.`
			});
		},
		startGame: function () {
			this.resetHealth();
			this.isGameOn = true;
			this.turns = [];
		},
		attack: function (isSpecialAttack = false) {
			this.attackByMonster();
			if (this.checkAndHandleGameOver()) {
				return;
			}
			this.attackByPlayer(isSpecialAttack);
			this.checkAndHandleGameOver();
		},
		specialAttack: function () {
			this.attack(true);
		},
		heal: function () {
			const healBy = this.playerHealth < 90 ? 10 : 100 - this.playerHealth;
			this.playerHealth += healBy;

			this.turns.unshift({
				class: 'healing',
				text: `You healed by ${healBy}. Your remaining health is ${this.playerHealth}.`
			});

			this.attackByMonster();
		},
		giveUp: function () {
			this.isGameOn = false;
		}
	}
});