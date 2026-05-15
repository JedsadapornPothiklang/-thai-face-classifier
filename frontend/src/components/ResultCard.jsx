import ConfidenceBar from './ConfidenceBar';

const REGION_META = {
  Northern:     { emoji: '⛰️', bg: 'from-green-500 to-emerald-600',  badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    provinces: ['Chiang Mai','Chiang Rai','Lamphun','Lampang','Phrae','Nan','Phayao','Mae Hong Son','Uttaradit','Tak','Sukhothai','Kamphaeng Phet','Phitsanulok','Phichit','Phetchabun'] },
  Northeastern: { emoji: '🌾', bg: 'from-orange-500 to-amber-500',   badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    provinces: ['Khon Kaen','Udon Thani','Nakhon Ratchasima','Ubon Ratchathani','Buriram','Surin','Sisaket','Roi Et','Maha Sarakham','Kalasin','Sakon Nakhon','Nakhon Phanom','Mukdahan','Loei','Nong Khai','Chaiyaphum','Yasothon','Amnat Charoen','Nong Bua Lamphu','Bung Kan'] },
  Central:      { emoji: '🏙️', bg: 'from-blue-500 to-indigo-600',    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    provinces: ['Bangkok','Ayutthaya','Nakhon Pathom','Nonthaburi','Pathum Thani','Samut Prakan','Samut Sakhon','Samut Songkhram','Ang Thong','Sing Buri','Chai Nat','Lop Buri','Saraburi','Nakhon Nayok','Suphan Buri','Kanchanaburi','Ratchaburi','Phetchaburi','Prachuap Khiri Khan'] },
  Southern:     { emoji: '🌊', bg: 'from-teal-500 to-cyan-500',      badge: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
    provinces: ['Phuket','Surat Thani','Hat Yai','Songkhla','Krabi','Trang','Nakhon Si Thammarat','Phatthalung','Satun','Pattani','Yala','Narathiwat','Chumphon','Ranong','Phang Nga'] },
};

function pick3(provinces) {
  const shuffled = [...provinces].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).join(' · ');
}

export default function ResultCard({ result }) {
  const meta = REGION_META[result.region] || { emoji: '🗺️', bg: 'from-gray-500 to-gray-600', text: '', badge: 'bg-gray-100 text-gray-700' };

  return (
    <div className="card overflow-hidden animate-slide-up">
      {/* Mock warning */}
      {result.isMock && (
        <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-5 py-3">
          <span className="text-yellow-500 text-base mt-0.5">⚠️</span>
          <div>
            <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">MOCK DATA — Model Not Loaded</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5">
              Place model files in <code className="font-mono bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">backend/models/</code> — results are random
            </p>
          </div>
        </div>
      )}

      {/* Region hero banner */}
      <div className={`bg-gradient-to-br ${meta.bg} p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-75 mb-3">Estimated Thai Region</p>
          <div className="flex items-center gap-4">
            <span className="text-6xl drop-shadow-lg">{meta.emoji}</span>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight drop-shadow">{result.region}</h2>
              <p className="text-sm opacity-75 mt-0.5">{pick3(meta.provinces)}</p>
            </div>
          </div>
          <div className="mt-4">
            <ConfidenceBar value={result.confidence} light />
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-center space-y-1 border border-gray-100 dark:border-gray-700/50">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">Age</p>
            {result.age != null
              ? <>
                  <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">{result.age}</p>
                  <p className="text-xs text-gray-400">years old</p>
                </>
              : <p className="text-sm text-gray-400 dark:text-gray-500 pt-2 pb-1">Not available</p>
            }
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-center space-y-1 border border-gray-100 dark:border-gray-700/50">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">Gender</p>
            {result.gender != null
              ? <>
                  <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                    {result.gender === 'Male' ? '♂' : '♀'}
                  </p>
                  <p className="text-xs text-gray-400">{result.gender}</p>
                </>
              : <p className="text-sm text-gray-400 dark:text-gray-500 pt-2 pb-1">Not available</p>
            }
          </div>
        </div>

        {/* All region probabilities */}
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">All Region Probabilities</p>
          <div className="space-y-2.5">
            {result.allRegionPredictions?.map(({ label, confidence }) => {
              const m = REGION_META[label];
              const isTop = label === result.region;
              return (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`flex items-center gap-1.5 font-medium ${isTop ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                      <span>{m?.emoji}</span>
                      {label}
                      {isTop && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${m?.badge}`}>Top</span>}
                    </span>
                    <span className={`font-semibold ${isTop ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`}>
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${isTop ? `bg-gradient-to-r ${m?.bg}` : 'bg-gray-200 dark:bg-gray-700'}`}
                      style={{ width: `${Math.round(confidence * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-gray-300 dark:text-gray-600 text-center border-t border-gray-100 dark:border-gray-800 pt-4">
          Probabilistic estimate for educational purposes only
        </p>
      </div>
    </div>
  );
}
