const express = require('express');
const path = require('path');
const router = new express.Router();

module.exports = () => {
    router.use(express.static(path.resolve(__dirname, 'dist')));
    router.use('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });

    return router;
};
