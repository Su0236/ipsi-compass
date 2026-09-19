export type Evidence = { year: number; sourceName: string; sourceUrl: string | null; publishedAt: string | null; checkedAt: string | null; updatedAt: string | null; status: 'example' | 'reviewed'; isDemo: boolean; scope?: string };
export type School = { id: string; name: string; type: string; region: string; district: string; gender: string; public: string; students: number | null; subjects: string[]; dormitory: string | null; description: string; evidence: Evidence };
export type Department = { id: string; university: string; name: string; field: string; curriculum: string; requirements: { subject: string; kind: 'required' | 'recommended' | 'evaluated' }[]; evidence: Evidence };
export type Event = { id: string; title: string; schoolId: string | null; date: string; endDate: string; kind: string; evidence: Evidence };
export type Profile = { grade: string; region: string; highYear: number; universityYear: number; field: string };
