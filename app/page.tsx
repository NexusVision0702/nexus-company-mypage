// app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  // サーバー側で即座にログイン画面へ転送するため、HTMLの描画が一切起きません
  redirect('/login');
}