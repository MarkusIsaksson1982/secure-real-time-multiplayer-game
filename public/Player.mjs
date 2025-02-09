// I have utilized ChatGPT as a resource for guidance and learning throughout this project. My approach reflects the growing trend of modern developers using AI tools to enhance their coding processes. However, all the final code presented here is my own work, based on own independently thought out prompts and without copying prompts or code from others other than snippets. I believe this practice aligns with the principles of academic honesty, as it emphasizes learning and using technology responsibly. 

import io from 'socket.io-client';

class Player {
  constructor({ id, x, y, score = 0 }, enableSocket = true) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = score;

    if (enableSocket && typeof window !== 'undefined') {
      this.socket = io();
      this.setupInputHandling();
    }
  }

  setupInputHandling() {
    document.addEventListener('keydown', (event) => {
      let direction = null;
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
          direction = 'right';
          break;
      }
      if (direction) {
        this.socket.emit('playerMove', { id: this.id, direction, speed: 5 });
      }
    });
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case 'up':
        this.y = Math.max(0, this.y - speed);
        break;
      case 'down':
        this.y = Math.min(385, this.y + speed);
        break;
      case 'left':
        this.x = Math.max(0, this.x - speed);
        break;
      case 'right':
        this.x = Math.min(785, this.x + speed);
        break;
    }
    if (this.socket) {
      this.socket.emit('updatePosition', { id: this.id, x: this.x, y: this.y });
    }
  }

  collision(item) {
    return this.x < item.x + 40 && this.x + 40 > item.x &&
           this.y < item.y + 40 && this.y + 40 > item.y;
  }

  calculateRank(players) {
    players.sort((a, b) => b.score - a.score);
    const rank = players.findIndex(player => player.id === this.id) + 1;
    return `Rank: ${rank}/${players.length}`;
  }
}

export default Player;
