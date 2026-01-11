import React, { useState } from 'react';
import { Bot, Sparkles, Upload, DollarSign, BrainCircuit, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const CreateAgentPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    role: 'design',
    rate: '5',
    personality: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate creation delay
    setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Agent training initiated! Your agent will be live in ~5 minutes.');
        // In a real app, this would POST to backend
        navigate('/agents');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
                <BrainCircuit className="w-8 h-8 text-cyan-400" />
                Train New Agent
            </h1>
            <p className="text-gray-400 mt-2">
                Create a specialized AI agent to work for you or others in the marketplace.
            </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 shadow-xl">
            {/* Progress Stepper */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10"></div>
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            step >= s ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-500'
                        }`}
                    >
                        {s}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold">Identity & Role</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. NeonDesigner v1"
                                className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 focus:border-cyan-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Primary Role</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['Design', 'Development', 'Writing', 'Moderation'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({...formData, role: role.toLowerCase()})}
                                        className={`p-4 rounded-xl border text-left transition-all ${
                                            formData.role === role.toLowerCase()
                                                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                                                : 'bg-black/30 border-gray-700 text-gray-400 hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className="font-bold">{role}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!formData.name}
                                className="px-6 py-3 bg-cyan-600 rounded-xl font-bold hover:bg-cyan-500 transition-colors disabled:opacity-50"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold">Knowledge & Personality</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">System Prompt / Personality</label>
                            <textarea
                                value={formData.personality}
                                onChange={(e) => setFormData({...formData, personality: e.target.value})}
                                placeholder="Describe how your agent should behave. E.g., 'You are a minimalist designer who loves neon accents...'"
                                rows={4}
                                className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 focus:border-cyan-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Knowledge Base</label>
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-500 transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">Upload PDF, TXT, or Code files to train your agent</p>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-gray-400 hover:text-white font-medium"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="px-6 py-3 bg-cyan-600 rounded-xl font-bold hover:bg-cyan-500 transition-colors"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold">Economics</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate (MNEE)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="number"
                                    value={formData.rate}
                                    onChange={(e) => setFormData({...formData, rate: e.target.value})}
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 pl-12 text-lg font-mono focus:border-green-500 outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Platform fee: 10%</p>
                        </div>

                        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6 rounded-xl border border-cyan-500/20">
                            <h3 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Agent Potential
                            </h3>
                            <p className="text-sm text-gray-300">
                                Based on your settings, this agent could earn an estimated <span className="text-white font-bold">50-200 MNEE/month</span> in the marketplace.
                            </p>
                        </div>

                        <div className="pt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="text-gray-400 hover:text-white font-medium"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? 'Training Model...' : 'Launch Agent'}
                                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAgentPage;
