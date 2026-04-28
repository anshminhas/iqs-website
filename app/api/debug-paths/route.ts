import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  const cwd = process.cwd();
  
  // Check if public/fonts exists
  const publicFontsPath = path.join(cwd, 'public', 'fonts');
  const publicFontsExist = fs.existsSync(publicFontsPath);
  
  // Check if node_modules/pdfkit exists relative to CWD
  const nodeModulesPath = path.join(cwd, 'node_modules', 'pdfkit');
  const nodeModulesExist = fs.existsSync(nodeModulesPath);

  // List files in public/fonts
  let files: string[] = [];
  if (publicFontsExist) {
    files = fs.readdirSync(publicFontsPath);
  }

  return NextResponse.json({
    cwd,
    publicFontsPath,
    publicFontsExist,
    nodeModulesPath,
    nodeModulesExist,
    files,
    env: process.env.NODE_ENV
  });
}
