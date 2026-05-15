import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { apiFetch, getAuthToken, clearAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut, User, Briefcase, Wrench, Link, GraduationCap,
  Plus, Pencil, Trash2, Check, X, ChevronDown, ChevronUp,
  ShieldCheck,
} from "lucide-react";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "links", label: "Links", icon: Link },
  { id: "education", label: "Education", icon: GraduationCap },
] as const;
type TabId = typeof TABS[number]["id"];

function useSaveToast() {
  const { toast } = useToast();
  return () => toast({ title: "Saved successfully", description: "Changes are live on your portfolio.", duration: 3000 });
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[#A0B3FF] text-sm">{label}</Label>
      {children}
    </div>
  );
}

const inputCls = "bg-[#0a0a1e] border-white/10 text-white placeholder:text-[#6B7C99] focus:border-primary/50";
const textareaCls = `${inputCls} resize-none`;

function ProfileTab() {
  const qc = useQueryClient();
  const showSave = useSaveToast();
  const { data } = useQuery<any>({ queryKey: ["admin-profile"], queryFn: () => apiFetch("/admin/profile") });
  const { register, handleSubmit, reset } = useForm<any>();
  useEffect(() => { if (data) reset(data); }, [data, reset]);
  const mut = useMutation({
    mutationFn: (v: any) => apiFetch("/admin/profile", { method: "PUT", body: JSON.stringify(v) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["portfolio"] }); showSave(); },
  });
  return (
    <SectionCard title="Profile Information">
      <form onSubmit={handleSubmit(v => mut.mutate(v))} className="space-y-4">
        <Field label="Full Name"><Input className={inputCls} {...register("name")} /></Field>
        <Field label="Role / Title"><Input className={inputCls} {...register("role")} /></Field>
        <Field label="Tagline"><Input className={inputCls} {...register("tagline")} /></Field>
        <Field label="About">
          <Textarea rows={5} className={textareaCls} {...register("about")} />
        </Field>
        <Button type="submit" disabled={mut.isPending} className="bg-primary text-[#0a0a1e] font-semibold hover:bg-primary/90">
          {mut.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </SectionCard>
  );
}

interface ProjectFormData {
  name: string;
  description: string;
  techRaw: string;
  featuresRaw: string;
  github: string;
  live: string;
}

function ProjectForm({ initial, onSave, onCancel }: { initial?: any; onSave: (v: any) => void; onCancel: () => void }) {
  const { register, handleSubmit } = useForm<ProjectFormData>({
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      techRaw: (initial?.tech ?? []).join(", "),
      featuresRaw: (initial?.features ?? []).join("\n"),
      github: initial?.github ?? "",
      live: initial?.live ?? "",
    },
  });
  const submit = (v: ProjectFormData) => {
    onSave({
      name: v.name,
      description: v.description,
      tech: v.techRaw.split(",").map(s => s.trim()).filter(Boolean),
      features: v.featuresRaw.split("\n").map(s => s.trim()).filter(Boolean),
      github: v.github,
      live: v.live,
    });
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 bg-[#0a0a1e] border border-white/10 rounded-xl p-5 mt-4">
      <Field label="Project Name"><Input className={inputCls} {...register("name", { required: true })} /></Field>
      <Field label="Description"><Textarea rows={3} className={textareaCls} {...register("description", { required: true })} /></Field>
      <Field label="Tech Stack (comma-separated)"><Input className={inputCls} placeholder="React, FastAPI, Python" {...register("techRaw")} /></Field>
      <Field label="Key Features (one per line)"><Textarea rows={4} className={textareaCls} placeholder="Feature 1&#10;Feature 2" {...register("featuresRaw")} /></Field>
      <Field label="GitHub URL"><Input className={inputCls} placeholder="https://github.com/..." {...register("github")} /></Field>
      <Field label="Live URL"><Input className={inputCls} placeholder="https://..." {...register("live")} /></Field>
      <div className="flex gap-3">
        <Button type="submit" size="sm" className="bg-primary text-[#0a0a1e] font-semibold hover:bg-primary/90">
          <Check className="w-4 h-4 mr-1" /> Save
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel} className="text-[#A0B3FF] hover:text-white">
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
      </div>
    </form>
  );
}

