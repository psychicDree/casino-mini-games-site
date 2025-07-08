# Unity WebGL Integration Guide

This guide explains how to integrate Unity WebGL builds into the casino mini-games website.

## Overview

The website now supports running Unity WebGL builds directly in the browser. The integration includes:

- **UnityWebGLService**: Handles loading and managing Unity WebGL builds
- **UnityWebGLPage**: React component for displaying Unity games
- **Progress tracking**: Loading progress with visual feedback
- **Fullscreen support**: Toggle fullscreen mode for immersive gaming
- **Error handling**: Graceful error handling and retry functionality

## File Structure

```
client/
├── src/
│   ├── services/
│   │   └── UnityWebGLService.ts      # Unity WebGL service
│   └── views/pages/
│       ├── UnityWebGLPage.tsx        # Unity WebGL page component
│       └── UnityWebGLPage.css        # Styling for Unity page
├── public/
│   └── unity-builds/
│       └── test-build/               # Sample Unity WebGL build
│           └── Build/
│               ├── Build.loader.js    # Unity WebGL loader
│               ├── Build.framework.js # Unity framework
│               └── Build.data         # Unity asset data
└── README-UNITY-WEBGL.md            # This file
```

## Setting Up Unity WebGL Builds

### 1. Export Unity WebGL Build

1. Open your Unity project
2. Go to `File > Build Settings`
3. Select `WebGL` platform
4. Click `Build` and choose output directory
5. Copy the build files to `client/public/unity-builds/[game-name]/`

### 2. Required Files

Your Unity WebGL build should include:
- `Build/Build.loader.js` - Unity WebGL loader script
- `Build/Build.framework.js` - Unity framework
- `Build/Build.data` - Unity asset data (binary file)
- `Build/Build.wasm` - WebAssembly file (if applicable)

### 3. Configure Build Path

Update the build path in your React component:

```tsx
<UnityWebGLPage 
  buildPath="/unity-builds/your-game-name" 
  gameName="Your Game Name" 
/>
```

## Usage

### Basic Implementation

```tsx
import UnityWebGLPage from './views/pages/UnityWebGLPage';

function GamePage() {
  return (
    <UnityWebGLPage 
      buildPath="/unity-builds/slot-machine" 
      gameName="Slot Machine" 
    />
  );
}
```

### Advanced Implementation with Service

```tsx
import UnityWebGLService from '../services/UnityWebGLService';

const unityService = new UnityWebGLService({
  buildPath: '/unity-builds/slot-machine',
  gameName: 'Slot Machine',
  onProgress: (progress) => console.log(`Loading: ${progress}%`),
  onLoaded: () => console.log('Unity build loaded'),
  onError: (error) => console.error('Unity error:', error)
});

// Load Unity build
await unityService.loadUnityBuild(containerElement);

// Send messages to Unity
unityService.sendMessage('GameManager', 'StartGame');
unityService.placeBet(100);
unityService.spinSlotMachine();
```

## Unity Communication

### Sending Messages to Unity

```tsx
// Pause/Resume game
unityService.pauseGame();
unityService.resumeGame();

// Casino game actions
unityService.placeBet(amount);
unityService.spinSlotMachine();
unityService.dealCards();

// Audio control
unityService.setGameVolume(0.5);

// Custom messages
unityService.sendMessage('GameObject', 'MethodName', parameter);
```

### Receiving Messages from Unity

```tsx
// Listen for Unity messages
unityService.onUnityMessage('gameWon', (data) => {
  console.log('Player won:', data);
  // Update UI, award prizes, etc.
});

unityService.onUnityMessage('gameLost', (data) => {
  console.log('Player lost:', data);
  // Update UI, show game over, etc.
});
```

## Unity WebGL Build Requirements

### Performance Optimization

1. **Asset Compression**: Compress textures and audio files
2. **Code Splitting**: Split large builds into smaller chunks
3. **LOD System**: Use Level of Detail for complex models
4. **Memory Management**: Optimize memory usage for WebGL

### Browser Compatibility

- Chrome 67+
- Firefox 60+
- Safari 11.1+
- Edge 79+

### File Size Limits

- **Recommended**: < 50MB total build size
- **Maximum**: < 100MB for reasonable loading times
- **Compression**: Use gzip compression for build files

## Testing

### Local Development

1. Start the development server:
   ```bash
   npm start
   ```

2. Navigate to `/unity-test` to test the Unity integration

3. Check browser console for Unity WebGL logs

### Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your web server

3. Ensure Unity WebGL builds are accessible via HTTPS

## Troubleshooting

### Common Issues

1. **Build not loading**
   - Check file paths in browser network tab
   - Verify Unity WebGL files are accessible
   - Check browser console for errors

2. **Performance issues**
   - Optimize Unity build size
   - Use WebGL 2.0 if possible
   - Implement progressive loading

3. **Communication errors**
   - Verify Unity message format
   - Check GameObject and method names
   - Ensure Unity scripts are properly attached

### Debug Mode

Enable debug logging:

```tsx
const unityService = new UnityWebGLService({
  buildPath: '/unity-builds/test-build',
  gameName: 'Test Game',
  debug: true // Enable debug logging
});
```

## Security Considerations

1. **Content Security Policy**: Configure CSP for Unity WebGL
2. **Cross-Origin**: Handle CORS for external Unity builds
3. **Sandboxing**: Consider iframe sandboxing for isolation
4. **Validation**: Validate Unity messages and data

## Performance Monitoring

Monitor Unity WebGL performance:

```tsx
// Track loading time
const startTime = performance.now();
await unityService.loadUnityBuild();
const loadTime = performance.now() - startTime;
console.log(`Unity load time: ${loadTime}ms`);

// Monitor frame rate
let frameCount = 0;
setInterval(() => {
  console.log(`FPS: ${frameCount}`);
  frameCount = 0;
}, 1000);
```

## Future Enhancements

- **Progressive Loading**: Load Unity builds in chunks
- **Caching**: Implement build caching for faster loading
- **Multiple Games**: Support multiple Unity games simultaneously
- **Mobile Optimization**: Optimize for mobile devices
- **Analytics**: Track Unity game performance and usage

## Support

For issues with Unity WebGL integration:

1. Check browser console for errors
2. Verify Unity build compatibility
3. Test with different browsers
4. Review Unity WebGL documentation
5. Check file permissions and paths 