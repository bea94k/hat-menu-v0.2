import type { ReactNode } from 'react';

type PageWrapperProps = {
    title: string;
    children: ReactNode;
};

const PageWrapper = ({ title, children }: PageWrapperProps) => {
    return (
        <main id="maincontent" className="w-full p-4 flex justify-center">
            <div className="grid w-full max-w-2xl gap-4">
                <h1 className="mb-1 text-2xl leading-[1.2]">{title}</h1>
                {children}
            </div>
        </main>
    );
};

export default PageWrapper;
