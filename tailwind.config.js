module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.12)'
      },
      colors: {
        accent: {
          50: '#f3f7ff',
          500: '#4f46e5',
          600: '#4338ca'
        }
      }
    }
  },
  plugins: []
};
