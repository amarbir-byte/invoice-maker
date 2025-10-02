import React from 'react';
interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-3xl font-bold font-display leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {children && (
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {children}
        </div>
      )}
    </div>
  );
}