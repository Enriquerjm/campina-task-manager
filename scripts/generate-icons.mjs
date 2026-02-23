import sharp from 'sharp'
import { existsSync, mkdirSync } from 'fs'

if (!existsSync('./public')) mkdirSync('./public')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#3b82f6"/>
  <text y=".9em" font-size="80" x="10">🍦</text>
</svg>`

const svgBuffer = Buffer.from(svg)

await sharp(svgBuffer).resize(192, 192).png().toFile('./public/icon-192.png')
await sharp(svgBuffer).resize(512, 512).png().toFile('./public/icon-512.png')

console.log('Icons generated!')