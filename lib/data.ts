import type { Evidence, School, Department, Event } from '@/types';
export const evidence = (year: number): Evidence => ({ year, sourceName: '기능 체험용 예시 자료', sourceUrl: null, publishedAt: null, checkedAt: null, updatedAt: null, status: 'example', isDemo: true });
const schoolEvidence = (url: string): Evidence => ({ year: 2027, sourceName: '학교 공식 홈페이지 · 학교 기본정보 확인', sourceUrl: url, publishedAt: null, checkedAt: '2026-09-19', updatedAt: null, status: 'reviewed', isDemo: false, scope: '학교 존재·학교 유형·지역만 확인. 2027 모집요강·개설과목·학생 수는 별도 확인 필요' });
export const schoolTypes = ['전체', '일반고', '외고', '국제고', '과고', '영재학교', '자사고'];
export const schools: School[] = [
  { id:'seoul-high', name:'서울고등학교', type:'일반고', region:'서울', district:'서초구', gender:'남녀공학', public:'공립', students:null, subjects:[], dormitory:null, description:'서울 서초구의 실제 일반고입니다. 학교 기본정보만 먼저 확인했으며, 지원 전 해당 학년도 교육과정과 모집 안내를 확인하세요.', evidence:schoolEvidence('https://seoul.sen.hs.kr/') },
  { id:'daewon-foreign', name:'대원외국어고등학교', type:'외고', region:'서울', district:'광진구', gender:'남녀공학', public:'사립', students:null, subjects:[], dormitory:null, description:'서울 광진구의 실제 외국어고입니다. 학교 공식 홈페이지에서 입학 공지와 교육과정 원문을 확인하세요.', evidence:schoolEvidence('https://www.dwfl.hs.kr/') },
  { id:'seoul-global', name:'서울국제고등학교', type:'국제고', region:'서울', district:'종로구', gender:'남녀공학', public:'공립', students:null, subjects:[], dormitory:null, description:'서울 종로구의 실제 국제고입니다. 모집요강과 학교생활 정보는 공식 공지를 기준으로 확인해야 합니다.', evidence:schoolEvidence('http://sghs.sen.hs.kr/') },
  { id:'hansung-science', name:'한성과학고등학교', type:'과고', region:'서울', district:'서대문구', gender:'남녀공학', public:'공립', students:null, subjects:[], dormitory:null, description:'서울 서대문구의 실제 과학고입니다. 과학고 전형과 개설과목은 학년도별 공식 안내를 따릅니다.', evidence:schoolEvidence('https://hansungsh.sen.hs.kr/') },
  { id:'seoul-science', name:'서울과학고등학교', type:'영재학교', region:'서울', district:'종로구', gender:'남녀공학', public:'공립', students:null, subjects:[], dormitory:null, description:'서울에 있는 실제 과학영재학교입니다. 영재학교 전형 일정과 지원 자격은 학교의 최신 공지를 확인하세요.', evidence:schoolEvidence('https://sshs.sen.hs.kr/') },
  { id:'hana-high', name:'하나고등학교', type:'자사고', region:'서울', district:'은평구', gender:'남녀공학', public:'사립', students:null, subjects:[], dormitory:null, description:'서울 은평구의 실제 자율형 사립고입니다. 학교 공식 홈페이지에서 학년도별 입학전형 요강을 확인하세요.', evidence:schoolEvidence('https://hana.hs.kr/') },
];
export const subjects = ['대수','미적분Ⅰ','미적분Ⅱ','확률과 통계','기하','물리학','화학','생명과학','지구과학','사회와 문화','정치','세계시민과 지리','영어 독해와 작문'];
export const departments: Department[] = [
  {id:'demo-d1',university:'나침반대학교',name:'컴퓨터공학과',field:'공학',curriculum:'2022',requirements:[{subject:'미적분Ⅰ',kind:'recommended'},{subject:'기하',kind:'recommended'},{subject:'물리학',kind:'evaluated'}],evidence:evidence(2030)},
  {id:'demo-d2',university:'나침반대학교',name:'경영학과',field:'사회',curriculum:'2022',requirements:[{subject:'확률과 통계',kind:'recommended'},{subject:'사회와 문화',kind:'recommended'}],evidence:evidence(2030)},
  {id:'demo-d3',university:'이음대학교',name:'생명과학과',field:'자연',curriculum:'2022',requirements:[{subject:'화학',kind:'recommended'},{subject:'생명과학',kind:'required'}],evidence:evidence(2030)},
  {id:'demo-d4',university:'이음대학교',name:'국제학부',field:'인문',curriculum:'2022',requirements:[],evidence:evidence(2030)},
];
export const events: Event[] = [];
export const guides = [
  {id:'school',title:'고교 선택, 무엇부터 비교할까요?',category:'고교 선택',text:'학교 유형뿐 아니라 통학, 실제 개설 과목, 모집 대상과 전형 방법을 함께 확인하세요. 학교별 공시 자료와 해당 학년도 모집요강을 나란히 살펴보는 것이 출발점입니다.',url:'https://www.schoolinfo.go.kr',publisher:'학교알리미'},
  {id:'credit',title:'고교학점제와 과목 선택',category:'과목 선택',text:'관심 분야에 필요한 과목과 우리 학교의 교육과정 편성표를 함께 확인하세요. 과목 이름이 비슷해도 교육과정이나 위계가 다를 수 있으므로 담당 선생님과 이수 순서를 상담하세요.',url:'https://www.moe.go.kr',publisher:'교육부'},
  {id:'record',title:'내신과 학생부 확인하기',category:'학생부',text:'성적 산출 방식과 학생부 기재 기준은 적용 학년도에 맞는 공식 안내를 확인해야 합니다. 활동 기록은 실제 학교생활을 바탕으로 확인하고, 구체적인 문의는 학교 담당 선생님에게 하세요.',url:'https://www.moe.go.kr',publisher:'교육부'},
  {id:'admission',title:'수시·정시 모집요강 읽기',category:'대입',text:'지원 자격, 전형 요소, 수능 최저, 제출 서류와 마감 시간을 차례로 확인하세요. 시행계획 발표 후에도 최종 모집요강과 정정 공지가 나올 수 있습니다.',url:'https://www.adiga.kr',publisher:'대입정보포털 어디가'},
  {id:'community',title:'네이버 카페·유튜브 정보는 어떻게 볼까요?',category:'정보 검증',text:'카페 글과 영상은 실제 경험을 찾는 데 유용하지만, 개인 경험·홍보·오래된 학년도 정보가 섞일 수 있습니다. 먼저 참고자료로 저장하고, 학교 홈페이지·학교알리미·교육청·대학 모집요강과 대조한 뒤 게시합니다.',url:'https://www.schoolinfo.go.kr',publisher:'학교알리미'},
  {id:'school-check',title:'학교 비교 체크리스트',category:'고교 선택',text:'학교 존재와 유형, 통학 시간, 실제 개설 과목, 평가 방식, 학생부 기록 과정, 수능 준비 환경, 상담 창구, 최종 모집요강을 순서대로 확인하세요. ‘내신이 쉽다’나 ‘생기부를 잘 써준다’ 같은 표현은 단독 근거로 사용하지 않습니다.',url:'https://www.sen.go.kr',publisher:'서울특별시교육청'},
];
