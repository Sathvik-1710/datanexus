"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Plus, X, Loader2, LogOut, LayoutDashboard, Users, Calendar, Download, Trash2,
    Edit3 as Edit, Settings, Save, Search, FolderGit2, Trophy, Group, Lock,
    Image as ImageIcon, ExternalLink, ChevronRight, CheckCircle2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ──────────────────────────────────────────────────────────────────────────
   TYPES
   ────────────────────────────────────────────────────────────────────────── */
type Registration = {
    id: number;
    name: string;
    roll_no: string;
    year: string;
    department: string;
    sub_group: string;
    created_at: string;
};

type Event = {
    id: string;
    slug: string;
    title: string;
    date: string;
    images: string[];
    description: string;
    link_url?: string;
};

type Project = {
    id: string;
    slug: string;
    title: string;
    description: string;
    github_url?: string;
    linkedin_url?: string;
    live_url?: string;
    images: string[];
};

type TeamMember = {
    id: string;
    slug: string;
    name: string;
    role: string;
    photo: string;
    bio: string;
    linkedin: string;
    order: number;
};

type FacultyMember = {
    id: string;
    slug: string;
    name: string;
    designation: string;
    photo: string;
    is_hod: boolean;
    order: number;
};

type SiteSettings = {
    id: string;
    tagline: string;
    years_active: number;
    founded_year: number;
    instagram: string;
    linkedin: string;
    github: string;
};

