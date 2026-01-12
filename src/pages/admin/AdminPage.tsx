import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Tab } from '@headlessui/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const AdminPage = () => {
  const [proposal, setProposal] = useState({ title: '', description: '', end_date: '', tags: '' });
  const [tier, setTier] = useState({ name: '', price: 0, mnee_bonus: 0, features: '' });
  const [module, setModule] = useState({ title: '', video_url: '', category: '' });
  const [steps, setSteps] = useState([{ title: '', content: '', order: 1 }]);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('proposals').insert({
      ...proposal,
      tags: proposal.tags.split(',').map(t => t.trim()),
      status: 'Active'
    });
    if (error) toast.error(error.message);
    else {
        toast.success('Proposal created!');
        setProposal({ title: '', description: '', end_date: '', tags: '' });
    }
  };

  const handleCreateTier = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('subscription_tiers').insert({
      ...tier,
      features: tier.features.split('\n').filter(Boolean)
    });
    if (error) toast.error(error.message);
    else {
        toast.success('Tier created!');
        setTier({ name: '', price: 0, mnee_bonus: 0, features: '' });
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Create Module
    const { data: modData, error: modError } = await supabase.from('learning_modules').insert(module).select().single();

    if (modError || !modData) {
        toast.error(modError?.message || 'Failed to create module');
        return;
    }

    // 2. Create Steps
    const stepsData = steps.map(s => ({ ...s, module_id: modData.id }));
    const { error: stepError } = await supabase.from('learning_steps').insert(stepsData);

    if (stepError) toast.error('Module created, but steps failed: ' + stepError.message);
    else {
        toast.success('Learning Module & Steps created!');
        setModule({ title: '', video_url: '', category: '' });
        setSteps([{ title: '', content: '', order: 1 }]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-purple-400">Admin Console</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/50 p-1 mb-8 max-w-md">
          {['Governance', 'Monetization', 'Learning'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white/60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-gray-400 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* Governance Panel */}
          <Tab.Panel className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Create Proposal</h2>
            <form onSubmit={handleCreateProposal} className="space-y-4">
                <input
                    type="text" placeholder="Title" className="w-full p-3 bg-black border border-gray-700 rounded"
                    value={proposal.title} onChange={e => setProposal({...proposal, title: e.target.value})} required
                />
                <textarea
                    placeholder="Description" className="w-full p-3 bg-black border border-gray-700 rounded" rows={3}
                    value={proposal.description} onChange={e => setProposal({...proposal, description: e.target.value})} required
                />
                <input
                    type="date" className="w-full p-3 bg-black border border-gray-700 rounded text-white"
                    value={proposal.end_date} onChange={e => setProposal({...proposal, end_date: e.target.value})} required
                />
                <input
                    type="text" placeholder="Tags (comma separated)" className="w-full p-3 bg-black border border-gray-700 rounded"
                    value={proposal.tags} onChange={e => setProposal({...proposal, tags: e.target.value})}
                />
                <button type="submit" className="px-6 py-2 bg-green-600 rounded font-bold hover:bg-green-500">Create Proposal</button>
            </form>
          </Tab.Panel>

          {/* Monetization Panel */}
          <Tab.Panel className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Create Subscription Tier</h2>
            <form onSubmit={handleCreateTier} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text" placeholder="Tier Name" className="w-full p-3 bg-black border border-gray-700 rounded"
                        value={tier.name} onChange={e => setTier({...tier, name: e.target.value})} required
                    />
                    <input
                        type="number" placeholder="Price ($)" className="w-full p-3 bg-black border border-gray-700 rounded"
                        value={tier.price} onChange={e => setTier({...tier, price: parseFloat(e.target.value)})} required
                    />
                </div>
                <input
                    type="number" placeholder="MNEE Bonus" className="w-full p-3 bg-black border border-gray-700 rounded"
                    value={tier.mnee_bonus} onChange={e => setTier({...tier, mnee_bonus: parseInt(e.target.value)})} required
                />
                <textarea
                    placeholder="Features (one per line)" className="w-full p-3 bg-black border border-gray-700 rounded" rows={4}
                    value={tier.features} onChange={e => setTier({...tier, features: e.target.value})} required
                />
                <button type="submit" className="px-6 py-2 bg-green-600 rounded font-bold hover:bg-green-500">Create Tier</button>
            </form>
          </Tab.Panel>

          {/* Learning Panel */}
          <Tab.Panel className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Create Learning Module</h2>
            <form onSubmit={handleCreateModule} className="space-y-6">
                <div className="space-y-4">
                    <input
                        type="text" placeholder="Module Title" className="w-full p-3 bg-black border border-gray-700 rounded"
                        value={module.title} onChange={e => setModule({...module, title: e.target.value})} required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Video URL" className="w-full p-3 bg-black border border-gray-700 rounded"
                            value={module.video_url} onChange={e => setModule({...module, video_url: e.target.value})}
                        />
                        <input
                            type="text" placeholder="Category" className="w-full p-3 bg-black border border-gray-700 rounded"
                            value={module.category} onChange={e => setModule({...module, category: e.target.value})}
                        />
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                    <h3 className="font-bold mb-2">Steps</h3>
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex gap-2 mb-2 items-start">
                            <span className="pt-3 text-gray-500">{idx + 1}.</span>
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text" placeholder="Step Title" className="w-full p-2 bg-black/50 border border-gray-700 rounded text-sm"
                                    value={step.title}
                                    onChange={e => {
                                        const newSteps = [...steps];
                                        newSteps[idx].title = e.target.value;
                                        setSteps(newSteps);
                                    }}
                                    required
                                />
                                <input
                                    type="text" placeholder="Step Content/Description" className="w-full p-2 bg-black/50 border border-gray-700 rounded text-sm"
                                    value={step.content}
                                    onChange={e => {
                                        const newSteps = [...steps];
                                        newSteps[idx].content = e.target.value;
                                        setSteps(newSteps);
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setSteps(steps.filter((_, i) => i !== idx))}
                                className="p-2 text-red-500 hover:bg-red-900/20 rounded"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setSteps([...steps, { title: '', content: '', order: steps.length + 1 }])}
                        className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                        <PlusIcon className="w-4 h-4" /> Add Step
                    </button>
                </div>

                <button type="submit" className="px-6 py-2 bg-green-600 rounded font-bold hover:bg-green-500">Create Course</button>
            </form>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AdminPage;
