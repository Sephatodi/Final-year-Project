# AI PDF Ingestion - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start the App
```bash
cd FrontEnd\farm-aid-frontend
npm run dev
```

### 2. Navigate to Knowledge Base
- Open browser to `http://localhost:5173`
- Click "Disease Knowledge Base"
- Watch for "AI Studying Farm Data..." banner

### 3. Wait for Learning to Complete
- Progress bar shows files being processed
- Takes 30 seconds to 2 minutes
- Banner disappears when done

---

## ✅ What's Now Working

### Symptom Searching
- Enter: "fever, lesions" 
- Results include content from 5 discovered PDFs
- Confidence scores included

### Image Recognition
- Upload sick animal photo
- Matches against learned PDF pages
- Returns top 3 matches

### Video Recognition
- Upload video clip
- Extracts middle frame
- Matches against learned data

---

## 📁 Automatically Discovered PDFs

### MyFarmData Folder (3 PDFs)
✓ Cattle and Bison Diseases.pdf  
✓ cattle-diseases-farmers-guide.pdf  
✓ COMMON-CATTLE-DISEASES-SYMPTOMS-TREATMENT-AND-PREVENTION.pdf  

### General Surveillance (2 PDFs)
✓ Agric Journal.pdf  
✓ Field_Manual_Syndromic-Surveillance_English_Brown_2015.pdf  

### Root Folder (1 PDF)
✓ animal-health-educational-toolkit_priority-animal-diseases-sheets.pdf  

---

## 🎯 Add More PDFs (No Code Changes!)

### Add Cattle Disease PDF
1. Drop file in: `/FrontEnd/public/MyFarmData/Cattle_Health/PDFs/`
2. Restart app
3. Auto-discovered and ingested

### Add Poultry Disease PDF
1. Create folder: `/FrontEnd/public/MyFarmData/Poultry_Diseases/PDFs/`
2. Drop file there
3. Restart app
4. Auto-discovered, tagged as poultry

### Add Legacy Reference PDF
1. Drop file in: `/FrontEnd/public/images/`
2. Restart app
3. Auto-discovered

---

## 🔧 What Was Installed

```
✓ pdfjs-dist@5.6.205
✓ @tensorflow-models/mobilenet@2.1.1
```

---

## 📊 Check Progress

### Browser Console
```javascript
// See learning status
const status = await knowledgeBaseQueries.getSystemStatus();
console.log(status);

// Count learned articles
const all = await knowledgeBaseQueries.getAllArticles();
console.log(`Total: ${all.length}, From PDFs: ${all.filter(a => a.tags?.includes('pdf-learned')).length}`);
```

### Browser Storage
- DevTools → Application → IndexedDB → FarmAidDB
- Check `knowledgeBase` store
- Check `systemStatus` store

---

## ❓ Troubleshooting

**PDFs not discovered?**
- Check `/public/MyFarmData/` folders exist
- Verify PDF files aren't corrupted
- Refresh browser

**Learning seems stuck?**
- Open console - check for error messages
- Try clearing IndexedDB (DevTools → Application → Storage)
- Refresh and restart

**Performance issues?**
- Close other tabs
- Wait for learning to complete (appears done when banner disappears)
- Monitor available RAM

---

## 📞 Quick Commands

```bash
# Start app
cd FrontEnd\farm-aid-frontend && npm run dev

# Check npm packages
npm ls pdfjs-dist @tensorflow-models/mobilenet

# Check for errors
npm audit

# Clean and reinstall
rm -r node_modules package-lock.json && npm install
```

---

## ✨ That's It!

Your AI system is now:
- ✅ Discovering PDFs automatically
- ✅ Learning from extracted content
- ✅ Improving diagnosis accuracy
- ✅ Tracking progress in real-time

**Enjoy enhanced animal health diagnostics! 🐄🐐🐑**

---

**Status:** Production Ready  
**Date:** April 20, 2026
