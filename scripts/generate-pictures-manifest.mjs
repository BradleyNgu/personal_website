import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const picturesDir = path.join(__dirname, '../public/MyPictures')

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'])

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

if (!fs.existsSync(picturesDir)) {
  fs.mkdirSync(picturesDir, { recursive: true })
}

const photos = fs
  .readdirSync(picturesDir)
  .filter((name) => {
    if (name === 'manifest.json') return false
    const ext = path.extname(name).toLowerCase()
    return IMAGE_EXTENSIONS.has(ext)
  })
  .map((name) => {
    const stats = fs.statSync(path.join(picturesDir, name))
    const urlPath = `/MyPictures/${encodeURIComponent(name)}`
    return {
      name,
      path: urlPath,
      size: formatSize(stats.size),
      date: stats.mtime.toLocaleDateString('en-US'),
      thumbnail: urlPath,
      mtime: stats.mtimeMs,
    }
  })
  .sort((a, b) => b.mtime - a.mtime)
  .map(({ mtime, ...photo }) => photo)

const manifestPath = path.join(picturesDir, 'manifest.json')
fs.writeFileSync(manifestPath, `${JSON.stringify({ photos }, null, 2)}\n`)

console.log(`My Pictures manifest updated: ${photos.length} photo(s)`)
if (photos.length === 0) {
  console.warn('No images found in public/MyPictures/ — add .jpg/.png/.gif/.webp files')
}
