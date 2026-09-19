import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { schoolSchema, departmentSchema, eventSchema } from '../../lib/schemas';
const bundleSchema=z.array(z.discriminatedUnion('kind',[
 z.object({kind:z.literal('school'),payload:schoolSchema}),z.object({kind:z.literal('department'),payload:departmentSchema}),z.object({kind:z.literal('event'),payload:eventSchema})
]));
export function normalizeName(name:string){return name.normalize('NFC').trim().replace(/\s+/g,' ')}
export function digest(text:string){return createHash('sha256').update(text).digest('hex')}
export function assertPermission(source:{collection_allowed:boolean;commercial_use:string;reviewed_at:string|null}){if(!source.collection_allowed||source.commercial_use!=='allowed'||!source.reviewed_at)throw new Error('수집 및 상업 이용 허용 검토가 필요합니다.');}

// Only locally supplied, authorized files are accepted until a source adapter is reviewed.
export async function importReviewedBundle(sourceId:string,documentUrl:string,raw:string){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('서버 전용 DB 연결이 필요합니다.');
 const db=createClient(url,key,{auth:{persistSession:false}});
 const {data:source,error:sourceError}=await db.from('sources').select('*').eq('id',sourceId).single();if(sourceError)throw new Error('등록된 출처가 없습니다.');assertPermission(source);
 if(new URL(documentUrl).origin!==new URL(source.base_url).origin)throw new Error('출처의 공식 주소와 일치해야 합니다.');
 const records=bundleSchema.parse(JSON.parse(raw));for(const r of records){if(r.payload.evidence.isDemo)throw new Error('예시 자료는 실제 수집 경로에 넣을 수 없습니다.');if(r.payload.evidence.sourceUrl!==documentUrl)throw new Error('원문 주소를 확인하세요.');}
 const hash=digest(JSON.stringify(records));const {data:existing}=await db.from('source_documents').select('id').eq('source_id',sourceId).eq('url',documentUrl).eq('sha256',hash).maybeSingle();if(existing)return {status:'unchanged',count:0};
 const {data:run,error:runError}=await db.from('collection_runs').insert({source_id:sourceId,status:'running'}).select('id').single();if(runError)throw new Error('수집 기록을 생성할 수 없습니다.');
 try{const {data:doc,error}=await db.from('source_documents').insert({source_id:sourceId,url:documentUrl,sha256:hash}).select('id').single();if(error)throw new Error('원문 근거를 저장하지 못했습니다.');const {error:reviewError}=await db.from('review_items').insert(records.map(r=>({kind:r.kind,payload:r.payload,document_id:doc.id,status:'pending'})));if(reviewError)throw new Error('검토 대기 자료를 저장하지 못했습니다.');await db.from('collection_runs').update({status:'review',finished_at:new Date().toISOString()}).eq('id',run.id);return {status:'review',count:records.length};}catch(e){await db.from('collection_runs').update({status:'failed',message:(e as Error).message,finished_at:new Date().toISOString()}).eq('id',run.id);throw e;}
}
export async function fetchApprovedJSON(url:string,policy:{endpoint:string;collection_allowed:boolean;commercial_use:string;reviewed_at:string|null},lastFetchedAt:number,minIntervalSeconds:number){
 assertPermission(policy);if(url!==policy.endpoint||new URL(url).protocol!=='https:')throw new Error('허용된 HTTPS API 주소만 호출할 수 있습니다.');if(Date.now()-lastFetchedAt<Math.max(60,minIntervalSeconds)*1000)throw new Error('수집 간격을 지켜 주세요.');
 for(let attempt=0;attempt<2;attempt++){try{const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(10000),headers:{Accept:'application/json'}});if(!response.ok)throw new Error(`수집 응답 ${response.status}`);if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('JSON 응답이 아닙니다.');const reader=response.body?.getReader();if(!reader)throw new Error('빈 응답');const chunks:Uint8Array[]=[];let size=0;while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.length;if(size>2_000_000){await reader.cancel();throw new Error('응답 크기 제한 초과');}chunks.push(chunk.value);}return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch(e){if(attempt===1)throw e;await new Promise(resolve=>setTimeout(resolve,1000));}}
}
