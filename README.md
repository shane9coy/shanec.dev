# shanc.dev - Production Portfolio Website

Agentic AI engineer & consultant portfolio built with React + Vite.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Production Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 3D Avatar Assets

The 3D avatar feature requires GLB model files in the `public/avatar/` directory:

- `initial.glb` - Initial pose (plays once on load)
- `standing.glb` - Idle standing animation
- `point.glb` - Pointing gesture
- `kick.glb` - Kick animation
- `chair.glb` - Sitting on chair
- `backflip.glb` - Backflip animation

Place your `.glb` files in `public/avatar/` before building for production.

## Deployment

The `dist/` folder contains the production-ready static files. Deploy to any static hosting service:

- **Vercel**: `vercel deploy dist/`
- **Netlify**: Drag & drop the `dist` folder
- **Cloudflare Pages**: Connect GitHub repo
- **AWS S3 + CloudFront**: Upload `dist/` contents

## Tech Stack

- React 18
- Vite 6
- Three.js (3D avatar)
- No CSS frameworks - custom styling
