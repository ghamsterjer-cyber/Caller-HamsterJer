
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

/**
 * High-Speed Frankfurt Engine
 * Оптимизирован для потоковой передачи тяжелых файлов без буферизации.
 */
app.use('/', createProxyMiddleware({
    target: 'https://api.telegram.org',
    changeOrigin: true,
    pathRewrite: (path) => path.replace(/^\//, ''),
    // Критически важно для скорости: отключаем буферизацию
    buffer: false, 
    onProxyRes: (proxyRes) => {
        // Разрешаем CORS для работы с вашим интерфейсом
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
    },
    onError: (err, req, res) => {
        console.error('Proxy Engine Error:', err);
        res.status(500).send('Proxy Connection Failed');
    }
}));

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log('High-Speed Frankfurt Engine is active on port ' + port);
});
