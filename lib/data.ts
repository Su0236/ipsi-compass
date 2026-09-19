import type { Evidence, School, Department, Event } from '@/types';
export const evidence = (year: number): Evidence => ({ year, sourceName: '기능 체험용 가상 자료', sourceUrl: null, publishedAt: null, checkedAt: null, updatedAt: null, status: 'example', isDemo: true });
export const schoolTypes = ['전체', '일반고', '외고', '국제고', '과고', '영재학교', '자사고'];
export const schools: School[] = [
  { id:'demo-h1', name:'나침반고등학교', type:'일반고', region:'서울', district:'마포구', gender:'남녀공학', public:'공립', students:720, subjects:['대수','미적분Ⅰ','확률과 통계','물리학','화학'], dormitory:'없음', description:'인문·자연 계열 과목을 함께 살펴볼 수 있는 가상 학교입니다.', evidence:evidence(2027) },
  { id:'demo-h2', name:'한빛외국어고등학교', type:'외고', region:'서울', district:'노원구', gender:'남녀공학', public:'사립', students:600, subjects:['영어 독해와 작문','세계시민과 지리','사회와 문화'], dormitory:null, description:'외국어와 국제 분야 교육과정을 비교하기 위한 가상 학교입니다.', evidence:evidence(2027) },
  { id:'demo-h3', name:'새봄국제고등학교', type:'국제고', region:'서울', district:'종로구', gender:'남녀공학', public:'공립', students:450, subjects:['사회와 문화','정치','영어 독해와 작문'], dormitory:'있음', description:'사회·국제 계열 과목 구성을 살펴보는 가상 학교입니다.', evidence:evidence(2027) },
  { id:'demo-h4', name:'푸른과학고등학교', type:'과고', region:'서울', district:'서대문구', gender:'남녀공학', public:'공립', students:300, subjects:['대수','미적분Ⅰ','물리학','화학','생명과학'], dormitory:'있음', description:'수학·과학 교육과정의 예시를 제공하는 가상 학교입니다.', evidence:evidence(2027) },
  { id:'demo-h5', name:'미래과학영재학교', type:'영재학교', region:'서울', district:'강남구', gender:'남녀공학', public:'공립', students:null, subjects:['물리학','화학','생명과학'], dormitory:'있음', description:'영재학교 유형을 비교하기 위한 가상 학교입니다.', evidence:evidence(2027) },
  { id:'demo-h6', name:'이음자율고등학교', type:'자사고', region:'서울', district:'서초구', gender:'남녀공학', public:'사립', students:810, subjects:['대수','미적분Ⅰ','확률과 통계','사회와 문화'], dormitory:null, description:'자율형 사립고 유형을 비교하기 위한 가상 학교입니다.', evidence:evidence(2027) },
  { id:'demo-h7', name:'경기나래고등학교', type:'일반고', region:'경기', district:'수원시', gender:'남녀공학', public:'공립', students:840, subjects:['대수','생명과학','사회와 문화'], dormitory:'없음', description:'지역 필터를 체험하기 위한 가상 학교입니다.', evidence:evidence(2027) },
];
export const subjects = ['대수','미적분Ⅰ','미적분Ⅱ','확률과 통계','기하','물리학','화학','생명과학','지구과학','사회와 문화','정치','세계시민과 지리','영어 독해와 작문'];
export const departments: Department[] = [
  {id:'demo-d1',university:'나침반대학교',name:'컴퓨터공학과',field:'공학',curriculum:'2022',requirements:[{subject:'미적분Ⅰ',kind:'recommended'},{subject:'기하',kind:'recommended'},{subject:'물리학',kind:'evaluated'}],evidence:evidence(2030)},
  {id:'demo-d2',university:'나침반대학교',name:'경영학과',field:'사회',curriculum:'2022',requirements:[{subject:'확률과 통계',kind:'recommended'},{subject:'사회와 문화',kind:'recommended'}],evidence:evidence(2030)},
  {id:'demo-d3',university:'이음대학교',name:'생명과학과',field:'자연',curriculum:'2022',requirements:[{subject:'화학',kind:'recommended'},{subject:'생명과학',kind:'required'}],evidence:evidence(2030)},
  {id:'demo-d4',university:'이음대학교',name:'국제학부',field:'인문',curriculum:'2022',requirements:[],evidence:evidence(2030)},
];
export const events: Event[] = [
  {id:'demo-e1',title:'나침반고 학교 설명회',schoolId:'demo-h1',date:'2026-10-10',endDate:'2026-10-10',kind:'설명회',evidence:evidence(2027)},
  {id:'demo-e2',title:'한빛외고 모집요강 확인',schoolId:'demo-h2',date:'2026-10-15',endDate:'2026-10-15',kind:'자료 확인',evidence:evidence(2027)},
  {id:'demo-e3',title:'새봄국제고 원서 접수',schoolId:'demo-h3',date:'2026-10-21',endDate:'2026-10-23',kind:'원서 접수',evidence:evidence(2027)},
  {id:'demo-e4',title:'나침반대 학과 탐색',schoolId:null,date:'2026-11-07',endDate:'2026-11-07',kind:'진로 탐색',evidence:evidence(2030)},
];
export const guides = [
  {id:'school',title:'고교 선택, 무엇부터 비교할까요?',category:'고교 선택',text:'학교 유형뿐 아니라 통학, 실제 개설 과목, 모집 대상과 전형 방법을 함께 확인하세요. 학교별 공시 자료와 해당 학년도 모집요강을 나란히 살펴보는 것이 출발점입니다.',url:'https://www.schoolinfo.go.kr',publisher:'학교알리미'},
  {id:'credit',title:'고교학점제와 과목 선택',category:'과목 선택',text:'관심 분야에 필요한 과목과 우리 학교의 교육과정 편성표를 함께 확인하세요. 과목 이름이 비슷해도 교육과정이나 위계가 다를 수 있으므로 담당 선생님과 이수 순서를 상담하세요.',url:'https://www.moe.go.kr',publisher:'교육부'},
  {id:'record',title:'내신과 학생부 확인하기',category:'학생부',text:'성적 산출 방식과 학생부 기재 기준은 적용 학년도에 맞는 공식 안내를 확인해야 합니다. 활동 기록은 실제 학교생활을 바탕으로 확인하고, 구체적인 문의는 학교 담당 선생님에게 하세요.',url:'https://www.moe.go.kr',publisher:'교육부'},
  {id:'admission',title:'수시·정시 모집요강 읽기',category:'대입',text:'지원 자격, 전형 요소, 수능 최저, 제출 서류와 마감 시간을 차례로 확인하세요. 시행계획 발표 후에도 최종 모집요강과 정정 공지가 나올 수 있습니다.',url:'https://www.adiga.kr',publisher:'대입정보포털 어디가'},
];
