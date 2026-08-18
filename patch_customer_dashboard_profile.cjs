const fs = require('fs');
let code = fs.readFileSync('src/pages/store/CustomerDashboard.tsx', 'utf8');

if (!code.includes("activeTab")) {
  // Add state
  code = code.replace(
    "const [orders, setOrders] = useState<any[]>([]);",
    "const [orders, setOrders] = useState<any[]>([]);\n  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');\n  const [profileData, setProfileData] = useState({ name: '', phone: '', address: '' });\n  const [savingProfile, setSavingProfile] = useState(false);"
  );

  // Add fetch profile
  code = code.replace(
    "const fetchOrders = async () => {",
    `const fetchProfile = async () => {
      try {
        const { getDoc, doc } = require('firebase/firestore');
        const userDoc = await getDoc(doc(db, 'users', user!.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData({
            name: data.name || user!.displayName || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        } else {
          setProfileData({ name: user!.displayName || '', phone: '', address: '' });
        }
      } catch (e) {
        console.error('Error fetching profile:', e);
      }
    };
    fetchProfile();
    const fetchOrders = async () => {`
  );

  // Add save handler
  const saveHandler = `
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { setDoc, doc } = require('firebase/firestore');
      await setDoc(doc(db, 'users', user!.uid), profileData, { merge: true });
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };
  `;
  code = code.replace(
    "const handleCancelRequest = async",
    saveHandler + "\n  const handleCancelRequest = async"
  );

  // Update Sidebar
  const sidebarLinks = `
              <button onClick={() => setActiveTab('orders')} className={\`text-[14px] font-black uppercase tracking-[0.1em] border-l-4 pl-[16px] py-[8px] text-left transition-colors \${activeTab === 'orders' ? 'text-primary border-primary bg-primary-container/10' : 'text-on-surface-variant border-transparent hover:text-on-surface'}\`}>
                ORDER HISTORY
              </button>
              <button onClick={() => setActiveTab('profile')} className={\`text-[14px] font-black uppercase tracking-[0.1em] border-l-4 pl-[16px] py-[8px] text-left transition-colors \${activeTab === 'profile' ? 'text-primary border-primary bg-primary-container/10' : 'text-on-surface-variant border-transparent hover:text-on-surface'}\`}>
                PROFILE SETTINGS
              </button>
  `;
  code = code.replace(
    /<Link to="\/account" className="text-\[14px\] font-black uppercase tracking-\[0\.1em\] text-primary border-l-4 border-primary pl-\[16px\] py-\[8px\] bg-primary-container\/10">[\s\S]*?<\/Link>/,
    sidebarLinks
  );

  // Update Main Content Rendering
  const oldMainContent = `<div className="flex-1">
          <h2 className="text-[32px] font-black uppercase tracking-tighter mb-[24px] text-on-surface leading-none border-b-2 border-surface-bright pb-4">ORDER HISTORY</h2>
          
          {loading ? (`;

  const newMainContent = `<div className="flex-1">
          <h2 className="text-[32px] font-black uppercase tracking-tighter mb-[24px] text-on-surface leading-none border-b-2 border-surface-bright pb-4">
            {activeTab === 'orders' ? 'ORDER HISTORY' : 'PROFILE SETTINGS'}
          </h2>
          
          {activeTab === 'profile' && (
            <div className="bg-surface-container-low border-2 border-surface-bright p-[32px]">
              <form onSubmit={handleSaveProfile} className="space-y-[24px] max-w-lg">
                <div>
                  <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[8px]">Full Name</label>
                  <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full bg-surface border-2 border-surface-bright p-[12px] text-[14px] text-on-background outline-none focus:border-primary font-bold" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[8px]">Phone Number</label>
                  <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-surface border-2 border-surface-bright p-[12px] text-[14px] text-on-background outline-none focus:border-primary font-bold" />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-[0.1em] font-bold text-on-surface-variant mb-[8px]">Delivery Address</label>
                  <textarea value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} className="w-full bg-surface border-2 border-surface-bright p-[12px] text-[14px] text-on-background outline-none focus:border-primary font-bold min-h-[100px]" />
                </div>
                <button type="submit" disabled={savingProfile} className="bg-primary text-on-primary px-[32px] py-[16px] text-[14px] font-black uppercase tracking-[0.1em] shadow-[4px_4px_0px_var(--color-on-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-background)] transition-all disabled:opacity-50">
                  {savingProfile ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <>
          {loading ? (`;
          
  const oldMainContentEnd = `                </motion.div>
              ))}
            </div>
          )}
        </div>`;

  const newMainContentEnd = `                </motion.div>
              ))}
            </div>
          )}
          </>
        )}
        </div>`;

  code = code.replace(oldMainContent, newMainContent);
  code = code.replace(oldMainContentEnd, newMainContentEnd);

  fs.writeFileSync('src/pages/store/CustomerDashboard.tsx', code);
  console.log("Customer Profile Added");
}
