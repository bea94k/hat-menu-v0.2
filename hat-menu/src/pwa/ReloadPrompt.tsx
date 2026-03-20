import { useRegisterSW } from 'virtual:pwa-register/react';
import Button from '../components/primitives/Button';

const ReloadPrompt = () => {
    const {
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
        setNeedRefresh(false);
    };

    return (
        needRefresh && 
            <div className="border border-warning-500 bg-warning-100 rounded-md p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <p>New content available.</p>
                <div className='flex gap-2'>
                    { needRefresh && <Button onClick={() => updateServiceWorker(true)}>Update</Button> }
                    <Button variant='outline' onClick={() => close()}>Close</Button>
                </div>
            </div>
    );
};

export default ReloadPrompt;