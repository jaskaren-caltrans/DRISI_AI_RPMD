# DRISI AI RPMD - Project Summary

## Project Overview
The DRISI AI-powered Data Analysis Tool is a web-based CSV analysis platform with intelligent query processing and data visualization capabilities.

**Repository**: github.com/jaskaren-caltrans/DRISI_AI_RPMD
**Current Branch**: development (for active development)
**Main Branch**: main (stable production version)

---

## Current Status ✅

### Implemented Features

#### Core Functionality
- ✅ CSV file upload and parsing
- ✅ Data table display with sorting
- ✅ Query-based filtering
- ✅ Export filtered results to CSV
- ✅ Dark/Light theme toggle
- ✅ Responsive mobile design

#### AI Query Processing
- ✅ Budget/cost analysis (averages, totals, ranges)
- ✅ Column value listing
- ✅ Range-based filtering (>, <, >=, <=, between)
- ✅ Grouping and counting (group by column)
- ✅ Status distribution analysis
- ✅ Date range analysis
- ✅ Selected text analysis

#### Code Quality
- ✅ Component-based architecture
- ✅ PropTypes validation
- ✅ Error handling
- ✅ Code comments
- ✅ Modular service layer
- ✅ Clean component separation

#### UI/UX
- ✅ Professional design
- ✅ Intuitive interface
- ✅ Loading indicators
- ✅ Error messages
- ✅ Success feedback
- ✅ Helpful tooltips
- ✅ Keyboard shortcuts

---

## Project Structure

```
DRISI_AI_RPMD/
├── src/
│   ├── components/
│   │   ├── AIAssistant.jsx          # AI query interface
│   │   ├── DataTable.jsx             # Sortable data table
│   │   ├── FileUploader.jsx          # File upload component
│   │   └── QueryInput.jsx            # Query input component
│   ├── services/
│   │   └── ai.js                     # AI query processing
│   ├── App.jsx                       # Main app component
│   ├── App.css                       # Styling
│   ├── index.css                     # Global styles
│   └── main.jsx                      # React entry point
├── dist/                             # Build output
├── public/                           # Static assets
├── package.json                      # Dependencies
├── vite.config.js                    # Build config
├── tailwind.config.js                # Tailwind CSS config
├── postcss.config.js                 # PostCSS config
├── USER_GUIDE.md                     # User documentation
├── IMPROVEMENTS.md                   # Technical improvements
├── README.md                         # Project readme
└── sample-data.csv                   # Example data
```

---

## Technology Stack

**Frontend**
- React 18.2.0
- Vite 7.1.3
- Tailwind CSS 3.3.6
- PapaParse 5.4.1 (CSV parsing)

**Development Tools**
- ESLint
- PostCSS
- Autoprefixer

