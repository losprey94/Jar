interface SettingsProps { soundOn: boolean; reducedAnimation: boolean; onSound: () => void; onAnimation: () => void; onReset: () => void; onClose: () => void; }

export default function SettingsPanel({ soundOn, reducedAnimation, onSound, onAnimation, onReset, onClose }: SettingsProps) {
  return <section className="overlay panel"><h3>⚙️ Settings</h3><button className="ghost" onClick={onClose}>Close</button><button onClick={onSound}>Sound: {soundOn ? 'On' : 'Off'}</button><button onClick={onAnimation}>Reduced Animation: {reducedAnimation ? 'On' : 'Off'}</button><button className="danger" onClick={onReset}>Reset Progress</button><div className="ad-placeholders"><h4>Rewarded Placeholder</h4><button>Double Offline Rewards</button><button>Rare Spore</button><button>Gentle Rain Boost</button></div></section>;
}
