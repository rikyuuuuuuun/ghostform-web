// Regenerate only the browser sample sheets; do not modify native-app media.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const source = process.argv[2], ffmpeg = process.argv[3] || 'ffmpeg';
if (!source) throw new Error('Usage: node scripts/prepare-trial-media.mjs <licensed-source-video> [ffmpeg-path]');
const destination = fileURLToPath(new URL('../try/assets/', import.meta.url));
mkdirSync(destination,{recursive:true});
execFileSync(ffmpeg,['-v','error','-y','-i',source,'-an','-vf','fps=24,trim=end_frame=108,scale=256:486:flags=lanczos,tile=6x6','-frames:v','3','-q:v','4',destination+'sample-%02d.jpg'],{stdio:'inherit'});
