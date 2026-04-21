// src/services/reportService.js
exports.generateReport = async (options) => {
    return { id: Date.now().toString(), ...options, generatedAt: new Date() };
};