export default function SuperAdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState<"registrations" | "events" | "projects" | "team" | "faculty" | "settings">("registrations");


    // UI States
    const [loading, setLoading] = useState(false);
    const [isUploadingFile, setIsUploadingFile] = useState(false); // New lock state
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Data States
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [faculty, setFaculty] = useState<FacultyMember[]>([]);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    // Edit/Modal States
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    /* ──────────────────────────────────────────────────────────────────────────
       AUTH LOGIC
       ────────────────────────────────────────────────────────────────────────── */
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "sathvik2005") {
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Incorrect administrator password.");
        }
    };

    /* ──────────────────────────────────────────────────────────────────────────
       FETCH LOGIC
       ────────────────────────────────────────────────────────────────────────── */
    // Improved Tab Switcher (Clears old data to prevent leakage)
    const handleTabChange = (tab: typeof activeTab) => {
        setIsModalOpen(false);
        setEditingItem(null);
        setError("");
        setSuccessMsg("");
        setActiveTab(tab);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAllData();
        }
    }, [isAuthenticated, activeTab]);

    async function fetchAllData() {
        setLoading(true);
        try {
            if (activeTab === "registrations") {
                const { data } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
                setRegistrations(data || []);
            } else if (activeTab === "events") {
                const { data } = await supabase.from('events').select('*').order('date', { ascending: false });
                setEvents(data || []);
            } else if (activeTab === 'projects') {
                const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
                setProjects(data || []);
            } else if (activeTab === "team") {
                const { data } = await supabase.from('team').select('*').order('order', { ascending: true });
                setTeam(data || []);
            } else if (activeTab === "faculty") {
                const { data } = await supabase.from('faculty').select('*').order('order', { ascending: true });
                setFaculty(data || []);
            } else if (activeTab === "settings") {
                const { data } = await supabase.from('settings').select('*');
                setSettings(data?.[0] || null);
            }
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    /* ──────────────────────────────────────────────────────────────────────────
       CRUD ACTIONS
       ────────────────────────────────────────────────────────────────────────── */
    async function handleDelete(id: any) {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            const { error } = await supabase.from(activeTab).delete().eq('id', id);
            if (error) throw error;
            showSuccess("Deleted successfully.");
            fetchAllData();
        } catch (err: any) {
            setError(err.message);
        }
    }


    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const rawData = Object.fromEntries(formData) as any;
            const cleanData: any = { ...rawData };

            // --- UNIVERSAL IMAGE NORMALIZATION ---
            // Fix for 'images' (Array)
            if (cleanData.images !== undefined) {
                const raw = cleanData.images || "";
                const arr = typeof raw === 'string'
                    ? raw.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : raw;
                cleanData.images = (Array.isArray(arr) && arr.length > 0) ? arr : null;
            }

            // Fix for 'photo' (Single String)
            if (cleanData.photo !== undefined) {
                cleanData.photo = cleanData.photo === "" ? null : cleanData.photo;
            }

            // --- DATA CLEANUP ---
            if (!cleanData.id || cleanData.id === "" || cleanData.id === "undefined") delete cleanData.id;
            if (cleanData.is_hod !== undefined) cleanData.is_hod = cleanData.is_hod === "on" || cleanData.is_hod === "true";
            if (cleanData.order) cleanData.order = parseInt(cleanData.order) || 0;
            if (cleanData.years_active) cleanData.years_active = parseInt(cleanData.years_active) || 0;
            if (cleanData.founded_year) cleanData.founded_year = parseInt(cleanData.founded_year) || 0;

            // Global Empty String Cleanup
            Object.keys(cleanData).forEach(key => {
                if (cleanData[key] === "") cleanData[key] = null;
            });

            console.log("FINAL DATA TO SAVE:", cleanData);

            const conflictCol = cleanData.id ? 'id' : 'slug';
            const { error: dbError } = await supabase.from(activeTab).upsert(cleanData, {
                onConflict: activeTab === 'settings' ? 'id' : conflictCol
            });

            if (dbError) {
                console.error("Supabase Save Error:", dbError);
                alert(`❌ Database Rejected Changes: ${dbError.message}\n\nHint: Make sure the 'uploads' bucket is Public in Supabase Storage.`);
                throw dbError;
            }

            // --- CACHE REFRESH ---
            try {
                await fetch('/api/revalidate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: activeTab === 'events' ? '/events' :
                            activeTab === 'projects' ? '/projects' :
                                activeTab === 'team' ? '/team' : '/'
                    })
                });
            } catch (revalErr) { /* ignore reval timeout */ }

            showSuccess("Changes saved successfully!");
            setIsModalOpen(false);
            setEditingItem(null);
            fetchAllData();
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            console.error("Save Error:", err);
        } finally {
            setLoading(false);
        }
    }



    const downloadRegistrationsCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,Roll Number,Full Name,Year,Department,Sub-Group,Date\n";
        registrations.forEach(r => {
            csvContent += `"${r.roll_no}","${r.name}","${r.year}","${r.department}","${r.sub_group}","${new Date(r.created_at).toLocaleString()}"\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Data_Nexus_Members_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    /* ──────────────────────────────────────────────────────────────────────────
       UI COMPONENTS
       ────────────────────────────────────────────────────────────────────────── */
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[grid-white/[0.02]]">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8 bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                    <div className="text-center space-y-2">
                        <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                            <Lock size={30} />
                        </div>
                        <h1 className="text-2xl font-bold">Club Admin Login</h1>
                        <p className="text-gray-500 text-sm">Welcome back, Sathvik. Please verify your credentials.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                        />
                        {error && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
                        <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">Unlock Dashboard</button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row bg-[grid-white/[0.01]]">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-72 border-r border-white/10 bg-black/50 backdrop-blur-2xl p-6 flex flex-col gap-8 z-20">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">DN</div>
                    <div className="flex flex-col">
                        <span className="font-bold tracking-widest text-sm">DATA NEXUS</span>
                        <span className="text-[8px] text-gray-600 font-mono uppercase tracking-widest mt-0.5">System v2.2</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    <NavItem active={activeTab === 'registrations'} icon={<Users size={18} />} label="Registrations" onClick={() => handleTabChange('registrations')} />
                    <NavItem active={activeTab === 'events'} icon={<Calendar size={18} />} label="Events" onClick={() => handleTabChange('events')} />
                    <NavItem active={activeTab === 'projects'} icon={<FolderGit2 size={18} />} label="Project Showcase" onClick={() => handleTabChange('projects')} />
                    <NavItem active={activeTab === 'team'} icon={<Group size={18} />} label="Team" onClick={() => handleTabChange('team')} />
                    <NavItem active={activeTab === 'faculty'} icon={<Trophy size={18} />} label="Faculty" onClick={() => handleTabChange('faculty')} />
                    <NavItem active={activeTab === 'settings'} icon={<Settings size={18} />} label="Site Settings" onClick={() => handleTabChange('settings')} />
                </nav>

                <div className="mt-auto pt-8 border-t border-white/10">
                    <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 text-gray-500 hover:text-white transition w-full p-2">
                        <LogOut size={18} /> <span className="text-sm font-medium">Log out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto pt-24 md:pt-12">
                <div className="max-w-6xl mx-auto space-y-8">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage, update, and monitor your club's data in real-time.</p>
                        </div>
                        <div className="flex gap-3">
                            {activeTab === 'registrations' && (
                                <button onClick={downloadRegistrationsCSV} className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-xl transition font-medium">
                                    <Download size={18} /> Export CSV
                                </button>
                            )}
                            {activeTab !== 'registrations' && activeTab !== 'settings' && (
                                <button
                                    onClick={() => { setEditingItem({}); setIsModalOpen(true); }}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition font-medium text-white"
                                >
                                    <Plus size={18} /> Add New {activeTab === 'team' ? 'Member' : 'Item'}
                                </button>
                            )}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {successMsg && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3">
                                <CheckCircle2 size={18} /> {successMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activeTab === 'registrations' && <RegistrationsTable data={registrations} />}
                            {activeTab === 'events' && <EventsGrid data={events} onEdit={(ev: Event) => { setEditingItem(ev); setIsModalOpen(true); }} onDelete={handleDelete} />}
                            {activeTab === 'projects' && <ProjectsGrid data={projects} onEdit={(it: Project) => { setEditingItem(it); setIsModalOpen(true); }} onDelete={handleDelete} />}
                            {activeTab === 'team' && <GenericTable data={team} onEdit={(it: TeamMember) => { setEditingItem(it); setIsModalOpen(true); }} onDelete={handleDelete} type="team" />}
                            {activeTab === 'faculty' && <GenericTable data={faculty} onEdit={(it: FacultyMember) => { setEditingItem(it); setIsModalOpen(true); }} onDelete={handleDelete} type="faculty" />}
                            {activeTab === 'settings' && <SettingsForm initialData={settings} onSave={fetchAllData} />}
                        </div>
                    )}
                </div>
            </main>

            {/* Editor Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold">Edit {activeTab}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition"><X /></button>
                            </div>

                            <form key={editingItem?.id || 'new'} onSubmit={handleSave} className="p-8 space-y-6 flex flex-col min-h-full">
                                {/* Hidden ID for updates */}
                                {editingItem?.id && <input type="hidden" name="id" value={editingItem.id} />}

                                {activeTab === 'events' && (
                                    <>

                                        <Input label="Title" name="title" defaultValue={editingItem?.title} required />
                                        <Input label="URL Slug" name="slug" defaultValue={editingItem?.slug} placeholder="e.g. ai-workshop-2026" required />
                                        <Input label="Date" name="date" type="date" defaultValue={editingItem?.date} required />
                                        <FileUploader label="Event Images" name="images" defaultValue={editingItem?.images} multiple={true} onUploadStart={() => setIsUploadingFile(true)} onUploadEnd={() => setIsUploadingFile(false)} onSuccess={showSuccess} onError={setError} />
                                        <Input label="Event Resource / Registration Link" name="link_url" defaultValue={editingItem?.link_url} placeholder="e.g. Google Docs, Form, or Hackathon link" />
                                        <TextArea label="Description" name="description" defaultValue={editingItem?.description} />
                                    </>
                                )}

                                {activeTab === 'projects' && (
                                    <>
                                        <Input label="Project Title" name="title" defaultValue={editingItem?.title} required />
                                        <Input label="URL Slug" name="slug" defaultValue={editingItem?.slug} required />
                                        <Input label="GitHub Repo Link" name="github_url" defaultValue={editingItem?.github_url} />
                                        <Input label="LinkedIn/Post Link" name="linkedin_url" defaultValue={editingItem?.linkedin_url} />
                                        <Input label="Live Demo Link" name="live_url" defaultValue={editingItem?.live_url} />
                                        <FileUploader key={editingItem?.id || 'new'} label="Project Showcase (Carousel Images)" name="images" defaultValue={editingItem?.images} multiple={true} onUploadStart={() => setIsUploadingFile(true)} onUploadEnd={() => setIsUploadingFile(false)} onSuccess={showSuccess} onError={setError} />
                                        <TextArea label="Project Description" name="description" defaultValue={editingItem?.description} />
                                    </>
                                )}

                                {activeTab === 'team' && (
                                    <>
                                        <Input label="Full Name" name="name" defaultValue={editingItem?.name} required />
                                        <Input label="URL Name" name="slug" defaultValue={editingItem?.slug} required />
                                        <Input label="Designation / Role" name="role" defaultValue={editingItem?.role} required />
                                        <FileUploader label="Profile Photo" name="photo" defaultValue={editingItem?.photo} onUploadStart={() => setIsUploadingFile(true)} onUploadEnd={() => setIsUploadingFile(false)} onSuccess={showSuccess} onError={setError} />
                                        <Input label="LinkedIn URL" name="linkedin" defaultValue={editingItem?.linkedin} />
                                        <Input label="Sort Order" name="order" type="number" defaultValue={editingItem?.order || 0} />
                                        <TextArea label="Short Bio" name="bio" defaultValue={editingItem?.bio} />
                                    </>
                                )}

                                {activeTab === 'faculty' && (
                                    <>
                                        <Input label="Faculty Name" name="name" defaultValue={editingItem?.name} required />
                                        <Input label="Slug" name="slug" defaultValue={editingItem?.slug} required />
                                        <Input label="Designation" name="designation" defaultValue={editingItem?.designation} required />
                                        <FileUploader label="Profile Photo" name="photo" defaultValue={editingItem?.photo} onUploadStart={() => setIsUploadingFile(true)} onUploadEnd={() => setIsUploadingFile(false)} onSuccess={showSuccess} onError={setError} />
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" name="is_hod" defaultChecked={editingItem?.is_hod} className="w-4 h-4" />
                                            <label className="text-sm font-medium">Head of Department (HOD)</label>
                                        </div>
                                        <Input label="Sort Order" name="order" type="number" defaultValue={editingItem?.order || 0} />
                                    </>
                                )}

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition">Cancel</button>
                                    <button type="submit" disabled={loading || isUploadingFile} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? "Saving..." : isUploadingFile ? "Wait for Upload..." : "Apply Changes Now"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
                }
            </AnimatePresence >
        </div >
    );
}

/* ──────────────────────────────────────────────────────────────────────────
   HELPER COMPONENTS
   ────────────────────────────────────────────────────────────────────────── */

async function uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`Uploading file to storage: ${filePath}`);

    const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Storage Error:", uploadError);
        throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

    return publicUrl;
}

function FileUploader({ label, name, defaultValue, multiple = false, onUploadStart, onUploadEnd, onSuccess, onError }: any) {
    const [uploading, setUploading] = useState(false);
    const [urls, setUrls] = useState<string[]>(
        Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [defaultValue] : [])
    );

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        if (onUploadStart) onUploadStart();

        try {
            const uploadedUrls: string[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const url = await uploadImage(e.target.files[i]);
                uploadedUrls.push(url);
                if (!multiple) break;
            }

            setUrls(prev => {
                const newUrls = multiple ? [...prev, ...uploadedUrls] : [uploadedUrls[uploadedUrls.length - 1]];
                return newUrls;
            });

            if (onSuccess) onSuccess("Image uploaded successfully.");
        } catch (err: any) {
            if (onError) onError(`Upload failed: ${err.message || "Unknown error"}. Check Supabase 'uploads' bucket.`);
            console.error("Upload Error:", err);
        } finally {
            setUploading(false);
            if (onUploadEnd) onUploadEnd();
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</label>

            <div className="flex flex-wrap gap-3">
                {urls.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 group">
                        <img src={url} className="w-full h-full object-cover rounded-xl border border-white/10" />
                        <button
                            type="button"
                            onClick={() => setUrls(urls.filter((_, i) => i !== idx))}
                            className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}

                <label className={`w-20 h-20 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition hover:border-blue-500/50 ${uploading ? 'animate-pulse' : ''}`}>
                    <Plus className="text-gray-500" />
                    <input type="file" className="hidden" accept="image/*" multiple={multiple} onChange={handleFileChange} disabled={uploading} />
                </label>
            </div>

            <input type="hidden" name={name} value={multiple ? urls.join(',') : (urls[0] || '')} />
            <p className="text-[10px] text-gray-600">Supports PNG, JPG, WEBP. Max 5MB recommended.</p>
        </div>
    );
}

function NavItem({ active, icon, label, onClick }: any) {
    return (
        <button onClick={onClick} className={`flex items-center gap-4 p-3 rounded-xl transition ${active ? 'bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
            {icon} <span className="text-sm">{label}</span>
        </button>
    );
}

function Input({ label, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</label>
            <input {...props} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition" />
        </div>
    );
}

function TextArea({ label, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</label>
            <textarea {...props} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition resize-none" />
        </div>
    );
}

function RegistrationsTable({ data }: { data: Registration[] }) {
    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-white/10">
                    <tr>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Roll</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Sub-Group</th>
                        <th className="px-6 py-4 text-right">Registered</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                    {data.map(r => (
                        <tr key={r.id} className="text-sm hover:bg-white/5 transition">
                            <td className="px-6 py-4 font-semibold">{r.name}</td>
                            <td className="px-6 py-4 text-gray-500 font-mono">{r.roll_no}</td>
                            <td className="px-6 py-4 text-gray-400">{r.department}</td>
                            <td className="px-6 py-4">
                                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-500/10">
                                    {r.sub_group}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-gray-600 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ProjectsGrid({ data, onEdit, onDelete }: any) {
    if (data.length === 0) return <div className="p-12 text-center text-gray-500 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">No projects in the showcase yet. Add one to get started!</div>;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((it: any) => (
                <div key={it.id} className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition group">
                    <div className="h-48 bg-white/5 relative">
                        {it.images?.[0] ? (
                            <img src={it.images[0]} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-600"><ImageIcon size={40} /></div>
                        )}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => onEdit(it)} className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-blue-600 transition"><Edit size={16} /></button>
                            <button onClick={() => onDelete(it.id)} className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-red-600 transition"><Trash2 size={16} /></button>
                        </div>
                    </div>
                    <div className="p-6">
                        <h4 className="font-bold text-lg">{it.title}</h4>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{it.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function EventsGrid({ data, onEdit, onDelete }: any) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((ev: any) => (
                <div key={ev.slug} className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 space-y-4 group">
                    <div className="h-40 bg-gray-900 rounded-2xl overflow-hidden relative">
                        {ev.images?.[0] ? <img src={ev.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="text-gray-800" size={40} /></div>}
                        <div className="absolute top-3 right-3 flex gap-2">
                            <button onClick={() => onEdit(ev)} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition"><Edit size={16} /></button>
                            <button onClick={() => onDelete(ev.id)} className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition"><Trash2 size={16} /></button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold truncate">{ev.title}</h4>
                        <p className="text-xs text-blue-400 font-medium">{new Date(ev.date).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function GenericTable({ data, onEdit, onDelete, type }: any) {
    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-white/10">
                    <tr>
                        <th className="px-6 py-4">Name / Info</th>
                        <th className="px-6 py-4">Role / Detail</th>
                        <th className="px-6 py-4">Photos</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                    {data.map((it: any) => (
                        <tr key={it.slug} className="text-sm hover:bg-white/5 transition">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-900 overflow-hidden flex-shrink-0">
                                        <img src={it.photo} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{it.name}</p>
                                        <p className="text-[10px] text-gray-500 font-mono tracking-tighter">/{it.slug}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                                {type === 'faculty' ? it.designation : it.role}
                                {it.is_hod && <span className="ml-2 text-[8px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">HOD</span>}
                            </td>
                            <td className="px-6 py-4 text-blue-500">
                                {it.photo ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <button onClick={() => onEdit(it)} className="p-2 text-gray-400 hover:text-white transition"><Edit size={16} /></button>
                                <button onClick={() => onDelete(it.id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function SettingsForm({ initialData, onSave }: any) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(formData);

        try {
            const { error } = await supabase.from('settings').upsert({
                id: 'general',
                ...data,
            });
            if (error) throw error;
            alert("Settings updated!");
            onSave();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 max-w-2xl space-y-6">
            <h4 className="text-xl font-bold mb-4">Global Site Settings</h4>
            <TextArea label="Club Tagline" name="tagline" defaultValue={initialData?.tagline} />
            <div className="grid grid-cols-2 gap-6">
                <Input label="Years Active" name="years_active" type="number" defaultValue={initialData?.years_active} />
                <Input label="Founded Year" name="founded_year" type="number" defaultValue={initialData?.founded_year} />
            </div>
            <hr className="border-white/5 my-6" />
            <Input label="Instagram URL" name="instagram" defaultValue={initialData?.instagram} />
            <Input label="LinkedIn URL" name="linkedin" defaultValue={initialData?.linkedin} />
            <Input label="GitHub URL" name="github" defaultValue={initialData?.github} />
            <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl mt-4 hover:bg-blue-700 transition">
                {loading ? "Updating..." : "Save Configuration"}
            </button>
        </form>
    );
}
