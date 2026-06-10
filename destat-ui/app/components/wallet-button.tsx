import { useAccount, useDisconnect } from 'wagmi';
import { rabbykit } from '~/root';
import {Button} from './ui/button';
import {useState, useEffect} from 'react';

export default function WalletButton() {
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <Button onClick={() => rabbykit.open()}>Connect</Button>;

    return (
        <div>
            {isConnected ? (
                <Button onClick={() => disconnect()}>Disconnect</Button>
            ) : (
                <Button onClick={() => rabbykit.open()}>Connect</Button>
            )}
        </div>
    );
}