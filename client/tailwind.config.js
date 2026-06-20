/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 宣纸色系
        paper: {
          light: '#faf6f0',
          warm: '#f2e8dc',
          aged: '#e8dcc8',
        },
        // 墨色系
        ink: {
          darkest: '#1a1a1a',
          dark: '#3d3d3d',
          medium: '#6b6b6b',
          light: '#999999',
          wash: '#c8c0b4',
        },
        // 印章红
        seal: {
          red: '#c41e3a',
          light: '#e85d75',
        },
        // 茶色
        tea: {
          green: '#7a9a6e',
          oolong: '#b8956a',
          red: '#8b4513',
          dark: '#4a3622',
        },
        // 莫兰迪色调
        morandi: {
          pink: '#d4b5b5',
          purple: '#c4b5c9',
          blue: '#b5c0c9',
          green: '#b5c9b8',
          yellow: '#e0d5b0',
          orange: '#d4a574',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        button: '24px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.06)',
        float: '0 8px 32px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
