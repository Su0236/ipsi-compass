import { readFile } from 'node:fs/promises';
import { importReviewedBundle } from './pipeline';
const [sourceId,url,file]=process.argv.slice(2);
if(!sourceId||!url||!file)throw new Error('사용법: tsx scripts/collect/import.ts 출처ID 공식원문URL 허가받은JSON파일');
importReviewedBundle(sourceId,url,await readFile(file,'utf8')).then(console.log).catch(e=>{console.error(e.message);process.exitCode=1});
