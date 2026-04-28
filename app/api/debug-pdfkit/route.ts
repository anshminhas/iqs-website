import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function GET() {
  try {
    const pkg = require('pdfkit/package.json');
    return NextResponse.json({ 
      version: pkg.version,
      cwd: process.cwd()
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