function ProjectsTab() {
  const qc = useQueryClient();
  const showSave = useSaveToast();
  const { toast } = useToast();
  const [editing, setEditing] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ["admin-projects"], queryFn: () => apiFetch("/admin/projects") });

  const createMut = useMutation({
    mutationFn: (v: any) => apiFetch("/admin/projects", { method: "POST", body: JSON.stringify(v) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); qc.invalidateQueries({ queryKey: ["portfolio"] }); setAdding(false); showSave(); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, ...v }: any) => apiFetch(`/admin/projects/${id}`, { method: "PUT", body: JSON.stringify(v) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); qc.invalidateQueries({ queryKey: ["portfolio"] }); setEditing(null); showSave(); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => apiFetch(`/admin/projects/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); qc.invalidateQueries({ queryKey: ["portfolio"] }); toast({ title: "Project deleted", duration: 2000 }); },
  });

  return (
    <SectionCard title="Projects">
      <div className="space-y-3">
        {(projects as any[]).map((p) => (
          <div key={p.id}>
            <div className="flex items-center justify-between p-4 bg-[#0a0a1e] border border-white/10 rounded-xl">
              <div>
                <p className="font-semibold text-white">{p.name}</p>
                <p className="text-sm text-[#6B7C99] mt-0.5 line-clamp-1">{p.description}</p>
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => setEditing(editing === p.id ? null : p.id)} className="w-8 h-8 text-[#A0B3FF] hover:text-white hover:bg-white/5">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteMut.mutate(p.id)} className="w-8 h-8 text-red-400/70 hover:text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {editing === p.id && (
              <ProjectForm initial={p} onSave={v => updateMut.mutate({ id: p.id, ...v })} onCancel={() => setEditing(null)} />
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <ProjectForm onSave={v => createMut.mutate(v)} onCancel={() => setAdding(false)} />
      ) : (
        <Button variant="outline" onClick={() => setAdding(true)} className="border-dashed border-white/20 text-[#A0B3FF] hover:text-white hover:border-white/40 hover:bg-white/5 w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      )}
    </SectionCard>
  );
}

function SkillsTab() {
  const qc = useQueryClient();
  const showSave = useSaveToast();
  const { data: skillRows = [] } = useQuery<any[]>({ queryKey: ["admin-skills"], queryFn: () => apiFetch("/admin/skills") });

  const { control, register, handleSubmit, reset } = useForm<{ skills: { category: string; skillsRaw: string }[] }>({
    defaultValues: { skills: [] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "skills" });

  useEffect(() => {
    if (skillRows.length > 0) {
      reset({ skills: skillRows.map((r: any) => ({ category: r.category, skillsRaw: r.skills.join(", ") })) });
    }
  }, [skillRows, reset]);

  const mut = useMutation({
    mutationFn: (v: any) => apiFetch("/admin/skills", {
      method: "PUT",
      body: JSON.stringify({ skills: v.skills.map((s: any) => ({ category: s.category, skills: s.skillsRaw.split(",").map((x: string) => x.trim()).filter(Boolean) })) }),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["portfolio"] }); showSave(); },
  });

  return (
    <SectionCard title="Skills">
      <form onSubmit={handleSubmit(v => mut.mutate(v))} className="space-y-4">
        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-3 items-start bg-[#0a0a1e] border border-white/10 rounded-xl p-4">
            <div className="flex-1 space-y-3">
              <Field label="Category Name">
                <Input className={inputCls} {...register(`skills.${i}.category`)} />
              </Field>
              <Field label="Skills (comma-separated)">
                <Input className={inputCls} placeholder="Python, JavaScript, SQL" {...register(`skills.${i}.skillsRaw`)} />
              </Field>
            </div>
            <button type="button" onClick={() => remove(i)} className="mt-6 p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => append({ category: "", skillsRaw: "" })} className="border-dashed border-white/20 text-[#A0B3FF] hover:text-white hover:border-white/40 hover:bg-white/5 w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
        <Button type="submit" disabled={mut.isPending} className="bg-primary text-[#0a0a1e] font-semibold hover:bg-primary/90">
          {mut.isPending ? "Saving..." : "Save Skills"}
        </Button>
      </form>
    </SectionCard>
  );
}

function LinksTab() {
  const qc = useQueryClient();
  const showSave = useSaveToast();
  const { data } = useQuery<any>({ queryKey: ["admin-links"], queryFn: () => apiFetch("/admin/links") });
  const { register, handleSubmit, reset } = useForm<any>();
  useEffect(() => { if (data) reset(data); }, [data, reset]);
  const mut = useMutation({
    mutationFn: (v: any) => apiFetch("/admin/links", { method: "PUT", body: JSON.stringify(v) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["portfolio"] }); showSave(); },
  });
  return (
    <SectionCard title="Social Links">
      <form onSubmit={handleSubmit(v => mut.mutate(v))} className="space-y-4">
        <Field label="GitHub URL"><Input className={inputCls} placeholder="https://github.com/..." {...register("github")} /></Field>
        <Field label="LinkedIn URL"><Input className={inputCls} placeholder="https://linkedin.com/in/..." {...register("linkedin")} /></Field>
        <Field label="Email Address"><Input className={inputCls} type="email" placeholder="you@email.com" {...register("email")} /></Field>
        <Button type="submit" disabled={mut.isPending} className="bg-primary text-[#0a0a1e] font-semibold hover:bg-primary/90">
          {mut.isPending ? "Saving..." : "Save Links"}
        </Button>
      </form>
    </SectionCard>
  );
}

function EducationTab() {
  const qc = useQueryClient();
  const showSave = useSaveToast();
  const { data } = useQuery<any>({ queryKey: ["admin-education"], queryFn: () => apiFetch("/admin/education") });
  const { register, handleSubmit, reset } = useForm<any>();
  useEffect(() => { if (data) reset(data); }, [data, reset]);
  const mut = useMutation({
    mutationFn: (v: any) => apiFetch("/admin/education", { method: "PUT", body: JSON.stringify(v) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["portfolio"] }); showSave(); },
  });
  return (
    <SectionCard title="Education">
      <form onSubmit={handleSubmit(v => mut.mutate(v))} className="space-y-4">
        <Field label="Degree / Program"><Input className={inputCls} placeholder="B.Tech in Computer Science" {...register("degree")} /></Field>
        <Field label="Institution"><Input className={inputCls} placeholder="University Name" {...register("institute")} /></Field>
        <Field label="Expected Year"><Input className={inputCls} placeholder="2025" {...register("year")} /></Field>
        <Button type="submit" disabled={mut.isPending} className="bg-primary text-[#0a0a1e] font-semibold hover:bg-primary/90">
          {mut.isPending ? "Saving..." : "Save Education"}
        </Button>
      </form>
    </SectionCard>
  );
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  useEffect(() => {
    if (!getAuthToken()) navigate("/admin");
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#0a0a1e]">
      <header className="border-b border-white/10 bg-[#111827]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Admin Panel</p>
              <p className="text-[#6B7C99] text-xs">Portfolio CMS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#A0B3FF] hover:text-white transition-colors hidden sm:block">
              View Portfolio
            </a>
            <Button size="sm" variant="ghost" onClick={handleLogout} className="text-[#6B7C99] hover:text-white hover:bg-white/5">
              <LogOut className="w-4 h-4 mr-1.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-[#6B7C99] hover:text-[#A0B3FF] hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "skills" && <SkillsTab />}
          {activeTab === "links" && <LinksTab />}
          {activeTab === "education" && <EducationTab />}
        </div>
      </div>
    </div>
  );
}
