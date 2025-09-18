import { Game } from './core/Game';

async function bootstrap(): Promise<void> {
  try {
    const game = new Game();
    await game.initialize();
    
    // Make game available globally for debugging
    (window as any).game = game;
    
    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
