# Quick Setup Guide

The map needs to run from a web server (not just opened as a file) to load the TopoJSON data properly.

## Option 1: Python (Recommended)
```bash
cd /Users/oded/opt/interactive-map
python3 -m http.server 8000
```
Then open: http://localhost:8000

## Option 2: Node.js
```bash
cd /Users/oded/opt/interactive-map
npx http-server -p 8000
```
Then open: http://localhost:8000

## Option 3: PHP
```bash
cd /Users/oded/opt/interactive-map
php -S localhost:8000
```
Then open: http://localhost:8000

## Why This Is Needed
Modern browsers block loading external resources (like the TopoJSON file) when opening HTML files directly (`file://` protocol). Running from a web server (`http://` protocol) allows the external resources to load properly.

## What You'll See
- Interactive US map with color-coded states
- Hover tooltips showing activity data
- Dropdown to switch between activities
- Click states for detailed breakdowns