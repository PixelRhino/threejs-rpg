import './style.css';
import GameScene from './scenes/GameScene';

await GameScene.instance.load();
GameScene.instance.render();
