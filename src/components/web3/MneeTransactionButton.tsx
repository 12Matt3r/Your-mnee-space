import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConnect } from 'wagmi';
import { parseUnits } from 'viem';
import { MNEE_CONTRACT_ADDRESS, MNEE_ABI } from '../../lib/wagmi';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface MneeTransactionButtonProps {
  recipientAddress: string;
  amount: string; // Amount in MNEE (e.g., "5.0")
  label: string;
  onSuccess?: () => void;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const MneeTransactionButton: React.FC<MneeTransactionButtonProps> = ({
  recipientAddress,
  amount,
  label,
  onSuccess,
  className,
  icon,
  disabled
}) => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [isPending, setIsPending] = useState(false);

  // Wagmi hooks for writing to contract
  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError
  } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction trigger
  const handleTransaction = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      // Attempt to connect with the first available connector (usually Injected/Metamask)
      const injected = connectors.find(c => c.id === 'injected');
      if (injected) connect({ connector: injected });
      return;
    }

    if (!recipientAddress || !recipientAddress.startsWith('0x')) {
        toast.error('Invalid recipient address');
        return;
    }

    setIsPending(true);
    try {
      // MNEE has 5 decimals
      const decimals = 5;
      const amountBigInt = parseUnits(amount, decimals);

      writeContract({
        address: MNEE_CONTRACT_ADDRESS,
        abi: MNEE_ABI,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, amountBigInt],
      });

    } catch (error) {
      console.error('Transaction failed:', error);
      setIsPending(false);
    }
  };

  // Effect to handle success
  React.useEffect(() => {
    if (isSuccess) {
      toast.success(`Sent ${amount} MNEE successfully!`);
      setIsPending(false);
      if (onSuccess) onSuccess();
    }
  }, [isSuccess, amount, onSuccess]);

  // Effect to handle error
  React.useEffect(() => {
    if (writeError) {
      console.error("Write error:", writeError);
      toast.error('Transaction rejected or failed');
      setIsPending(false);
    }
  }, [writeError]);

  const isLoading = isWritePending || isConfirming || isPending;

  return (
    <button
      onClick={handleTransaction}
      disabled={isLoading || disabled || isSuccess}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-all
        ${isSuccess
            ? 'bg-green-500/20 text-green-400 cursor-default border border-green-500/50'
            : 'bg-gradient-to-r from-mnee-gold to-mnee-goldDark text-black hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{isConfirming ? 'Confirming...' : 'Sign Request...'}</span>
        </>
      ) : isSuccess ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>Sent!</span>
        </>
      ) : (
        <>
          {icon}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
