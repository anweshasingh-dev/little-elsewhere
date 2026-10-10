import type { ReactNode } from 'react';
const art: Record<string, ReactNode> = {
  leaf: <><path d="M28 73C7 42 35 16 75 17c4 39-20 64-47 56Z" fill="#A8C18D" stroke="#4F604D"/><path d="m23 82 40-48M36 62l-1-18m1 18 19 1m-7-15V35m0 13 16 1" stroke="#4F604D" fill="none"/></>,
  cloud: <><path d="M24 69C6 64 10 43 27 42c1-24 36-25 43-6 22-6 29 28 11 33Z" fill="#F7F7ED" stroke="#4F604D"/><path d="M28 77h42" stroke="#A8C18D"/><path d="M22 84h18m15 0h22" stroke="#D2DBCA"/></>,
  yellow: <><path d="M50 9v9m0 64v9M9 50h9m64 0h9M21 21l7 7m44 44 7 7M21 79l7-7m44-44 7-7" stroke="#A77A61"/><circle cx="50" cy="50" r="25" fill="#F1D37C" stroke="#A77A61"/><path d="M42 53q8 8 16 0" fill="none" stroke="#A77A61"/></>,
  bird: <><path d="M15 77h70" stroke="#A77A61"/><path d="M30 69C12 66 15 45 31 44c1-27 35-33 42-9l10 7-11 7c4 21-17 30-42 20Z" fill="#A8C18D" stroke="#4F604D"/><path d="M37 45q27 8 14 26H32" fill="#E9B49A" stroke="#4F604D"/><path d="m33 72-2 6m15-6v6" stroke="#4F604D"/><circle cx="61" cy="33" r="3" fill="#293D30"/></>,
  flower: <><path d="M50 84V48m0 21q-26-28-27-3 8 14 27 10m0-9q26-28 27-3-8 14-27 10" fill="#A8C18D" stroke="#4F604D"/><path d="M50 44C14 51 18 28 33 28c-8-24 22-29 22-8 22-13 37 15 16 23 17 19-7 38-21 12-14 26-37 6-21-11Z" fill="#E9B49A" stroke="#A77A61"/><circle cx="50" cy="41" r="10" fill="#F1D37C" stroke="#A77A61"/></>,
  sound: <><path d="M31 80V46m0 20Q6 58 15 41q19 1 16 25m0-16q5-21 21-13-4 17-21 13" fill="#A8C18D" stroke="#4F604D"/><path d="M64 52V26l17-4v25M64 31l17-4" fill="none" stroke="#A77A61"/><ellipse cx="59" cy="54" rx="7" ry="5" fill="#E9B49A"/><ellipse cx="76" cy="49" rx="7" ry="5" fill="#E9B49A"/><path d="M58 69q10 2 16-4" fill="none" stroke="#4F604D"/></>,
  shape: <><path d="M17 69C4 44 28 19 48 25c23-20 37 4 35 21 24 21 2 36-23 33-20 10-35 2-43-10Z" fill="#DDE9D2" stroke="#4F604D"/><path d="M23 62q15-35 27-27m-7 34 13-11m8-17 7 3" fill="none" stroke="#A77A61"/><path d="M19 87h65" stroke="#A8C18D"/></>,
  moving: <><path d="M48 53C9 1 2 42 31 56 1 65 24 90 47 67M52 53C91 1 98 42 69 56c30 9 7 34-16 11" fill="#E9B49A" stroke="#A77A61"/><path d="M50 42v35m0-35-8-10m8 10 8-10" stroke="#4F604D"/><path d="M26 40q-6 13 7 14m40-14q6 13-7 14" fill="none" stroke="#F7F7ED"/><path d="M18 22l-5-4m73 3 5-5" stroke="#A8C18D"/></>,
  tiny: <><path d="M41 84V55h18v29" fill="#F7F7ED" stroke="#A77A61"/><path d="M21 54c-2-43 60-43 58 0Z" fill="#E9B49A" stroke="#A77A61"/><circle cx="36" cy="36" r="5" fill="#F7F7ED"/><circle cx="59" cy="28" r="4" fill="#F7F7ED"/><circle cx="64" cy="44" r="5" fill="#F7F7ED"/><path d="M26 85h49m-53-9-5-10m62 9 5-9" stroke="#4F604D"/></>,
};
export function NatureIllustration({ name, className = '' }: { name: string; className?: string }) {
  return <svg className={`nature-art ${className}`} viewBox="0 0 100 100" aria-hidden="true" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{art[name] ?? art.leaf}</svg>;
}
