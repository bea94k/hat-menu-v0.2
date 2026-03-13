import type { ReactNode } from 'react';

type PageWrapperProps = {
    title: string;
    children: ReactNode;
};

const PageWrapper = ({ title, children }: PageWrapperProps) => {
    return (
        <main id="maincontent" className="mx-auto grid w-full max-w-2xl gap-4 p-4">
            <h1 className="mb-1 text-2xl leading-[1.2]">{title}</h1>
            {children}
        </main>
    );
};

export default PageWrapper;
