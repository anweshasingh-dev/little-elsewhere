import { useAppState } from '../app/AppStateProvider';
import { avatars } from '../data/avatars';
export function AvatarPicker() {
  const { state, dispatch } = useAppState();
  const selected = avatars.find((avatar) => avatar.id === state.homeProfile?.avatarId) ?? avatars[0];
  return <div className="avatar-profile">
    <div className="home-avatar-paper"><img className="home-avatar" src={selected.src} alt={selected.alt} width="1254" height="1254" fetchPriority="high" /></div>
    <details className="avatar-picker">
      <summary>Choose your explorer</summary>
      <div className="avatar-options" role="group" aria-label="Explorer options">
        {avatars.map((avatar) => <button type="button" key={avatar.id} aria-label={avatar.label} aria-pressed={selected.id === avatar.id} onClick={() => dispatch({ type: 'set-avatar', avatarId: avatar.id })}>
          <img src={avatar.src} alt="" width="1254" height="1254" loading="lazy" />
          <span>{avatar.label}</span>
          {selected.id === avatar.id && <span className="avatar-selected" aria-hidden="true">✓</span>}
        </button>)}
      </div>
    </details>
  </div>;
}
