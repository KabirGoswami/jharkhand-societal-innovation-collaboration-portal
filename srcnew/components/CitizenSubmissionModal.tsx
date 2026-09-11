import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Upload,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Send,
  Loader2,
  FileText,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { JHARKHAND_DISTRICTS, THEMATIC_DOMAINS } from '../data/jharkhandData';
import { DomainTheme, District, SubmitterType, ProblemStatement, AIAnalysisResult } from '../types';

interface CitizenSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProblem: ProblemStatement) => void;
}

export const CitizenSubmissionModal: React.FC<CitizenSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<DomainTheme>('water_resources');
  const [district, setDistrict] = useState<District>('Ranchi');
  const [blockOrPanchayat, setBlockOrPanchayat] = useState('');
  const [lat, setLat] = useState<number>(23.3441);
  const [lng, setLng] = useState<number>(85.3096);
  const [submitterName, setSubmitterName] = useState('');
  const [submitterType, setSubmitterType] = useState<SubmitterType>('gram_panchayat');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [urgency, setUrgency] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [affectedPopulation, setAffectedPopulation] = useState<number>(2500);
  const [description, setDescription] = useState('');
  const [priorAttempts, setPriorAttempts] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb18086f7?auto=format&fit=crop&w=800&q=80');

  // AI Analysis result cache
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [createdProblem, setCreatedProblem] = useState<ProblemStatement | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto-detect GPS
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(4)));
        setLng(Number(pos.coords.longitude.toFixed(4)));
        setGpsLoading(false);
        setGpsSuccess(true);
        setTimeout(() => setGpsSuccess(false), 3000);
      },
      (err) => {
        console.warn('Geolocation warning:', err.message);
        setGpsLoading(false);
        // Default to Ranchi coordinates
        setLat(23.3441);
        setLng(85.3096);
        setGpsSuccess(true);
      },
      { timeout: 8000 }
    );
  };

  // Trigger server-side AI evaluation
  const handleRunAiEvaluation = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both the Challenge Title and Problem Description first.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description + (priorAttempts ? ` [Prior Attempts: ${priorAttempts}]` : ''),
          district,
          blockOrPanchayat,
          domain,
          affectedPopulation,
          urgency,
        }),
      });
      const data = await res.json();
      setAiResult(data);
      setStep(3);
    } catch (err) {
      console.error('AI evaluation failed:', err);
      alert('Could not complete AI evaluation. You can still submit directly.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Final Submit
  const handleSubmitProblem = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description: description + (priorAttempts ? `\n\n[Prior Attempts & Root Causes: ${priorAttempts}]` : ''),
        domain,
        district,
        blockOrPanchayat: blockOrPanchayat || `${district} Block Cluster`,
        locationCoords: {
          lat,
          lng,
          address: `${blockOrPanchayat ? blockOrPanchayat + ', ' : ''}${district}, Jharkhand`,
        },
        submittedBy: {
          name: submitterName || 'Community Representative',
          type: submitterType,
          contact: contact || '+91 94311 00000',
          email: email || 'samadhan.jh@gov.in',
          organization: organization || undefined,
        },
        urgency,
        affectedPopulation: Number(affectedPopulation) || 1000,
        mediaUrls: [mediaUrl],
        videoUrl: videoUrl || undefined,
        aiAnalysis: aiResult || undefined,
      };

      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit challenge');
      }

      const problemData = await res.json();
      setCreatedProblem(problemData);
      onSuccess(problemData);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit problem. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingCode = () => {
    if (createdProblem?.trackingCode) {
      navigator.clipboard.writeText(createdProblem.trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div
        id="citizen-submission-modal-card"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full my-8 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-inner">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight">Submit Societal Challenge for Jharkhand</h2>
              <p className="text-xs text-slate-300">
                Panchayati Raj Institutions (PRIs), Urban Local Bodies (ULBs) & Citizens
              </p>
            </div>
          </div>
          <button
            id="btn-close-submission-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!createdProblem && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-medium text-slate-600">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-emerald-700 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
              <span>Challenge Essentials</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-emerald-700 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
              <span>Evidence & Context</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-700 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
              <span>AI Evaluation & Routing Preview</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {createdProblem ? (
            /* Success View */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Challenge Successfully Registered!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Your problem statement has been logged into the Jharkhand State Societal Innovation Registry and routed for institutional evaluation.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md mx-auto mb-6 text-left">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Permanent Tracking Code</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-lg font-bold text-emerald-800">{createdProblem.trackingCode}</span>
                  <button
                    onClick={copyTrackingCode}
                    className="inline-flex items-center gap-1 text-xs bg-white px-2.5 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <div className="mt-3 text-xs text-slate-600 pt-2 border-t border-slate-200 flex justify-between">
                  <span>District: <strong className="text-slate-800">{createdProblem.district}</strong></span>
                  <span>Domain: <strong className="text-slate-800">{createdProblem.domain}</strong></span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  View in Challenge Registry
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* Step 1: Essentials */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Challenge Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-challenge-title"
                  type="text"
                  placeholder="e.g., High Fluoride Contamination in Bundu Community Borewells"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Provide a concise, specific title highlighting the problem and location.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thematic Domain <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="select-challenge-domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as DomainTheme)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-600"
                  >
                    {THEMATIC_DOMAINS.map((td) => (
                      <option key={td.key} value={td.key}>
                        {td.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jharkhand District <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="select-challenge-district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value as District)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-600"
                  >
                    {JHARKHAND_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Block / Gram Panchayat / Municipal Ward <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-block-panchayat"
                    type="text"
                    placeholder="e.g., Bundu Block (Edalhatu & Kanchi Panchayats)"
                    value={blockOrPanchayat}
                    onChange={(e) => setBlockOrPanchayat(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>GPS Geographical Coordinates</span>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      disabled={gpsLoading}
                      className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{gpsLoading ? 'Detecting...' : gpsSuccess ? 'Detected!' : 'Detect GPS'}</span>
                    </button>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="Latitude (e.g. 23.1812)"
                      value={lat}
                      onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                      className="text-xs px-2.5 py-2 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="Longitude (e.g. 85.5864)"
                      value={lng}
                      onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                      className="text-xs px-2.5 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Submitter Details */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Submitter Entity & Contact</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Submitter Entity Type</label>
                    <select
                      value={submitterType}
                      onChange={(e) => setSubmitterType(e.target.value as SubmitterType)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="gram_panchayat">Gram Panchayat (PRI)</option>
                      <option value="citizen">Individual Citizen</option>
                      <option value="community_group">Community / SHG Group</option>
                      <option value="urban_local_body">Urban Local Body (ULB)</option>
                      <option value="govt_agency">Government Agency / Dept</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Contact Person Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramu Munda (Mukhiya)"
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Mobile Contact</label>
                    <input
                      type="text"
                      placeholder="+91 94311 00000"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Directly Affected Population (Estimate)
                  </label>
                  <input
                    type="number"
                    min="10"
                    placeholder="e.g., 2500 villagers"
                    value={affectedPopulation}
                    onChange={(e) => setAffectedPopulation(parseInt(e.target.value) || 0)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Problem Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Critical">Critical (Threat to health, life, or livelihood)</option>
                    <option value="High">High (Significant chronic distress)</option>
                    <option value="Medium">Medium (Affecting seasonal economic outcomes)</option>
                    <option value="Low">Low (Long-term infrastructure improvement)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            /* Step 2: Evidence & Context */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Narrative of the Societal Challenge <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="textarea-problem-description"
                  rows={4}
                  placeholder="Describe the ground realities in detail: What is happening? How many hamlets/villages are affected? What are the observable signs (e.g. crop failure, water discoloration, health disorders)? Who is impacted the most?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prior Attempts & Root Causes (Why did previous solutions fail?)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Alum filters installed in 2019 are non-functional due to lack of local media replacement; power grid fails during monsoon months..."
                  value={priorAttempts}
                  onChange={(e) => setPriorAttempts(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Photo / Image Evidence (URL or presets)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://image-url..."
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  {mediaUrl && (
                    <div className="mt-2 h-24 rounded border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img src={mediaUrl} alt="Evidence preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Video Demonstration Link (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="YouTube / Drive / Loom link"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                  <div className="mt-2 p-3 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-800">
                    <strong>Tip:</strong> Video recordings from Panchayats showing dry riverbeds, affected crops, or malfunctioning machines dramatically speed up university triage and incubation grant approvals.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Step 3: AI Analysis & Pre-Routing Preview */
            <div className="space-y-4">
              {aiResult ? (
                <div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>AI Classification & Validation Report</span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-emerald-700 text-white shadow-xs">
                        Priority Score: {aiResult.priorityScore}/100
                      </div>
                    </div>
                    <div className="text-xs text-emerald-900 mb-1">
                      <strong>Taxonomy:</strong> {aiResult.category} &rsaquo; {aiResult.subCategory}
                    </div>
                    <p className="text-xs text-emerald-800">{aiResult.socialImpactPotential}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {aiResult.thematicTags?.map((tag, i) => (
                        <span key={i} className="text-[10px] bg-white border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Deduplication check */}
                  {aiResult.duplicateMatches && aiResult.duplicateMatches.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-900">
                      <div className="flex items-center gap-1 font-bold mb-1 text-amber-950">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Similar Challenges Detected in Jharkhand</span>
                      </div>
                      <p className="text-[11px] text-amber-800 mb-2">
                        Our AI deduplication engine flagged existing submissions with overlapping causes. They will be clustered for collective university research.
                      </p>
                      <div className="space-y-1">
                        {aiResult.duplicateMatches.map((dm, idx) => (
                          <div key={idx} className="bg-white/80 p-1.5 rounded border border-amber-300/60 flex justify-between items-center text-[11px]">
                            <span className="truncate max-w-xs font-medium">{dm.title} ({dm.district})</span>
                            <span className="text-amber-700 font-bold whitespace-nowrap">{dm.similarity}% match</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Universities */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>Recommended Jharkhand Higher Education Institutions (HEIs)</span>
                    </h4>
                    <div className="space-y-2">
                      {aiResult.matchedHeis?.map((m, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 text-xs">
                          <div>
                            <div className="font-semibold text-slate-900">{m.universityName}</div>
                            <div className="text-blue-700 font-medium text-[11px] mb-1">{m.department}</div>
                            <p className="text-slate-600 text-[11px]">{m.reason}</p>
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <span className="inline-block bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[11px]">
                              {m.matchScore}% Match
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Tech & NEP Alignment */}
                  <div className="p-3 bg-slate-100 rounded-lg text-xs space-y-2 border border-slate-200">
                    <div>
                      <strong className="text-slate-800">Recommended Innovations:</strong>{' '}
                      <span className="text-slate-600">{aiResult.recommendedTech?.join(' • ')}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">NEP 2020 Framework Linkage:</strong>{' '}
                      <span className="text-slate-600">{aiResult.nepRelevance}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Estimated Prototype Budget Band:</strong>{' '}
                      <span className="text-emerald-700 font-semibold">{aiResult.estimatedBudgetBand}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-600 mb-4">
                    Run our server-side AI evaluation to automatically categorize, detect duplicates, and match with the top university research labs in Jharkhand.
                  </p>
                  <button
                    onClick={handleRunAiEvaluation}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isAnalyzing ? 'Running AI Engine...' : 'Run Automated AI Evaluation'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!createdProblem && (
          <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              {step === 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (!title.trim()) {
                      alert('Please provide a challenge title.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer"
                >
                  <span>Next: Evidence & Context</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRunAiEvaluation}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Run AI Evaluation</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitProblem}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Submit Directly</span>
                  </button>
                </div>
              )}

              {step === 3 && (
                <button
                  type="button"
                  onClick={handleSubmitProblem}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-6 py-2 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Confirm & Register Challenge</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
