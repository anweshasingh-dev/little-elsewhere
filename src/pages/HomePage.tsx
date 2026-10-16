import { useRef, useState } from 'react';
import { Settings } from 'lucide-react';
import { useAppState } from '../app/AppStateProvider';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AvatarPicker } from '../components/AvatarPicker';
import { NatureIllustration } from '../components/NatureIllustration';
import { AdventureJournal } from '../components/AdventureJournal';
import { BackpackCollection } from '../components/BackpackCollection';
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
  const nextProgress = state.questProgress.find(item => item.status === 'completed') ?? state.questProgress.find(item => item.status === 'active') ?? state.questProgress.find(item => item.status === 'available');
  const nextQuest = quests.find(quest => quest.id === nextProgress?.questId);
  const bingoCount = state.bingoBoard.cells.filter(cell => cell.completed).length;
  function openSettings() { setName(profile?.name ?? ''); setAge(profile?.age?.toString() ?? ''); setSettings(true); }
  return <div className="home-world">
    <section className="home-profile" aria-label="Explorer profile">
      <div className="home-portrait"><AvatarPicker/></div>
      <div className="home-profile-details"><div className="home-header-actions"><button type="button" onClick={openSettings} aria-label="Home settings" title="Home settings"><Settings aria-hidden="true"/></button></div><h1>{profile?.name || 'Little explorer'}</h1><p className="home-age">{profile?.age ? `${profile.age} years old` : 'Ready for a little adventure?'}</p>
        <div className="home-interests" aria-label="Explorer interests"><span><NatureIllustration name="leaf"/>Nature</span><span><NatureIllustration name="cloud"/>Daydreams</span><span><NatureIllustration name="flower"/>Little wonders</span></div>
        <fieldset className="home-moods"><legend>How do you feel today?</legend><div>{moods.map((mood) => <button key={mood.id} type="button" aria-label={mood.label} aria-pressed={profile?.mood === mood.id} onClick={() => dispatch({ type: 'set-mood', mood: mood.id })}><span className="mood-emoji" aria-hidden="true">{mood.face}</span><small>{mood.label}</small></button>)}</div></fieldset>
      </div>
    </section>
    <section className="home-adventures" aria-labelledby="home-adventures-title"><h2 id="home-adventures-title">Pick an adventure</h2><div className="home-adventure-links">
      <a href="#/bingo" className="home-bingo"><img className="home-adventure-image" src="/assets/home_icons/bingo_icon.png" alt="" width="1448" height="1086"/><h3>Nature Bingo</h3></a>
      <a href="#/quests" className="home-quests"><img className="home-adventure-image" src="/assets/home_icons/quest_icon.png" alt="" width="1448" height="1086"/><h3>Little Quests</h3></a>
    </div></section>
    <section className="today-adventure" aria-labelledby="today-title">
      {nextQuest ? <NatureIllustration name={nextQuest.icon}/> : <img src="/assets/home_icons/bingo_icon.png" alt=""/>}
      <div><p className="home-eyebrow">TODAY'S ADVENTURE</p><h2 id="today-title">{nextQuest?.title ?? 'Nature Bingo'}</h2><p>{nextQuest ? nextProgress?.status === 'completed' ? 'You did it! Your coins are ready.' : nextProgress?.status === 'active' ? 'Your adventure is underway.' : 'A little wonder to explore.' : bingoCount === 9 ? 'A whole board of discoveries!' : `${bingoCount} of 9 discoveries`}</p>
      <a className="button button-primary" href={nextQuest ? '#/quests' : '#/bingo'}>{nextQuest ? nextProgress?.status === 'completed' ? 'Collect my coins' : nextProgress?.status === 'active' ? 'Continue my quest' : 'Explore this quest' : bingoCount === 9 ? 'Visit my board' : 'Explore Bingo'}</a></div>
    </section>
    <div className="home-scrapbook"><AdventureJournal/><BackpackCollection/></div>

    <ConfirmDialog open={settings} title="Your explorer" description="Keep a name and age in this browser." confirmLabel="Save profile" cancelLabel="Cancel" onCancel={() => setSettings(false)} onConfirm={() => { if (!profileForm.current?.reportValidity()) return; dispatch({ type: 'set-home-profile', name: name.trim(), age: age ? Number(age) : undefined }); setSettings(false); }}>
      <form ref={profileForm} className="home-settings-fields" onSubmit={(event) => event.preventDefault()}><label>Name<input maxLength={40} value={name} onChange={(event) => setName(event.target.value)}/></label><label>Age<input type="number" min="1" max="18" value={age} onChange={(event) => setAge(event.target.value)}/></label></form>
      <section className="settings-help" aria-labelledby="settings-help-title"><h3 id="settings-help-title">How to play</h3><ul><li><strong>Bingo:</strong> Find each discovery, then draw an X on its tile.</li><li><strong>Quests:</strong> Choose a quest, explore, mark it complete, then collect your coins.</li><li>Explore safely with a grown-up. Indoor discoveries count too.</li></ul><p className="fine-print">Each adventure earns coins once. Starting a new board keeps your coins. Progress is saved in this browser when saving is available.</p></section>
    </ConfirmDialog>
  </div>;
}




