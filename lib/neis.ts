import type { School } from '@/types';

type NeisRow = {
  ATPT_OFCDC_SC_NM?: string;
  SD_SCHUL_CODE?: string;
  SCHUL_NM?: string;
  SCHUL_KND_SC_NM?: string;
  LCTN_SC_NM?: string;
  FOND_SC_NM?: string;
  COEDU_SC_NM?: string;
  HMPG_ADRES?: string;
  ORG_RDNMA?: string;
};

function classify(name: string): string {
  if (name.includes('외국어')) return '외고';
  if (name.includes('국제')) return '국제고';
  if (name.includes('과학영재') || name.includes('영재학교')) return '영재학교';
  if (name.includes('과학고')) return '과고';
  if (name.includes('자율형') || name.endsWith('고등학교') && name.includes('하나고')) return '자사고';
  if (name.includes('마이스터')) return '마이스터고';
  if (name.includes('특성화') || name.includes('상업') || name.includes('공업') || name.includes('정보산업')) return '특성화고';
  if (name.includes('예술')) return '예술고';
  if (name.includes('체육')) return '체육고';
  return '일반고';
}

function normalize(row: NeisRow): School {
  const name = row.SCHUL_NM?.trim() || '학교명 미상';
  const region = row.ATPT_OFCDC_SC_NM?.replace('교육청', '').trim() || row.LCTN_SC_NM?.trim() || '지역 미상';
  return {
    id: `neis-${row.ATPT_OFCDC_SC_NM ?? 'unknown'}-${row.SD_SCHUL_CODE ?? name}`,
    name,
    type: classify(name),
    region,
    district: row.LCTN_SC_NM?.trim() || '지역 미상',
    gender: row.COEDU_SC_NM?.trim() || '정보 미확인',
    public: row.FOND_SC_NM?.trim() || '정보 미확인',
    students: null,
    subjects: [],
    dormitory: null,
    description: '나이스 학교기본정보에서 불러온 학교입니다. 학생 수·개설과목·모집요강은 학교알리미와 학교 공식 공지를 추가로 확인하세요.',
    evidence: {
      year: 2027,
      sourceName: '교육부·시도교육청 나이스 학교기본정보',
      sourceUrl: row.HMPG_ADRES || 'https://open.neis.go.kr/portal/data/service/selectServicePage.do?infId=OPEN17020190531110010104913&infSeq=2',
      publishedAt: null,
      checkedAt: new Date().toISOString().slice(0, 10),
      updatedAt: null,
      status: 'reviewed',
      isDemo: false,
      scope: '학교명·지역·학교 홈페이지 등 기본정보'
    }
  };
}

export async function searchNeisSchools(params: { q?: string; region?: string; page?: number; limit?: number }) {
  const key = process.env.NEIS_API_KEY;
  if (!key) throw new Error('전국 학교 검색을 사용하려면 NEIS_API_KEY 환경변수를 등록해 주세요.');
  const url = new URL('https://open.neis.go.kr/hub/schoolInfo');
  url.searchParams.set('KEY', key);
  url.searchParams.set('Type', 'json');
  url.searchParams.set('pIndex', String(params.page ?? 1));
  url.searchParams.set('pSize', String(Math.min(params.limit ?? 1000, 1000)));
  url.searchParams.set('SCHUL_KND_SC_NM', '고등학교');
  if (params.q?.trim()) url.searchParams.set('SCHUL_NM', params.q.trim());
  if (params.region && params.region !== '전체') url.searchParams.set('ATPT_OFCDC_SC_NM', `${params.region}교육청`);
  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) throw new Error('나이스 학교정보를 불러오지 못했습니다.');
  const body = await response.json() as { schoolInfo?: Array<{ head?: Array<{ list_total_count?: number }>; row?: NeisRow[] }> };
  const block = body.schoolInfo?.[1];
  return { items: (block?.row ?? []).map(normalize), total: block?.head?.[0]?.list_total_count ?? 0 };
}
