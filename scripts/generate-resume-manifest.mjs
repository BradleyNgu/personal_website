import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resumeDir = path.join(__dirname, '../public/resume')

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true })
}

const pdfs = fs
  .readdirSync(resumeDir)
  .filter((name) => name.toLowerCase().endsWith('.pdf'))
  .map((name) => ({
    name,
    mtime: fs.statSync(path.join(resumeDir, name)).mtimeMs,
  }))
  .sort((a, b) => b.mtime - a.mtime)

const manifestPath = path.join(resumeDir, 'manifest.json')
const manifest = { file: pdfs[0]?.name ?? null }

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

if (manifest.file) {
  console.log(`Resume manifest updated: ${manifest.file}`)
} else {
  console.warn('No PDF found in public/resume/ — add your resume as any .pdf filename')
}
