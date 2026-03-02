import type { ReactNode } from 'react';

type PageWrapperProps = {
    title: string;
    children: ReactNode;
    className?: string;
};

const PageWrapper = ({ title, children, className }: PageWrapperProps) => {
    return (
        <main id="maincontent" className={`page-wrapper ${className ?? ''}`.trim()}>
            <h1 className="page-title">{title}</h1>
            {children}
        </main>
    );
};

export default PageWrapper;
