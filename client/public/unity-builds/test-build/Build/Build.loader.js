// Unity WebGL Loader Script
// This is a placeholder for actual Unity WebGL loader

(function() {
  'use strict';
  
  console.log('Unity WebGL Loader initialized');
  
  // Simulate Unity WebGL loading
  window.UnityWebGL = {
    loadBuild: function(config) {
      console.log('Loading Unity WebGL build with config:', config);
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Unity WebGL build loaded successfully');
          resolve({
            canvas: config.canvas,
            sendMessage: function(gameObject, method, parameter) {
              console.log('Unity message:', { gameObject, method, parameter });
            },
            quit: function() {
              console.log('Unity instance quit');
            }
          });
        }, 2000);
      });
    }
  };
})(); 