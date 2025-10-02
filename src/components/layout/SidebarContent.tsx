import { NavLink } from 'react-router-dom';
import { Home, FileText, FileClock, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: Home },
  { name: 'Invoices', href: '/app/invoices', icon: FileText },
  { name: 'Estimates', href: '/app/estimates', icon: FileClock },
  { name: 'Clients', href: '/app/clients', icon: Users },
];
export function SidebarContent() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <>
      <div className="flex h-16 shrink-0 items-center space-x-3 px-6 lg:px-0">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="text-2xl font-bold font-display text-white">Zenvoice</h1>
      </div>
      <nav className="flex flex-1 flex-col px-6 lg:px-0">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        isActive
                          ? 'bg-indigo-700 dark:bg-gray-800 text-white'
                          : 'text-indigo-200 hover:text-white hover:bg-indigo-700 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )
                    }
                  >
                    <item.icon
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto -mx-2">
            <NavLink
              to="/app/settings"
              className={({ isActive }) =>
                cn(
                  isActive
                    ? 'bg-indigo-700 dark:bg-gray-800 text-white'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-700 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                )
              }
            >
              <Settings className="h-6 w-6 shrink-0" aria-hidden="true" />
              Settings
            </NavLink>
            <Button
              onClick={toggleTheme}
              variant="ghost"
              className="w-full justify-start text-indigo-200 hover:text-white hover:bg-indigo-700 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 mt-1"
            >
              <span className="mr-3 h-6 w-6">{isDark ? '☀️' : '🌙'}</span>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </li>
        </ul>
      </nav>
    </>
  );
}