# Excel/CSV/Table to PDF Converter

This project is a web application that allows you to convert Excel, CSV, or HTML Table data into a PDF file. It is built with React and Material-UI, and uses libraries such as `xlsx`, `jspdf`, and `jspdf-autotable` for file parsing and PDF generation.

## Features
- Convert Excel (`.xlsx`) files to PDF
- Convert CSV files to PDF
- Convert pasted HTML tables to PDF
- Preview and download the generated PDF
- Select a specific sheet from multi-sheet Excel files
- User-friendly interface with Material-UI

## Getting Started

### Prerequisites
- Node.js and npm (already included in the dev container)
- [Bun](https://bun.sh/) (optional alternative to npm/yarn)

### Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd exceltopdf
   ```
2. Install dependencies:
   ```sh
   npm install
   # or, with Bun
   bun install
   ```

### Running the App
To start the development server:
```sh
npm start
# or, with Bun
bun run start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production
To build the app for production:
```sh
npm run build
# or, with Bun
bun run build
```
The build output will be in the `build/` directory.

### Running Tests
To run tests:
```sh
npm test
# or, with Bun
bun run test
```

## Project Structure
- `src/components/ExcelToPdf.tsx` – Excel to PDF conversion UI and logic
- `src/components/CsvToPdf.tsx` – CSV to PDF conversion UI and logic
- `src/components/TableToPdf.tsx` – HTML Table to PDF conversion UI and logic
- `src/components/ui/` – Reusable UI components (file upload, PDF preview, etc.)
- `src/App.tsx` – Main app with tab navigation

## Dependencies
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [xlsx](https://github.com/SheetJS/sheetjs)
- [jspdf](https://github.com/parallax/jsPDF)
- [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- [papaparse](https://www.papaparse.com/) (for CSV parsing)

## License
MIT
