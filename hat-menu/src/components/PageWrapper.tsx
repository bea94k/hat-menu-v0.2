import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import ReloadPrompt from '../pwa/ReloadPrompt';
import Button from './primitives/Button';

type PageWrapperProps = {
    title: string;
    backUrl?: string;
    children: ReactNode;
};

const PageWrapper = ({ title, backUrl, children }: PageWrapperProps) => {
    const navigate = useNavigate();
    return (
        <main id="maincontent" className="w-full p-4 flex justify-center">
            <div className="grid w-full max-w-2xl gap-6">
                {backUrl && (
                    <Button
                        onClick={() => navigate(backUrl)}
                        variant='outline'
                        className="w-fit"
                    >
                        Back
                    </Button>
                )}
                <ReloadPrompt />
                <h1 className="mb-1 text-2xl leading-[1.2]">{title}</h1>
                {children}
            </div>
        </main>
    );
};

export default PageWrapper;
