import { useRegisterSW } from 'virtual:pwa-register/react';
import Button from '../components/primitives/Button';

const ReloadPrompt = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
             
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    return (
        (offlineReady || needRefresh) && 
            <div className="border border-warning-500 bg-warning-100 rounded-md p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                { offlineReady
                    ? <p>App ready to work offline</p>
                    : <p>New content available.</p>
                }
                <div className='flex gap-2'>
                    { needRefresh && <Button onClick={() => updateServiceWorker(true)}>Update</Button> }
                    <Button variant='outline' onClick={() => close()}>Close</Button>
                </div>
            </div>
    );
};

export default ReloadPrompt;