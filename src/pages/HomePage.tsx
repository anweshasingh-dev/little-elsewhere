import { useRef, useState } from 'react';
import { Backpack, Settings, ArrowUpRight } from 'lucide-react';
import { useAppState } from '../app/AppStateProvider';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AvatarPicker } from '../components/AvatarPicker';
import { NatureIllustration } from '../components/NatureIllustration';
import { quests } from '../data/quests';
import type { Mood } from '../app/state';
const moods: { id: Mood; face: string; label: string }[] = [
  { id: 'happy', face: '😊', label: 'Happy' }, { id: 'excited', face: '🤩', label: 'Excited' },
  { id: 'calm', face: '😌', label: 'Calm' }, { id: 'sad', face: '😔', label: 'Sad' }, { id: 'tired', face: '😴', label: 'Tired' },
];
export function HomePage() {
  const { state, dispatch } = useAppState();
  const profile = state.homeProfile;
  const profileForm = useRef<HTMLFormElement>(null);
  const [settings, setSettings] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const daily = quests.find((quest) => state.questProgress.some((item) => item.questId === quest.id && ['available', 'active'].includes(item.status))) ?? quests[1];
  function openSettings() { setName(profile?.name ?? ''); setAge(profile?.age?.toString() ?? ''); setSettings(true); }
  return <div className="home-world">
    <section className="home-profile" aria-label="Explorer profile">
      <div className="home-portrait"><span className="home-eyebrow">YOUR LITTLE CORNER OF THE WORLD</span><AvatarPicker/></div>
      <div className="home-profile-details"><p className="home-eyebrow">HELLO, EXPLORER</p><h1>{profile?.name || 'Little explorer'}</h1><p className="home-age">{profile?.age ? `${profile.age} years old` : 'Add your name & age in settings'}</p>
        <div className="home-interests" aria-label="Explorer interests"><span><NatureIllustration name="leaf"/>Nature</span><span><NatureIllustration name="cloud"/>Daydreams</span><span><NatureIllustration name="flower"/>Little wonders</span></div>
        <fieldset className="home-moods"><legend>How do you feel today?</legend><div>{moods.map((mood) => <button key={mood.id} type="button" aria-label={mood.label} aria-pressed={profile?.mood === mood.id} onClick={() => dispatch({ type: 'set-mood', mood: mood.id })}><span aria-hidden="true">{mood.face}</span><small>{mood.label}</small></button>)}</div></fieldset>
      </div>
    </section>
    <a className="home-daily" href="#/quests"><NatureIllustration name={daily.icon === 'drop' ? 'leaf' : daily.icon}/><div><p className="home-eyebrow">TODAY'S LITTLE GOAL</p><h2>{daily.title}</h2></div><ArrowUpRight aria-hidden="true"/></a>
    <section className="home-adventures" aria-labelledby="home-adventures-title"><h2 id="home-adventures-title">Pick an adventure</h2><div className="home-adventure-links">
      <a href="#/bingo" className="home-bingo"><img className="home-adventure-image" src="/assets/home_icons/bingo_icon.png" alt="" width="1448" height="1086" /><h3>Nature Bingo <ArrowUpRight aria-hidden="true"/></h3></a>
      <a href="#/quests" className="home-quests"><img className="home-adventure-image" src="/assets/home_icons/quest_icon.png" alt="" width="1448" height="1086" /><h3>Little Quests <ArrowUpRight aria-hidden="true"/></h3></a>
    </div></section>
    <div className="home-header-actions"><a href="#/progress" aria-label="Backpack and trinkets" title="Backpack & trinkets"><Backpack aria-hidden="true"/></a><button type="button" onClick={openSettings} aria-label="Home settings" title="Home settings"><Settings aria-hidden="true"/></button></div>
    <ConfirmDialog open={settings} title="Your explorer" description="Keep a name and age in this browser." confirmLabel="Save profile" cancelLabel="Cancel" onCancel={() => setSettings(false)} onConfirm={() => { if (!profileForm.current?.reportValidity()) return; dispatch({ type: 'set-home-profile', name: name.trim(), age: age ? Number(age) : undefined }); setSettings(false); }}>
      <form ref={profileForm} className="home-settings-fields" onSubmit={(event) => event.preventDefault()}><label>Name<input maxLength={40} value={name} onChange={(event) => setName(event.target.value)}/></label><label>Age<input type="number" min="1" max="18" value={age} onChange={(event) => setAge(event.target.value)}/></label></form>
    </ConfirmDialog>
  </div>;
}




