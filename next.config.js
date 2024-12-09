// /** @type {import('next').NextConfig} */

// // Environment Configuration
// const isDevelopment = process.env.NODE_ENV === 'development';
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vibevision.ai';

// const nextConfig = {
//   // Core Next.js Configuration
//   reactStrictMode: true,
  
//   // Performance and Optimization
//   poweredByHeader: false,
//   compress: true,
  
//   // Image Optimization
//   images: {
//     domains: [
//       'your-image-domain.com', 
//       'localhost', 
//       '54.165.196.203',
//       'example.com'
//     ],
//     remotePatterns: [
//       { 
//         protocol: 'https', 
//         hostname: '**' 
//       },
//       { 
//         protocol: 'http', 
//         hostname: '**' 
//       }
//     ],
//   },
  
//   // Comprehensive Rewrite Configuration
//   async rewrites() {
//     return [
//       // API Routes
//       {
//         source: '/api/:path*',
//         destination: `${BASE_URL}/api/:path*`,
//       },
//       // Authentication Routes
//       {
//         source: '/api/auth/:path*',
//         destination: `${BASE_URL}/api/auth/:path*`,
//       },
//       // Content Routes
//       {
//         source: '/api/content/:path*',
//         destination: `${BASE_URL}/api/content/:path*`,
//       },
//       // Media Generation Routes
//       {
//         source: '/api/generate-video/:path*',
//         destination: `${BASE_URL}/api/generate-video/:path*`,
//       },
//       {
//         source: '/api/generate-audio/:path*',
//         destination: `${BASE_URL}/api/generate-audio/:path*`,
//       },
//       // Static File Uploads
//       {
//         source: '/uploads/:path*',
//         destination: `${BASE_URL}/uploads/:path*`,
//       }
//     ];
//   },
  
//   // Enhanced Security Headers
//   async headers() {
//     return [
//       {
//         source: '/api/:path*',
//         headers: [
//           { 
//             key: 'Access-Control-Allow-Origin', 
//             value: process.env.ALLOWED_ORIGIN || '*' 
//           },
//           { 
//             key: 'Access-Control-Allow-Methods', 
//             value: 'GET,POST,PUT,DELETE,OPTIONS' 
//           },
//           {
//             key: 'Access-Control-Allow-Headers',
//             value: 'X-Requested-With,Content-Type,Authorization'
//           },
//           {
//             key: 'Content-Security-Policy',
//             value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
//           }
//         ],
//       }
//     ];
//   },
  
//   // Webpack Configuration
//   webpack: (config, { isServer }) => {
//     // Client-side webpack configurations
//     if (!isServer) {
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false,
//         net: false,
//         tls: false,
//       };
//     }
    
//     // Add custom module resolution if needed
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       '@components': './components',
//       '@utils': './utils',
//       '@styles': './styles',
//     };
    
//     return config;
//   },
  
//   // Custom Server Configuration
//   serverRuntimeConfig: {
//     // Server-only runtime configuration
//     backendUrl: BASE_URL,
//   },
  
//   // Public Runtime Configuration
//   publicRuntimeConfig: {
//     // Configuration exposed to browser
//     apiUrl: BASE_URL,
//     isDevelopment,
//   },
  
//   // Experimental Features
//   experimental: {
//     optimizePackageImports: ['@radix-ui', 'lodash'],
//     serverComponentsExternalPackages: ['mongoose', 'bcrypt'],
//   },
  
//   // Transpilation for specific packages
//   transpilePackages: [
//     'react-icons', 
//     'react-use', 
//     '@headlessui/react'
//   ],
  
//   // Logging Configuration
//   logging: {
//     level: isDevelopment ? 'verbose' : 'warn',
//   },
  
//   // Standalone Output for Deployment
//   output: 'standalone',
// };

// module.exports = nextConfig;

// // Optional: Environment Validation
// if (!BASE_URL) {
//   console.warn('⚠️ Backend URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL');
// }


/** @type {import('next').NextConfig} */

// const BASE_URL = 'http://54.165.196.203:8000'
// const BASE_URL = 'http://localhost:8000'
const BASE_URL = 'https://vibevision.ai'
// const BASE_URL = ''

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    domains: ['your-image-domain.com'],
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BASE_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BASE_URL}/uploads/:path*`,
      },
      // Catch-all rewrite for any other routes
      {
        source: '/:path*',
        destination: `${BASE_URL}/:path*`,
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

