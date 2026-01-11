import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, CreditCard, Copy, Check, LogOut, Loader2 } from 'lucide-react';
import { useAccount, useBalance, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { MNEE_CONTRACT_ADDRESS, MNEE_ABI } from '../../lib/wagmi';
import { MNEE_CONFIG, formatMNEE } from '../../lib/mnee';
import { ConnectWallet } from '../../components/web3/ConnectWallet';

interface LocalTransaction {
    hash: string;
    to: string;
    amount: string;
    timestamp: number;
    status: 'pending' | 'confirmed';
}

export const WalletPage = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance, refetch } = useBalance({
    address,
    token: MNEE_CONTRACT_ADDRESS,
  } as any);

  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const [copied, setCopied] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<LocalTransaction[]>([]);

  useEffect(() => {
      // Load local transactions
      const stored = localStorage.getItem('local_mnee_transactions');
      if (stored) {
          try {
              setTransactions(JSON.parse(stored));
          } catch (e) {
              console.error("Failed to parse local transactions", e);
          }
      }
  }, []);

  useEffect(() => {
      // Save pending transaction
      if (hash && amount && recipient) {
          const newTx: LocalTransaction = {
              hash,
              to: recipient,
              amount,
              timestamp: Date.now(),
              status: 'pending'
          };

          const updated = [newTx, ...transactions];
          setTransactions(updated);
          localStorage.setItem('local_mnee_transactions', JSON.stringify(updated));
      }
  }, [hash]); // Only run when hash is generated

  useEffect(() => {
    if (isConfirmed) {
        setAmount('');
        setRecipient('');
        refetch();

        // Update transaction status
        if (hash) {
            const updated = transactions.map(tx =>
                tx.hash === hash ? { ...tx, status: 'confirmed' as const } : tx
            );
            setTransactions(updated);
            localStorage.setItem('local_mnee_transactions', JSON.stringify(updated));
        }
    }
  }, [isConfirmed, refetch, hash]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    try {
      writeContract({
        address: MNEE_CONTRACT_ADDRESS,
        abi: MNEE_ABI,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, parseUnits(amount, MNEE_CONFIG.decimals)],
        account: address,
        chain: undefined,
      });
    } catch (err) {
      console.error("Transfer failed", err);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-6 rounded-full">
            <Wallet className="w-16 h-16 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
        <p className="text-gray-500 max-w-md">
            Connect MetaMask, Coinbase Wallet, or Rainbow to manage your MNEE tokens and access the platform economy.
        </p>
        <div className="flex justify-center">
            <ConnectWallet />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Wallet className="w-8 h-8 text-blue-500" />
            My Wallet
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your MNEE tokens and transaction history
          </p>
        </div>
        <button
            onClick={() => disconnect()}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Disconnect
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 font-medium mb-1">Total Balance</p>
            <h2 className="text-5xl font-bold mb-2">
                {balance ? `${formatUnits(balance.value, balance.decimals)} ${balance.symbol}` : 'Loading...'}
            </h2>
            <p className="text-blue-200">≈ ${balance ? formatUnits(balance.value, balance.decimals) : '0.00'} USD</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-blue-200 bg-black/20 py-2 px-4 rounded-full w-fit">
          <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          <button onClick={copyAddress} className="hover:text-white transition-colors">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Send Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5" />
                Send MNEE
            </h3>
            <form onSubmit={handleSend} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Recipient Address</label>
                    <input
                        type="text"
                        placeholder="0x..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        step="0.00001"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                        required
                    />
                </div>

                {writeError && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                        {writeError.message.split('\n')[0]}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending || isConfirming || !recipient || !amount}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPending || isConfirming ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUpRight className="w-5 h-5" />}
                    {isPending ? 'Confirming in Wallet...' : isConfirming ? 'Processing...' : 'Send Transaction'}
                </button>
            </form>
        </div>

        {/* Local Transaction History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Recent Activity
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px] p-4 space-y-3">
                {transactions.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No recent transactions found on this device.</div>
                ) : (
                    transactions.map((tx) => (
                        <div key={tx.hash} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-blue-600">Sent MNEE</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    tx.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {tx.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 break-all">
                                To: {tx.to}
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <div className="text-xs text-gray-500">
                                    {new Date(tx.timestamp).toLocaleString()}
                                </div>
                                <div className="font-mono font-bold">
                                    -{tx.amount} MNEE
                                </div>
                            </div>
                            <a
                                href={`https://etherscan.io/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline mt-2 block"
                            >
                                View on Explorer
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
