// src/components/profile/ProfileView.tsx
import React, { useEffect, useState } from 'react';
import { useProfileStore } from '../../store/profileStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { User, ShieldCheck, Settings, Wallet, Users, Layout, Search } from 'lucide-react';
import { UserProToggle } from '../admin/UserProToggle';
import { supabase } from '../../lib/supabase';

export const ProfileView = () => {
  const { profile, isAdmin, isPro } = useProfileStore();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setAllUsers(data);
    setLoadingUsers(false);
  };

  const filteredUsers = allUsers.filter(u => 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.user_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!profile) return <div className="p-20 text-center font-mono">INITIALIZING_NEURAL_LINK...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER SECTION */}
      <div className="relative h-64 bg-zinc-900 overflow-hidden">
        {profile.banner_url ? (
          <img src={profile.banner_url} className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black" />
        )}
        
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="w-32 h-32 rounded-2xl border-4 border-black bg-zinc-800 overflow-hidden">
            <img src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} referrerPolicy="no-referrer" />
          </div>
          <div className="pb-4">
            <h1 className="text-3xl font-black flex items-center gap-2">
              {profile.display_name} 
              {profile.verified && <ShieldCheck className="text-blue-500" size={20} />}
            </h1>
            <p className="text-zinc-500 font-mono text-sm">@{profile.username}</p>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="max-w-7xl mx-auto px-8 mt-24">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 mb-8 overflow-x-auto">
            <TabsTrigger value="overview" className="gap-2"><User size={14}/> OVERVIEW</TabsTrigger>
            <TabsTrigger value="content" className="gap-2"><Layout size={14}/> CONTENT</TabsTrigger>
            {isPro && <TabsTrigger value="wallet" className="gap-2 text-orange-500"><Wallet size={14}/> VAULT</TabsTrigger>}
            {isPro && <TabsTrigger value="affiliate" className="gap-2 text-orange-500"><Users size={14}/> AFFILIATE</TabsTrigger>}
            <TabsTrigger value="settings" className="gap-2"><Settings size={14}/> SETTINGS</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin" className="gap-2 text-red-500 font-bold underline">COMMAND_ADMIN</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview">
             <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 p-8 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
                   <h3 className="text-xs font-mono text-zinc-500 uppercase mb-4">Bio</h3>
                   <p className="text-lg font-light">{profile.bio || "No mission statement defined."}</p>
                </div>
                {/* Statistics Card */}
                <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
                   <h3 className="text-xs font-mono text-zinc-500 uppercase mb-4">Neural Stats</h3>
                   <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-zinc-400"><span>Tier</span><span className="text-white">Level {profile.affiliate_tier}</span></div>
                      <div className="flex justify-between text-zinc-400"><span>Status</span><span className={isPro ? "text-orange-500" : "text-zinc-600"}>{isPro ? "PRO_ACTIVE" : "STANDARD"}</span></div>
                   </div>
                </div>
             </div>
          </TabsContent>

          {/* ADMIN TABS: Where the "Switch" lives */}
          <TabsContent value="admin">
             <div className="p-8 border border-red-900/30 bg-red-900/5 rounded-3xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-red-500">ADMIN_GATEKEEPER</h2>
                    <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Neural Tier Management Protocol</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input 
                      type="text" 
                      placeholder="SEARCH_USER_ID..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono outline-none focus:border-red-500/50 transition-all w-64"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                   {loadingUsers ? (
                     <div className="py-10 text-center font-mono text-xs animate-pulse">SCANNING_NEURAL_DATABASE...</div>
                   ) : filteredUsers.length > 0 ? (
                     <div className="grid gap-3">
                       {filteredUsers.map((u) => (
                         <div key={u.user_id} className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800 rounded-2xl hover:border-red-500/20 transition-all group">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden">
                               <img src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} referrerPolicy="no-referrer" />
                             </div>
                             <div>
                               <div className="flex items-center gap-2">
                                 <span className="text-sm font-bold">{u.display_name || u.username}</span>
                                 {u.is_admin && <span className="text-[8px] px-1.5 py-0.5 bg-red-500 text-white rounded font-black">ADMIN</span>}
                               </div>
                               <p className="text-[10px] text-zinc-600 font-mono">ID: {u.user_id.slice(0, 8)}...</p>
                             </div>
                           </div>
                           <UserProToggle userId={u.user_id} initialStatus={u.is_pro} />
                         </div>
                       ))}
                     </div>
                   ) : (
                     <p className="text-sm text-zinc-500 italic text-center py-10">"No neural signatures found matching your query."</p>
                   )}
                </div>
             </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
             <div className="max-w-2xl space-y-8">
                <section>
                   <h3 className="text-lg font-bold mb-4">Account Settings</h3>
                   {/* Forms for display_name, location, etc. */}
                   <p className="text-zinc-500 italic">Settings module initializing...</p>
                </section>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
