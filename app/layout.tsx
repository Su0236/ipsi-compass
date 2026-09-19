import type { Metadata } from 'next';
import './globals.css';
import { StateProvider } from '@/components/app-state';
export const metadata: Metadata = { title: '입시 나침반 | 나의 진학 대시보드', description: '고교 선택부터 대학 진학까지, 출처와 함께 확인하는 입시 정보', icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="ko"><body><StateProvider>{children}</StateProvider></body></html>; }
