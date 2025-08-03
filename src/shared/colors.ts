export const colors = {
  // Cores principais
  header: '#7d91ed',
  danger: '#FF3B30',
  success: '#4CD964',
  action: '#4A90E2',

  // Cores de fundo
  background: {
    default: '#FFFFFF',
    input: '#F5F5F5',
    gradient: {
      start: '#667eea',
      end: '#764ba2',
    },
    card: 'rgba(255, 255, 255, 0.85)',
    statCard: 'rgba(255, 255, 255, 0.15)',
  },

  // Cores de overlay
  overlay: {
    light: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },

  // Cores de texto
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#FFFFFF',
    dark: '#1a1a1a',
    lightTransparent: 'rgba(255, 255, 255, 0.9)',
  },

  // Cores de borda
  border: {
    default: '#E0E0E0',
    card: 'rgba(255, 255, 255, 0.2)',
    task: '#f54952',
  },

  // Status
  status: {
    online: '#4CD964',
    offline: '#FF3B30',
  },

  // Sombras
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
    text: 'rgba(0, 0, 0, 0.2)',
  },
} as const;
