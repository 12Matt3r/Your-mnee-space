import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { MNEE_CONTRACT_ADDRESS, MNEE_ABI } from '../../lib/wagmi';
import { MNEE_CONFIG } from '../../lib/mnee';
import { ShoppingBag, Plus, Loader2, Tag, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Treasury for Sales (In real app, this might be the seller's address directly if we had it)
// For hackathon, we send to platform treasury or a burn address
const TREASURY_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

interface MarketItem {
  id: string;
  title: string;
  description: string;
  price: number;
  preview_url: string;
  seller_id: string;
  seller?: { display_name: string };
}

export const ShopPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showListModal, setShowListModal] = useState(false);

  // Web3
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, token: MNEE_CONTRACT_ADDRESS } as any);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // List Item Form
  const [newItem, setNewItem] = useState({ title: '', description: '', price: '10', preview_url: '' });
  const [purchasingItem, setPurchasingItem] = useState<MarketItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (isConfirmed && purchasingItem) {
        completePurchase(purchasingItem, hash!);
    }
  }, [isConfirmed]);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
        .from('marketplace_items')
        .select('*, seller:seller_id(display_name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Mock upload URL for now
    const mockUrl = `https://picsum.photos/seed/${Date.now()}/400/400`;

    const { error } = await supabase.from('marketplace_items').insert({
        seller_id: user.id,
        title: newItem.title,
        description: newItem.description,
        price: parseFloat(newItem.price),
        preview_url: newItem.preview_url || mockUrl,
        category: 'general'
    });

    if (error) toast.error('Failed to list item');
    else {
        toast.success('Item listed successfully!');
        setShowListModal(false);
        setNewItem({ title: '', description: '', price: '10', preview_url: '' });
        fetchItems();
    }
  };

  const initiatePurchase = (item: MarketItem) => {
    if (!isConnected) {
        toast.error('Connect wallet to buy');
        return;
    }
    const cost = parseUnits(item.price.toString(), MNEE_CONFIG.decimals);
    if (!balance || balance.value < cost) {
        toast.error('Insufficient MNEE');
        return;
    }

    setPurchasingItem(item);
    writeContract({
        address: MNEE_CONTRACT_ADDRESS,
        abi: MNEE_ABI,
        functionName: 'transfer',
        args: [TREASURY_ADDRESS, cost],
        account: address,
        chain: undefined,
    });
  };

  const completePurchase = async (item: MarketItem, txHash: string) => {
    if (!user) return;
    const { error } = await supabase.from('purchases').insert({
        buyer_id: user.id,
        item_id: item.id,
        transaction_hash: txHash,
        amount_paid: item.price
    });

    if (error) toast.error('Purchase recorded failed (but payment sent)');
    else {
        toast.success(`Purchased ${item.title}! Check your inventory.`);
        setPurchasingItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-green-400" />
                        Creator Shop
                    </h1>
                    <p className="text-gray-400 mt-2">Buy and sell digital assets with MNEE.</p>
                </div>
                <button
                    onClick={() => setShowListModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition-all"
                >
                    <Plus className="w-5 h-5" /> Sell Item
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-green-500" /></div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No items in the shop yet. Be the first!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map(item => (
                        <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/50 transition-all group">
                            <div className="aspect-square bg-gray-800 relative">
                                <img src={item.preview_url} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold">
                                    {item.price} MNEE
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold truncate">{item.title}</h3>
                                <p className="text-sm text-gray-400 mb-2">by {item.seller?.display_name || 'Unknown'}</p>
                                <button
                                    onClick={() => initiatePurchase(item)}
                                    disabled={isPending || isConfirming}
                                    className="w-full py-2 bg-gray-800 hover:bg-green-600 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {purchasingItem?.id === item.id && (isPending || isConfirming) ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>Buy Now <ExternalLink className="w-3 h-3" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List Item Modal */}
            {showListModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">List New Item</h2>
                        <form onSubmit={handleList} className="space-y-4">
                            <input
                                type="text" placeholder="Item Title" className="w-full bg-black border border-gray-700 rounded p-3"
                                value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} required
                            />
                            <textarea
                                placeholder="Description" className="w-full bg-black border border-gray-700 rounded p-3" rows={3}
                                value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} required
                            />
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-400 mb-1">Price (MNEE)</label>
                                    <input
                                        type="number" className="w-full bg-black border border-gray-700 rounded p-3"
                                        value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowListModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-green-600 rounded font-bold hover:bg-green-500">List Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ShopPage;
