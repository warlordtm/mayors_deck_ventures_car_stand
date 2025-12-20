/*
A safe, dry-run-first Node script to scan for Tailwind color utilities and optionally replace them with semantic tokens.
Usage:
  node scripts/refactor-tailwind.js          # show report (dry-run)
  node scripts/refactor-tailwind.js --apply  # apply replacements (creates .bak backups)

This intentionally favors conservative replacements. Always run without --apply first and review diffs.
*/

const fs = require('fs').promises
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const TARGET_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.css']
const APPLY = process.argv.includes('--apply')

// Replacement map: regex -> replacement
// Keep these conservative. Expand as you review results.
const REPLACEMENTS = [
  { re: /\btext-white\b/g, to: 'text-foreground' },
  { re: /\bbg-black\b/g, to: 'bg-card' },
  { re: /\bborder-white(\\/\d{1,2})?\b/g, to: 'border-border' },
  // map common zinc text colors to muted semantic (coarse)
  { re: /\btext-zinc-(300|400|500|600|700)\b/g, to: 'text-muted-foreground' },
  // map common zinc background shades used as dark to card
  { re: /\bbg-zinc-(900|950|800|700|600)\b/g, to: 'bg-card' },
  { re: /\bhover:bg-white\b/g, to: 'hover:bg-card' },
]

function isTarget(file) {
  return TARGET_EXTS.includes(path.extname(file))
}

async function walk(dir) {
  const res = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue
      res.push(...await walk(full))
    } else if (isTarget(full)) {
      res.push(full)
    }
  }
  return res
}

async function process() {
  console.log(`Starting tailwind refactor scan from ${ROOT}`)
  const files = await walk(ROOT)
  const report = []

  for (const file of files) {
    let txt = await fs.readFile(file, 'utf8')
    let original = txt
    const matches = []
    for (const { re, to } of REPLACEMENTS) {
      if (re.test(txt)) {
        matches.push({ pattern: re.toString(), replacement: to })
      }
    }
    if (matches.length) {
      // show file-level matches
      report.push({ file: path.relative(ROOT, file), matches })
      // perform replacement in memory for dry-run preview
      for (const { re, to } of REPLACEMENTS) {
        txt = txt.replace(re, to)
      }
      if (APPLY) {
        // create backup then write
        await fs.writeFile(file + '.bak', original, 'utf8')
        await fs.writeFile(file, txt, 'utf8')
      }
    }
  }

  // print report
  if (report.length === 0) {
    console.log('No matches found for the configured replacement set.')
    return
  }

  console.log(`Found ${report.length} files with matches:`)
  for (const r of report) {
    console.log(' -', r.file)
    for (const m of r.matches) console.log('    •', m.pattern, '→', m.replacement)
  }

  if (!APPLY) {
    console.log('\nDry-run only. To apply changes run:')
    console.log('  node scripts/refactor-tailwind.js --apply')
  } else {
    console.log('\nReplacements applied. Backup files with .bak were created next to modified files.')
  }
}

process().catch((err) => {
  console.error('Error during refactor scan:', err)
  process.exit(1)
})
