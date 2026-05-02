export default function SettingsPanel({ soundOn, reducedAnimation, onSound, onAnimation, onReset, onClose }: any) {
  return <div className="overlay"><h3>Settings</h3><button onClick={onClose}>Close</button><button onClick={onSound}>Sound: {soundOn?'On':'Off'}</button><button onClick={onAnimation}>Reduced Animation: {reducedAnimation?'On':'Off'}</button><button onClick={onReset}>Reset Progress</button><div className="ad-placeholders"><button>Double Offline Rewards</button><button>Rare Spore</button><button>Gentle Rain Boost</button></div></div>;
}