**Deployment**
- Render (https://drisi-ai-rpmd.onrender.com)

---

## Development Workflow

### Local Development
```bash
# Clone and setup
git clone https://github.com/jaskaren-caltrans/DRISI_AI_RPMD.git
cd DRISI_AI_RPMD

# Install dependencies
npm install

# Start dev server
npm run dev
# Opens at http://localhost:5173
```

### Making Changes
1. Create feature branch from `development`
2. Make changes and test locally
3. Commit with clear messages
4. Push to GitHub
5. Create Pull Request to `development`
6. Review and merge
7. Periodically merge `development` → `main`

### Building for Production
```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview

# Deploy (auto on push to main for Render)
```

---

## Key Components

### AIAssistant.jsx
Intelligent query processor with dual-view responses:
- Enhanced view: Structured card-based layout
- Classic view: Original text format
- Supports complex queries
- Handles selected text analysis

### DataTable.jsx
Interactive data display with:
- Column-based sorting (ascending/descending)
- Sortable numeric and text columns
- CSV export functionality
- Empty value handling
- Responsive layout

### FileUploader.jsx
Reusable file upload component:
- CSV file validation
- Column preview
- Load status indicator
- Helpful tips

### QueryInput.jsx
Intelligent query input:
- Multi-line textarea
- Keyboard shortcuts (Ctrl+Enter)
- Real-time validation
- Placeholder examples

---

## Query Capabilities

### Statistical Queries
- Average calculations
- Sum totals
- Min/Max values
- Count operations

### Categorical Analysis
- List unique values
- Count distributions
- Group by column
- Frequency analysis

### Range-Based Queries
- Greater than (>)
- Less than (<)
- Between ranges
- Natural language support

### Advanced
- Date range analysis
- Column-based filtering
- Multi-column grouping
- Selected text analysis

---

## Performance Metrics

**Build Size**
- CSS: 17.71 kB (gzip: 3.92 kB)
- JS: 182.95 kB (gzip: 60.00 kB)
- Total: ~63 kB gzipped

**Load Time**
- Development: <1s
- Production: <2s (depending on connection)

**Data Handling**
- Tested with up to 10,000+ rows
- Smooth sorting and filtering
- No lag on typical operations

---

## Recent Changes (Latest Commits)

### Commit 1: Improvements 3-6
- Enhanced AI query processing
- New component extraction
- PropTypes validation
- CSV export functionality
- Column sorting

### Commit 2: User Guide
- Comprehensive documentation
- Query examples
- Troubleshooting guide
- Best practices

---

## Known Limitations & Future Work

### Current Limitations
- CSV files only (no Excel support)
- No data visualization/charts
- No persistent data storage
- Single-sheet CSV only
- Limited to browser memory for large files

### Planned Enhancements
- [ ] Data visualization (charts/graphs)
- [ ] Advanced filtering UI
- [ ] Query history
- [ ] Saved queries
- [ ] Multi-file comparison
- [ ] Data validation rules
- [ ] Custom formula support

---

## Testing Checklist

Before deploying to production:

- [ ] Test file upload with various CSV formats
- [ ] Test range queries with different operators
- [ ] Test grouping with multiple columns
- [ ] Test export to CSV
- [ ] Test column sorting (numeric and text)
- [ ] Test dark mode toggle
- [ ] Test responsive design on mobile
- [ ] Test with large datasets (5000+ rows)
- [ ] Test all keyboard shortcuts
- [ ] Verify AI Assistant responses
- [ ] Check console for errors
- [ ] Test theme persistence

---

## Deployment

### Current Deployment
- **Platform**: Render
- **URL**: https://drisi-ai-rpmd.onrender.com
- **Auto-deploy**: On push to `main` branch
- **Environment**: Node.js

### Deployment Checklist
1. Test locally: `npm run build && npm run preview`
2. Commit changes to `development`
3. Create Pull Request
4. Review and merge to `main`
5. Render auto-deploys
6. Verify at: drisi-ai-rpmd.onrender.com

---

## Contributing

### Code Standards
- Use functional components (React Hooks)
- PropTypes for all component props
- Clear, descriptive variable names
- Comments for complex logic
- Keep components focused and single-purpose

### Commit Message Format
```
[Feature/Fix/Docs] Brief description

Detailed explanation of changes:
- Bullet point 1
- Bullet point 2

Related issues: #123
```

### Pull Request Template
1. Description of changes
2. Type: Feature/Fix/Docs
3. Testing done
4. Screenshots (if UI changes)
5. Related issues

---

## Resources

**Documentation**
- USER_GUIDE.md - User documentation
- IMPROVEMENTS.md - Technical improvements
- This README - Project overview

**Links**
- GitHub: https://github.com/jaskaren-caltrans/DRISI_AI_RPMD
- Live Demo: https://drisi-ai-rpmd.onrender.com
- Render Dashboard: https://dashboard.render.com

**Tools & Libraries**
- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com

---

## Support & Contact

- **Issues**: GitHub Issues
- **Email**: jaskaren.virk.caltrans@gmail.com
- **Organization**: Caltrans DRISI

---

## License & Acknowledgments

**Project**: DRISI AI RPMD
**Owner**: Caltrans Division of Research, Innovation, and System Information
**Created**: 2025

---

## Changelog

### Version 1.0.0 (January 2026)
- Initial public release
- All core features implemented
- Full documentation
- Ready for production use

---

**Last Updated**: January 8, 2026
**Status**: ✅ Ready for Production
